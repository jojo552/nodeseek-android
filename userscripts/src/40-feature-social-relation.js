           [ 🤝 社交关系 ] - 用户关系管理 (关注/好友)
           ========================================================================== */
        const userRelation = {
            id: "userRelation",
            deps: ["ui"],
            order: 390,
            cfg: {
                relation: {
                    blacklist_enabled: true,
                    blacklist_mode: "fold", // fold | official
                    friends_enabled: true,
                    friends_highlight: "#ff9800",
                    show_friend_btn: true,
                    show_block_btn: true
                }
            },
            meta: {
                relation: {
                    label: "社交关系设置",
                    group: "🤝 社交关系",
                    fields: {
                        show_friend_btn: { type: "SWITCH", label: "显示添加好友按钮" },
                        show_block_btn: { type: "SWITCH", label: "显示屏蔽用户按钮" },
                        blacklist_enabled: { type: "SWITCH", label: "开启高级黑名单" },
                        blacklist_mode: { type: "SELECT", label: "黑名单显示模式", options: { fold: "优雅折叠", official: "官方屏蔽" } },
                        friends_enabled: { type: "SWITCH", label: "开启本地好友高亮" },
                        friends_highlight: { type: "COLOR", label: "好友高亮色" }
                    }
                }
            },
            match: ctx => ctx.store.get("relation.blacklist_enabled", true) || ctx.store.get("relation.friends_enabled", true),
            init(ctx) {
                const blacklistKey = 'nsx_advanced_blacklist';
                const friendsKey = 'nsx_advanced_friends';
                const keywordsKey = 'nsx_advanced_keywords';

                const getMap = (key) => {
                    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
                    catch { return {}; }
                };
                const saveMap = (key, map) => localStorage.setItem(key, JSON.stringify(map));

                const state = {
                    blacklist: getMap(blacklistKey),
                    friends: getMap(friendsKey),
                    keywords: getMap(keywordsKey),
                    cfg: {
                        blEnabled: ctx.store.get("relation.blacklist_enabled", true),
                        blMode: ctx.store.get("relation.blacklist_mode", "fold"),
                        frEnabled: ctx.store.get("relation.friends_enabled", true),
                        frColor: ctx.store.get("relation.friends_highlight", "#ff9800")
                    }
                };

                let processAll = () => { };
                let processList = () => { };

                // 添加全局样式
                addStyle("nsx-user-relation", `
                /* 屏蔽与好友按钮 */
                .nsx-relation-btn {
                    font-size: 10px; padding: 2px 8px; border-radius: 5px; border: none;
                    color: #fff !important; cursor: pointer; margin-left: 0; opacity: 0.9;
                    transition: all 0.2s; user-select: none; display: inline-block; line-height: 1.6;
                    font-weight: 600; text-shadow: 0 1px 1px rgba(0,0,0,0.2);
                    box-shadow: none;
                }
                .nsx-relation-btn-wrap{display:inline-flex;flex-wrap:wrap;align-items:center;gap:4px}
                .nsx-relation-btn:hover { opacity: 1; filter: brightness(.98); }
                .nsx-relation-btn:active { transform: translateY(0); }
                .nsx-btn-block { background: linear-gradient(135deg, #ff7675, #d63031); }
                .nsx-btn-friend { background: linear-gradient(135deg, #55efc4, #00b894); }

                /* 折叠模式 */
                .nsx-post-folded > *:not(.nsx-fold-notice) { display: none !important; }
                .nsx-post-folded { background-color: rgba(244, 67, 54, 0.05) !important; padding: 0 !important; }
                .nsx-fold-notice {
                    font-size: 12px; color: #f44336; padding: 10px; opacity: 0.8;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .nsx-unfold-btn { cursor: pointer; text-decoration: underline; }

                /* 彻底隐藏模式 */
                .nsx-post-hidden { display: none !important; }

                /* 好友高亮 */
                .nsx-friend-badge {
                    font-size: 11px; padding: 1px 5px; border-radius: 4px; margin-left: 4px;
                    background-color: ${state.cfg.frColor}22; border: 1px solid ${state.cfg.frColor};
                    color: ${state.cfg.frColor}; font-weight: bold; cursor: help;
                }
            `);

                // 帖子页处理逻辑
                if (ctx.isPost) {
                    const processPostItem = (authorLink) => {
                        const postEl = authorLink.closest('.nsk-post, .comments > li, li.comment-item, .comment-item, li');
                        if (!postEl) return;
                        if (postEl.dataset.nsxRelationProcessed) return;

                        const username = authorLink.textContent.trim();
                        if (!username) return;

                        postEl.dataset.nsxRelationProcessed = "1";

                        // --- 黑名单逻辑 ---
                        if (state.cfg.blEnabled && state.blacklist[username]) {
                            const blInfo = state.blacklist[username];
                            if (state.cfg.blMode === 'official' || state.cfg.blMode === 'hide') {
                                postEl.classList.add('nsx-post-hidden');
                            } else {
                                // Fold mode
                                postEl.classList.add('nsx-post-folded');
                                const notice = document.createElement('div');
                                notice.className = 'nsx-fold-notice';
                                notice.innerHTML = `
                                <span> 已折叠来自黑名单用户 [<b>${username}</b>] 的言论。备注: ${blInfo.remark || '无'}</span>
                                <span class="nsx-unfold-btn">临时展开</span>
                            `;
                                notice.querySelector('.nsx-unfold-btn').onclick = (e) => {
                                    postEl.classList.remove('nsx-post-folded');
                                    notice.style.display = 'none';
                                };
                                postEl.prepend(notice);
                            }
                        }

                        // --- 好友逻辑 ---
                        if (state.cfg.frEnabled && state.friends[username]) {
                            const frInfo = state.friends[username];
                            const frBadge = document.createElement('span');
                            frBadge.className = 'nsx-friend-badge';
                            frBadge.title = `好友备注: ${frInfo.remark || '无'}\n添加时间: ${frInfo.time}`;
                            frBadge.innerHTML = '好友';
                            authorLink.after(frBadge);
                        }

                    };

                    processAll = () => ctx.$$('.nsk-content-meta-info .author-info > a[href^="/space/"]').forEach(processPostItem);
                    processAll();
                    ctx.watch('.nsk-content-meta-info', processAll, { debounce: 200 });
                }

                // 列表页处理逻辑 (讨论列表)
                if (ctx.isList || location.pathname === '/' || location.pathname.startsWith('/categories') || location.pathname.startsWith('/board')) {
                    const processListItem = (itemEl) => {
                        if (itemEl.dataset.nsxRelationListProcessed) return;
                        itemEl.dataset.nsxRelationListProcessed = "1";

                        const authorEl = itemEl.querySelector('.info-author, .post-author');
                        if (!authorEl) return;
                        const username = authorEl.textContent.trim();

                        if (state.cfg.blEnabled && state.blacklist[username]) {
                            if (state.cfg.blMode === 'official' || state.cfg.blMode === 'hide') {
                                itemEl.style.display = 'none';
                            } else {
                                const blInfo = state.blacklist[username];
                                itemEl.classList.add('nsx-post-folded');
                                const notice = document.createElement('div');
                                notice.className = 'nsx-fold-notice';
                                notice.style.padding = '12px 15px';
                                notice.innerHTML = `
                                <span> 已折叠来自黑名单用户 [<b>${username}</b>] 的主题。备注: ${blInfo.remark || '无'}</span>
                                <span class="nsx-unfold-btn">临时展开</span>
                            `;
                                notice.querySelector('.nsx-unfold-btn').onclick = (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    itemEl.classList.remove('nsx-post-folded');
                                    notice.style.display = 'none';
                                };
                                itemEl.prepend(notice);
                            }
                        }
                        if (state.cfg.frEnabled && state.friends[username]) {
                            const frInfo = state.friends[username];
                            authorEl.style.color = state.cfg.frColor;
                            authorEl.style.fontWeight = 'bold';
                            const badge = document.createElement('span');
                            badge.className = 'nsx-friend-badge';
                            badge.style.cssText = `font-size:10px;padding:1px 4px;border-radius:3px;margin-left:4px;background-color:${state.cfg.frColor}22;border:1px solid ${state.cfg.frColor};color:${state.cfg.frColor};vertical-align:middle;line-height:1;font-weight:normal;`;
                            badge.title = `好友备注: ${frInfo.remark || '无'}`;
                            badge.textContent = '好友';
                            authorEl.after(badge);
                        }
                    };

                    processList = () => ctx.$$('.post-list-item, .post-list .list-item').forEach(processListItem);
                    processList();
                    ctx.watch('.post-list, .post-list-item', processList, { debounce: 200 });
                }

                // === 构建社交关系管理大面板 (仿历史记录风格) ===
                const panelCss = `
                .nsx-rel-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:12px 12px 8px}
                .nsx-rel-head-main{display:flex;flex-direction:column;min-width:0}
                .nsx-rel-title{font-size:15px;font-weight:800;line-height:1.2}
                .nsx-rel-sub{margin-top:2px;font-size:11px;line-height:1.35;color:#64748b}
                .nsx-rel-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap;justify-content:flex-end}
                .nsx-rel-action{border:1px solid rgba(15,23,42,.12);background:rgba(248,250,252,.9);color:#475569;cursor:pointer;font-size:12px;padding:6px 10px;border-radius:999px;font-weight:700;white-space:nowrap}
                .nsx-rel-action[data-a="add"]{border-color:rgba(59,130,246,.26);background:rgba(239,246,255,.94);color:#1d4ed8}
                .nsx-rel-action:hover{filter:brightness(.98)}
                .nsx-rel-close-btn{border:1px solid rgba(15,23,42,.14);background:#fff;color:#475569;cursor:pointer;font-size:13px;width:30px;height:30px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;line-height:1}
                .nsx-rel-close-btn:hover{background:#f8fafc}
                .nsx-rel-search{display:flex;align-items:center;gap:7px;margin:0 12px 8px;border:1px solid rgba(15,23,42,.12);border-radius:11px;padding:8px 10px;background:rgba(248,250,252,.9)}
                .nsx-rel-search-i{font-size:12px;opacity:.75}
                .nsx-rel-search input{border:0;background:0;outline:0;width:100%;font-size:13px}
                .nsx-rel-tabs{display:flex;gap:8px;padding:0 12px 8px}
                .nsx-rel-tab{border:1px solid rgba(15,23,42,.12);background:#fff;cursor:pointer;color:#64748b;font-size:12px;padding:6px 10px;font-weight:700;border-radius:999px}
                .nsx-rel-tab.is-active{color:#1d4ed8;border-color:rgba(59,130,246,.34);background:rgba(239,246,255,.94)}
                .nsx-filter-add-row{padding:0 12px 8px}
                .nsx-filter-add-btn{width:100%;display:flex;align-items:center;justify-content:center;font-size:13px;padding:8px 10px;border-color:rgba(59,130,246,.32)!important;background:rgba(239,246,255,.94)!important;color:#1d4ed8!important}
                .nsx-rel-list{flex:1;overflow-y:auto;padding:0 8px 12px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
                .nsx-rel-item{display:flex;align-items:center;gap:8px;padding:9px 8px;border-radius:10px;border:1px solid rgba(15,23,42,.08);background:rgba(248,250,252,.82);margin-bottom:6px}
                .nsx-rel-item:hover{background:rgba(241,245,249,.9)}
                .nsx-rel-link{display:flex;align-items:center;gap:10px;flex:1;min-width:0;text-decoration:none;color:inherit}
                .nsx-rel-icon{width:34px;height:34px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;color:#64748b;font-weight:bold;font-size:16px}
                .nsx-rel-info{display:flex;flex-direction:column;gap:2px;overflow:hidden;flex:1}
                .nsx-rel-item-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:760;font-size:13px}
                .nsx-rel-remark{color:#64748b;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .nsx-rel-time{color:#94a3b8;font-size:11px;white-space:nowrap}
                .nsx-rel-empty{padding:18px 10px;color:#94a3b8;font-size:12px;text-align:center}
                .nsx-rel-close{border:1px solid rgba(239,68,68,.26);background:rgba(255,241,242,.92);cursor:pointer;font-size:11px;padding:4px 8px;border-radius:999px;color:#be123c;display:inline-flex;align-items:center;justify-content:center;line-height:1;white-space:nowrap}
                .nsx-rel-close:hover{filter:brightness(.98)}
                body.dark-layout .nsx-rel-sub,html.dark .nsx-rel-sub{color:#94a3b8}
                body.dark-layout .nsx-rel-action,html.dark .nsx-rel-action{border-color:rgba(148,163,184,.24);background:rgba(15,23,42,.6);color:#cbd5e1}
                body.dark-layout .nsx-rel-action[data-a="add"],html.dark .nsx-rel-action[data-a="add"]{border-color:rgba(96,165,250,.34);background:rgba(30,64,175,.28);color:#bfdbfe}
                body.dark-layout .nsx-rel-close-btn,html.dark .nsx-rel-close-btn{color:#cbd5e1;border-color:rgba(148,163,184,.24);background:rgba(15,23,42,.66)}
                body.dark-layout .nsx-rel-search,html.dark .nsx-rel-search{border-color:rgba(148,163,184,.24);background:rgba(15,23,42,.52)}
                body.dark-layout .nsx-rel-search input,html.dark .nsx-rel-search input{color:#e2e8f0}
                body.dark-layout .nsx-rel-tab,html.dark .nsx-rel-tab{border-color:rgba(148,163,184,.24);background:rgba(15,23,42,.58);color:#94a3b8}
                body.dark-layout .nsx-rel-tab.is-active,html.dark .nsx-rel-tab.is-active{color:#bfdbfe;border-color:rgba(96,165,250,.34);background:rgba(30,64,175,.28)}
                body.dark-layout .nsx-filter-add-btn,html.dark .nsx-filter-add-btn{border-color:rgba(96,165,250,.34)!important;background:rgba(30,64,175,.28)!important;color:#bfdbfe!important}
                body.dark-layout .nsx-rel-item,html.dark .nsx-rel-item{border-color:rgba(148,163,184,.18);background:rgba(15,23,42,.44)}
                body.dark-layout .nsx-rel-item:hover,html.dark .nsx-rel-item:hover{background:rgba(15,23,42,.56)}
                body.dark-layout .nsx-rel-icon,html.dark .nsx-rel-icon{background:#334155;color:#e2e8f0}
                body.dark-layout .nsx-rel-remark,html.dark .nsx-rel-remark{color:#94a3b8}
                body.dark-layout .nsx-rel-time,html.dark .nsx-rel-time{color:#94a3b8}
                body.dark-layout .nsx-rel-close,html.dark .nsx-rel-close{border-color:rgba(248,113,113,.34);background:rgba(159,18,57,.3);color:#fda4af}
                `;
                addStyle("nsx-rel-panel-style", panelCss);

                let relPanel = null, relTrigger = null, pState = { open: false, tab: "bl", kw: "" };

                // 寻找吸顶栏作为挂靠点
                const head = ctx.$("#nsk-head");
                if (head) {
                    let grp = document.getElementById('nsx-icon-group');
                    if (!grp) {
                        grp = document.createElement('div');
                        grp.id = 'nsx-icon-group';
                        grp.style.cssText = 'display:flex;align-items:center;';
                        head.appendChild(grp);
                    }
                    relTrigger = document.createElement("div");
                    relTrigger.className = "relation-dropdown-on";
                    relTrigger.style.cssText = "";
                    relTrigger.title = "关系管理(黑名单/好友)";
                    relTrigger.innerHTML = `<svg viewBox="0 0 48 48" fill="none" class="iconpark-icon" style="width:17px;height:17px;color:currentColor;"><path d="M24 20C28.4183 20 32 16.4183 32 12C32 7.58172 28.4183 4 24 4C19.5817 4 16 7.58172 16 12C16 16.4183 19.5817 20 24 20Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                    grp.appendChild(relTrigger);

                    const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

                    const openRel = () => {
                        if (!relPanel) {
                            relPanel = document.createElement("div");
                            relPanel.id = "nsx-rel-panel";
                            relPanel.innerHTML = `<div class="nsx-rel-header"><div class="nsx-rel-head-main"><div class="nsx-rel-title">社交关系名单</div><div class="nsx-rel-sub">管理黑名单与本地好友，支持备注编辑</div></div><div class="nsx-rel-actions"><button class="nsx-rel-action" data-a="clear">清空列表</button><button class="nsx-rel-close-btn" data-a="close" aria-label="关闭">×</button></div></div><div class="nsx-rel-search"><span class="nsx-rel-search-i">🔎</span><input placeholder="搜索用户名或备注..."/></div><div class="nsx-rel-tabs"><button class="nsx-rel-tab is-active" data-t="bl">黑名单</button><button class="nsx-rel-tab" data-t="fr">本地好友</button></div><div class="nsx-rel-list"></div>`;
                            document.body.appendChild(relPanel);

                            relPanel.querySelector("input").oninput = e => { pState.kw = e.target.value.toLowerCase(); renderRel(); };
                            relPanel.onclick = e => {
                                e.stopPropagation();
                                if (e.target.closest('.nsx-rel-remark')) {
                                    if (e.target.tagName !== 'INPUT') e.preventDefault();
                                    return;
                                }
                                const t = e.target.closest("[data-t]");
                                if (t) { pState.tab = t.dataset.t; renderRel(); return; }
                                const a = e.target.closest("[data-a]");
                                if (!a) return;
                                const act = a.dataset.a, un = a.dataset.un;
                                if (act === "close") { closeRel(); return; }
                                if (act === "clear") {
                                    const names = { bl: "黑名单", fr: "好友" };
                                    ctx.ui.confirm("确认清空?", `确定要清空所有${names[pState.tab]}吗？`, () => {
                                        if (pState.tab === 'bl') state.blacklist = {}; else state.friends = {};
                                        saveMap(pState.tab === 'bl' ? blacklistKey : friendsKey, pState.tab === 'bl' ? state.blacklist : state.friends);
                                        renderRel();
                                        ctx.ui.toast("已清空");
                                    });
                                }
                                if (act === "del") {
                                    if (pState.tab === 'bl') {
                                        const targetUserId = state.blacklist[un]?.userId;
                                        delete state.blacklist[un];
                                        if (targetUserId) {
                                            fetch('/api/block-list/del', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ block_member_id: Number(targetUserId) }) }).catch(() => { });
                                        }
                                    } else {
                                        delete state.friends[un];
                                    }
                                    saveMap(pState.tab === 'bl' ? blacklistKey : friendsKey, pState.tab === 'bl' ? state.blacklist : state.friends);
                                    renderRel();
                                    ctx.ui.toast("已移除");
                                }
                            };
                            relPanel.ondblclick = e => {
                                const remarkSpan = e.target.closest('.nsx-rel-remark');
                                if (remarkSpan) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const un = remarkSpan.dataset.un;
                                    if (!un) return;
                                    let mapObj = pState.tab === "bl" ? state.blacklist : state.friends;
                                    const currentRemark = mapObj[un]?.remark || "";

                                    const input = document.createElement('input');
                                    input.type = 'text';
                                    input.value = currentRemark;
                                    input.style.cssText = "width:100%;font-size:12px;border:1px solid #0a62ff;border-radius:4px;padding:2px 4px;outline:none;background:#fff;color:#333;";

                                    input.onkeydown = (ke) => {
                                        if (ke.key === 'Enter') input.blur();
                                        if (ke.key === 'Escape') { input.value = currentRemark; input.blur(); }
                                    };
                                    input.onblur = () => {
                                        const newRemark = input.value.trim();
                                        if (mapObj[un]) {
                                            mapObj[un].remark = newRemark;
                                            saveMap(pState.tab === "bl" ? blacklistKey : friendsKey, mapObj);
                                        }
                                        renderRel();
                                        if (newRemark !== currentRemark) ctx.ui.toast("备注已更新，刷新贴子生效");
                                    };

                                    remarkSpan.innerHTML = '';
                                    remarkSpan.appendChild(input);
                                    input.focus();
                                    // 光标移到最后
                                    input.setSelectionRange(input.value.length, input.value.length);
                                }
                            };
                            document.addEventListener("click", e => { if (pState.open && !relPanel.contains(e.target) && !relTrigger.contains(e.target)) closeRel(); });
                            document.addEventListener("keydown", e => { if (pState.open && e.key === "Escape") closeRel(); });
                        }
                        const r = relTrigger.getBoundingClientRect();
                        const baseBottom = (r && Number.isFinite(r.bottom) && r.bottom > 0) ? r.bottom : getHeadBottom();
                        relPanel.style.top = `${baseBottom + 8}px`;
                        relPanel.style.height = `${innerHeight - baseBottom - 16}px`;
                        relPanel.style.right = ``;
                        renderRel();
                        relPanel.classList.add("show");
                        if (!pState.open) panelRefreshGuard.open();
                        pState.open = true;
                    };

                    const closeRel = () => {
                        if (!pState.open) return;
                        relPanel?.classList.remove("show");
                        pState.open = false;
                        panelRefreshGuard.close();
                    };
                    window.__nsxPanelCtrl ||= {};
                    window.__nsxPanelCtrl.relation = { close: closeRel, isOpen: () => pState.open };
                    const toggleRel = () => pState.open ? closeRel() : openRel();

                    const renderRel = () => {
                        let mapObj = pState.tab === "bl" ? state.blacklist : state.friends;
                        let list = Object.entries(mapObj).map(([un, info]) => ({ username: un, remark: info.remark || "", time: info.time || "", userId: info.userId || "" }));

                        if (pState.kw) list = list.filter(i => i.username.toLowerCase().includes(pState.kw) || i.remark.toLowerCase().includes(pState.kw));
                        list.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));

                        relPanel.querySelectorAll(".nsx-rel-tab").forEach(b => b.classList.toggle("is-active", b.dataset.t === pState.tab));

                        const lEl = relPanel.querySelector(".nsx-rel-list");
                        if (!list.length) { lEl.innerHTML = `<div class="nsx-rel-empty">该列表空空如也</div>`; return; }

                        lEl.innerHTML = list.map(i => {
                            const url = i.userId ? `/space/${i.userId}#/general` : `/space/${encodeURIComponent(i.username)}`;
                            const avatarLetter = i.username.charAt(0).toUpperCase();
                            const iconColor = pState.tab === "bl" ? "#f44336" : "#4caf50";

                            const avatarImgHtml = i.userId
                                ? `<img src="/avatar/${i.userId}.png" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='inline';">`
                                : "";
                            const letterHtml = `<span style="${i.userId ? 'display:none;' : 'display:inline;'}">${avatarLetter}</span>`;

                            return `<div class="nsx-rel-item">
                                <a class="nsx-rel-link" href="${url}" target="_blank">
                                    <span class="nsx-rel-icon" style="color:white;background:${iconColor};opacity:0.8">${avatarImgHtml}${letterHtml}</span>
                                    <div class="nsx-rel-info">
                                        <span class="nsx-rel-item-title">${esc(i.username)}</span>
                                        <span class="nsx-rel-remark" data-un="${esc(i.username)}" title="双击可直接修改备注">${esc(i.remark ? '备注: ' + i.remark : '无备注 (双击添加)')}</span>
                                    </div>
                                </a>
                                <span class="nsx-rel-time">${i.time ? i.time.split(' ')[0] : ''}</span>
                                <button class="nsx-rel-close" data-a="del" data-un="${esc(i.username)}" title="移出列表">移除</button>
                            </div>`;
                        }).join("");
                    };

                    relTrigger.onclick = e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!pState.open) {
                            window.__nsxPanelCtrl.filter?.close?.();
                            window.__nsxPanelCtrl.history?.close?.();
                        }
                        toggleRel();
                    };
                }

                window.__nsxRuntime ||= {};
                window.__nsxRuntime.reapplyRelation = () => {
                    state.blacklist = getMap(blacklistKey);
                    state.friends = getMap(friendsKey);
                    state.cfg.blEnabled = ctx.store.get("relation.blacklist_enabled", true);
                    state.cfg.blMode = ctx.store.get("relation.blacklist_mode", "fold");
                    state.cfg.frEnabled = ctx.store.get("relation.friends_enabled", true);
                    state.cfg.frColor = ctx.store.get("relation.friends_highlight", "#ff9800");

                    ctx.$$(".nsx-relation-btn-wrap,.nsx-friend-badge,.nsx-fold-notice").forEach(el => el.remove());
                    ctx.$$(".nsx-post-folded,.nsx-post-hidden").forEach(el => {
                        el.classList.remove("nsx-post-folded", "nsx-post-hidden");
                        el.style.display = "";
                    });
                    ctx.$$(".nsk-content-meta-info .author-info > a[href^='/space/'], .post-list-item .info-author, .post-list-item .post-author").forEach(el => {
                        el.style.color = "";
                        el.style.fontWeight = "";
                    });
                    ctx.$$('[data-nsx-relation-processed],[data-nsx-relation-list-processed]').forEach(el => {
                        delete el.dataset.nsxRelationProcessed;
                        delete el.dataset.nsxRelationListProcessed;
                    });

                    processAll();
                    processList();
                    if (typeof renderRel === "function" && pState.open) renderRel();
                };
            }
        };
        define(userRelation);
        // 🚫 过滤设置 (放在最后)
        define(blockPosts);
        define(blockViewLevel);

        boot(ctx);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }

})();
