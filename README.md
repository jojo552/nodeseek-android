# NodeSeek Android

非官方 NodeSeek Android 客户端（WebView 方案），用于在安卓设备访问 `https://www.nodeseek.com/`。

## 介绍

- 已集成 `Nodeseek Pro` 增强脚本，支持自动签到、黑名单/好友、关键字过滤、历史记录、快捷回复等能力。
- 针对移动端做了专项适配，重点覆盖：可拖动悬浮入口与二级菜单、小屏工具栏与回复栏布局稳定性、移动端图标/角标防遮挡、下拉刷新与弹层滚动冲突处理。

## 项目特性

- 支持站内页面浏览，外链自动交由系统浏览器打开。
- 支持下拉刷新与主框架错误提示。
- 支持 `nodeseek.com` / `www.nodeseek.com` 深链唤起。
- 支持系统明暗模式与网页主题联动（自动同步网页右上角主题开关）。
- 内置 `Nodeseek Pro` 用户脚本：移动端入口为可拖动悬浮按钮（点击打开 Pro 菜单），并针对手机场景持续做交互与布局优化。

## 用户脚本拆分文档

- 结构与功能说明：`docs/userscript-splitting.md`
- 内容覆盖：拆分文件职责、构建合并规则、运行时单文件加载机制（无分片回退）。

## 下载与安装

- 最新稳定包：`Releases/latest` 中的 `nodeseek.apk`
- 直链：`https://github.com/jojo552/nodeseek-android/releases/download/latest/nodeseek.apk`

> 说明：优先使用 `Releases` 下载；`Artifacts` 可能受仓库存储配额影响而不可用。

## 开发环境要求

| 项目 | 要求 |
| --- | --- |
| JDK | 17 |
| Android SDK | 与 `compileSdk` 对应版本（当前为 36） |
| 最低系统版本 | Android 10（`minSdk=29`） |

## 本地构建

### Debug

```bash
./gradlew assembleDebug
```

输出：`app/build/outputs/apk/debug/app-debug.apk`

Windows 也可直接使用：

```powershell
.\build.bat
```

### Release（推荐）

为保证后续 APK 可覆盖安装，`release` 包应使用固定签名证书。

1. 在项目根目录创建 `keystore.properties`：

```properties
storeFile=xxx.jks
storePassword=******
keyAlias=******
keyPassword=******
# 可选
# storeType=PKCS12
```

2. 执行构建：

```bash
./gradlew assembleRelease
```

输出：`app/build/outputs/apk/release/app-release.apk`

## CI 自动构建与发布

GitHub Actions 会在 `main` 分支推送或手动触发时自动构建 APK。

- 未配置签名 secrets：构建 `debug` APK，并上传到当前工作流 `Artifacts`。
- 已配置签名 secrets：构建 `release` APK，并在 `main` 分支发布到 `Releases/latest`。

如需 CI 使用固定签名，请在仓库 `Secrets` 配置：

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

此外，CI 会基于 `GITHUB_RUN_NUMBER` 自动递增 `versionCode`，避免覆盖安装失败。

## 常见问题

### 1) 从其他应用打开 NodeSeek 链接无反应

请确认系统中已允许该应用处理 `nodeseek.com` / `www.nodeseek.com` 链接。

### 2) 安装提示“与现有软件包冲突”或签名异常

原因通常是设备上已安装相同包名（`com.nodeseek.app`）但签名不同的版本。

- 处理方式：先卸载旧版本，再安装新 APK。
- 后续若持续使用同一份 `release` 证书签名，可正常覆盖更新。

## 免责声明

本项目为第三方非官方客户端，与 NodeSeek 官方无隶属关系。
