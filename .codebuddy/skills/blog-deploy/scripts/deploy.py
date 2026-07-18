import paramiko
from pathlib import Path
import os
import time

# ==================== 配置 ====================
SERVER_IP = "39.106.192.238"
SERVER_USER = "root"
SERVER_PASS = "lzd@720930"
REMOTE_PATH = "/usr/local/myblog"
FRONTEND_REMOTE = f"{REMOTE_PATH}/fontEnd"
BACKEND_REMOTE = f"{REMOTE_PATH}/projectServer"

# 后端端口配置（用于检测服务是否启动）
BACKEND_PORT = 3000

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent.parent
FRONTEND_DIST = PROJECT_ROOT / "fontEnd" / "dist"
BACKEND_DIR = PROJECT_ROOT / "projectServer"

SKIP_DIRS = {'node_modules', '.git', 'dist', '__pycache__'}


def log_info(msg):
    print(f"[INFO] {msg}")


def log_success(msg):
    print(f"[SUCCESS] {msg}")


def log_error(msg):
    print(f"[ERROR] {msg}")


def upload_files(sftp, client, local_dir, remote_base):
    """Upload all files from local_dir to remote_base"""
    all_files = []
    for f in Path(local_dir).rglob('*'):
        if not f.is_file():
            continue
        rel = f.relative_to(local_dir)
        parts = rel.parts
        if any(p in SKIP_DIRS for p in parts):
            continue
        all_files.append((f, rel))

    total = len(all_files)
    print(f"  Uploading {total} files...")

    for i, (local_file, rel_path) in enumerate(all_files, 1):
        remote_path = remote_base + '/' + str(rel_path).replace('\\', '/')
        remote_dir = os.path.dirname(remote_path)
        
        try:
            sftp.stat(remote_dir)
        except Exception:
            _, out, _ = client.exec_command(f'mkdir -p "{remote_dir}"')
            out.read()
        
        sftp.put(str(local_file), remote_path)
        if i <= 5 or i % 5 == 0:
            print(f"    [{i}/{total}] {rel_path}")

    return total


def install_and_start_service(client):
    """Install dependencies and start the backend service"""
    
    # Step 1: Fix npm config and install dependencies
    log_info("\n[3/5] Installing npm dependencies...")
    
    # Set official npm registry to avoid mirror issues
    _, out, _ = client.exec_command('npm config set registry https://registry.npmjs.org/')
    out.read()
    
    # Delete old lock file that may have wrong URLs
    _, out, _ = client.exec_command(f'rm -f {BACKEND_REMOTE}/package-lock.json')
    out.read()
    
    print(f"  Running: cd {BACKEND_REMOTE} && npm install")
    _, stdout, stderr = client.exec_command(f'cd {BACKEND_REMOTE} && npm install 2>&1')
    output = stdout.read().decode()
    err_output = stderr.read().decode()
    
    # Check for errors
    if 'error' in output.lower() or 'ERR!' in err_output:
        log_error("npm install failed!")
        if output:
            print(output[:800])
        return False
    
    if output:
        lines = [l for l in output.split('\n') if l.strip()]
        print(f"  Result: {' '.join(lines[-3:])}")
    
    log_success("npm install completed!")
    
    # Step 2: Stop existing service (if running)
    log_info("Checking for existing service...")
    _, stdout, _ = client.exec_command(f'lsof -ti:{BACKEND_PORT}')
    pid = stdout.read().decode().strip()
    
    if pid:
        log_info(f"Stopping existing process (PID: {pid})...")
        _, _, _ = client.exec_command(f'kill -9 {pid}')
        time.sleep(2)
        log_success("Old process stopped.")
    else:
        log_info("No existing service found.")
    
    # Step 3: Start service with nohup (background)
    log_info("\n[4/5] Starting backend service...")
    print(f"  Running: node bin/www (port: {BACKEND_PORT})")
    
    # Use nohup to run in background
    cmd = f'cd {BACKEND_REMOTE} && nohup node bin/www > /tmp/myblog.log 2>&1 &'
    _, _, _ = client.exec_command(cmd)
    
    # Wait for service to start
    time.sleep(3)
    
    return True


