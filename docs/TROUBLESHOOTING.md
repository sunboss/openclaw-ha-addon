# OpenClaw 现场排障与诊断手册 (TROUBLESHOOTING.md)

供专职 AI Bots 与运维人员在排查 OpenClaw 加载项异常时秒级定位与排障。

---

## ⚡ 常见排查命令（只读，免确认直接运行）

### 1. 查看容器进程与 CPU 负载
```bash
docker exec app_local_openclaw top -b -n 1 | head -n 15
# 确认 PID 1 为 tini，node 与 nginx 正常运行且无 zombie (<defunct>)
```

### 2. 查看 OpenClaw Gateway 实时日志
```bash
docker logs --tail 50 app_local_openclaw
# 查看是否输出：[gateway] listening on http://127.0.0.1:18790
```

### 3. 查看 Nginx 错误日志
```bash
docker exec app_local_openclaw cat /tmp/nginx_error.log
```

### 4. 内部连通性测试
```bash
# 测试 Ingress 8099 端口代理
docker exec app_local_openclaw curl -i http://127.0.0.1:8099/

# 测试 OpenClaw 内部 18790 端口直接响应
docker exec app_local_openclaw curl -i http://127.0.0.1:18790/
```

---

## 🔍 核心故障排查 SOP

### Q1: 打开 Control UI 提示 "Unauthorized" 或要求输入 Token？
- **原因**：前端未自动附带 Gateway Token 或与 `.env` 中生成的 Token 不一致。
- **解决**：
  1. 查看持久化 Token：
     ```bash
     docker exec app_local_openclaw cat /config/.openclaw/.env | grep OPENCLAW_GATEWAY_TOKEN
     ```
  2. 在 Control UI 右上角设置（Settings）中粘贴该 Token 即可永久认证。

### Q2: 侧边栏 Ingress 提示 404 或白屏？
- **排查**：检查 `openclaw/rootfs/etc/nginx/nginx.conf` 中是否已配置 `proxy_set_header X-Forwarded-Prefix $http_x_ingress_path;` 以及 `allowedOrigins` 是否包含 HA 代理域名。
- **验证**：通过局域网直接打开 `http://<ha-ip>:18789/`，若局域网直连秒开，说明仅为 Ingress 前缀配置问题。

### Q3: 容器重启后配置或已配好的 Telegram/Discord 丢失？
- **排查**：确认宿主机数据目录 `/config/.openclaw/` 权限是否属于 `node` (UID 1000)。
- **解决**：
  ```bash
  docker exec -u root app_local_openclaw chown -R node:node /config
  ```
