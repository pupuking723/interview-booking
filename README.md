# 前端面试教练 - 预约系统

快速搭建的前端面试教练服务预约平台。

## 功能特性

- ✅ 单页预约表单（姓名、微信、面试时间、备注）
- ✅ 服务介绍与价格展示（¥99/次）
- ✅ 微信收款码支付（可替换为实际收款码图片）
- ✅ 预约数据自动保存到 JSON 文件
- ✅ 后台预约列表管理
- ✅ 预约状态管理（待处理/已确认/已完成/已取消）

## 技术栈

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- 文件系统存储（JSON）

## 本地开发

```bash
# 安装依赖
cd interview-booking
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 Vercel 导入项目
3. 自动部署完成

```bash
# 推送代码
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 页面地址

- 预约页面：`/`
- 预约管理：`/admin/bookings`（需要认证）

## 管理后台认证

API 使用简单 Token 认证：
- Header: `Authorization: Bearer admin-secret-key-2024`

⚠️ **生产环境请修改 `src/app/api/bookings/route.ts` 中的密钥**

## 数据文件

预约数据保存在：`data/bookings.json`

格式示例：
```json
[
  {
    "id": "1710400000000",
    "name": "张三",
    "wechat": "zhangsan123",
    "interviewTime": "2024-03-20T14:00",
    "notes": "希望重点辅导 React 性能优化",
    "status": "pending",
    "createdAt": "2024-03-14T05:30:00.000Z"
  }
]
```

## 自定义配置

### 替换微信收款码

1. 准备收款码图片（建议 300x300 PNG）
2. 放入 `public/wechat-qr.png`
3. 修改 `src/app/page.tsx` 中的收款码区域：

```tsx
<img src="/wechat-qr.png" alt="微信收款码" className="w-48 h-48" />
```

### 修改服务信息

编辑 `src/app/page.tsx` 中的服务内容列表和价格。

## 环境变量（可选）

创建 `.env.local` 文件：

```env
# 管理后台密钥（生产环境必须修改）
ADMIN_SECRET_KEY=your-secret-key-here
```

## 后续扩展

- [ ] 接入微信支付 API
- [ ] 邮件/短信通知
- [ ] 日历同步（Google Calendar / 飞书日历）
- [ ] 用户认证系统
- [ ] 数据库存储（Prisma + PostgreSQL）

## 许可证

MIT
