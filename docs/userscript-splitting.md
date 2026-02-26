# 用户脚本模块化说明

本文档描述 `Nodeseek Pro` 的实际维护和运行模型：开发期多文件拆分，构建期合并为单文件，运行期单脚本注入。

## 核心原则

- 开发期：修改 `userscripts/src/*.js` 拆分源文件。
- 构建期：按固定顺序合并为一个产物文件。
- 运行期：App 仅加载 `userscripts/nodeseek-pro.user.js`，不做运行时分片。

## 文件职责（逐文件）

### A. 开发源（手工维护）

目录：`userscripts/src/`

#### `00-core-runtime.js`

- 定义脚本元信息（`@grant`、`@match`、`@run-at` 等）。
- 提供全局基础能力：`env`、DOM 工具（`$`/`$$`）、样式/脚本注入、节流防抖、头部图标定位工具。
- 提供配置中心：`store.reg/get/set`，负责合并各模块默认配置和元数据。
- 提供网络封装：`net.get/post/fetch`。
- 提供模块系统骨架：`define(cfg)` + `boot(ctx)`（拓扑排序 + `match/init/watch` 调度）。
- 说明：该文件是“核心片段”，不单独启动。

#### `10-feature-content-tools.js`

- 负责内容区增强模块，主要聚焦帖子/列表阅读与交互体验。
- 模块清单（`id`）：
- `autoJump`：外链跳转还原。
- `autoLoading`：列表/评论自动翻页，含分页按钮与历史处理。
- `blockPosts`：关键字过滤与折叠策略。
- `blockViewLevel`：低等级内容可见性处理。
- `callout`：Callout 语法渲染与编辑器插入支持。
- `codeHighlight`：代码高亮与复制按钮。
- `commentShortcut`：快捷键回复（如 Ctrl+Enter）。
- `darkMode`：深色模式样式同步（含高亮主题切换）。
- `history`：浏览历史面板与记录管理。
- `imageSlide`：帖子图片灯箱预览。
- `instantPage`：链接悬停预加载。
- `levelTag`：占位模块（当前关闭）。
- 运行时共享接口：
- 写入 `window.__nsxRuntime.reapplyKeywords`、`window.__nsxRuntime.refreshHistory`。
- 写入 `window.__nsxPanelCtrl.filter/history` 面板控制句柄。

#### `20-feature-settings-menu.js`

- 负责“设置与交互壳层”，是启动主流程所在片段。
- 启动职责：
- 构建 `Observer` 与 `ctx`（统一注入 `env/$/store/net/ui/watch`）。
- 注入 UI 资源（layui、highlight.js 相关样式/脚本）。
- 注册并初始化菜单与高级设置面板。
- 模块清单（`id`）：
- `menus`：菜单体系与设置入口。
- `quickComment`：快捷评论面板能力。
- `signIn`：自动签到。
- `signinTips`：签到提示。
- `smoothScroll`：页面平滑滚动。
- `userCardExt`：侧边卡片通知增强。
- `visitedColor`：已访问链接颜色。
- `timeChinese`：相对时间中文化。
- `imageUpload`：图床上传助手（NodeImage）。
- `openInNewTabFix`：帖子链接新标签行为修复。
- 运行时共享接口：
- `window.__nsxRuntime.openSheet` / `openSettings` / `exportEditorDiag`。
- `applyRuntimeSettings()`：设置变更后重应用逻辑。
- 通过 `NSXBridge.setPullToRefreshSuppressed` 管理面板打开时的下拉刷新抑制。

#### `30-feature-reputation.js`

- 负责名望诊断与作者信息增强模块。
- 模块清单（`id`）：
- `inlineUserInfo`：楼主/评论用户诊断信息、等级标签、手机端详情卡片、快捷社交操作。
- 与其他模块的协作：
- 读取 `window.__nsxRuntime.openSheet` 用于移动端操作面板。
- 调用 `window.__nsxRuntime.reapplyRelation` 触发关系状态刷新。

#### `40-feature-social-relation.js`

- 负责社交关系与“最终启动收口”。
- 模块清单（`id`）：
- `userRelation`：黑名单/好友本地关系管理，帖子页与列表页处理，关系管理面板。
- 额外注册：`blockPosts`、`blockViewLevel`（过滤模块在最终阶段统一接入）。
- 启动收口：
- 调用 `boot(ctx)`，执行所有已 `define` 模块的拓扑初始化。
- 在 `DOMContentLoaded` 或文档已就绪时触发 `start()`。
- 运行时共享接口：
- `window.__nsxRuntime.reapplyRelation`（关系重应用）。
- `window.__nsxPanelCtrl.relation`（关系面板控制）。

### B. 构建与运行时文件

#### `app/build.gradle`

- 定义 `assembleUserscriptSource` 任务。
- 按顺序读取以下 5 个源文件并拼接：
- `00-core-runtime.js`
- `10-feature-content-tools.js`
- `20-feature-settings-menu.js`
- `30-feature-reputation.js`
- `40-feature-social-relation.js`
- 输出到：`app/build/generated/userscripts/assets/userscripts/nodeseek-pro.user.js`。
- 将 `app/build/generated/userscripts/assets` 注册为 `assets` 来源。
- 通过 `preBuild -> assembleUserscriptSource` 确保常规构建自动合并。

#### `app/build/generated/userscripts/assets/userscripts/nodeseek-pro.user.js`

- 构建产物，运行时实际注入文件。
- 不作为源码维护，不建议手工修改。

#### `app/src/main/java/com/nodeseek/app/NodeseekUserscriptRuntime.java`

- 仅从 assets 读取 `userscripts/nodeseek-pro.user.js`。
- 通过 bootstrap 注入 GM 兼容 API、Bridge 能力、资源映射，再执行用户脚本。
- 运行时不再尝试加载任何分片脚本。

## 加载顺序与依赖规则

- 构建顺序必须固定：`00 -> 10 -> 20 -> 30 -> 40`。
- `00` 提供 `define/boot/store/net` 等基础设施，后续片段依赖这些符号存在。
- `20` 承担 `start()` 主流程，`30` 与 `40` 作为其后续拼接片段继续在同一作用域注册模块。
- `40` 负责最终 `boot(ctx)`，因此必须位于最后。
- 新增拆分文件时，必须同时更新 `app/build.gradle` 的 `userscriptSourceModules` 顺序。

## 常见改动落点

- 核心环境、模块调度、配置/网络基础：改 `00-core-runtime.js`。
- 内容页/列表页功能（过滤、历史、预览、高亮等）：改 `10-feature-content-tools.js`。
- 设置 UI、菜单、签到、图床、全局运行时接口：改 `20-feature-settings-menu.js`。
- 用户名望诊断与作者信息增强：改 `30-feature-reputation.js`。
- 黑名单/好友关系与最终启动收口：改 `40-feature-social-relation.js`。

## 验证命令

```bash
./gradlew :app:assembleUserscriptSource
```
