# Checkpoint: 2026-02-25 Userscript Asset Pipeline

## 背景

- 目标是彻底去除源码目录中的 userscript 合并产物，避免手工维护构建文件。

## 变更摘要

- 将 userscript 合并输出目录迁移到 `app/build/generated/userscripts/assets/userscripts/`
- 删除 `app/src/main/assets/userscripts/nodeseek-pro.user.js`
- 在 `sourceSets.main.assets` 注册生成目录
- 保持 `preBuild -> assembleUserscriptSource` 自动合并链路

## 关联提交

- `b6d184b` build: generate userscript asset under build dir
- `9b64f59` docs: clarify userscript runtime loading behavior
- `a788c5b` docs: detail userscript file responsibilities and load flow

## 验证记录

- 命令：`./gradlew :app:assembleUserscriptSource`
- 结果：成功生成 `app/build/generated/userscripts/assets/userscripts/nodeseek-pro.user.js`

## 风险与后续

- 风险：缺少自动化 smoke 覆盖真实运行时注入
- 后续：
  - 在 CI 增加 `:app:assembleUserscriptSource` 必过
  - 增加 debug/release 手工 smoke 清单
