# 当前基线（US-2026-02-25）

## 1) 基线目标

- 固化用户脚本链路：开发多文件、构建合并、运行单脚本。
- 防止回退到“源码资产手改”或“运行时分片加载”。

## 2) 基线事实

- 源文件目录：`userscripts/src/`
- 构建产物：`app/build/generated/userscripts/assets/userscripts/nodeseek-pro.user.js`
- 运行时资产路径：`userscripts/nodeseek-pro.user.js`

## 3) 必过检查

1. 构建任务可执行：`:app:assembleUserscriptSource`
2. 缺失任一模块时构建应失败
3. 产物文件可生成到 `build/generated` 目录
4. 运行时代码仅读取 `userscripts/nodeseek-pro.user.js`

## 4) 快速验证命令

```bash
./gradlew :app:assembleUserscriptSource
```

## 5) 最近关联提交

- `b6d184b`：脚本产物迁移到 `build/generated`，删除源码资产文件
- `9b64f59`：README 明确运行时单脚本机制
- `a788c5b`：完善 userscript 拆分与加载文档

## 6) 回退锚点

- 若出现脚本注入异常，优先检查 `app/build.gradle` 中：
  - `userscriptSourceModules` 顺序
  - `assets.srcDir(generatedUserscriptAssetsDir)`
  - `preBuild -> assembleUserscriptSource`
