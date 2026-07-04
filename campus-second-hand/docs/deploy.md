# campus-second-hand 部署说明

这份说明对应“前后端分离 + 可公网访问”的部署方式，适合放到云服务器上运行。

## 一、推荐部署结构

- 前端：Vue 打包后的静态文件
- 后端：Spring Boot jar
- 数据库：MySQL
- 反向代理：Nginx
- 图片目录：后端服务器本地 `uploads/`

推荐访问方式：

- 前端页面：`http://你的域名/`
- 后端接口：`http://你的域名/api`
- 商品图片：`http://你的域名/uploads/xxx.jpg`

## 二、服务器准备

建议一台 Linux 云服务器，至少准备：

- JDK 17 或更高
- Maven 3.9+
- MySQL 8
- Nginx
- Node.js 18+

## 三、后端配置

后端配置文件已经改成支持环境变量，默认值仍可用于本地开发。

关键环境变量如下：

```bash
SERVER_PORT=8080
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=campus_second_hand
DB_USERNAME=root
DB_PASSWORD=12345
JWT_SECRET=campusSecondHandSecretKey1234567890
JWT_EXPIRE=86400000
FILE_UPLOAD_PATH=/opt/campus-second-hand/uploads
FILE_ACCESS_URL_PREFIX=/uploads/
```

### 1. 打包后端

```bash
cd campus-second-hand-backend
mvn clean package -DskipTests
```

打包后得到：

```text
target/campus-second-hand-backend-1.0.0.jar
```

### 2. 启动后端

```bash
java -jar target/campus-second-hand-backend-1.0.0.jar
```

如果要带环境变量启动：

```bash
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_NAME=campus_second_hand
export DB_USERNAME=root
export DB_PASSWORD=你的密码
export FILE_UPLOAD_PATH=/opt/campus-second-hand/uploads
export FILE_ACCESS_URL_PREFIX=/uploads/
java -jar target/campus-second-hand-backend-1.0.0.jar
```

## 四、前端配置

前端已经支持开发和生产环境配置：

- `.env.development`
- `.env.production`

当前生产环境默认值：

```env
VITE_API_BASE_URL=/api
VITE_FILE_BASE_URL=
```

这表示：

- 页面请求接口时访问 `/api`
- 图片访问时使用同域名下的 `/uploads/...`

### 1. 打包前端

```bash
cd campus-second-hand-frontend
npm install
npm run build
```

打包后目录：

```text
dist/
```

## 五、Nginx 配置

仓库中已提供示例文件：

- [nginx.campus-second-hand.conf](D:\study_Files\code\java\campus-second-hand\docs\nginx.campus-second-hand.conf)

配置思路如下：

1. `/` 指向前端 `dist`
2. `/api/` 反向代理到 Spring Boot
3. `/uploads/` 访问后端图片目录

## 六、部署步骤建议

### 方案一：前后端放同一台服务器

1. 安装 MySQL、JDK、Nginx、Node
2. 导入数据库 SQL
3. 打包后端 jar
4. 打包前端 dist
5. 把 `dist` 放到 Nginx 静态目录
6. 启动 Spring Boot
7. 配置 Nginx

这是最适合实习项目的方案，简单、好讲，也容易成功。

## 七、图片上传说明

现在上传的图片会保存到：

```text
FILE_UPLOAD_PATH
```

例如：

```text
/opt/campus-second-hand/uploads
```

接口返回的图片路径类似：

```text
/uploads/abc123.jpg
```

前端会直接使用这个路径显示图片。

## 八、数据库提醒

现在代码里数据库地址已经支持环境变量，但你必须保证：

1. 服务器 MySQL 已安装
2. 已创建数据库 `campus_second_hand`
3. 已导入 `campus-second-hand-backend/sql/campus_second_hand.sql`

## 九、演示建议

如果你是为了简历项目展示，最推荐：

1. 一台云服务器
2. 一个域名
3. Nginx + Spring Boot + MySQL
4. 用公网地址直接访问

这样面试时你可以直接说：

- 前端通过 Nginx 提供静态资源
- 后端以 jar 包方式部署
- 接口通过 `/api` 反向代理
- 商品图片通过 `/uploads` 对外访问

这套说法会比“我本地跑起来了”更像一个真正可上线的项目。