def check_service_status(client):
    """Check if the backend service is running"""
    log_info("Checking service status...")
    
    # Check if port is listening
    _, stdout, _ = client.exec_command(f'lsof -i:{BACKEND_PORT} | grep LISTEN')
    listen_result = stdout.read().decode().strip()
    
    if listen_result:
        log_success(f"Service is RUNNING on port {BACKEND_PORT}")
        print(f"  {listen_result.split(chr(10))[0]}")
        
        # Try to access the API
        _, stdout, _ = client.exec_command(f'curl -s -o /dev/null -w "%{{http_code}}" http://localhost:{BACKEND_PORT}/ || echo "0"')
        http_code = stdout.read().decode().strip()
        
        if http_code and http_code != '0':
            log_success(f"HTTP Response: {http_code}")
        else:
            log_info("HTTP check skipped (curl may not be installed)")
        
        # Show recent logs
        log_info("\nRecent server logs:")
        _, stdout, _ = client.exec_command('tail -10 /tmp/myblog.log')
        logs = stdout.read().decode().strip()
        if logs:
            for line in logs.split('\n')[-5:]:
                print(f"  > {line}")
        
        return True
    else:
        # Check process by name
        _, stdout, _ = client.exec_command('pgrep -f "node bin/www"')
        pids = stdout.read().decode().strip()
        
        if pids:
            log_success(f"Process is running (PIDs: {pids})")
            
            # Show error logs if port not listening
            _, stdout, _ = client.exec_command('tail -20 /tmp/myblog.log')
            logs = stdout.read().decode().strip()
            if logs:
                log_error("Service process exists but port not listening. Logs:")
                for line in logs.split('\n')[-10:]:
                    print(f"  ! {line}")
                return True
        else:
            log_error("Service failed to start!")
            
            # Show error logs
            _, stdout, _ = client.exec_command('cat /tmp/myblog.log 2>/dev/null || echo "No log file"')
            logs = stdout.read().decode().strip()
            if logs and logs != "No log file":
                print("\nError logs:")
                for line in logs.split('\n')[-15:]:
                    print(f"  ! {line}")
            return False


def restart_nginx(client):
    """Restart nginx service after deployment"""
    log_info("\n[5/5] Restarting nginx...")
    
    # Check if nginx is installed
    _, stdout, _ = client.exec_command('which nginx')
    if not stdout.read().decode().strip():
        log_warning("nginx not found on server, skipping restart.")
        return False
    
    # Test config before reload
    _, stdout, stderr = client.exec_command('nginx -t 2>&1')
    test_result = stdout.read().decode()
    
    if 'syntax is ok' in test_result or 'test is successful' in test_result.lower():
        # Reload/restart nginx
        _, stdout, stderr = client.exec_command('systemctl restart nginx 2>&1 || service nginx restart 2>&1 || /etc/init.d/nginx restart 2>&1')
        result = stdout.read().decode()
        err = stderr.read().decode()
        
        time.sleep(2)
        
        # Verify nginx status
        _, stdout, _ = client.exec_command('systemctl status nginx --no-pager | head -5 || pgrep -x nginx && echo "running"')
        status = stdout.read().decode().strip()
        
        if status:
            log_success("nginx restarted successfully!")
            lines = status.split('\n')[:3]
            for line in lines:
                print(f"  {line}")
            return True
        else:
            # Fallback: try kill -HUP for graceful reload
            _, stdout, _ = client.exec_command('nginx -s reload 2>&1')
            result = stdout.read().decode()
            
            _, stdout, _ = client.exec_command('pgrep -x nginx')
            if stdout.read().decode().strip():
                log_success("nginx reloaded successfully!")
                return True
        
        log_error("nginx restart failed!")
        if err:
            print(f"  Error: {err[:300]}")
        return False
    else:
        log_error(f"nginx config test failed:\n{test_result}")
        return False
    print("\n" + "=" * 50)
    print("     Blog Auto Deploy Tool")
    print("=" * 50 + "\n")

    log_info(f"Server: {SERVER_IP}")
    log_info(f"Remote: {REMOTE_PATH}")

    # Check frontend dist
    if not FRONTEND_DIST.exists():
        log_error(f"Frontend dist not found: {FRONTEND_DIST}")
        return

    # Connect
    log_info("Connecting to server...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(SERVER_IP, username=SERVER_USER, password=SERVER_PASS, timeout=30)
    sftp = client.open_sftp()
    log_success("Connected!")

    # Create directories
    _, out, _ = client.exec_command(f'mkdir -p {FRONTEND_REMOTE} {BACKEND_REMOTE}')
    out.read()

    # Upload frontend
    log_info("\n[1/5] Uploading frontend...")
    frontend_count = upload_files(sftp, client, FRONTEND_DIST, FRONTEND_REMOTE)
    log_success(f"Frontend done! ({frontend_count} files)")

    # Upload backend
    log_info("\n[2/5] Uploading backend...")
    backend_count = upload_files(sftp, client, BACKEND_DIR, BACKEND_REMOTE)
    log_success(f"Backend done! ({backend_count} files)")

    sftp.close()

    # Install & Start service
    started = install_and_start_service(client)

    # Check status
    if started:
        success = check_service_status(client)

    # Restart nginx (only when both frontend and backend uploaded)
    if started and success is not False:
        restart_nginx(client)

    client.close()

    # Summary
    print("\n" + "=" * 50)
    if started:
        print("     DEPLOY COMPLETE!")
    else:
        print("     DEPLOY FINISHED (service not started)")
    print("=" * 50)
    print(f"\n  Server : {SERVER_IP}")
    print(f"  Frontend: {FRONTEND_REMOTE} ({frontend_count} files)")
    print(f"  Backend : {BACKEND_REMOTE} ({backend_count} files)")
    print(f"\n  Access URL: http://{SERVER_IP}")
    print(f"  API URL:   http://{SERVER_IP}:{BACKEND_PORT}")
    print(f"\n  Server log: tail -f /tmp/myblog.log")
    print(f"  Nginx log:  tail -f /var/log/nginx/access.log")


if __name__ == "__main__":
    main()
