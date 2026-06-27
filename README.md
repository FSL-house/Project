# Project

这是我的项目总仓库，统一收录了几个具有代表性的课程 / 练习 / 实战作品，方便集中展示与查看源码。

## 仓库说明

本仓库将多个独立项目整理到一个仓库中，每个项目保留原有目录结构，便于招聘方或面试官快速浏览我的项目经历。

当前收录项目：

- `FilmRadar`
- `STM32_SmartLight_Protect`
- `campus-second-hand`

## 项目总览

| 项目名 | 类型 | 技术栈 | 简介 |
|---|---|---|---|
| `FilmRadar` | 跨平台部署的电影推荐 Web 应用系统 | Node.js、Express、MySQL、Spark ALS、ECharts | 一个电影推荐系统，支持评分、电影浏览、推荐结果展示与可视化分析。 |
| `STM32_SmartLight_Protect` | 嵌入式项目 | STM32、ADC、PWM、OLED、蓝牙、EEPROM | 基于 STM32 的智能人体感应照明与过热保护综合系统。 |
| `campus-second-hand` | 前后端分离 Web 项目 | Spring Boot、MyBatis-Plus、MySQL、Vue3、Element Plus | 一个校园二手交易平台，支持登录、商品发布、订单、收藏和后台管理。 |

## 目录结构

```text
Project
├─ FilmRadar
├─ STM32_SmartLight_Protect
└─ campus-second-hand
```

## 1. FilmRadar

路径：

```text
./FilmRadar
```

项目简介：

- 一个基于 Web 的电影推荐系统
- 用户可以登录、浏览电影、进行评分
- 系统支持热门、最新、随机、类型加权和 Spark ALS 协同过滤推荐
- 支持推荐结果可视化展示

主要技术：

- Node.js
- Express
- MySQL
- Spark ALS
- ECharts

说明：

- 更详细的运行说明请查看：
  - [FilmRadar/README.md](./FilmRadar/README.md)

## 2. STM32_SmartLight_Protect

路径：

```text
./STM32_SmartLight_Protect
```

项目简介：

- 基于 STM32F103 的嵌入式综合实践项目
- 实现暗光 + 人体检测自动照明
- 支持 PWM 调光、延时关灯、过热保护、OLED 显示、蓝牙控制和 EEPROM 掉电保存

主要技术 / 模块：

- STM32F103
- ADC
- PWM
- OLED
- 蓝牙串口
- EEPROM

说明：

- 更详细的硬件模块说明和引脚说明请查看：
  - [STM32_SmartLight_Protect/README.md](./STM32_SmartLight_Protect/README.md)

## 3. campus-second-hand

路径：

```text
./campus-second-hand
```

项目简介：

- 一个适合 Java 初学者学习和展示的前后端分离项目
- 模拟校园内二手商品交易场景
- 支持用户注册登录、商品发布、商品浏览、下单购买、商品收藏以及管理员审核管理

主要技术：

- Spring Boot
- MyBatis-Plus
- MySQL
- JWT
- Vue3
- Vite
- Element Plus
- Axios

说明：

- 更详细的启动步骤与数据库说明请查看：
  - [campus-second-hand/README.md](./campus-second-hand/README.md)

## 展示目的

这个仓库主要用于：

- 统一展示我的简历项目
- 方便面试官快速查看不同类型的作品
- 避免项目仓库过于分散，提升展示效率

## 说明

- 各项目源码均保留在对应子目录中
- 每个子项目如有独立说明文档，请优先阅读各自目录下的 `README.md`
- 本仓库更偏向“作品集总入口”，不是单一项目仓库
