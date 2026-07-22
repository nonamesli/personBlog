import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('39.106.192.238', username='root', password='lzd@720930', timeout=30)

def run(cmd):
    print(f'\n$ {cmd}')
    _, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err:
        print('ERR:', err[:500])

# 停止旧进程
run('kill -9 130854 130855 2>/dev/null; echo "killed"')
time.sleep(2)

# 确认端口释放
run('ss -tlnp | grep 3000 || echo "3000 port is free"')

# 启动新服务
run('cd /usr/local/myblog/projectServer && nohup node bin/www > /tmp/myblog.log 2>&1 & echo "started"')
time.sleep(3)

# 确认端口监听
run('ss -tlnp | grep 3000')

# 测试 /api/login
run('curl -s -o /dev/null -w "%{http_code}" -X POST http://127.0.0.1:3000/api/login -H "Content-Type: application/json" -d \'{"username":"admin","password":"123456"}\'; echo')

# 测试通过 8099 nginx 转发
run('curl -s -o /dev/null -w "%{http_code}" -X POST http://127.0.0.1:8099/api/login -H "Content-Type: application/json" -d \'{"username":"admin","password":"123456"}\'; echo')

client.close()
