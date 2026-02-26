# .ai_state 工作区说明

本目录用于保存项目级长期状态，目标是让上下文可恢复、可追溯、可检索。

## 目录约定

- `meta/`
  - 当前状态、看板、待办、会话锁等“高频变动”信息。
- `requirements/`
  - 关键需求与验收标准，强调“必须满足什么”。
- `designs/`
  - 设计与实现边界，强调“如何满足需求”。
- `checkpoints/`
  - 里程碑快照与可回滚记录。
- `experience/`
  - 经验沉淀与索引。
  - `learned/` 下为按日期自动沉淀条目。
  - `EXP-xxx.md` 为人工整理的结构化经验。

## 使用规则

- 变更优先更新 `meta/state.yaml` 与对应 checkpoint。
- 新经验先落在 `experience/EXP-xxx.md`，再更新 `experience/index.md`。
- 需求变化先改 `requirements/`，再同步 `designs/` 与 `meta/TODO.md`。
- 文档内路径尽量使用仓库相对路径，避免环境耦合。

## 当前基线（2026-02-25）

- 运行时模式：单脚本注入（`userscripts/nodeseek-pro.user.js`）。
- 构建模式：`userscripts/src/*.js` 合并到 `app/build/generated/.../nodeseek-pro.user.js`。
- 参考文档：`docs/userscript-splitting.md`。
