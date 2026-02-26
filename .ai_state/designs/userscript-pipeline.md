# Userscript Pipeline Design

Updated: 2026-02-25

## 目标

- 保持“开发可维护”与“运行时稳定”同时成立。

## 设计概览

1. 开发层
   - 文件：`userscripts/src/*.js`
   - 特性：按职责拆分、顺序可控、便于定位改动
2. 构建层
   - 文件：`app/build.gradle`
   - 任务：`assembleUserscriptSource`
   - 输出：`app/build/generated/userscripts/assets/userscripts/nodeseek-pro.user.js`
3. 运行层
   - 文件：`NodeseekUserscriptRuntime.java`
   - 行为：仅读取并注入 `userscripts/nodeseek-pro.user.js`

## 关键约束

- 合并顺序固定：`00 -> 10 -> 20 -> 30 -> 40`
- `40-feature-social-relation.js` 负责最终 `boot(ctx)` 收口
- 新增拆分文件时必须同步更新构建模块列表

## 为什么不做运行时按需加载

- 当前架构是 assets 本地注入，网络并非主要瓶颈。
- 按需加载会显著增加依赖时序、错误恢复、调试复杂度。
- 当前“开发拆分 + 构建合并 + 运行单脚本”已是稳定折中。

## 关联文档

- `docs/userscript-splitting.md`
- `.ai_state/requirements/userscript-runtime.md`
