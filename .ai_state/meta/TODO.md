# TODO（执行清单）

状态约定：`BACKLOG -> IN_PROGRESS -> REVIEW -> DONE`

## BACKLOG

- [ ] P1: CI 增加 `:app:assembleUserscriptSource` 必过校验
- [ ] P1: 补充 App 内 userscript 注入 smoke 测试脚本（主站 + deepflood）
- [ ] P2: 为 `.ai_state/checkpoints/` 建立命名模板与最小字段约束

## IN_PROGRESS

- [ ] P0: `.ai_state` 重构（目录标准化、状态索引、经验索引）

## REVIEW

- [ ] P1: userscript 构建与运行时单脚本链路文档一致性复核（README / docs / .ai_state）

## DONE

- [x] P0: 将 userscript 产物迁移到 `app/build/generated/...`（2026-02-25）
- [x] P0: 删除源码资产 `app/src/main/assets/userscripts/nodeseek-pro.user.js`（2026-02-25）
- [x] P1: README 修正文案为单脚本加载（2026-02-25）
- [x] P1: 完整补充 `docs/userscript-splitting.md` 的逐文件职责与加载流程（2026-02-25）

---
Updated: 2026-02-25
