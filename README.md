# 店小伴 - 门店私域一体化SaaS系统

一套面向中小实体店（美业/美甲/美容/宠物店/瑜伽馆/养生馆）的一站式线上经营SaaS系统。
客户采购这套系统后，店铺日常线上工作全部在系统内完成，不用再搭配多个工具。

## 🏗️ 项目架构

```
store-saas/
├── backend/          # NestJS 后端服务
│   ├── src/
│   │   ├── common/   # 公共守卫、拦截器
│   │   └── modules/  # 业务模块
│   │       ├── auth/         # 认证登录
│   │       ├── tenant/       # 租户管理
│   │       ├── member/       # 会员客户
│   │       ├── appointment/  # 预约管理
│   │       ├── service/      # 服务项目
│   │       ├── card/         # 卡项疗程
│   │       ├── order/       # 订单收银
│   │       ├── marketing/   # 营销优惠券
│   │       ├── dashboard/   # 数据看板
│   │       ├── staff/       # 员工技师
│   │       └── notice/       # 消息通知
│   └── .env          # 环境配置
│
├── admin-web/        # Vue3 + Element Plus PC管理后台
│   ├── src/
│   │   ├── api/      # API接口
│   │   ├── views/    # 页面组件
│   │   ├── router/   # 路由
│   │   ├── store/    # Pinia状态管理
│   │   └── utils/    # 工具函数
│   └── vite.config.ts
│
└── mini-app/         # UniApp 顾客小程序
    ├── pages/
    │   ├── index/       # 店铺首页
    │   ├── appointment/ # 在线预约
    │   ├── member/      # 会员中心
    │   └── my/          # 个人中心
    ├── pages.json
    └── manifest.json
```

## 🚀 快速启动

### 前置要求
- Node.js >= 18
- MySQL 8.0
- Redis（可选，MVP阶段可暂不使用）

### 第一步：启动后端

```bash
cd backend

# 安装依赖
npm install

# 创建数据库
# 登录MySQL后执行：
# CREATE DATABASE store_saas DEFAULT CHARACTER SET utf8mb4;

# 修改 .env 文件中的数据库配置
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=你的密码
# DB_DATABASE=store_saas

# 开发模式启动
npm run start:dev
```

后端启动后访问：http://localhost:3000/api

> 首次启动会自动创建数据表（synchronize: true）

### 第二步：启动PC管理后台

```bash
cd admin-web

# 安装依赖
npm install

# 开发模式启动
npm run dev
```

后台访问：http://localhost:5173

> 默认代理已配置 /api 到后端 3000 端口

### 第三步：启动小程序端

```bash
# 使用 HBuilderX 打开 mini-app 目录
# 或使用 uni-app CLI 运行
```

## 📦 功能模块

### ✅ 已实现（MVP完整版）

| 模块 | 功能说明 |
|------|----------|
| **多租户体系** | 店铺隔离、套餐管理、到期控制 |
| **认证权限** | 账号登录、JWT鉴权、RBAC角色权限 |
| **会员管理** | 客户档案、标签、来源、备注、回访提醒 |
| **预约管理** | 预约创建、状态流转、日历视图、今日预约 |
| **服务项目** | 项目CRUD、分类、价格、时长、上下架 |
| **卡项管理** | 次卡/储值卡/套餐卡、开卡、剩余次数 |
| **订单收银** | 快速开单、支付方式、退款、订单记录 |
| **营销中心** | 优惠券创建、领取、使用 |
| **数据看板** | 今日营收、今日预约、新增客户、营收趋势 |
| **员工管理** | 技师信息、提成比例、岗位 |
| **店铺设置** | 店铺资料、营业时间、套餐信息 |

### 🚀 小程序端（顾客侧）
- 店铺首页展示
- 在线预约（选项目→选技师→选时间）
- 会员中心（卡包、优惠券、消费记录）
- 个人中心

## 🔧 技术栈

### 后端
- **框架**: NestJS 10
- **数据库**: MySQL 8.0 + TypeORM
- **认证**: JWT + Passport
- **多租户**: 共享数据库 + tenant_id 隔离

### PC后台
- **框架**: Vue 3 + Vite
- **UI库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **图表**: ECharts

### 小程序端
- **框架**: UniApp (Vue3)
- **端**: 微信小程序

## 💡 商业模式

| 套餐 | 价格 | 说明 |
|------|------|------|
| 基础版 | 499元/店/年 | 单店，5个员工账号 |
| 专业版 | 899元/店/年 | 单店，15个员工账号，全部营销功能 |
| 连锁版 | 1999元/年 | 最多10家门店，总部后台 |

## 📝 后续迭代规划

- [ ] 微信小程序订阅消息推送
- [ ] 微信支付对接
- [ ] 拼团/秒杀活动
- [ ] 自动回访SOP
- [ ] 员工个人拓客海报
- [ ] 数据导出Excel
- [ ] 连锁多店管理

## ⚠️ 注意事项

1. 生产环境请将 `synchronize: true` 改为 `false`，使用数据库迁移
2. JWT密钥请修改为随机字符串
3. 首次部署需创建超级管理员账号（可直接在数据库插入）
4. 小程序端需要在微信公众平台申请小程序AppID
