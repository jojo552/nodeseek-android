# Kanban（当前）

## TODO

- 为 `:app:assembleUserscriptSource` 增加 CI 校验步骤（防止模块缺失进入主干）
- 增加运行时 smoke checklist（Debug/Release 各一轮）
- 为 `docs/userscript-splitting.md` 补一张加载链路图（构建 -> assets -> runtime）

## DOING

- `.ai_state` 结构重构（目录标准化 + 索引化）

## DONE

- userscript 构建产物迁移到 `app/build/generated/...`，不再维护源码资产文件
- README 表述修正为“运行时单脚本加载（无分片回退）”
- `docs/userscript-splitting.md` 补充逐文件职责与启动链路

---
Updated: 2026-02-25
Focus: Userscript Build/Runtime Pipeline
