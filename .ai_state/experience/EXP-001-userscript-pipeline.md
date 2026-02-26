# EXP-001: 单脚本运行时 + 构建期合并的稳定实践
Created: 2026-02-25
Tags: [userscript, android-webview, build, assets, runtime]

## 问题背景

- 开发中需要把 userscript 拆分成多文件维护。
- 运行时又要求注入链路稳定、顺序确定、排障简单。
- 若把合并产物放在源码目录，容易出现“误修改构建产物”和合并冲突。

## 解决方案

- 开发源固定在 `userscripts/src/*.js`，按明确顺序维护。
- 构建任务 `assembleUserscriptSource` 将模块合并输出到：
  - `app/build/generated/userscripts/assets/userscripts/nodeseek-pro.user.js`
- 在 `android.sourceSets.main.assets.srcDir(...)` 中注册该生成目录。
- 运行时仍只读取 `userscripts/nodeseek-pro.user.js`，保持注入链路单一。

## 关键动作

1. 将输出目录从 `app/src/main/assets/userscripts` 迁移到 `app/build/generated/...`
2. 删除源码资产 `app/src/main/assets/userscripts/nodeseek-pro.user.js`
3. 保持 `preBuild -> assembleUserscriptSource` 依赖关系
4. 同步修正文档（README 与 userscript-splitting）

## 注意事项

- 运行时单脚本不等于开发期单文件：开发仍在 `userscripts/src/` 做模块化。
- 若新增模块文件，必须同时更新 `app/build.gradle` 的模块顺序列表。
- 该方案的主要风险不在本地注入，而在外部资源可用性（如 `layui`、`highlight.js`）。
