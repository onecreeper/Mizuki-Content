---
title: LobeChat + Vercel + Auth0 + 阿里云OSS 部署教程
published: 2024-01-15
image: "./cover.png"
---
# LobeChat + Vercel + Auth0 + 阿里云OSS 部署教程

## 第 1 步：一键部署 LobeChat

首先，我们需要将 LobeChat 的官方项目代码复制一份到自己的 GitHub 账号下，然后再通过 Vercel 进行部署。

1. **Fork 项目**：
   访问 [LobeChat 的 GitHub 仓库](https://github.com/lobehub/lobe-chat)，点击页面右上角的 Fork 按钮，将项目复刻到你自己的 GitHub 账户中。

2. **在 Vercel 中创建项目**：
   前往 Vercel 控制台，点击 Create a New Project。

3. **导入 GitHub 仓库**：
   选择 Import Git Repository，并选择你刚刚 Fork 的 lobe-chat 仓库进行导入。Vercel 会自动识别项目类型并为你配置好大部分部署选项。

4. **直接部署**：
   此时先不要急着修改环境变量，直接点击 Deploy 按钮。Vercel 会开始构建和部署你的应用。这个过程可能需要一些时间（大约 10-20 分钟），请耐心等待。

部署完成后，你将拥有一个可以访问的 LobeChat 站点，你可以在 Vercel 看到它的域名，这个后面要用。但这只是一个基础版本，接下来我们将为它添加数据库和用户系统。

## 第 2 步：配置数据库 (Postgres)

为了让 LobeChat 能够保存用户的对话历史和设置，我们需要一个数据库。Vercel 自带的 Storage 功能可以让我们一键创建一个免费的 Postgres 数据库。

1. **创建数据库**：
   回到 Vercel 主页，切换到 Storage 标签页，点击 Create a new Database 并选择 Neon。

2. **连接项目**：
   选择你的 lobe-chat 项目，并为数据库连接起一个前缀，随便设置就行，然后点击 Connect。

3. **配置环境变量**：
   连接成功后，Vercel 会自动在你的项目中添加 POSTGRES_* 相关的环境变量。但 LobeChat 使用的是通用的 DATABASE_URL 变量，所以我们需要手动配置一下。

   - 进入你的项目设置 Settings -> Environment Variables。
   - 复制 Vercel 自动生成的 POSTGRES_URL_NONPOOLING 的值。
   - 添加以下4个新的环境变量：

| Key                      | Value                            | Description           |
| ------------------------ | -------------------------------- | --------------------- |
| DATABASE_URL             | 粘贴你复制的 POSTGRES_URL_NONPOOLING 值 | 用于连接数据库的服务端链接         |
| NEXT_PUBLIC_SERVICE_MODE | server                           | 开启服务端模式，以便使用数据库功能     |
| KEY_VAULTS_SECRET        | 运行 openssl rand -base64 32 生成    | 一个 32 位的随机密钥，用于加密敏感数据 |
| APP_URL                  | https://你的应用地址                   | 应用访问地址                |

> **提示**：KEY_VAULTS_SECRET 是一个用于加密用户 API Key 等敏感信息的密钥。你可以在本地终端（如 PowerShell, Terminal）中运行 openssl rand -base64 32 命令来生成一个足够安全的随机字符串。

## 第 3 步：配置用户认证 (Auth0)

为了实现多用户登录和隔离，我们需要接入一个身份验证服务。这里我们选用 Auth0。

官方文档已经提供了非常详细的步骤，请直接参考官方文档中关于配置 Auth0 身份验证服务的说明。

**关键提示**：

- 按照官方文档一步步操作即可，流程非常清晰。[在 LobeChat 中配置 Auth0 身份验证服务 - 详细步骤和环... · LobeHub](https://lobehub.com/zh/docs/self-hosting/advanced/auth/next-auth/auth0)
- 在 Auth0 设置中，请不要开启注册功能。作为私人应用，我们通常是手动在 Auth0 后台为受信任的用户创建账号，以确保服务的私密性和安全性。
- 完成 Auth0 配置后，别忘了将相关的环境变量（如 AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH_SECRET 等）添加到你的 Vercel 项目中。
- 同时，添加一个关键的环境变量来启用 NextAuth：

| Key | Value | Description |
|---|---|---|
| NEXT_PUBLIC_ENABLE_NEXT_AUTH | 1 | 在 Vercel 部署中显式开启 NextAuth 认证 |

此外，还需要配置以下认证相关的环境变量：

| Key                     | Value                         | Description     |
| ----------------------- | ----------------------------- | --------------- |
| NEXT_AUTH_SECRET        | 运行 openssl rand -base64 32 生成 | NextAuth 的加密密钥  |
| NEXT_AUTH_SSO_PROVIDERS | auth0                         | 指定单点登录提供商       |
| AUTH_AUTH0_ID           | 你的Auth0客户端ID                  | Auth0 应用的客户端标识符 |
| AUTH_AUTH0_SECRET       | 你的Auth0客户端密钥                  | Auth0 应用的客户端密钥  |
| AUTH_AUTH0_ISSUER       | 你的Auth0发行者URL                 | Auth0 颁发者地址     |
| NEXTAUTH_URL            | 你的应用地址/api/auth               | NextAuth 的回调URL |

## 第 4 步：配置对象存储 (阿里云 OSS)

如果希望在对话中使用文件上传功能（例如发送图片），你需要配置一个对象存储服务。这里我们以阿里云 OSS 为例，它价格实惠，标准用量下一年仅需⑨块钱。

![](.\attachments\e8b7a10b708f387d74a78701f3840e5a_MD5.jpeg)


### 4.1 创建 OSS Bucket

1. 登录 [OSS管理控制台](https://oss.console.aliyun.com/bucket)
2. 点击"创建 Bucket"按钮
3. 填写 Bucket 名称（需全局唯一，请认真取名）
4. 选择地域（建议选择距离你较近的区域以获得更快的访问速度）
5. 其他选项暂时保持默认，点击"确定"创建

### 4.2 配置 Bucket 权限

1. 进入创建好的 Bucket，找到"权限管理" -> "读写权限"
2. 将权限修改为"公共读"（这是为了让应用可以公开访问上传的文件）
3. 确认修改



![](.\attachments\04af0559a29346aaa22c1044f8d9312c_MD5.jpeg)


### 4.3 配置跨域规则

1. 在 Bucket 设置中，找到"数据安全" -> "跨域设置"
2. 点击"设置"按钮，然后点击"创建规则"
3. 按以下配置填写：
   - 来源(Origin)：填写你 Vercel 应用的域名（如 `https://your-app.vercel.app`）
   - 允许 Methods(CORS)：GET, POST, PUT, DELETE, HEAD
   - 允许 Headers：*
- 点击"确定"保存规则

### 4.4 创建 RAM 子用户

为了安全起见，我们不直接使用主账号的 AccessKey。而是创建一个只拥有 OSS 操作权限的子用户。

1. 前往 [访问控制 RAM 控制台](https://ram.console.aliyun.com/users)
2. 点击"创建用户"按钮
3. 填写用户名（可自定义）
4. 点击"确定"创建用户
5. 创建完成后，务必保存好生成的 AccessKey ID 和 AccessKey Secret，这个凭证只会显示一次
6. 返回用户列表，找到刚创建的用户，点击"添加权限"
7. 在"系统策略"中搜索并选择 `AliyunOSSFullAccess`
8. 点击"确定"完成授权

### 4.5 获取 OSS 连接信息

1. 进入 [OSS管理控制台](https://oss.console.aliyun.com/bucket)
2. 找到你创建的 Bucket，点击进入
3. 在"概览"页面，记录以下两个信息：
   - Endpoint（地域节点）中的外网访问地址（如 `https://oss-cn-beijing.aliyuncs.com`）
   - Bucket 域名（如 `https://your-bucket-name.oss-cn-beijing.aliyuncs.com`）

### 4.6 在 Vercel 中添加 OSS 环境变量

回到 Vercel 项目的环境变量设置页面，添加以下变量：

| Key                  | Value                      | Example & Description                                       |
| -------------------- | -------------------------- | ----------------------------------------------------------- |
| S3_ACCESS_KEY_ID     | 你的 RAM 用户 AccessKey ID     | LTAI5t...                                                   |
| S3_SECRET_ACCESS_KEY | 你的 RAM 用户 AccessKey Secret | your-secret-key...                                          |
| S3_ENDPOINT          | 你的 Bucket 外网访问节点           | https://oss-cn-beijing.aliyuncs.com                         |
| S3_BUCKET            | 你的 Bucket 名称               | your-unique-bucket-name                                     |
| S3_PUBLIC_DOMAIN     | 你的 Bucket 访问域名             | https://your-unique-bucket-name.oss-cn-beijing.aliyuncs.com |

示例配置：
```
S3_ACCESS_KEY_ID=LT123123123123
S3_SECRET_ACCESS_KEY=y524523452345234cG976h822346346gB
S3_ENDPOINT=https://oss-cn-beijing.aliyuncs.com
S3_BUCKET=liujianmeisima
S3_PUBLIC_DOMAIN=https://zhaojiesima.oss-cn-beijing.aliyuncs.com
```

> **安全警告**：你的 AccessKey 和对象存储 Bucket 信息是高度敏感的资产。切勿泄露给任何人！有恶意用户会扫描网络来刷取他人的 OSS 流量，可能导致高额账单。强烈建议你的私人 LobeChat 应用不要公开给不受信任的人使用。

## 第 5 步：配置自定义域名

如果你希望使用自己的域名访问 LobeChat，需要进行以下配置：

### 5.1 在 Vercel 中配置自定义域名

1. 在 Vercel 项目控制台，进入 Settings -> Domains
2. 点击 Add，输入你的自定义域名（如 chat.yourdomain.com）
3. 根据提示配置 DNS 记录
4. 等待 SSL 证书自动颁发（通常需要几分钟）

### 5.2 更新 Auth0 配置

1. 登录 Auth0 控制台，进入你的应用设置
2. 找到 "Allowed Callback URLs" 字段，添加你的自定义域名回调地址：
   ```
   https://你的自定义域名/api/auth/callback/auth0
   ```
3. 保存更改

### 5.3 更新阿里云 OSS 跨域配置

1. 登录阿里云 OSS 控制台，进入你的 Bucket
2. 找到 "数据安全 -> 跨域设置"
3. 修改或添加跨域规则，将"来源"更新为你的自定义域名：
   ```
   https://你的自定义域名
   ```
4. 保存配置

### 5.4 更新环境变量

在 Vercel 项目设置中，更新以下环境变量：

| Key | 原值 | 新值 | 说明 |
|---|---|---|---|
| APP_URL | Vercel 默认域名 | https://你的自定义域名 | 应用访问地址 |
| NEXTAUTH_URL | Vercel 默认域名/api/auth | https://你的自定义域名/api/auth | NextAuth 的回调URL |

## 第 6 步：大功告成

当你完成以上所有环境变量的配置后，Vercel 会自动进行最后一次重新部署。等待部署成功后，访问你的自定义域名，你将看到 Auth0 的登录页面。登录后，即可开始享受你功能齐全、完全私有的 LobeChat 实例了！

---

## 环境变量汇总

### 数据库环境变量

| Key | Value | Description |
|---|---|---|
| DATABASE_URL | 粘贴你复制的 POSTGRES_URL_NONPOOLING 值 | 用于连接数据库的服务端链接 |
| NEXT_PUBLIC_SERVICE_MODE | server | 开启服务端模式，以便使用数据库功能 |
| KEY_VAULTS_SECRET | 运行 openssl rand -base64 32 生成 | 一个 32 位的随机密钥，用于加密敏感数据 |
| APP_URL | https://你的自定义域名 | 应用访问地址 |

```
DATABASE_URL=粘贴你复制的POSTGRES_URL_NONPOOLING值
NEXT_PUBLIC_SERVICE_MODE=server
KEY_VAULTS_SECRET=运行openssl rand -base64 32生成
APP_URL=https://你的自定义域名
```

### 认证环境变量

| Key                          | Value                    | Description                  |
| ---------------------------- | ------------------------ | ---------------------------- |
| NEXT_PUBLIC_ENABLE_NEXT_AUTH | 1                        | 在 Vercel 部署中显式开启 NextAuth 认证 |
| NEXT_AUTH_SECRET             | 生成的随机密钥                  | NextAuth 的加密密钥               |
| NEXT_AUTH_SSO_PROVIDERS      | auth0                    | 指定单点登录提供商                    |
| AUTH_AUTH0_ID                | 你的Auth0客户端ID             | Auth0 应用的客户端标识符              |
| AUTH_AUTH0_SECRET            | 你的Auth0客户端密钥             | Auth0 应用的客户端密钥               |
| AUTH_AUTH0_ISSUER            | 你的Auth0发行者URL            | Auth0 颁发者地址                  |
| NEXTAUTH_URL                 | https://你的自定义域名/api/auth | NextAuth 的回调URL              |

```
NEXT_PUBLIC_ENABLE_NEXT_AUTH=1
NEXT_AUTH_SECRET=生成的随机密钥
NEXT_AUTH_SSO_PROVIDERS=auth0
AUTH_AUTH0_ID=你的Auth0客户端ID
AUTH_AUTH0_SECRET=你的Auth0客户端密钥
AUTH_AUTH0_ISSUER=你的Auth0发行者URL
NEXTAUTH_URL=https://你的自定义域名/api/auth
```

### 对象存储环境变量

| Key                  | Value                      | Example & Description                                       |
| -------------------- | -------------------------- | ----------------------------------------------------------- |
| S3_ACCESS_KEY_ID     | 你的 RAM 用户 AccessKey ID     | LTAI5t...                                                   |
| S3_SECRET_ACCESS_KEY | 你的 RAM 用户 AccessKey Secret | your-secret-key...                                          |
| S3_ENDPOINT          | 你的 Bucket 外网访问节点           | https://oss-cn-beijing.aliyuncs.com                         |
| S3_BUCKET            | 你的 Bucket 名称               | your-unique-bucket-name                                     |
| S3_PUBLIC_DOMAIN     | 你的 Bucket 访问域名             | https://your-unique-bucket-name.oss-cn-beijing.aliyuncs.com |

```
S3_ACCESS_KEY_ID=你的RAM用户AccessKey ID
S3_SECRET_ACCESS_KEY=你的RAM用户AccessKey Secret
S3_ENDPOINT=你的Bucket外网访问节点
S3_BUCKET=你的Bucket名称
S3_PUBLIC_DOMAIN=你的Bucket访问域名
```

---
## 后记
1. 折腾半天都不能用，发现是NEXT_PUBLIC_ENABLE_NEXT_AUTH没有设置，另外lobechat的环境变量前几天才更新，建议同时参考官方网站进行部署。
2. 云函数有执行时间的限制，建议打开客户端请求模式。
3. auth0关闭注册：[如何禁用/启用特定应用程序的注册功能？ - Stack Overflow --- How to disable/enable Sign Ups for a specific application with Auth0? - Stack Overflow](https://stackoverflow.com/questions/70863967/how-to-disable-enable-sign-ups-for-a-specific-application-with-auth0)
4. 自动更新不建议开，不然突然炸了会很难受的。

## 参考资料：
1. [在 Vercel 上部署 LobeChat 的服务端数据库版本 · Lo... · LobeHub](https://lobehub.com/zh/docs/self-hosting/server-database/vercel)
2. [Vercel部署LobeChat数据库版简略流程 | 生物信息文件夹](https://pzweuj.github.io/posts/LobeChat)
3. [LobeChat私有化部署教程（带服务端数据库） - 知乎](https://zhuanlan.zhihu.com/p/29191032890)