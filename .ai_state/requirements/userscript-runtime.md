# Userscript Runtime Requirements

Updated: 2026-02-25

## R1. 单一运行时入口

- App 运行时必须只加载一个 userscript 资产：
  - `userscripts/nodeseek-pro.user.js`

## R2. 开发与运行分离

- 日常开发必须在 `userscripts/src/*.js` 进行。
- 合并产物不得作为手工维护源文件。

## R3. 构建期确定性合并

- 必须存在固定顺序的模块合并任务。
- 任一模块文件缺失时，构建应显式失败。

## R4. 产物目录规范

- 合并产物必须输出到 `app/build/generated/...` 下。
- 不应把生成产物放回 `app/src/main/assets/` 源码目录。

## R5. 运行时兼容稳定

- 运行时注入链路需保持现有 GM 兼容能力可用（存储、网络、通知等基础接口）。
- 不引入运行时分片加载与分片回退机制。

## R6. 文档一致性

- README、`docs/userscript-splitting.md`、`.ai_state` 三处描述必须保持一致。
