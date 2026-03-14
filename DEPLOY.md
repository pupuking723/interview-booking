# 🚀 部署指南

## 方式一：Vercel 网页部署（推荐，最简单）

1. **推送代码到 GitHub**
   ```bash
   cd /Users/mac/.openclaw/workspace/interview-booking
   git init
   git add .
   git commit -m "Initial commit - 面试教练预约系统"
   git branch -M main
   git remote add origin <你的 GitHub 仓库地址>
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 https://vercel.com/new
   - 点击 "Import Git Repository"
   - 选择刚推送的仓库
   - 点击 "Deploy"
   - 等待部署完成（约 1-2 分钟）

3. **获取访问链接**
   - 部署完成后会获得类似 `https://interview-booking-xxx.vercel.app` 的链接
   - 可在 Vercel 设置中绑定自定义域名

## 方式二：Vercel CLI 部署

```bash
# 登录 Vercel
vercel login

# 部署到生产环境
cd /Users/mac/.openclaw/workspace/interview-booking
vercel --prod
```

## 方式三：其他部署平台

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Railway
1. 访问 https://railway.app
2. 新建项目 → Deploy from GitHub repo
3. 选择仓库自动部署

## 部署后配置

### 1. 替换微信收款码
- 准备收款码图片（建议 300x300 PNG）
- 命名为 `wechat-qr.png`
- 放入项目 `public/` 目录
- 重新部署

### 2. 修改管理后台密钥（重要！）
编辑 `src/app/api/bookings/route.ts`，将：
```typescript
if (authHeader !== 'Bearer admin-secret-key-2024')
```
改为你的自定义密钥。

### 3. 数据持久化
⚠️ **注意**：当前使用 JSON 文件存储，Vercel Serverless 环境重启会丢失数据。

**生产环境建议方案：**
- 方案 A：使用 Vercel KV (Redis)
- 方案 B：使用 Supabase/PlanetScale 数据库
- 方案 C：使用飞书多维表格/腾讯文档 API

如需升级数据库存储，请联系开发团队。

## 访问地址

部署成功后：
- **预约页面**: `https://<你的域名>/`
- **预约管理**: `https://<你的域名>/admin/bookings`

## 管理后台使用说明

1. 访问 `/admin/bookings`
2. 查看预约列表
3. 更新预约状态：
   - 待处理 → 收到付款后改为"已确认"
   - 已完成 → 面试结束后更新
   - 已取消 → 用户取消时更新

## 测试

本地测试：
```bash
npm run dev
# 访问 http://localhost:3000
```

提交测试预约后，检查 `data/bookings.json` 确认数据保存。
