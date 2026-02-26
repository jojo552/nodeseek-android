       [ 🧭 辅助工具 ] - 自动跳转外部链接
       ========================================================================== */
    const autoJump = {
        id: "autoJump",
        order: 210,
        cfg: { auto_jump_external_links: { enabled: true } },
        meta: { auto_jump_external_links: { label: "自动跳转外部链接", group: "🧭 辅助工具" } },
        match: ctx => ctx.store.get("auto_jump_external_links.enabled", true),
        init(ctx) {
            $$('a[href*="/jump?to="]').forEach(a => {
                try {
                    const to = new URL(a.href).searchParams.get("to");
                    if (to) a.href = decodeURIComponent(to);
                } catch { }
            });
            if (/^\/jump/.test(location.pathname)) ctx.$(".btn")?.click();
        }
    };

    const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: autoJump
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🧭 辅助工具 ] - 下拉加载 / 自动翻页 (Infinite Scroll)
       ========================================================================== */

    const PROFILES = {
        list: { path: /^\/(categories\/|page|award|search|$)/, threshold: 1500, next: ".nsk-pager a.pager-next", list: "ul.post-list:not(.topic-carousel-panel)", pagerTop: "div.nsk-pager.pager-top", pagerBot: "div.nsk-pager.pager-bottom" },
        post: { path: /^\/post-/, threshold: 690, next: ".nsk-pager a.pager-next", list: "ul.comments", pagerTop: "div.nsk-pager.post-top-pager", pagerBot: "div.nsk-pager.post-bottom-pager" }
    };

    const autoLoading = {
        id: "autoLoading",
        order: 220,
        cfg: { loading_post: { enabled: true }, loading_comment: { enabled: true } },
        meta: {
            loading_post: { label: "自动加载下一页(帖子)", group: "🧭 辅助工具" },
            loading_comment: { label: "自动加载下一页(评论)", group: "🧭 辅助工具" }
        },
        match: ctx => ctx.isList || ctx.isPost,
        init(ctx) {
            const profile = ctx.isList ? PROFILES.list : ctx.isPost ? PROFILES.post : null;
            if (!profile) return;

            const cfgKey = ctx.isList ? "loading_post.enabled" : "loading_comment.enabled";
            let isEnabled = ctx.store.get(cfgKey, true);

            // 注入快捷开关按钮：纯净创造节点，以原生的 class 和 CSS 层叠逻辑定位
            const navGroup = ctx.$("#fast-nav-button-group");
            if (navGroup) {
                const btn = document.createElement("a");
                btn.className = "nav-item-btn";
                btn.id = "nsx-toggle-autoload";
                btn.href = "javascript:void(0);";

                const updateBtn = () => {
                    // 开启时：绿色向下加载流水线； 关闭时：鲜红色带禁止图标
                    if (isEnabled) {
                        btn.title = "瀑布流自动加载：已开启 (点击休眠)";
                        btn.innerHTML = `<svg viewBox="0 0 48 48" fill="none" class="iconpark-icon" style="width:24px;height:24px;color:#4caf50;"><path d="M24 10V38M12 26L24 38L36 26" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                    } else {
                        btn.title = "瀑布流自动加载：已休眠 (点击开启)";
                        btn.innerHTML = `<svg viewBox="0 0 48 48" fill="none" class="iconpark-icon" style="width:24px;height:24px;color:#f44336;"><path d="M24 10V38M12 26L24 38L36 26" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8L40 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                    }
                };
                updateBtn();

                btn.onclick = (e) => {
                    e.preventDefault();
                    isEnabled = !isEnabled;
                    ctx.store.set(cfgKey, isEnabled);
                    updateBtn();
                    ctx.ui?.toast?.(isEnabled ? "✅ 瀑布流向下加载已开启" : "❌ 瀑布流加载已停用");
                };

                // 置于结构序列的第一位，由扩展的 nth-last-child CSS 接管精准定位！
                navGroup.prepend(btn);
            }

            let busy = false, prevY = scrollY;

            const blockByLevel = (doc) => {
                const lv = ctx.user?.rank || 0;
                doc.querySelectorAll('.post-list-item use[href="#lock"]').forEach(el => {
                    const n = +(el.closest("span")?.textContent?.match(/\d+/)?.[0] || 0);
                    if (n > lv) el.closest(".post-list-item")?.classList.add("blocked-post");
                });
            };

            const load = async () => {
                if (!isEnabled || busy) return;
                const atBottom = document.documentElement.scrollHeight <= innerHeight + scrollY + profile.threshold;
                if (!atBottom) return;
                const nextUrl = ctx.$(profile.next)?.href;
                if (!nextUrl) return;

                busy = true;
                try {
                    const html = await net.get(nextUrl, {}, "text");
                    const doc = new DOMParser().parseFromString(html, "text/html");
                    blockByLevel(doc);

                    // 评论数据同步
                    if (ctx.isPost) {
                        const json = doc.getElementById("temp-script")?.textContent;
                        if (json) try {
                            const cfg = JSON.parse(decodeURIComponent(atob(json).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")));
                            if (cfg?.postData?.comments) ctx.uw.__config__.postData.comments.push(...cfg.postData.comments);
                        } catch { }
                    }

                    const src = doc.querySelector(profile.list), dst = document.querySelector(profile.list);
                    if (src && dst) dst.append(...src.children);

                    [profile.pagerTop, profile.pagerBot].forEach(sel => {
                        const s = doc.querySelector(sel), d = document.querySelector(sel);
                        if (s && d) d.innerHTML = s.innerHTML;
                    });

                    // 瀑布流自动加载会在同一页内不断请求下一页：
                    // - 若使用 pushState，会把每次自动翻页都写入历史栈
                    // - 安卓侧“返回手势/返回键”会先回退这些虚拟记录，导致无法“一步返回上个页面”
                    // 这里使用 replaceState：保持地址栏同步到最新页，但不污染历史记录
                    try { history.replaceState(null, "", nextUrl); } catch { }
                } catch (e) { ctx.env.error("autoLoading", e); }
                busy = false;
            };

            const deb = debounce(load, 300);
            addEventListener("scroll", throttle(() => { if (scrollY > prevY) deb(); prevY = scrollY; }, 200), { passive: true });

            document.addEventListener('click', e => {
                const a = e.target.closest('a');
                if (a && (a.classList.contains('pager-pos') || a.classList.contains('pager-prev') || a.classList.contains('pager-next') || a.closest('.nsk-pager'))) {
                    a.target = '_self';
                    e.stopImmediatePropagation();
                }
            }, true);
        }
    };

    const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: autoLoading
    }, Symbol.toStringTag, { value: 'Module' }));


    /* ==========================================================================
       [ 🚫 过滤设置 ] - 关键字过滤 (帖子屏蔽)
       ========================================================================== */

    const mark$3 = new WeakSet();
    const run$1 = (els, ctx) => {
        const kws = (ctx.store.get("block_posts.keywords", []) || []).map(k => String(k).trim().toLowerCase()).filter(Boolean);
        els.forEach(item => {
            if (mark$3.has(item)) return;
            mark$3.add(item);
            const title = item.querySelector(".post-title>a")?.textContent?.toLowerCase() || "";
            if (kws.some(k => title.includes(k))) item.classList.add("blocked-post");
        });
    };

    const blockPosts = {
        id: "blockPosts",
        order: 380,
        cfg: { block_posts: { enabled: true } },
        meta: {
            block_posts: {
                label: "关键字管理", group: "🚫 过滤设置",
                fields: {}
            }
        },
        match: ctx => (ctx.isList || ctx.isPost) && ctx.store.get("block_posts.enabled", true),
        init(ctx) {
            const keywordsKey = 'nsx_advanced_keywords';
            const getMap = () => { try { return JSON.parse(localStorage.getItem(keywordsKey) || '{}'); } catch { return {}; } };
            const saveMap = (map) => localStorage.setItem(keywordsKey, JSON.stringify(map));

            const runFilter = (els) => {
                const kws = getMap();
                const kwEntries = Object.entries(kws);
                if (!kwEntries.length) return;
                const hColor = ctx.store.get("block_posts.highlight_color", "#fff9c4");

                els.forEach(item => {
                    if (item.dataset.nsxKwProcessed) return;
                    const titleEl = item.querySelector(".post-title>a");
                    const title = titleEl?.textContent?.toLowerCase() || "";
                    if (!title) return;

                    let matchedColors = [];
                    let shouldHide = false;
                    let foldWords = [];

                    for (const [word, info] of kwEntries) {
                        const groupWords = String(word || "").split(/[，,]/).map(s => s.trim().toLowerCase()).filter(Boolean);
                        if (!groupWords.length) continue;
                        const hit = groupWords.some(w => title.includes(w));
                        if (!hit) continue;

                        if (info.type === 'highlight') {
                            matchedColors.push(info.color || "#fff9c4");
                        } else if (info.type === 'block') {
                            if (info.mode === 'hide') {
                                shouldHide = true;
                                break;
                            } else {
                                foldWords.push(word);
                            }
                        }
                    }

                    if (shouldHide) {
                        item.style.display = 'none';
                    } else if (foldWords.length > 0) {
                        item.classList.add('nsx-post-folded');
                        if (!item.querySelector('.nsx-fold-notice')) {
                            const notice = document.createElement('div');
                            notice.className = 'nsx-fold-notice';
                            notice.style.padding = '10px 15px';
                            notice.innerHTML = `<span>已折叠包含关键词 [<b>${foldWords.join(', ')}</b>] 的主题</span><span class="nsx-unfold-btn" style="text-decoration:underline;cursor:pointer">点此查看</span>`;
                            notice.querySelector('.nsx-unfold-btn').onclick = () => { item.classList.remove('nsx-post-folded'); notice.style.display = 'none'; };
                            item.prepend(notice);
                        }
                    } else if (matchedColors.length > 0) {
                        item.style.transition = "background-color 0.3s, background 0.3s";
                        if (matchedColors.length === 1) {
                            item.style.backgroundColor = matchedColors[0];
                        } else {
                            // 多个关键字冲突：使用线性渐变色
                            const uniqueColors = [...new Set(matchedColors)];
                            if (uniqueColors.length === 1) {
                                item.style.backgroundColor = uniqueColors[0];
                            } else {
                                item.style.background = `linear-gradient(90deg, ${uniqueColors.join(', ')})`;
                            }
                        }
                    }

                    if (shouldHide || foldWords.length > 0 || matchedColors.length > 0) {
                        item.dataset.nsxKwProcessed = "1";
                    }
                });
            };

            const reapplyKeywords = () => {
                const all = $$(".post-list-item");
                all.forEach(item => {
                    delete item.dataset.nsxKwProcessed;
                    item.style.display = "";
                    item.style.backgroundColor = "";
                    item.style.background = "";
                    item.style.transition = "";
                    item.classList.remove("nsx-post-folded");
                    item.querySelectorAll(".nsx-fold-notice").forEach(n => n.remove());
                });
                runFilter(all);
            };

            runFilter($$(".post-list-item"));
            ctx.watch(".post-list-item", els => runFilter(els), { debounce: 150 });
            window.__nsxRuntime ||= {};
            window.__nsxRuntime.reapplyKeywords = reapplyKeywords;

            // --- 独立的关键字面板逻辑 ---
            let kwPanel = null, kwTrigger = null, pState = { open: false, kw: "", tab: "block" };
            const head = ctx.$("#nsk-head");
            if (head) {
                let grp = document.getElementById('nsx-icon-group');
                if (!grp) {
                    grp = document.createElement('div');
                    grp.id = 'nsx-icon-group';
                    grp.style.cssText = 'display:flex;align-items:center;';
                    head.appendChild(grp);
                }
                kwTrigger = document.createElement("div");
                kwTrigger.className = "filter-dropdown-on";
                kwTrigger.style.cssText = "";
                kwTrigger.innerHTML = `<svg viewBox="0 0 48 48" fill="none" style="width:17px;height:17px;color:currentColor;"><path d="M6 9L20.4 25.8178V38.4444L27.6 42V25.8178L42 9H6Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`;
                kwTrigger.title = "关键字过滤管理";
                grp.appendChild(kwTrigger);

                const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

                const renderList = () => {
                    const map = getMap();
                    let list = Object.entries(map).map(([k, v]) => ({ word: k, ...v }));
                    if (pState.kw) list = list.filter(i => i.word.toLowerCase().includes(pState.kw));
                    list = list.filter(i => (pState.tab === 'highlight' ? i.type === 'highlight' : i.type !== 'highlight'));
                    list.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));

                    kwPanel.querySelectorAll('.nsx-rel-tab').forEach(b => b.classList.toggle('is-active', b.dataset.t === pState.tab));
                    const lEl = kwPanel.querySelector(".nsx-rel-list");
                    if (!list.length) { lEl.innerHTML = `<div class="nsx-rel-empty">当前分组没有关键字</div>`; return; }

                    lEl.innerHTML = list.map(i => {
                        let iconColor = i.type === 'highlight' ? (i.color || "#ffb300") : "#9e9e9e";
                        return `<div class="nsx-rel-item">
                            <div class="nsx-rel-link">
                                <span class="nsx-rel-icon" style="color:white;background:${iconColor};opacity:0.8;font-size:14px;${i.type === 'highlight' ? 'border:1px solid rgba(0,0,0,0.1)' : ''}">#</span>
                                <div class="nsx-rel-info">
                                    <span class="nsx-rel-item-title" data-un="${esc(i.word)}">${esc(i.word)}</span>
                                    <span class="nsx-rel-remark" data-un="${esc(i.word)}">${i.type === 'highlight' ? '高亮 (颜色: ' + (i.color || "默认") + ')' : (i.mode === 'hide' ? '彻底隐藏' : '折叠展示')}（双击编辑）</span>
                                </div>
                            </div>
                            <span class="nsx-rel-time">${i.time ? i.time.split(' ')[0] : ''}</span>
                            <button class="nsx-rel-close" data-a="del" data-un="${esc(i.word)}">移除</button>
                        </div>`;
                    }).join("");
                };

                const openPanel = () => {
                    if (!kwPanel) {
                        const getKwDialogArea = () => isSmallScreen(768) ? ['96vw', '78vh'] : ['520px', '430px'];
                        kwPanel = document.createElement("div"); kwPanel.id = "nsx-filter-panel";
                        kwPanel.innerHTML = `
                                <div class="nsx-rel-header">
                                    <div class="nsx-rel-head-main">
                                        <div class="nsx-rel-title">关键字过滤</div>
                                        <div class="nsx-rel-sub">管理屏蔽与高亮规则，支持分类检索和编辑</div>
                                    </div>
                                    <div class="nsx-rel-actions">
                                        <button class="nsx-rel-action" data-a="clear">清空当前组</button>
                                        <button class="nsx-rel-close-btn" data-a="close" aria-label="关闭">×</button>
                                    </div>
                                </div>
                                <div class="nsx-rel-search"><span class="nsx-rel-search-i">🔎</span><input placeholder="搜索关键字与配置..."/></div>
                                <div class="nsx-rel-tabs"><button class="nsx-rel-tab is-active" data-t="block">屏蔽组</button><button class="nsx-rel-tab" data-t="highlight">高亮组</button></div>
                                <div class="nsx-filter-add-row"><button class="nsx-rel-action nsx-filter-add-btn" data-a="add">新增关键词</button></div>
                                <div class="nsx-rel-list"></div>
                            `;
                        document.body.appendChild(kwPanel);

                        kwPanel.querySelector("input").oninput = e => { pState.kw = e.target.value.toLowerCase(); renderList(); };
                        kwPanel.onclick = e => {
                            e.stopPropagation();
                            const t = e.target.closest('[data-t]');
                            if (t) { pState.tab = t.dataset.t; renderList(); return; }
                            const a = e.target.closest("[data-a]"); if (!a) return;
                            const act = a.dataset.a, un = a.dataset.un;
                            if (act === "close") { closePanel(); return; }

                            if (act === "clear") {
                                ctx.ui.confirm("清空列表?", `确定要删除当前分组（${pState.tab === 'highlight' ? '高亮' : '屏蔽'}）的关键字吗？`, () => {
                                    const map = getMap();
                                    Object.keys(map).forEach(k => {
                                        const it = map[k] || {};
                                        const isHighlight = it.type === 'highlight';
                                        if ((pState.tab === 'highlight' && isHighlight) || (pState.tab === 'block' && !isHighlight)) delete map[k];
                                    });
                                    saveMap(map); reapplyKeywords(); renderList(); ctx.ui.toast("已清空");
                                });
                            }
                            if (act === "del") {
                                const map = getMap(); delete map[un]; saveMap(map); reapplyKeywords(); renderList(); ctx.ui.toast("已移除");
                            }
                            if (act === "add") {
                                const html = `
                                        <style>
                                            .nsx-kw-form{padding:20px 20px 0}
                                            .nsx-kw-form .layui-form-item{margin-bottom:12px}
                                            .nsx-kw-form .layui-form-label{width:76px;padding-left:0}
                                            .nsx-kw-form .layui-input-block{margin-left:96px}
                                            @media (max-width:768px){
                                                .nsx-kw-form{padding:12px 12px 0!important}
                                                .nsx-kw-form .layui-form-item{margin-bottom:10px}
                                                .nsx-kw-form .layui-form-label{width:64px!important;padding:8px 6px 8px 0!important;font-size:12px!important}
                                                .nsx-kw-form .layui-input-block{margin-left:74px!important}
                                            }
                                        </style>
                                        <div class="layui-form nsx-kw-form">
                                            <div class="layui-form-item"><label class="layui-form-label">关键字</label><div class="layui-input-block"><input type="text" id="nkw-v" class="layui-input" placeholder="输入词语（可用 , 分隔，同一组）"></div></div>
                                            <div class="layui-form-item"><label class="layui-form-label">类型</label><div class="layui-input-block"><select id="nkw-t" lay-filter="nkw-t-filter"><option value="block" ${pState.tab === 'block' ? 'selected' : ''}>🚫 屏蔽</option><option value="highlight" ${pState.tab === 'highlight' ? 'selected' : ''}>🎨 高亮</option></select></div></div>
                                            <div class="layui-form-item" id="nkw-m-box"><label class="layui-form-label">模式</label><div class="layui-input-block"><select id="nkw-m"><option value="fold">优雅折叠</option><option value="hide">彻底隐藏</option></select></div></div>
                                            <div class="layui-form-item" id="nkw-c-box" style="display:none;"><label class="layui-form-label">高亮颜色</label><div class="layui-input-block">
                                                <div id="nkw-color-picker"></div>
                                                <input type="hidden" id="nkw-c-val" value="#fff9c4">
                                            </div></div>
                                        </div>
                                    `;
                                ctx.ui.layer.open({
                                    title: '新增关键字', content: html, area: getKwDialogArea(), btn: ['添加', '取消'],
                                    success: (l) => {
                                        layui.use(['form', 'colorpicker'], function () {
                                            const form = layui.form;
                                            form.render('select');

                                            const syncTypeUI = (val) => {
                                                const isH = val === 'highlight';
                                                l.find('#nkw-m-box').toggle(!isH);
                                                l.find('#nkw-c-box').toggle(isH);
                                            };

                                            form.on('select(nkw-t-filter)', function (data) {
                                                syncTypeUI(data.value);
                                            });

                                            // 首次打开时根据默认选中项立即同步显示区域
                                            syncTypeUI(l.find('#nkw-t').val());

                                            layui.colorpicker.render({
                                                elem: '#nkw-color-picker',
                                                color: '#fff9c4',
                                                predefine: true,
                                                alpha: true,
                                                done: function (color) { l.find('#nkw-c-val').val(color); }
                                            });
                                        });
                                    },
                                    yes: (idx, l) => {
                                        const w = l.find('#nkw-v').val().trim();
                                        if (!w) return;
                                        const map = getMap();
                                        const type = l.find('#nkw-t').val();
                                        map[w] = {
                                            type,
                                            mode: type === 'block' ? l.find('#nkw-m').val() : null,
                                            color: type === 'highlight' ? l.find('#nkw-c-val').val() : null,
                                            time: new Date().toLocaleString()
                                        };
                                        saveMap(map); reapplyKeywords(); ctx.ui.layer.close(idx); renderList(); ctx.ui.toast("已添加");
                                    }
                                });
                            }
                        };
                        kwPanel.ondblclick = (e) => {
                            const target = e.target.closest('.nsx-rel-item-title,.nsx-rel-remark');
                            if (!target) return;
                            e.preventDefault();
                            e.stopPropagation();
                            const un = target.dataset.un;
                            const map = getMap();
                            const info = map[un];
                            if (!info) return;

                            const html = `
                                <style>
                                    .nsx-kw-form{padding:20px 20px 0}
                                    .nsx-kw-form .layui-form-item{margin-bottom:12px}
                                    .nsx-kw-form .layui-form-label{width:76px;padding-left:0}
                                    .nsx-kw-form .layui-input-block{margin-left:96px}
                                    @media (max-width:768px){
                                        .nsx-kw-form{padding:12px 12px 0!important}
                                        .nsx-kw-form .layui-form-item{margin-bottom:10px}
                                        .nsx-kw-form .layui-form-label{width:64px!important;padding:8px 6px 8px 0!important;font-size:12px!important}
                                        .nsx-kw-form .layui-input-block{margin-left:74px!important}
                                    }
                                </style>
                                <div class="layui-form nsx-kw-form">
                                    <div class="layui-form-item"><label class="layui-form-label">关键字</label><div class="layui-input-block"><input type="text" id="nkw-e-v" class="layui-input" value="${esc(un)}" placeholder="可用 , 分隔，作为同一组"></div></div>
                                    <div class="layui-form-item"><label class="layui-form-label">类型</label><div class="layui-input-block"><select id="nkw-e-t" lay-filter="nkw-e-t-filter"><option value="block" ${info.type === 'highlight' ? '' : 'selected'}>🚫 屏蔽</option><option value="highlight" ${info.type === 'highlight' ? 'selected' : ''}>🎨 高亮</option></select></div></div>
                                    <div class="layui-form-item" id="nkw-e-m-box" style="${info.type === 'highlight' ? 'display:none;' : ''}"><label class="layui-form-label">模式</label><div class="layui-input-block"><select id="nkw-e-m"><option value="fold" ${info.mode === 'hide' ? '' : 'selected'}>优雅折叠</option><option value="hide" ${info.mode === 'hide' ? 'selected' : ''}>彻底隐藏</option></select></div></div>
                                    <div class="layui-form-item" id="nkw-e-c-box" style="${info.type === 'highlight' ? '' : 'display:none;'}"><label class="layui-form-label">高亮颜色</label><div class="layui-input-block"><div id="nkw-e-color-picker"></div><input type="hidden" id="nkw-e-c-val" value="${esc(info.color || '#fff9c4')}"></div></div>
                                </div>`;
                            ctx.ui.layer.open({
                                title: '编辑关键字', content: html, area: getKwDialogArea(), btn: ['保存', '取消'],
                                success: (l) => {
                                    layui.use(['form', 'colorpicker'], function () {
                                        const form = layui.form;
                                        form.render('select');
                                        form.on('select(nkw-e-t-filter)', function (data) {
                                            const isH = data.value === 'highlight';
                                            l.find('#nkw-e-m-box').toggle(!isH);
                                            l.find('#nkw-e-c-box').toggle(isH);
                                        });
                                        layui.colorpicker.render({ elem: '#nkw-e-color-picker', color: info.color || '#fff9c4', predefine: true, alpha: true, done: color => l.find('#nkw-e-c-val').val(color) });
                                    });
                                },
                                yes: (idx, l) => {
                                    const nw = l.find('#nkw-e-v').val().trim();
                                    if (!nw) return;
                                    const type = l.find('#nkw-e-t').val();
                                    delete map[un];
                                    map[nw] = { type, mode: type === 'block' ? l.find('#nkw-e-m').val() : null, color: type === 'highlight' ? l.find('#nkw-e-c-val').val() : null, time: new Date().toLocaleString() };
                                    saveMap(map); reapplyKeywords(); ctx.ui.layer.close(idx); renderList(); ctx.ui.toast('已更新');
                                }
                            });
                        };
                        document.addEventListener("click", e => {
                            const inLayer = !!e.target.closest('.layui-layer,.layui-layer-page,.layui-layer-dialog,.layui-colorpicker');
                            if (inLayer) return;
                            const hasTopLayer = !!document.querySelector('.layui-layer[style*="z-index"]');
                            if (hasTopLayer) return;
                            if (pState.open && !kwPanel.contains(e.target) && !kwTrigger.contains(e.target)) closePanel();
                        });
                    }
                    const r = kwTrigger.getBoundingClientRect();
                    const baseBottom = (r && Number.isFinite(r.bottom) && r.bottom > 0) ? r.bottom : getHeadBottom();
                    kwPanel.style.top = `${baseBottom + 8}px`;
                    kwPanel.style.height = `${innerHeight - baseBottom - 16}px`;
                    kwPanel.style.right = ``;
                    renderList(); kwPanel.classList.add("show");
                    if (!pState.open) panelRefreshGuard.open();
                    pState.open = true;
                };
                const closePanel = () => {
                    if (!pState.open) return;
                    kwPanel?.classList.remove("show");
                    pState.open = false;
                    panelRefreshGuard.close();
                };
                window.__nsxPanelCtrl ||= {};
                window.__nsxPanelCtrl.filter = { close: closePanel, isOpen: () => pState.open };
                kwTrigger.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!pState.open) {
                        window.__nsxPanelCtrl.history?.close?.();
                        window.__nsxPanelCtrl.relation?.close?.();
                    }
                    pState.open ? closePanel() : openPanel();
                };
            }
        }
    };

    const __vite_glob_0_3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: blockPosts
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🚫 过滤设置 ] - 低等级可见内容屏蔽
       ========================================================================== */

    const mark$2 = new WeakSet();
    const run = (els, ctx) => {
        const lv = ctx.user?.rank || 0;
        els.forEach(el => {
            const item = el.closest(".post-list-item");
            if (!item || mark$2.has(item)) return;
            mark$2.add(item);
            const n = +(el.closest("span")?.textContent?.match(/\d+/)?.[0] || 0);
            if (n > lv) item.classList.add("blocked-post");
        });
    };

    const blockViewLevel = {
        id: "blockViewLevel",
        order: 222,
        meta: { block_view_level: { label: "低等级内容屏蔽", group: "🚫 过滤设置" } },
        match: ctx => ctx.isList,
        init(ctx) { run($$('.post-list-item use[href="#lock"]'), ctx); },
        watch: ctx => ({ sel: '.post-list-item use[href="#lock"]', fn: els => run(els, ctx), opts: { debounce: 80 } })
    };

    const __vite_glob_0_4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: blockViewLevel
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🎨 视觉美化 ] - Callout 语法支持 (引述增强)
       ========================================================================== */

    const CSS_BASE = `.post-content blockquote{border-left:none;border-radius:4px;margin:1em 0;box-shadow:inset 4px 0 0 0 rgba(0,0,0,.1)}.callout{--c:8,109,221;overflow:hidden;border-radius:4px;margin:1em 0;padding:12px 12px 12px 24px!important;box-shadow:inset 4px 0 0 0 rgba(var(--c),.5)}.callout.is-collapsible .callout-title{cursor:pointer}.callout-title{display:flex;gap:4px;color:rgb(var(--c));line-height:1.3;align-items:flex-start}.callout-content{overflow-x:auto}.callout-icon{flex:0 0 auto;display:flex;align-items:center}.callout-icon .svg-icon,.callout-fold .svg-icon{color:rgb(var(--c));height:18px;width:18px}.callout-title-inner{font-weight:600}.callout-fold{display:flex;align-items:center;padding-inline-end:8px}.callout-fold .svg-icon{transition:transform .1s}.callout-fold.is-collapsed .svg-icon{transform:rotate(-90deg)}.callout.is-collapsed .callout-content{display:none}.callout[data-callout="abstract"],.callout[data-callout="summary"],.callout[data-callout="tldr"]{--c:83,223,221}.callout[data-callout="info"],.callout[data-callout="todo"]{--c:8,109,221}.callout[data-callout="tip"],.callout[data-callout="hint"],.callout[data-callout="important"]{--c:83,223,221}.callout[data-callout="success"],.callout[data-callout="check"],.callout[data-callout="done"]{--c:68,207,110}.callout[data-callout="question"],.callout[data-callout="help"],.callout[data-callout="faq"]{--c:236,117,0}.callout[data-callout="warning"],.callout[data-callout="caution"],.callout[data-callout="attention"]{--c:236,117,0}.callout[data-callout="failure"],.callout[data-callout="fail"],.callout[data-callout="missing"]{--c:233,49,71}.callout[data-callout="danger"],.callout[data-callout="error"]{--c:233,49,71}.callout[data-callout="bug"]{--c:233,49,71}.callout[data-callout="example"]{--c:120,82,238}.callout[data-callout="quote"],.callout[data-callout="cite"]{--c:158,158,158}.callout-inserter-wrapper{position:relative;display:inline-flex;align-items:center}.callout-inserter-btn{padding:0;border:none;background:0 0;cursor:pointer;display:flex;color:currentColor}.callout-inserter-btn:hover{opacity:.7}.callout-inserter-dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:8px;border-radius:6px;border:1px solid rgba(15,23,42,.12);background:var(--bg-color,#fff);box-shadow:0 2px 8px rgba(15,23,42,.1);z-index:1000;min-width:160px;display:none;overflow:auto;max-height:240px}.callout-inserter-dropdown.show{display:block}.callout-inserter-item{padding:8px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;transition:background .15s}.callout-inserter-item:hover{background:#f5f5f5}.callout-inserter-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}`;
    const CSS_COLORFUL = `.callout{background:rgba(var(--c),.1)}`;

    const ICONS = { note: "M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5zm-6.17-1.81 4 4", abstract: "M8 2h8v4H8zM16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01", info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14v-4m0-4h.01", tip: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4", success: "M20 6 9 17l-5-5", question: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01", warning: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01", failure: "M18 6 6 18M6 6l12 12", danger: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z", bug: "M12 20v-9m2-6a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4zM14.12 3.88 16 2M8 2l1.88 1.88M9 7.13V6a3 3 0 1 1 6 0v1.13", example: "M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13", quote: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2zM5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z", fold: "m6 9 6 6 6-6" };
    const TYPE_MAP = { summary: "abstract", tldr: "abstract", hint: "tip", important: "tip", check: "success", done: "success", help: "question", faq: "question", caution: "warning", attention: "warning", fail: "failure", missing: "failure", error: "danger", cite: "quote" };
    const MENUS = [{ k: "note", n: "笔记", c: "8,109,221" }, { k: "info", n: "信息", c: "8,109,221" }, { k: "tip", n: "提示", c: "83,223,221" }, { k: "warning", n: "警告", c: "236,117,0" }, { k: "danger", n: "危险", c: "233,49,71" }, { k: "success", n: "成功", c: "68,207,110" }, { k: "question", n: "问题", c: "236,117,0" }, { k: "example", n: "示例", c: "120,82,238" }];
    const svg = d => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="${d}"/></svg>`;
    const RE = /^\[!(\w+)\]([+-])?(?:\s+([^<\n]+))?(?:<br\s*\/?>)?([\s\S]*)$/i;

    const render = (els) => {
        els.forEach(bq => {
            if (bq.classList.contains("oc-done") || bq.closest("blockquote.oc-done")) return;
            bq.classList.add("oc-done");
            const p = bq.querySelector(":scope > p");
            const m = (p?.innerHTML?.trim() || "").match(RE);
            if (!m) return;
            const [, type, fold, title, content] = m;
            const t = type.toLowerCase(), base = TYPE_MAP[t] || t, icon = ICONS[base] || ICONS.note;
            const isColl = fold === "+" || fold === "-", isCol = fold === "-";
            const wrap = document.createElement("div");
            wrap.className = `callout${isColl ? " is-collapsible" : ""}${isCol ? " is-collapsed" : ""}`;
            wrap.dataset.callout = t;
            const titleEl = document.createElement("div");
            titleEl.className = "callout-title";
            titleEl.innerHTML = `<div class="callout-icon">${svg(icon)}</div><div class="callout-title-inner">${title?.trim() || type[0].toUpperCase() + type.slice(1)}</div>`;
            if (isColl) {
                const foldEl = document.createElement("div");
                foldEl.className = `callout-fold${isCol ? " is-collapsed" : ""}`;
                foldEl.innerHTML = svg(ICONS.fold);
                titleEl.appendChild(foldEl);
                titleEl.onclick = () => { wrap.classList.toggle("is-collapsed"); foldEl.classList.toggle("is-collapsed"); };
            }
            wrap.appendChild(titleEl);
            const cont = document.createElement("div");
            cont.className = "callout-content";
            if (content?.trim()) { const pp = document.createElement("p"); pp.innerHTML = content.trim(); cont.appendChild(pp); }
            let sib = p.nextSibling;
            while (sib) { const next = sib.nextSibling; cont.appendChild(sib); sib = next; }
            if (cont.childNodes.length) wrap.appendChild(cont);
            bq.replaceWith(wrap);
        });
    };

    const insertCallout = (editor, type) => {
        const cm = editor.querySelector(".CodeMirror")?.CodeMirror;
        if (!cm) return;
        const doc = cm.getDoc();
        let cur = doc.getCursor();
        const lvl = (doc.getLine(cur.line).match(/^(>\s*)+/)?.[0].match(/>/g) || []).length;
        if (lvl > 0) {
            let last = cur.line;
            for (let i = cur.line + 1; i < doc.lineCount(); i++) { if (doc.getLine(i).match(/^>\s*/)) last = i; else break; }
            cur = { line: last, ch: doc.getLine(last).length };
        }
        const pre = lvl > 0 ? ">".repeat(lvl + 1) + " " : "> ";
        doc.replaceRange((lvl > 0 ? "\n" : "") + `${pre}[!${type}] \n${pre}`, cur);
        doc.setCursor({ line: cur.line + (lvl > 0 ? 1 : 0), ch: `${pre}[!${type}] `.length });
        cm.focus();
    };

    let clickBound = false;
    const createInserter = () => {
        const editor = $(".md-editor");
        const bar = editor?.querySelector(".mde-toolbar");
        if (!editor || !bar || bar.querySelector(".callout-inserter-wrapper")) return;

        const vAttr = [...(bar.querySelector(".toolbar-item")?.attributes || [])].find(a => a.name.startsWith("data-v-"))?.name;
        const setV = el => vAttr && el.setAttribute(vAttr, "");

        const wrap = document.createElement("span");
        wrap.className = "callout-inserter-wrapper toolbar-item";
        wrap.title = "Callout - Nodeseek Pro";
        setV(wrap);

        const btn = document.createElement("span");
        btn.className = "callout-inserter-btn i-icon";
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M44 8H4v30h15l5 5 5-5h15V8Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 18v10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="33" r="2" fill="currentColor"/></svg>`;
        setV(btn);

        const drop = document.createElement("div");
        drop.className = "callout-inserter-dropdown";
        MENUS.forEach(t => {
            const item = document.createElement("div");
            item.className = "callout-inserter-item";
            item.innerHTML = `<span class="callout-inserter-dot" style="background:rgb(${t.c})"></span>${t.n}[${t.k}]`;
            item.onclick = e => { e.stopPropagation(); insertCallout(editor, t.k); drop.classList.remove("show"); };
            drop.appendChild(item);
        });

        btn.onclick = e => { e.stopPropagation(); drop.classList.toggle("show"); };
        if (!clickBound) { document.addEventListener("click", () => $$(".callout-inserter-dropdown.show").forEach(d => d.classList.remove("show"))); clickBound = true; }

        const sep = document.createElement("div");
        sep.className = "sep";
        setV(sep);
        wrap.append(btn, drop);
        bar.append(sep, wrap);
    };

    const callout = {
        id: "callout",
        order: 360,
        cfg: { callout: { enabled: true, style: "colorful" } },
        meta: { callout: { label: "Callout 语法支持", group: "🎨 视觉美化", fields: { style: { type: "RADIO", label: "风格", options: [{ value: "colorful", text: "绚丽" }, { value: "clean", text: "清新" }] } } } },
        match: ctx => (ctx.isPost || /^\/new-discussion/.test(location.pathname)) && ctx.store.get("callout.enabled", true),
        init(ctx) {
            const style = ctx.store.get("callout.style", "colorful");
            addStyle("nsx-callout", CSS_BASE + (style === "colorful" ? CSS_COLORFUL : ""));
            render($$(".post-content blockquote"));
            createInserter();
            document.addEventListener("click", e => { if (e.target?.closest?.(".md-editor")) requestAnimationFrame(createInserter); });
        },
        watch: () => [{ sel: ".post-content blockquote", fn: render, opts: { debounce: 80 } }, { sel: ".mde-toolbar", fn: createInserter, opts: { debounce: 80 } }]
    };

    const __vite_glob_0_5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: callout
    }, Symbol.toStringTag, { value: 'Module' }));

    // 代码高亮 + 复制按钮

    const CSS$4 = `.post-content pre{position:relative}.post-content pre span.copy-code{position:absolute;right:.5em;top:.5em;cursor:pointer;color:#c1c7cd}.post-content pre .iconpark-icon{width:16px;height:16px;margin:3px}.post-content pre .iconpark-icon:hover{color:var(--link-hover-color)}.dark-layout .post-content pre code.hljs{padding:1em!important}`;

    const mark$1 = new WeakSet();
    const addCopyBtn = (els, ctx) => {
        els.forEach(code => {
            if (mark$1.has(code)) return;
            mark$1.add(code);
            const btn = document.createElement("span");
            btn.className = "copy-code";
            btn.title = "复制代码";
            btn.innerHTML = `<svg class="iconpark-icon"><use href="#copy"></use></svg>`;
            btn.onclick = async () => {
                let ok = false;
                const text = code.textContent || "";
                try {
                    if (navigator.clipboard?.writeText) {
                        await navigator.clipboard.writeText(text);
                        ok = true;
                    }
                } catch { }

                if (!ok) {
                    try {
                        const sel = getSelection(), range = document.createRange();
                        range.selectNodeContents(code);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        ok = document.execCommand("copy");
                        sel.removeAllRanges();
                    } catch { ok = false; }
                }

                if (ok) {
                    btn.querySelector("use")?.setAttribute("href", "#check");
                    setTimeout(() => btn.querySelector("use")?.setAttribute("href", "#copy"), 1000);
                    ctx.ui.tips?.("复制成功", btn, { tips: 4, time: 1000 });
                } else {
                    ctx.ui.warning?.("复制失败，请手动复制");
                }
            };
            code.after(btn);
        });
    };

    /* ==========================================================================
       [ 🎨 视觉美化 ] - 代码高亮 + 复制按钮
       ========================================================================== */
    const codeHighlight = {
        id: "codeHighlight",
        deps: ["ui"],
        order: 140,
        cfg: { code_highlight: { enabled: true } },
        meta: { code_highlight: { label: "代码高亮", group: "🎨 视觉美化" } },
        match: ctx => ctx.store.get("code_highlight.enabled", true),
        init(ctx) {
            addStyle("nsx-hl-css", CSS$4);
            addCopyBtn($$(".post-content pre code"), ctx);
        },
        watch: ctx => ({ sel: ".post-content pre code", fn: els => addCopyBtn(els, ctx), opts: { debounce: 80 } })
    };

    const __vite_glob_0_6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: codeHighlight
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🧭 辅助工具 ] - 快捷键回复 (Ctrl+Enter)
       ========================================================================== */
    const commentShortcut = {
        id: "commentShortcut",
        order: 135,
        cfg: { comment_shortcut: { enabled: true } },
        meta: { comment_shortcut: { label: "快捷键快捷回复", group: "🧭 辅助工具" } },
        match: ctx => ctx.isPost && ctx.store.get("comment_shortcut.enabled", true),
        init(ctx) {
            const getBtn = () => $(".md-editor button.submit.btn.focus-visible");
            $$(".CodeMirror").forEach(cmEl => {
                const cm = cmEl?.CodeMirror;
                if (!cm || cm.__nsx) return;
                cm.__nsx = true;
                const bind = () => {
                    const btn = getBtn();
                    if (btn && !/Ctrl\+Enter/i.test(btn.textContent)) btn.textContent += "(Ctrl+Enter)";
                    if (btn && !cm.__nsxMap) {
                        cm.__nsxMap = { "Ctrl-Enter": () => getBtn()?.click() };
                        cm.addKeyMap(cm.__nsxMap);
                    } else if (!btn && cm.__nsxMap) {
                        cm.removeKeyMap(cm.__nsxMap);
                        cm.__nsxMap = null;
                    }
                };
                bind();
                cmEl.addEventListener("focusin", bind, true);
                cmEl.addEventListener("focusout", bind, true);
            });
        }
    };

    const __vite_glob_0_7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: commentShortcut
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🎨 视觉美化 ] - 深色模式同步系统
       ========================================================================== */
    const darkMode = {
        id: "darkMode",
        order: 180,
        init(ctx) {
            const body = document.body;
            if (!body) return;
            const lightHl = GM_getResourceURL("highlightStyle");
            const darkHl = GM_getResourceURL("highlightStyle_dark");

            const apply = () => {
                const dark = body.classList.contains("dark-layout");
                // 为 html 添加/移除 .dark 类以触发 layui 深色主题
                document.documentElement.classList.toggle("dark", dark);
                // 切换 highlight.js 样式
                document.getElementById("nsx-hl")?.remove();
                addStyle("nsx-hl", dark ? darkHl : lightHl);
            };
            apply();
            new MutationObserver(() => apply()).observe(body, { attributes: true, attributeFilter: ["class"] });
        }
    };

    const __vite_glob_0_8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: darkMode
    }, Symbol.toStringTag, { value: 'Module' }));

    // 浏览历史

    const CSS$3 = `
    .nsx-history-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:12px 12px 8px}
    .nsx-history-head-main{display:flex;flex-direction:column;min-width:0}
    .nsx-history-title{font-size:15px;font-weight:800;line-height:1.2}
    .nsx-history-sub{margin-top:2px;font-size:11px;line-height:1.35;color:#64748b}
    .nsx-history-actions{display:flex;align-items:center;gap:7px}
    .nsx-history-action{border:1px solid rgba(239,68,68,.26);background:rgba(255,241,242,.92);color:#be123c;cursor:pointer;font-size:12px;padding:6px 10px;border-radius:999px;font-weight:700;white-space:nowrap}
    .nsx-history-close-btn{border:1px solid rgba(15,23,42,.14);background:#fff;color:#475569;cursor:pointer;font-size:13px;width:30px;height:30px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;line-height:1}
    .nsx-history-close-btn:hover{background:#f8fafc}
    .nsx-history-action:hover{filter:brightness(.98)}
    .nsx-history-search{display:flex;align-items:center;gap:7px;margin:0 12px 8px;border:1px solid rgba(15,23,42,.12);border-radius:11px;padding:8px 10px;background:rgba(248,250,252,.9)}
    .nsx-history-search-i{font-size:12px;opacity:.75}
    .nsx-history-search input{border:0;background:0;outline:0;width:100%;font-size:13px}
    .nsx-history-tabs{display:flex;gap:8px;padding:0 12px 8px}
    .nsx-history-tab{border:1px solid rgba(15,23,42,.12);background:#fff;cursor:pointer;color:#64748b;font-size:12px;padding:6px 10px;font-weight:700;border-radius:999px}
    .nsx-history-tab.is-active{color:#1d4ed8;border-color:rgba(59,130,246,.34);background:rgba(239,246,255,.94)}
    .nsx-history-list{flex:1;overflow-y:auto;padding:0 8px 12px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
    .nsx-history-group{margin-bottom:8px}
    .nsx-history-group-title{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 4px 6px;color:#64748b;font-size:12px;font-weight:700}
    .nsx-history-items{list-style:none;margin:0;padding:0}
    .nsx-history-item{display:flex;align-items:center;gap:8px;padding:9px 8px;border-radius:10px;border:1px solid rgba(15,23,42,.08);background:rgba(248,250,252,.82);margin-bottom:6px}
    .nsx-history-item:hover{background:rgba(241,245,249,.9)}
    .nsx-history-link{display:flex;align-items:center;gap:8px;flex:1;min-width:0;text-decoration:none;color:inherit}
    .nsx-history-icon{width:28px;height:28px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0}
    .nsx-history-icon img{width:100%;height:100%;object-fit:cover}
    .nsx-history-item-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:700}
    .nsx-history-time{color:#64748b;font-size:11px;margin-left:auto;white-space:nowrap}
    .nsx-history-empty{padding:18px 10px;color:#94a3b8;font-size:12px;text-align:center}
    .nsx-history-close,.nsx-history-restore{border:1px solid rgba(15,23,42,.12);background:#fff;cursor:pointer;font-size:11px;padding:4px 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;line-height:1;white-space:nowrap}
    .nsx-history-close{color:#64748b}
    .nsx-history-restore{color:#1d4ed8;border-color:rgba(59,130,246,.3);background:rgba(239,246,255,.94)}
    .nsx-history-group-title .nsx-history-close{padding:3px 8px}
    .nsx-history-close:hover{color:#dc2626;border-color:rgba(220,38,38,.28);background:#fff1f2}
    body.dark-layout .nsx-history-sub,html.dark .nsx-history-sub{color:#94a3b8}
    body.dark-layout .nsx-history-action,html.dark .nsx-history-action{color:#fda4af;border-color:rgba(248,113,113,.34);background:rgba(159,18,57,.28)}
    body.dark-layout .nsx-history-close-btn,html.dark .nsx-history-close-btn{color:#cbd5e1;border-color:rgba(148,163,184,.24);background:rgba(15,23,42,.66)}
    body.dark-layout .nsx-history-search,html.dark .nsx-history-search{border-color:rgba(148,163,184,.24);background:rgba(15,23,42,.52)}
    body.dark-layout .nsx-history-search input,html.dark .nsx-history-search input{color:#e2e8f0}
    body.dark-layout .nsx-history-tab,html.dark .nsx-history-tab{border-color:rgba(148,163,184,.24);background:rgba(15,23,42,.58);color:#94a3b8}
    body.dark-layout .nsx-history-tab.is-active,html.dark .nsx-history-tab.is-active{color:#bfdbfe;border-color:rgba(96,165,250,.34);background:rgba(30,64,175,.28)}
    body.dark-layout .nsx-history-group-title,html.dark .nsx-history-group-title{color:#94a3b8}
    body.dark-layout .nsx-history-item,html.dark .nsx-history-item{border-color:rgba(148,163,184,.18);background:rgba(15,23,42,.44)}
    body.dark-layout .nsx-history-item:hover,html.dark .nsx-history-item:hover{background:rgba(15,23,42,.56)}
    body.dark-layout .nsx-history-icon,html.dark .nsx-history-icon{background:#334155}
    body.dark-layout .nsx-history-time,html.dark .nsx-history-time{color:#94a3b8}
    body.dark-layout .nsx-history-close,html.dark .nsx-history-close{color:#cbd5e1;border-color:rgba(148,163,184,.24);background:rgba(15,23,42,.66)}
    body.dark-layout .nsx-history-restore,html.dark .nsx-history-restore{color:#bfdbfe;border-color:rgba(96,165,250,.34);background:rgba(30,64,175,.28)}
    body.dark-layout .nsx-history-empty,html.dark .nsx-history-empty{color:#94a3b8}
    `;

    const HKEY = "nsx_browsing_history", RKEY = "nsx_recently_closed";

    const pad = n => String(n).padStart(2, "0");
    const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const fmtTime = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const now = () => new Date().toISOString();
    const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

    /* ==========================================================================
       [ 🧭 辅助工具 ] - 浏览历史记录 (右侧面板)
       ========================================================================== */
    const history$1 = {
        id: "history",
        order: 400,
        cfg: { history: { enabled: true, limit: 100, days: 7 } },
        meta: { history: { label: "浏览历史记录", group: "🧭 辅助工具", fields: { limit: { type: "NUMBER", label: "保存上限", valueType: "number" }, days: { type: "NUMBER", label: "保存天数", valueType: "number" } } } },
        match: ctx => (ctx.isPost || ctx.isList || location.pathname.startsWith("/board")) && ctx.store.get("history.enabled", true),
        init(ctx) {
	            let maxItems = ctx.store.get("history.limit", 100) || 100;
	            let maxAge = (ctx.store.get("history.days", 7) || 7) * 864e5;

	            const safeGetItem = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
	            const safeSetItem = (k, v) => { try { localStorage.setItem(k, v); } catch { } };
	            const safeRemoveItem = (k) => { try { localStorage.removeItem(k); } catch { } };

	            const prune = arr => {
	                const t = Date.now();
	                return (arr || []).filter(i => t - new Date(i.time).getTime() < maxAge).sort((a, b) => new Date(a.time) - new Date(b.time)).slice(-maxItems);
	            };
	            const load = k => { try { const r = JSON.parse(safeGetItem(k) || "[]"); const n = prune(r); if (n.length !== r.length) safeSetItem(k, JSON.stringify(n)); return n; } catch { return []; } };
	            const save = (k, a) => safeSetItem(k, JSON.stringify(prune(a)));
	            const getH = () => load(HKEY), saveH = a => save(HKEY, a);
	            const getR = () => load(RKEY), saveR = a => save(RKEY, a);

	            // 获取帖子信息（优先 postData，失败则从 URL/DOM 兜底，避免历史记录“始终为空”）
	            const readDomPostInfo = () => {
	                let postId = "";
	                try { postId = location.pathname.match(/\/post-(\d+)(?:-|$)/)?.[1] || ""; } catch { postId = ""; }
	                if (!postId) return null;

	                let title = "";
	                try {
	                    const titleEl = document.querySelector(".nsk-post h1, .post-title, .post-content-title");
	                    title = (titleEl?.textContent || "").trim();
	                } catch { }
	                if (!title) {
	                    try { title = (document.title || "").trim(); } catch { title = ""; }
	                }

	                let author = "";
	                let uid = null;
	                try {
	                    const authorEl = document.querySelector(".nsk-content-meta-info .author-info > a[href*=\"/space/\"]");
	                    author = (authorEl?.textContent || "").trim();
	                    const uidMatch = authorEl?.href?.match(/\/space\/(\d+)/);
	                    uid = uidMatch ? uidMatch[1] : null;
	                } catch { }

	                return { postId, title, op: { uid, name: author } };
	            };

	            const add = (pd, list, saveFn) => {
	                const dom = readDomPostInfo();
	                const id = pd?.postId || dom?.postId;
	                if (!id) return;
	                const title = (pd?.title || dom?.title || document.title || "").trim();
	                const uid = pd?.op?.uid ?? dom?.op?.uid ?? null;
	                const author = pd?.op?.name ?? dom?.op?.name ?? null;
	                const h = list(), i = h.findIndex(x => x.postId == id);
	                const e = { postId: id, title, time: now(), uid, author };
	                i > -1 ? Object.assign(h[i], e) : h.push(e);
	                saveFn(h);
	            };

	            addStyle("nsx-hist", CSS$3);
	            let panel = null, trigger = null, state = { open: false, tab: "all", kw: "" };

            const head = $("#nsk-head");
            if (!head) return;
            let grp = document.getElementById('nsx-icon-group');
            if (!grp) {
                grp = document.createElement('div');
                grp.id = 'nsx-icon-group';
                grp.style.cssText = 'display:flex;align-items:center;';
                head.appendChild(grp);
            }
            trigger = document.createElement("div");
            trigger.className = "history-dropdown-on";
            trigger.title = "历史记录";
            trigger.innerHTML = `<svg class="iconpark-icon" style="width:17px;height:17px"><use href="#history"></use></svg>`;
            grp.appendChild(trigger);

            const fmtDayTitle = day => {
                const d = new Date(`${day}T00:00:00`);
                const title = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${WEEK[d.getDay()]}`;
                return day === fmtDate(new Date()) ? `今天 - ${title}` : title;
            };

            const open = () => {
                if (!panel) {
                    panel = document.createElement("div");
                    panel.id = "nsx-history-panel";
                    panel.innerHTML = `<div class="nsx-history-header"><div class="nsx-history-head-main"><div class="nsx-history-title">历史记录</div><div class="nsx-history-sub">按时间分组，支持快速恢复最近关闭帖子</div></div><div class="nsx-history-actions"><button class="nsx-history-action" data-a="clear">清空</button><button class="nsx-history-close-btn" data-a="close" aria-label="关闭">×</button></div></div><div class="nsx-history-search"><span class="nsx-history-search-i">🔎</span><input placeholder="搜索标题"/></div><div class="nsx-history-tabs"><button class="nsx-history-tab is-active" data-t="all">全部记录</button><button class="nsx-history-tab" data-t="recent">最近关闭</button></div><div class="nsx-history-list"></div>`;
                    document.body.appendChild(panel);
                    panel.querySelector("input").oninput = e => { state.kw = e.target.value.toLowerCase(); render(); };
                    panel.onclick = e => {
                        e.stopPropagation();
                        const t = e.target.closest("[data-t]");
                        if (t) { state.tab = t.dataset.t; render(); return; }
	                        const a = e.target.closest("[data-a]");
	                        if (!a) return;
	                        const act = a.dataset.a, id = a.dataset.id;
	                        if (act === "close") {
	                            close();
	                            return;
	                        }
	                        if (act === "clear") ctx.ui.confirm("确认", "确定要清空所有记录吗？", () => { safeRemoveItem(state.tab === "recent" ? RKEY : HKEY); render(); });
	                        if (act === "del") { state.tab === "recent" ? saveR(getR().filter(x => x.postId != id)) : saveH(getH().filter(x => x.postId != id)); render(); }
	                        if (act === "clear-day") { const key = state.tab === "recent" ? RKEY : HKEY; save(key, load(key).filter(i => fmtDate(new Date(i.time)) !== a.dataset.day)); render(); }
	                        if (act === "restore") {
	                            const url = `/post-${id}-1`;
	                            try {
	                                const w = window.open(url, "_blank");
	                                if (!w) location.href = url;
	                            } catch {
	                                location.href = url;
	                            }
	                        }
	                    };
	                    document.addEventListener("click", e => { if (state.open && !panel.contains(e.target) && !trigger.contains(e.target)) close(); });
	                    document.addEventListener("keydown", e => { if (state.open && e.key === "Escape") close(); });
	                }
                const r = trigger.getBoundingClientRect();
                const baseBottom = (r && Number.isFinite(r.bottom) && r.bottom > 0) ? r.bottom : getHeadBottom();
                panel.style.top = `${baseBottom + 8}px`;
                panel.style.height = `${innerHeight - baseBottom - 16}px`;
                render();
                panel.classList.add("show");
	                if (!state.open) panelRefreshGuard.open();
	                state.open = true;
	            };
	            const close = () => {
	                if (!state.open) return;
	                panel?.classList.remove("show");
	                state.open = false;
	                panelRefreshGuard.close();
	            };
	            const toggle = () => state.open ? close() : open();
	            window.__nsxPanelCtrl ||= {};
	            window.__nsxPanelCtrl.history = { close, open, toggle, isOpen: () => state.open };

	            const render = () => {
	                let list = (state.tab === "recent" ? getR() : getH()).sort((a, b) => new Date(b.time) - new Date(a.time));
	                if (state.kw) list = list.filter(i => (i.title || "").toLowerCase().includes(state.kw));
                panel.querySelectorAll(".nsx-history-tab").forEach(b => b.classList.toggle("is-active", b.dataset.t === state.tab));
                const lEl = panel.querySelector(".nsx-history-list");
                if (!list.length) { lEl.innerHTML = `<div class="nsx-history-empty">暂无记录</div>`; return; }
                const g = {};
                list.forEach(i => { const d = fmtDate(new Date(i.time)); (g[d] ||= []).push(i); });
                lEl.innerHTML = Object.entries(g).map(([day, items]) => {
                    const itemsHtml = items.map(i => {
                        if (!i.postId) return "";
                        const url = `/post-${i.postId}-1`;
                        const avatar = i.uid ? `<img src="/avatar/${i.uid}.png" onerror="this.style.display='none'">` : "";
                        const restore = state.tab === "recent" ? `<button class="nsx-history-restore" data-a="restore" data-id="${i.postId}" title="恢复">恢复</button>` : "";
                        return `<li class="nsx-history-item"><a class="nsx-history-link" href="${url}"><span class="nsx-history-icon"${i.author ? ` title="@${esc(i.author)}"` : ""}>${avatar}</span><span class="nsx-history-item-title">${esc((i.title || "").slice(0, 32))}</span></a><span class="nsx-history-time">${fmtTime(new Date(i.time))}</span>${restore}<button class="nsx-history-close" data-a="del" data-id="${i.postId}">移除</button></li>`;
                    }).join("");
                    return `<div class="nsx-history-group"><div class="nsx-history-group-title"><span>${fmtDayTitle(day)}</span><button class="nsx-history-close" data-a="clear-day" data-day="${day}" title="清除当天">清空当天</button></div><ul class="nsx-history-items">${itemsHtml}</ul></div>`;
                }).join("");
            };

            trigger.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                if (!state.open) {
                    window.__nsxPanelCtrl.filter?.close?.();
                    window.__nsxPanelCtrl.relation?.close?.();
                }
                toggle();
	            };

	            const getPostData = () => ctx.uw?.__config__?.postData || readDomPostInfo();

	            // 记录当前页面（部分环境 __config__.postData 可能不存在/延迟）
	            const recordCurrent = () => add(getPostData(), getH, saveH);
	            recordCurrent();
	            setTimeout(recordCurrent, 300);
	            setTimeout(recordCurrent, 1200);

	            // 监听页面关闭
	            const recordClosed = () => add(getPostData(), getR, saveR);
	            addEventListener("pagehide", recordClosed, { capture: true });
	            addEventListener("beforeunload", recordClosed, { capture: true });

	            window.__nsxRuntime ||= {};
	            window.__nsxRuntime.refreshHistory = () => {
	                maxItems = ctx.store.get("history.limit", 100) || 100;
	                maxAge = (ctx.store.get("history.days", 7) || 7) * 864e5;
	                const h = prune(getH());
	                const r = prune(getR());
	                safeSetItem(HKEY, JSON.stringify(h));
	                safeSetItem(RKEY, JSON.stringify(r));
	                if (panel && state.open) render();
	            };
	        }
	    };

    const __vite_glob_0_9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: history$1
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🎨 视觉美化 ] - 图片沉浸预览 (灯箱效果)
       ========================================================================== */
    // 自定义图片查看器：
    // - 统一桌面与移动端交互
    // - 移动端支持双指缩放、拖拽平移、左右滑动切换
const IMAGE_VIEWER_CSS = `
#nsx-image-viewer{
    position:fixed;inset:0;z-index:1000000;display:none;
    align-items:center;justify-content:center;
    background:
        radial-gradient(120% 120% at 12% 8%,rgba(255,255,255,.18),rgba(255,255,255,0) 48%),
        linear-gradient(180deg,rgba(15,23,42,.86),rgba(2,6,23,.94));
    backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)
}
body.dark-layout #nsx-image-viewer,html.dark #nsx-image-viewer{
    background:
        radial-gradient(120% 120% at 12% 8%,rgba(148,163,184,.16),rgba(148,163,184,0) 48%),
        linear-gradient(180deg,rgba(2,6,23,.92),rgba(2,6,23,.97))
}
#nsx-image-viewer.show{display:flex}
#nsx-image-viewer .nsx-iv-stage{
    position:relative;width:100vw;height:100vh;overflow:hidden;
    touch-action:none;user-select:none;-webkit-user-select:none;
    cursor:zoom-in
}
#nsx-image-viewer .nsx-iv-stage::before{
    content:"";position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(120% 100% at 50% 100%,rgba(255,255,255,.07),rgba(255,255,255,0) 55%)
}
body.dark-layout #nsx-image-viewer .nsx-iv-stage::before,html.dark #nsx-image-viewer .nsx-iv-stage::before{
    background:radial-gradient(120% 100% at 50% 100%,rgba(148,163,184,.08),rgba(148,163,184,0) 55%)
}
#nsx-image-viewer .nsx-iv-img{
    position:absolute;left:50%;top:50%;
    max-width:100%;max-height:100%;
    transform:translate(calc(-50% + var(--nsx-iv-tx,0px)),calc(-50% + var(--nsx-iv-ty,0px))) scale(var(--nsx-iv-scale,1));
    transform-origin:center center;
    will-change:transform;
    pointer-events:none;
    user-drag:none;-webkit-user-drag:none
}
#nsx-image-viewer .nsx-iv-ui{
    position:absolute;inset:0;pointer-events:none
}
#nsx-image-viewer .nsx-iv-indicator{
    pointer-events:none;position:absolute;left:50%;transform:translateX(-50%);
    bottom:max(12px,env(safe-area-inset-bottom));font-size:12px;color:#334155;
    background:rgba(248,250,252,.88);
    border:1px solid rgba(148,163,184,.24);border-radius:999px;
    box-shadow:none;
    padding:5px 10px;line-height:1
}
body.dark-layout #nsx-image-viewer .nsx-iv-indicator,html.dark #nsx-image-viewer .nsx-iv-indicator{
    color:#cbd5e1;
    background:rgba(15,23,42,.62);
    border-color:rgba(148,163,184,.2);
    box-shadow:none
}
@media (max-width:768px){
    #nsx-image-viewer .nsx-iv-indicator{bottom:max(10px,env(safe-area-inset-bottom))}
}
`;

    const imageMark = new WeakSet();
    let imageViewerApi = null;
    const createImageViewer = () => {
        if (imageViewerApi) return imageViewerApi;
        addStyle("nsx-image-viewer-style", IMAGE_VIEWER_CSS);

        const root = document.createElement("div");
        root.id = "nsx-image-viewer";
        root.innerHTML = `
            <div class="nsx-iv-stage" aria-label="图片查看器" role="dialog">
                <img class="nsx-iv-img" alt="">
                <div class="nsx-iv-ui">
                    <div class="nsx-iv-indicator"></div>
                </div>
            </div>
        `.trim();
        document.body.appendChild(root);
        // 兜底清理旧版本可能残留的滚动锁 class，避免影响下拉刷新
        document.documentElement.classList.remove("nsx-image-viewer-open");
        document.body.classList.remove("nsx-image-viewer-open");

        const stage = root.querySelector(".nsx-iv-stage");
        const imgEl = root.querySelector(".nsx-iv-img");
        const indicator = root.querySelector(".nsx-iv-indicator");

        const state = {
            open: false,
            list: [],
            index: 0,
            scale: 1,
            tx: 0,
            ty: 0,
            maxScale: 4
        };
        const TAP_MOVE_TOLERANCE = 10;
        const CLICK_SUPPRESS_MS = 360;
        const pointers = new Map();
        let gesture = null;
        let suppressClickUntil = 0;

        const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
        const dist = (a, b) => Math.hypot((a.x || 0) - (b.x || 0), (a.y || 0) - (b.y || 0));
        const midpoint = (a, b) => ({ x: ((a.x || 0) + (b.x || 0)) / 2, y: ((a.y || 0) + (b.y || 0)) / 2 });
        const getRect = () => stage.getBoundingClientRect();

        const getFitSize = () => {
            const rect = getRect();
            const nw = imgEl.naturalWidth || rect.width || 1;
            const nh = imgEl.naturalHeight || rect.height || 1;
            const fit = Math.min((rect.width || 1) / nw, (rect.height || 1) / nh);
            return {
                w: nw * fit,
                h: nh * fit,
                vw: rect.width || 1,
                vh: rect.height || 1
            };
        };

        const clampTranslate = () => {
            if (state.scale <= 1) {
                state.tx = 0;
                state.ty = 0;
                return;
            }
            const fit = getFitSize();
            const boundX = Math.max(0, (fit.w * state.scale - fit.vw) / 2);
            const boundY = Math.max(0, (fit.h * state.scale - fit.vh) / 2);
            state.tx = clamp(state.tx, -boundX, boundX);
            state.ty = clamp(state.ty, -boundY, boundY);
        };

        const applyTransform = () => {
            clampTranslate();
            imgEl.style.setProperty("--nsx-iv-tx", `${state.tx}px`);
            imgEl.style.setProperty("--nsx-iv-ty", `${state.ty}px`);
            imgEl.style.setProperty("--nsx-iv-scale", String(state.scale));
            stage.style.cursor = state.scale > 1 ? "grab" : "zoom-in";
        };

        const setScaleAt = (targetScale, clientX, clientY) => {
            const rect = getRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const localX = (clientX || (rect.left + centerX)) - rect.left - centerX;
            const localY = (clientY || (rect.top + centerY)) - rect.top - centerY;
            const nextScale = clamp(targetScale, 1, state.maxScale);
            if (nextScale <= 1) {
                state.scale = 1;
                state.tx = 0;
                state.ty = 0;
                applyTransform();
                return;
            }
            const imageX = (localX - state.tx) / state.scale;
            const imageY = (localY - state.ty) / state.scale;
            state.scale = nextScale;
            state.tx = localX - imageX * state.scale;
            state.ty = localY - imageY * state.scale;
            applyTransform();
        };

        const resetTransform = () => {
            state.scale = 1;
            state.tx = 0;
            state.ty = 0;
            applyTransform();
        };

        const updateIndicator = () => {
            const total = state.list.length || 0;
            if (!total) {
                indicator.textContent = "";
                return;
            }
            indicator.textContent = `${state.index + 1} / ${total}`;
        };

        const preloadNearby = () => {
            const total = state.list.length;
            if (total <= 1) return;
            const near = [state.index - 1, state.index + 1].map(i => (i + total) % total);
            near.forEach(i => {
                const src = state.list[i]?.src;
                if (!src) return;
                const img = new Image();
                img.src = src;
            });
        };

        const renderCurrent = () => {
            const cur = state.list[state.index];
            if (!cur) return;
            imgEl.src = cur.src;
            imgEl.alt = cur.alt || `图片 ${state.index + 1}`;
            resetTransform();
            updateIndicator();
            preloadNearby();
        };

        const open = (list, startIndex = 0) => {
            const normalized = (list || []).filter(x => x?.src);
            if (!normalized.length) return false;
            state.list = normalized;
            state.index = clamp(Number(startIndex) || 0, 0, normalized.length - 1);
            state.open = true;
            root.classList.add("show");
            renderCurrent();
            return true;
        };

        const close = ({ suppressClick = false } = {}) => {
            state.open = false;
            pointers.clear();
            gesture = null;
            if (suppressClick) suppressClickUntil = Date.now() + CLICK_SUPPRESS_MS;
            root.classList.remove("show");
            imgEl.removeAttribute("src");
            state.list = [];
            state.index = 0;
            resetTransform();
        };

        const go = (delta) => {
            const total = state.list.length;
            if (!total) return;
            state.index = (state.index + delta + total) % total;
            renderCurrent();
        };

        const onPointerDown = (e) => {
            if (!state.open) return;
            if (e.pointerType === "mouse" && e.button !== 0) return;
            stage.setPointerCapture?.(e.pointerId);
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.size === 1) {
                const p = pointers.get(e.pointerId);
                gesture = {
                    type: state.scale > 1 ? "pan" : "swipe",
                    startX: p.x,
                    startY: p.y,
                    startTx: state.tx,
                    startTy: state.ty,
                    dx: 0,
                    dy: 0,
                    moved: false
                };
            } else if (pointers.size >= 2) {
                const pts = [...pointers.values()];
                const a = pts[0], b = pts[1];
                gesture = {
                    type: "pinch",
                    startDist: Math.max(1, dist(a, b)),
                    startScale: state.scale,
                    startTx: state.tx,
                    startTy: state.ty,
                    startMid: midpoint(a, b),
                    moved: false
                };
            }
        };

        const onPointerMove = (e) => {
            if (!state.open || !pointers.has(e.pointerId)) return;
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (!gesture) return;

            if (gesture.type === "pinch" && pointers.size >= 2) {
                const pts = [...pointers.values()];
                const a = pts[0], b = pts[1];
                const mid = midpoint(a, b);
                const currentDist = Math.max(1, dist(a, b));
                const nextScale = clamp(gesture.startScale * (currentDist / gesture.startDist), 1, state.maxScale);
                const rect = getRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const imageX = (gesture.startMid.x - rect.left - centerX - gesture.startTx) / gesture.startScale;
                const imageY = (gesture.startMid.y - rect.top - centerY - gesture.startTy) / gesture.startScale;
                state.scale = nextScale;
                state.tx = (mid.x - rect.left - centerX) - imageX * nextScale;
                state.ty = (mid.y - rect.top - centerY) - imageY * nextScale;
                gesture.moved = true;
                applyTransform();
                try { e.preventDefault(); } catch { }
                return;
            }

            if (pointers.size !== 1) return;
            const p = [...pointers.values()][0];
            const dx = p.x - gesture.startX;
            const dy = p.y - gesture.startY;
            gesture.dx = dx;
            gesture.dy = dy;
            if (Math.hypot(dx, dy) > TAP_MOVE_TOLERANCE) gesture.moved = true;

            if (gesture.type === "pan" && state.scale > 1) {
                state.tx = gesture.startTx + dx;
                state.ty = gesture.startTy + dy;
                applyTransform();
                try { e.preventDefault(); } catch { }
                return;
            }
            if (gesture.type === "swipe" && state.scale <= 1) {
                const visualX = clamp(dx * 0.18, -56, 56);
                imgEl.style.setProperty("--nsx-iv-tx", `${visualX}px`);
                imgEl.style.setProperty("--nsx-iv-ty", "0px");
                imgEl.style.setProperty("--nsx-iv-scale", "1");
                try { e.preventDefault(); } catch { }
            }
        };

        const onPointerUp = (e) => {
            if (!state.open) return;
            pointers.delete(e.pointerId);
            if (pointers.size >= 2) return;
            if (pointers.size === 1 && gesture?.type === "pinch") {
                const p = [...pointers.values()][0];
                gesture = {
                    type: state.scale > 1 ? "pan" : "swipe",
                    startX: p.x,
                    startY: p.y,
                    startTx: state.tx,
                    startTy: state.ty,
                    dx: 0,
                    dy: 0,
                    moved: true
                };
                return;
            }
            const g = gesture;
            gesture = null;
            applyTransform();
            if (!g) return;

            if (g.type === "swipe" && state.scale <= 1) {
                const absX = Math.abs(g.dx || 0);
                const absY = Math.abs(g.dy || 0);
                if (absX > 56 && absX > absY * 1.2) {
                    go((g.dx || 0) < 0 ? 1 : -1);
                    return;
                }
            }
            if (!g.moved) {
                close({ suppressClick: true });
            }
        };

        stage.addEventListener("pointerdown", onPointerDown, { passive: false });
        stage.addEventListener("pointermove", onPointerMove, { passive: false });
        stage.addEventListener("pointerup", onPointerUp, { passive: false });
        stage.addEventListener("pointercancel", onPointerUp, { passive: false });
        stage.addEventListener("wheel", (e) => {
            if (!state.open) return;
            const next = state.scale * (e.deltaY < 0 ? 1.12 : 0.88);
            setScaleAt(next, e.clientX, e.clientY);
            try { e.preventDefault(); } catch { }
        }, { passive: false });

        document.addEventListener("click", (e) => {
            if (Date.now() <= suppressClickUntil) {
                try { e.preventDefault(); } catch { }
                try { e.stopPropagation(); } catch { }
                try { e.stopImmediatePropagation?.(); } catch { }
            }
        }, true);

        root.addEventListener("click", (e) => {
            if (e.target === root) close({ suppressClick: true });
        });
        window.addEventListener("keydown", (e) => {
            if (!state.open) return;
            if (e.key === "Escape") close();
            else if (e.key === "ArrowLeft") go(-1);
            else if (e.key === "ArrowRight") go(1);
        });
        window.addEventListener("resize", () => { if (state.open) applyTransform(); }, { passive: true });

        imageViewerApi = { open, close };
        return imageViewerApi;
    };

    const bind = (els) => {
        const viewer = createImageViewer();
        els.forEach(img => {
            const post = img.closest("article.post-content");
            if (!post || imageMark.has(img)) return;
            imageMark.add(img);
            img.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                const imgs = [...post.querySelectorAll("img:not(.sticker)")];
                const list = imgs.map((x, i) => ({
                    alt: x.alt || `图片 ${i + 1}`,
                    src: x.currentSrc || x.src || x.getAttribute("src") || ""
                })).filter(x => x.src);
                const start = Math.max(0, imgs.indexOf(img));
                viewer.open(list, start);
            }, true);
        });
    };

    const imageSlide = {
        id: "imageSlide",
        deps: ["ui"],
        order: 160,
        cfg: { image_slide: { enabled: true } },
        meta: { image_slide: { label: "图片沉浸预览", group: "🎨 视觉美化" } },
        match: ctx => ctx.isPost && ctx.store.get("image_slide.enabled", true),
        init() { bind($$("article.post-content img:not(.sticker)")); },
        watch: () => ({ sel: "article.post-content img:not(.sticker)", fn: els => bind(els), opts: { debounce: 80 } })
    };

    const __vite_glob_0_10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: imageSlide
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🧭 辅助工具 ] - 网页预加载 (Instant Page)
       ========================================================================== */
    const instantPage = {
        id: "instantPage",
        order: 320,
        cfg: { instant_page: { enabled: true } },
        meta: { instant_page: { label: "鼠标悬停预加载", group: "🧭 辅助工具" } },
        match: ctx => ctx.store.get("instant_page.enabled", true),
        init(ctx) {
            const done = new Set();
            const inflight = new Set();
            document.body.addEventListener("mouseover", e => {
                const a = e.target.closest("a");
                if (!a?.href?.startsWith(`${location.origin}/post-`) || done.has(a.href) || inflight.has(a.href)) return;
                setTimeout(() => {
                    if (!a.matches(":hover") || done.has(a.href) || inflight.has(a.href)) return;
                    const link = document.createElement("link");
                    link.rel = "prefetch";
                    link.href = a.href;
                    inflight.add(a.href);
                    const clear = () => {
                        done.add(a.href);
                        inflight.delete(a.href);
                        link.remove();
                    };
                    link.addEventListener("load", clear, { once: true });
                    link.addEventListener("error", clear, { once: true });
                    document.head.appendChild(link);
                    setTimeout(clear, 5000);
                }, 65);
            }, { passive: true });
        }
    };

    const __vite_glob_0_11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: instantPage
    }, Symbol.toStringTag, { value: 'Module' }));

    // 等级标签已被移除
    const levelTag = {
        id: "levelTag",
        cfg: {},
        meta: {},
        match: ctx => false,
        init: () => { }
    };

    const __vite_glob_0_12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: levelTag
    }, Symbol.toStringTag, { value: 'Module' }));

	    /* ==========================================================================
