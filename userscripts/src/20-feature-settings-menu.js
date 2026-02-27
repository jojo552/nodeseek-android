	       [ 系统核心 ] - 设置菜单 (高级设置面板)
	       ========================================================================== */
	    // 菜单系统（油猴菜单 + 高级设置面板）

	    // 高级设置面板样式（仅作用于 #setting-layer-direction-r）：
	    // - 解决移动端设置项文字显示不全（label 允许换行）
	    // - 提升面板上下滑动手感（滚动容器统一由 #nsx-config-content 承担）
	    // 注意：不影响帖子作者信息行（用户 ID 省略号/不换行逻辑在其它样式中处理）
	    const CSS$1 = `
		#setting-layer-direction-r{
			--nsx-cfg-border:rgba(15,23,42,.12);
			--nsx-cfg-soft:#f8fafc;
			--nsx-cfg-muted:#64748b;
			--nsx-cfg-title:#0f172a;
			--nsx-cfg-content-bg:#f8fafc;
			--nsx-cfg-card-bg:rgba(255,255,255,.94);
			--nsx-cfg-accent:#1d4ed8;
			--nsx-cfg-shadow:none
		}
		body.dark-layout #setting-layer-direction-r,html.dark #setting-layer-direction-r{
			--nsx-cfg-border:rgba(148,163,184,.24);
			--nsx-cfg-soft:#101827;
			--nsx-cfg-muted:#94a3b8;
			--nsx-cfg-title:#e2e8f0;
			--nsx-cfg-content-bg:#0f172a;
			--nsx-cfg-card-bg:rgba(15,23,42,.62);
			--nsx-cfg-accent:#93c5fd;
			--nsx-cfg-shadow:none
		}
	#setting-layer-direction-r .layui-layer-title{
		height:42px;
		line-height:42px;
		padding:0 14px;
		font-size:14px;
		font-weight:800;
		color:var(--nsx-cfg-title);
		border-bottom:1px solid var(--nsx-cfg-border);
			background:rgba(248,250,252,.94)
	}
	body.dark-layout #setting-layer-direction-r .layui-layer-title,html.dark #setting-layer-direction-r .layui-layer-title{
			background:rgba(15,23,42,.72)
	}
	#setting-layer-direction-r .layui-layer-content{
		overflow:hidden!important;
		touch-action:pan-y;
		background:var(--nsx-cfg-content-bg)
	}
	#setting-layer-direction-r .layui-row{height:100%}
	#setting-layer-direction-r #nsx-config-menu{
		height:100%;
		overflow-y:auto;
		border-right:1px solid var(--nsx-cfg-border);
		background:var(--nsx-cfg-soft);
		padding:10px 8px
	}
	#setting-layer-direction-r #nsx-config-menu .layui-menu{background:transparent}
	#setting-layer-direction-r #nsx-config-menu .layui-menu-body-title{padding:0}
	#setting-layer-direction-r #nsx-config-menu .layui-menu-body-title a{
		display:block;
		padding:8px 10px;
		border:1px solid transparent;
		border-radius:10px;
		font-size:12px;
		font-weight:760;
		line-height:1.3;
		color:var(--nsx-cfg-muted);
		transition:all .16s ease
	}
	#setting-layer-direction-r #nsx-config-menu .layui-menu-item-checked>.layui-menu-body-title>a{
		color:var(--nsx-cfg-accent);
		border-color:rgba(59,130,246,.28);
			background:rgba(239,246,255,.94)
	}
	body.dark-layout #setting-layer-direction-r #nsx-config-menu .layui-menu-item-checked>.layui-menu-body-title>a,
	html.dark #setting-layer-direction-r #nsx-config-menu .layui-menu-item-checked>.layui-menu-body-title>a{
		border-color:rgba(96,165,250,.34);
			background:rgba(30,64,175,.28)
	}
	#setting-layer-direction-r #nsx-config-content{
		height:100%;
		overflow:auto!important;
		padding:10px 12px 14px;
		background:transparent;
		-webkit-overflow-scrolling:touch;
		overscroll-behavior:contain;
		touch-action:pan-y
	}
	#setting-layer-direction-r #nsx-config-content .layui-field-title{
		margin:0 2px 10px;
		border:0;
		padding:0
	}
	#setting-layer-direction-r #nsx-config-content .layui-field-title legend{
		padding:0 2px;
		font-size:11px;
		font-weight:760;
		color:var(--nsx-cfg-muted);
		letter-spacing:.1px
	}
	#setting-layer-direction-r .nsx-config-card{
		margin-bottom:12px;
		border:1px solid var(--nsx-cfg-border);
		border-radius:12px;
		background:var(--nsx-cfg-card-bg);
			box-shadow:none;
		overflow:hidden
	}
	body.dark-layout #setting-layer-direction-r .nsx-config-card,html.dark #setting-layer-direction-r .nsx-config-card{
		box-shadow:var(--nsx-cfg-shadow)
	}
	#setting-layer-direction-r .nsx-config-card .layui-card-header{
		position:relative;
		display:flex;
		align-items:center;
		justify-content:space-between;
		min-height:42px;
		padding:10px 56px 10px 12px;
		border-bottom:1px solid var(--nsx-cfg-border);
		background:rgba(255,255,255,.38);
		font-size:13px;
		font-weight:820;
		color:var(--nsx-cfg-title);
		line-height:1.2
	}
	body.dark-layout #setting-layer-direction-r .nsx-config-card .layui-card-header,html.dark #setting-layer-direction-r .nsx-config-card .layui-card-header{
		background:rgba(2,6,23,.22)
	}
	#setting-layer-direction-r .nsx-config-card .header-checkbox{
		position:absolute;
		right:12px;
		top:50%;
		transform:translateY(-50%)
	}
	#setting-layer-direction-r .nsx-config-card .layui-form-switch{
		margin-top:0!important;
		min-width:56px;
		flex-shrink:0
	}
	#setting-layer-direction-r .nsx-config-card .layui-form-switch em{
		white-space:nowrap!important;
		word-break:keep-all!important;
		line-height:20px!important
	}
	#setting-layer-direction-r .nsx-config-card .layui-form-switch i{flex-shrink:0}
	#setting-layer-direction-r .nsx-config-card .layui-card-body{padding:10px 10px 2px}
	#setting-layer-direction-r .nsx-config-card .layui-card-body:empty{padding-top:0;padding-bottom:0}
	#setting-layer-direction-r .nsx-config-card .layui-form-item{margin-bottom:10px}
	#setting-layer-direction-r .layui-form-label{
		width:108px!important;
		padding:8px 10px!important;
		font-size:12px;
		font-weight:720;
		color:var(--nsx-cfg-muted);
		line-height:1.35;
		white-space:normal!important;
		overflow:visible!important;
		text-overflow:clip!important;
		word-break:break-word!important
	}
	#setting-layer-direction-r .layui-input-block{margin-left:128px!important;min-height:34px}
	#setting-layer-direction-r .layui-input,
	#setting-layer-direction-r .layui-textarea,
	#setting-layer-direction-r .layui-select-title input{
		border-color:var(--nsx-cfg-border);
		border-radius:9px;
		font-size:12px;
		color:#1e293b;
		background:rgba(255,255,255,.88)
	}
	body.dark-layout #setting-layer-direction-r .layui-input,
	body.dark-layout #setting-layer-direction-r .layui-textarea,
	body.dark-layout #setting-layer-direction-r .layui-select-title input,
	html.dark #setting-layer-direction-r .layui-input,
	html.dark #setting-layer-direction-r .layui-textarea,
	html.dark #setting-layer-direction-r .layui-select-title input{
		color:#e2e8f0;
		border-color:var(--nsx-cfg-border);
		background:rgba(15,23,42,.58)
	}
	#setting-layer-direction-r .layui-input:focus,
	#setting-layer-direction-r .layui-textarea:focus,
	#setting-layer-direction-r .layui-select-title input:focus{border-color:rgba(59,130,246,.42)!important}
	#setting-layer-direction-r .layui-textarea{min-height:76px}
	#setting-layer-direction-r .layui-disabled{opacity:.52!important}
	#setting-layer-direction-r .layui-disabled .layui-form-select .layui-input{color:var(--nsx-cfg-muted)!important}
	#setting-layer-direction-r .layui-layer-btn{
		position:sticky;
		bottom:0;
		z-index:5;
		display:flex;
		justify-content:flex-end;
		gap:8px;
		padding:10px 12px calc(10px + env(safe-area-inset-bottom));
		border-top:1px solid var(--nsx-cfg-border);
			background:rgba(248,250,252,.94)
	}
	body.dark-layout #setting-layer-direction-r .layui-layer-btn,html.dark #setting-layer-direction-r .layui-layer-btn{
			background:rgba(15,23,42,.82)
	}
	#setting-layer-direction-r .layui-layer-btn a{
		margin:0!important;
		min-width:88px;
		height:34px;
		line-height:32px;
		padding:0 14px;
		border-radius:999px;
		border:1px solid var(--nsx-cfg-border);
			background:#fff;
		color:#475569;
		font-size:12px;
		font-weight:760;
		text-align:center
	}
	#setting-layer-direction-r .layui-layer-btn .layui-layer-btn0{
		border-color:rgba(59,130,246,.32);
			background:rgba(239,246,255,.94);
		color:#1d4ed8
	}
	body.dark-layout #setting-layer-direction-r .layui-layer-btn a,html.dark #setting-layer-direction-r .layui-layer-btn a{
		color:#cbd5e1;
		border-color:var(--nsx-cfg-border);
			background:rgba(15,23,42,.62)
	}
	body.dark-layout #setting-layer-direction-r .layui-layer-btn .layui-layer-btn0,html.dark #setting-layer-direction-r .layui-layer-btn .layui-layer-btn0{
		color:#bfdbfe;
		border-color:rgba(96,165,250,.34);
			background:rgba(30,64,175,.28)
	}
	#setting-layer-direction-r .nsx-color-form-item{
		display:flex;
		flex-direction:column;
		gap:3px
	}
	#setting-layer-direction-r .nsx-color-form-item>.layui-form-label{
		float:none!important;
		width:auto!important;
		padding:0!important;
		text-align:left!important;
		line-height:1.25
	}
	#setting-layer-direction-r .nsx-color-form-item>.layui-input-block{
		margin-left:0!important;
		min-height:0
	}
	#setting-layer-direction-r .nsx-color-row{
		display:flex;
		align-items:center;
		gap:7px;
		flex-wrap:nowrap;
		padding:0
	}
	#setting-layer-direction-r .nsx-color-code{
		font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
		font-size:11px;
		color:var(--nsx-cfg-muted);
		letter-spacing:.05px;
		line-height:1
	}
	#setting-layer-direction-r .nsx-color-picker{
		display:inline-flex;
		align-items:center;
		gap:0;
		flex:0 0 auto
	}
	#setting-layer-direction-r .nsx-color-chip{
		width:24px;
		height:24px;
		border-radius:8px;
		border:1px solid var(--nsx-cfg-border);
			background:#e2e8f0;
			box-shadow:none;
		cursor:pointer
	}
		body.dark-layout #setting-layer-direction-r .nsx-color-chip,html.dark #setting-layer-direction-r .nsx-color-chip{
			background:#334155
		}
	#setting-layer-direction-r .nsx-color-chip[data-empty="1"]{
		background:repeating-linear-gradient(135deg,#f8fafc 0 5px,#e2e8f0 5px 10px)
	}
	body.dark-layout #setting-layer-direction-r .nsx-color-chip[data-empty="1"],html.dark #setting-layer-direction-r .nsx-color-chip[data-empty="1"]{
		background:repeating-linear-gradient(135deg,#334155 0 5px,#1e293b 5px 10px)
	}
	#setting-layer-direction-r .nsx-color-picker{
		position:relative;
		width:24px;
		height:24px;
		flex:0 0 24px;
		display:inline-block
	}
	#setting-layer-direction-r .nsx-color-chip{
		position:absolute;
		inset:0;
		pointer-events:none
	}
	#setting-layer-direction-r .nsx-color-host{
		position:absolute;
		left:0;
		top:0;
		width:24px;
		height:24px;
		opacity:0;
		pointer-events:auto;
		overflow:visible;
		cursor:pointer
	}
	#setting-layer-direction-r .nsx-color-host,
	#setting-layer-direction-r .nsx-color-host.layui-colorpicker{
		display:block!important;
		margin:0!important;
		padding:0!important;
		border:0!important;
		background:transparent!important;
		box-shadow:none!important
	}
	#setting-layer-direction-r .nsx-color-host .layui-colorpicker-main{z-index:1000002}
	#setting-layer-direction-r .nsx-config-card[lay-filter="nsx-visited_color"] .layui-card-body{
		display:flex;
		flex-wrap:nowrap;
		gap:8px;
		padding-top:8px
	}
	#setting-layer-direction-r .nsx-config-card[lay-filter="nsx-visited_color"] .layui-card-body>[class*="layui-col-"]{
		float:none!important;
		width:50%!important;
		flex:1 1 0;
		min-width:0;
		padding:0!important
	}
	#setting-layer-direction-r .nsx-config-card[lay-filter="nsx-visited_color"] .nsx-color-form-item{
		gap:2px
	}
	#setting-layer-direction-r .nsx-config-card[lay-filter="nsx-visited_color"] .nsx-color-form-item>.layui-form-label{
		font-size:11px;
		line-height:1.2
	}
	#setting-layer-direction-r .nsx-config-card[lay-filter="nsx-visited_color"] .nsx-color-row{
		justify-content:space-between
	}
	#setting-layer-direction-r .nsx-config-card[lay-filter="nsx-visited_color"] .nsx-color-code{
		font-size:10px;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		max-width:calc(100% - 30px)
	}
	@media (max-width:768px){
		#setting-layer-direction-r #nsx-config-menu{display:none!important}
		#setting-layer-direction-r .layui-col-xs3{display:none!important}
		#setting-layer-direction-r .layui-col-xs9{width:100%!important}
		#setting-layer-direction-r #nsx-config-content{padding:10px 10px 12px!important}
		#setting-layer-direction-r .nsx-config-card{margin-bottom:10px}
		#setting-layer-direction-r .layui-form-label{width:96px!important;padding:8px 8px!important}
		#setting-layer-direction-r .layui-input-block{margin-left:116px!important}
	}
	@media (max-width:480px){
		#setting-layer-direction-r .nsx-color-picker{justify-content:flex-start}
		#setting-layer-direction-r .layui-form-label{width:100%!important;padding:0 0 6px!important;text-align:left!important}
		#setting-layer-direction-r .layui-input-block{margin-left:0!important}
		#setting-layer-direction-r .nsx-config-card[lay-filter="nsx-visited_color"] .layui-card-body{gap:6px}
		#setting-layer-direction-r .nsx-config-card[lay-filter="nsx-visited_color"] .nsx-color-code{max-width:calc(100% - 28px)}
		#setting-layer-direction-r .layui-layer-btn{
			display:grid;
			grid-template-columns:1fr 1fr;
			justify-content:stretch
		}
		#setting-layer-direction-r .layui-layer-btn a{width:100%;min-width:0}
	}
	`;

    const el = (t, c, p, s) => { const e = document.createElement(t); if (c) e.className = c; if (s) e.style.cssText = s; if (p) p.appendChild(e); return e; };

    const menus = {
        id: "menus",
        deps: ["ui"],
        order: 30,
        cfg: {
            open_post_in_new_tab: { enabled: false },
            developer_tools: { enabled: false }
        },
        meta: {
            open_post_in_new_tab: { label: "新标签页打开帖子", group: "🧭 辅助工具" },
            developer_tools: {
                label: "开发者工具（布局诊断）",
                group: "🧪 开发工具",
                order: 100000
            }
        },
        match: () => true,
        init(ctx) {
            const uw = ctx.uw, code = ctx.site?.code || "ns";
            const ids = [];
            const txt = (m, v) => `${m.text}: ${m.states[v].s1} ${m.states[v].s2}`;
            const isLayoutDiagEnabled = () => !!store.get("developer_tools.enabled", false);


            const regMenus = () => {
                ids.splice(0).forEach(i => GM_unregisterMenuCommand(i));
                buildMenuDefs().forEach(m => {
                    let lbl = m.text;
                    if (m.states.length > 0) {
                        let v = 0;
                        if (m.name === "sign_in") v = store.get(`sign_in.${code}.method`, 0);
                        else v = store.get(`${m.name}.enabled`, true) === false ? 0 : 1;
                        lbl = txt(m, v);
                    }
                    const id = GM_registerMenuCommand(lbl, () => m.cb(m.name, m.states), { autoClose: m.autoClose ?? true });
                    ids.push(id || lbl);
                });
            };

            const switchState = (n, states) => {
                if (n === "sign_in") {
                    if (!ctx.site) return;
                    let cur = store.get(`sign_in.${code}.method`, 0);
                    cur = (cur + 1) % states.length;
                    store.set(`sign_in.${code}.enabled`, cur !== 0);
                    store.set(`sign_in.${code}.method`, cur || 1);
                } else if (n === "loading_post") {
                    const next = !store.get("loading_post.enabled", true);
                    store.set("loading_post.enabled", next);
                    store.set("loading_comment.enabled", next);
                } else {
                    store.set(`${n}.enabled`, !store.get(`${n}.enabled`, true));
                }
                regMenus();
            };

            const reSign = () => {
                if (!ctx.loggedIn || store.get(`sign_in.${code}.enabled`, true) === false) return ctx.ui.alert("提示", "签到已关闭");
                store.set(`sign_in.${code}.last_date`, "1753/1/1");
                location.reload();
            };

            const switchNewTab = () => {
                const next = !store.get("open_post_in_new_tab.enabled", false);
                try {
                    uw.indexedDB.open("ns-preference-db").onsuccess = e => {
                        const db = e.target.result;
                        const s = db.transaction("ns-preference-store", "readwrite").objectStore("ns-preference-store");
                        s.get("configuration").onsuccess = e2 => {
                            const c = e2.target.result || {};
                            c.openPostInNewPage = next;
                            s.put(c, "configuration");
                            store.set("open_post_in_new_tab.enabled", next);
                            regMenus();
                            ctx.ui.alert("", `已${next ? "开启" : "关闭"}新标签页打开链接`);
                        };
                    };
                } catch { }
            };

            const escapeHtmlForDiag = (s) => String(s ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
            const clipTextForDiag = (s, max = 80) => {
                const t = String(s ?? "").replace(/\s+/g, " ").trim();
                if (!t) return "";
                return t.length > max ? `${t.slice(0, max)}...` : t;
            };
            const clipHtmlForDiag = (s, max = 2400) => {
                const t = String(s ?? "").trim();
                if (!t) return "";
                return t.length > max ? `${t.slice(0, max)}\n<!-- ...clipped... -->` : t;
            };
            const toRectForDiag = (el) => {
                try {
                    const r = el?.getBoundingClientRect?.();
                    if (!r) return null;
                    return {
                        x: Number(r.x?.toFixed?.(2) || 0),
                        y: Number(r.y?.toFixed?.(2) || 0),
                        w: Number(r.width?.toFixed?.(2) || 0),
                        h: Number(r.height?.toFixed?.(2) || 0)
                    };
                } catch { return null; }
            };
            const toStyleForDiag = (el) => {
                try {
                    const cs = getComputedStyle(el);
                    return {
                        display: cs.display,
                        position: cs.position,
                        width: cs.width,
                        height: cs.height,
                        maxWidth: cs.maxWidth,
                        minWidth: cs.minWidth,
                        marginLeft: cs.marginLeft,
                        marginRight: cs.marginRight,
                        paddingLeft: cs.paddingLeft,
                        paddingRight: cs.paddingRight,
                        borderLeft: cs.borderLeft,
                        borderRight: cs.borderRight,
                        overflowX: cs.overflowX,
                        overflowY: cs.overflowY,
                        fontSize: cs.fontSize,
                        lineHeight: cs.lineHeight,
                        color: cs.color,
                        backgroundColor: cs.backgroundColor,
                        flex: cs.flex,
                        flexWrap: cs.flexWrap,
                        justifyContent: cs.justifyContent,
                        alignItems: cs.alignItems
                    };
                } catch { return null; }
            };
            const toSelectorForDiag = (el) => {
                if (!el || el.nodeType !== 1) return "";
                const segs = [];
                let cur = el;
                let depth = 0;
                while (cur && cur.nodeType === 1 && depth < 6) {
                    let seg = cur.tagName?.toLowerCase?.() || "node";
                    if (cur.id) {
                        seg += `#${cur.id}`;
                        segs.unshift(seg);
                        break;
                    }
                    const cls = String(cur.className || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
                    if (cls.length) seg += `.${cls.join(".")}`;
                    const parent = cur.parentElement;
                    if (parent) {
                        const same = Array.from(parent.children || []).filter(n => n.tagName === cur.tagName);
                        if (same.length > 1) seg += `:nth-of-type(${same.indexOf(cur) + 1})`;
                    }
                    segs.unshift(seg);
                    cur = parent;
                    depth += 1;
                }
                return segs.join(" > ");
            };
            const toNodeForDiag = (el) => {
                if (!el || el.nodeType !== 1) return null;
                return {
                    tag: el.tagName,
                    id: el.id || "",
                    cls: String(el.className || ""),
                    selector: toSelectorForDiag(el),
                    title: el.getAttribute?.("title") || "",
                    role: el.getAttribute?.("role") || "",
                    text: clipTextForDiag(el.textContent, 120),
                    inlineStyle: el.getAttribute?.("style") || "",
                    rect: toRectForDiag(el),
                    style: toStyleForDiag(el)
                };
            };
            const collectTreeForDiag = (root, maxDepth = 3, maxNodes = 120) => {
                if (!root || root.nodeType !== 1) return { nodeCount: 0, tree: [] };
                const tree = [];
                let nodeCount = 0;
                const queue = [{ node: root, depth: 0 }];
                while (queue.length && nodeCount < maxNodes) {
                    const cur = queue.shift();
                    const node = cur?.node;
                    const depth = cur?.depth || 0;
                    if (!node || node.nodeType !== 1) continue;
                    const rect = toRectForDiag(node);
                    if (!rect || rect.w < 1 || rect.h < 1) continue;
                    tree.push({
                        depth,
                        node: toNodeForDiag(node),
                        childCount: node.children?.length || 0
                    });
                    nodeCount += 1;
                    if (depth >= maxDepth) continue;
                    Array.from(node.children || []).slice(0, 20).forEach(child => queue.push({ node: child, depth: depth + 1 }));
                }
                return { nodeCount, tree };
            };
            const collectVisibleNodesForDiag = (limit = 80) => {
                const out = [];
                const vw = window.innerWidth || document.documentElement?.clientWidth || 0;
                const vh = window.innerHeight || document.documentElement?.clientHeight || 0;
                const all = document.body?.querySelectorAll?.("*") || [];
                for (const el of all) {
                    if (out.length >= limit) break;
                    if (!el || el.nodeType !== 1) continue;
                    if (el.closest?.("#nsx-sheet-mask")) continue;
                    let cs;
                    try { cs = getComputedStyle(el); } catch { continue; }
                    if (!cs || cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity || 1) <= 0) continue;
                    const rect = toRectForDiag(el);
                    if (!rect || rect.w < 10 || rect.h < 10) continue;
                    if (rect.x > vw || rect.y > vh || (rect.x + rect.w) < 0 || (rect.y + rect.h) < 0) continue;
                    out.push({
                        node: toNodeForDiag(el),
                        textBrief: clipTextForDiag(el.textContent, 60)
                    });
                }
                return out;
            };
            const collectRegionForDiag = (selector, label, opts = {}) => {
                const maxDepth = Number(opts.maxDepth || 3);
                const maxNodes = Number(opts.maxNodes || 120);
                const root = document.querySelector(selector);
                if (!root) return { label, selector, exists: false };
                const tree = collectTreeForDiag(root, maxDepth, maxNodes);
                return {
                    label,
                    selector,
                    exists: true,
                    root: toNodeForDiag(root),
                    htmlSnippet: clipHtmlForDiag(root.outerHTML, Number(opts.htmlMax || 3200)),
                    tree
                };
            };
            const collectHeadStylesForDiag = () => {
                try {
                    const nodes = Array.from(document.head?.querySelectorAll?.("link[rel*='stylesheet'],style") || []).slice(0, 80);
                    return nodes.map(node => {
                        const tag = node.tagName?.toLowerCase?.() || "";
                        return {
                            tag,
                            id: node.id || "",
                            href: tag === "link" ? (node.getAttribute?.("href") || "") : "",
                            media: node.getAttribute?.("media") || "",
                            textSize: tag === "style" ? String(node.textContent || "").length : 0
                        };
                    });
                } catch { return []; }
            };
            const collectNsxNodesForDiag = (limit = 120) => {
                const set = new Set();
                try {
                    document.querySelectorAll?.("[id^='nsx-'],[class*='nsx-']")?.forEach?.(el => {
                        if (set.size < limit) set.add(el);
                    });
                } catch { }
                return Array.from(set).slice(0, limit).map(toNodeForDiag).filter(Boolean);
            };
            const collectEditorDiag = () => {
                const vv = window.visualViewport;
                const editors = ctx.$$(".md-editor").slice(0, 3);
                const editorData = editors.map((editor, idx) => {
                    const header = editor.querySelector(".tab-select.window_header");
                    const toolbar = editor.querySelector(".mde-toolbar");
                    const topButtons = Array.from(editor.querySelectorAll(".editor-top-button")).slice(0, 20);
                    const autoMarginNodes = Array.from(editor.querySelectorAll("*"))
                        .filter(el => {
                            const cls = String(el.className || "");
                            const inline = String(el.getAttribute?.("style") || "");
                            if (/(^|\s)ml-auto(\s|$)/.test(cls)) return true;
                            return /margin-left\s*:\s*auto/i.test(inline);
                        })
                        .slice(0, 20);

                    return {
                        index: idx,
                        root: toNodeForDiag(editor),
                        header: toNodeForDiag(header),
                        toolbar: toNodeForDiag(toolbar),
                        headerChildren: header ? Array.from(header.children).slice(0, 12).map(toNodeForDiag) : [],
                        topButtons: topButtons.map(toNodeForDiag),
                        autoMarginNodes: autoMarginNodes.map(toNodeForDiag),
                        codeMirrorCount: editor.querySelectorAll(".CodeMirror").length
                    };
                });

                const keyRegions = [
                    collectRegionForDiag("#nsk-head", "顶部栏", { maxDepth: 3, maxNodes: 80, htmlMax: 2200 }),
                    collectRegionForDiag("#nsx-icon-group", "图标组", { maxDepth: 4, maxNodes: 80, htmlMax: 2200 }),
                    collectRegionForDiag("#nsk-container", "页面容器", { maxDepth: 3, maxNodes: 120, htmlMax: 3000 }),
                    collectRegionForDiag(".post-layout", "帖子布局", { maxDepth: 4, maxNodes: 140, htmlMax: 3200 }),
                    collectRegionForDiag(".post-content", "帖子内容", { maxDepth: 4, maxNodes: 140, htmlMax: 3200 }),
                    collectRegionForDiag(".comments", "评论区", { maxDepth: 3, maxNodes: 140, htmlMax: 3200 }),
                    collectRegionForDiag(".md-editor", "编辑器", { maxDepth: 4, maxNodes: 140, htmlMax: 3200 }),
                    collectRegionForDiag("#nsx-sheet-mask", "NSX 弹层", { maxDepth: 4, maxNodes: 100, htmlMax: 2400 }),
                    collectRegionForDiag("#nsx-float-menu", "悬浮菜单", { maxDepth: 4, maxNodes: 80, htmlMax: 2200 })
                ];

                const payload = {
                    source: "NSX_LAYOUT_DIAG",
                    schemaVersion: "2.0.0",
                    generatedAt: new Date().toISOString(),
                    location: {
                        href: location.href,
                        pathname: location.pathname,
                        hash: location.hash || ""
                    },
                    viewport: {
                        innerWidth: window.innerWidth || 0,
                        innerHeight: window.innerHeight || 0,
                        clientWidth: document.documentElement?.clientWidth || 0,
                        clientHeight: document.documentElement?.clientHeight || 0,
                        visualViewportWidth: vv?.width || 0,
                        visualViewportHeight: vv?.height || 0,
                        screenWidth: window.screen?.width || 0,
                        screenHeight: window.screen?.height || 0,
                        dpr: window.devicePixelRatio || 1,
                        scrollX: window.scrollX || 0,
                        scrollY: window.scrollY || 0,
                        pointerCoarse: !!window.matchMedia?.("(pointer: coarse)")?.matches
                    },
                    page: {
                        title: document.title || "",
                        bodyScrollWidth: document.body?.scrollWidth || 0,
                        bodyScrollHeight: document.body?.scrollHeight || 0,
                        docScrollWidth: document.documentElement?.scrollWidth || 0,
                        docScrollHeight: document.documentElement?.scrollHeight || 0,
                        bodyHtmlSnippet: clipHtmlForDiag(document.body?.outerHTML || "", 5200),
                        headStyles: collectHeadStylesForDiag()
                    },
                    flags: {
                        isSmallScreen480: isSmallScreen(480),
                        isSmallScreen768: isSmallScreen(768),
                        isMobileEditorScreen: (typeof isMobileEditorScreen === "function" ? !!isMobileEditorScreen() : isSmallScreen(768)),
                        nsxMobileEditorClass: document.documentElement.classList.contains("nsx-mobile-editor"),
                        darkMode: document.body?.classList?.contains("dark-layout") || document.documentElement.classList.contains("dark")
                    },
                    classes: {
                        html: document.documentElement.className || "",
                        body: document.body?.className || ""
                    },
                    styleTags: {
                        base: !!document.getElementById("nsx-base"),
                        mobileEditorFix: !!document.getElementById("nsx-mobile-editor-fix"),
                        settings: !!document.getElementById("nsx-cfg")
                    },
                    selectorStats: {
                        mdEditor: ctx.$$(".md-editor").length,
                        mdeToolbar: ctx.$$(".md-editor .mde-toolbar").length,
                        tabSelectHeader: ctx.$$(".md-editor .tab-select.window_header").length,
                        editorTopButton: ctx.$$(".md-editor .editor-top-button").length,
                        codeMirror: ctx.$$(".md-editor .CodeMirror").length,
                        postLayout: ctx.$$(".post-layout").length,
                        commentItem: ctx.$$(".comment-item, .comments > li").length,
                        userInfoMeta: ctx.$$(".nsx-user-id-meta").length
                    },
                    editors: editorData,
                    keyRegions,
                    visibleNodes: collectVisibleNodesForDiag(90),
                    nsxNodes: collectNsxNodesForDiag(120),
                    runtimeHooks: {
                        hasRuntime: !!window.__nsxRuntime,
                        openSheet: typeof window.__nsxRuntime?.openSheet === "function",
                        openSettings: typeof window.__nsxRuntime?.openSettings === "function",
                        exportEditorDiag: typeof window.__nsxRuntime?.exportEditorDiag === "function"
                    }
                };

                const existingRegions = keyRegions.filter(r => r.exists).length;
                payload.summaryText = [
                    `诊断类型: ${payload.source}@${payload.schemaVersion}`,
                    `页面: ${payload.location.pathname}`,
                    `视口: ${payload.viewport.innerWidth}x${payload.viewport.innerHeight} DPR=${payload.viewport.dpr}`,
                    `关键区域: ${existingRegions}/${keyRegions.length} 已命中`,
                    `可见节点采样: ${payload.visibleNodes.length}，NSX 节点: ${payload.nsxNodes.length}`,
                    `编辑器数量: ${payload.selectorStats.mdEditor}, 评论数: ${payload.selectorStats.commentItem}`
                ].join("\n");

                return payload;
            };
            const copyTextForDiag = (text) => {
                const raw = String(text ?? "");
                if (!raw) return false;
                try {
                    if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(raw);
                        return true;
                    }
                } catch { }
                try {
                    const ta = document.createElement("textarea");
                    ta.value = raw;
                    ta.setAttribute("readonly", "readonly");
                    ta.style.position = "fixed";
                    ta.style.left = "-9999px";
                    ta.style.top = "0";
                    document.body.appendChild(ta);
                    ta.focus();
                    ta.select();
                    const ok = !!document.execCommand?.("copy");
                    ta.remove();
                    return ok;
                } catch { return false; }
            };
            const downloadTextForDiag = (text, filename) => {
                try {
                    const blob = new Blob([String(text ?? "")], { type: "application/json;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename || "nsx-layout-diag.json";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(() => URL.revokeObjectURL(url), 800);
                    return true;
                } catch { return false; }
            };
            const ensureDiagModalStyle = () => addStyle("nsx-editor-diag-modal", `
.nsx-diag-modal-wrap{padding:12px 12px 10px}
.nsx-diag-card{
    font-size:12px;
    line-height:1.55;
    color:#475569;
    border:1px solid rgba(15,23,42,.12);
    background:linear-gradient(180deg,#fff,#f8fafc);
    border-radius:12px;
    padding:9px 10px;
    margin-bottom:10px
}
.nsx-diag-card-title{
    font-weight:760;
    color:#0f172a;
    margin-bottom:4px
}
.nsx-diag-card-sub{margin-top:4px;color:#64748b}
.nsx-diag-card.is-accent{
    border-color:rgba(59,130,246,.24);
    background:linear-gradient(180deg,#eff6ff,#dbeafe)
}
.nsx-diag-card.is-accent .nsx-diag-card-title{color:#1e3a8a}
.nsx-diag-card.is-success{
    border-color:rgba(16,185,129,.3);
    background:linear-gradient(180deg,#ecfdf5,#d1fae5)
}
.nsx-diag-card.is-success .nsx-diag-card-title{color:#065f46}
.nsx-diag-actions{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    margin-top:8px
}
.nsx-diag-actions .layui-btn.layui-btn-sm{
    border-radius:999px;
    padding:0 12px
}
.nsx-diag-topic-state{font-size:12px;color:#475569}
.nsx-diag-textarea{
    height:46vh;
    font-family:ui-monospace,SFMono-Regular,Consolas,monospace;
    white-space:pre;
    overflow:auto;
    border-radius:10px
}
.nsx-diag-hint{
    margin-top:8px;
    font-size:11px;
    color:#94a3b8
}
body.dark-layout .nsx-diag-card,html.dark .nsx-diag-card{
    color:#cbd5e1;
    border-color:rgba(148,163,184,.22);
    background:linear-gradient(180deg,rgba(30,41,59,.86),rgba(15,23,42,.82))
}
body.dark-layout .nsx-diag-card-title,html.dark .nsx-diag-card-title{color:#f8fafc}
body.dark-layout .nsx-diag-card-sub,html.dark .nsx-diag-card-sub{color:#94a3b8}
body.dark-layout .nsx-diag-card.is-accent,html.dark .nsx-diag-card.is-accent{
    border-color:rgba(96,165,250,.34);
    background:linear-gradient(180deg,rgba(30,64,175,.34),rgba(30,58,138,.24))
}
body.dark-layout .nsx-diag-card.is-accent .nsx-diag-card-title,html.dark .nsx-diag-card.is-accent .nsx-diag-card-title{color:#bfdbfe}
body.dark-layout .nsx-diag-card.is-success,html.dark .nsx-diag-card.is-success{
    border-color:rgba(52,211,153,.3);
    background:linear-gradient(180deg,rgba(4,120,87,.32),rgba(6,95,70,.24))
}
body.dark-layout .nsx-diag-card.is-success .nsx-diag-card-title,html.dark .nsx-diag-card.is-success .nsx-diag-card-title{color:#86efac}
body.dark-layout .nsx-diag-topic-state,html.dark .nsx-diag-topic-state{color:#cbd5e1}
body.dark-layout .nsx-diag-hint,html.dark .nsx-diag-hint{color:#94a3b8}
`);
            const resolveDiagChunkSize = () => {
                return 12000;
            };
            const splitTextForDiag = (text, maxChars = 12000) => {
                const raw = String(text ?? "");
                if (!raw) return [];
                const limit = Math.max(2000, Math.floor(Number(maxChars) || 12000));
                if (raw.length <= limit) return [raw];
                const chunks = [];
                let cursor = 0;
                while (cursor < raw.length) {
                    let end = Math.min(cursor + limit, raw.length);
                    if (end < raw.length) {
                        const softStart = Math.min(raw.length, cursor + Math.floor(limit * 0.6));
                        const cutAt = raw.lastIndexOf("\n", end);
                        if (cutAt >= softStart) end = cutAt + 1;
                    }
                    if (end <= cursor) end = Math.min(cursor + limit, raw.length);
                    chunks.push(raw.slice(cursor, end));
                    cursor = end;
                }
                return chunks;
            };
            const buildDiagChunkGuide = (payload, chunkCount, chunkSize) => {
                return [
                    "[NSX_LAYOUT_DIAG_CHUNK_GUIDE]",
                    `页面: ${payload?.location?.pathname || location.pathname || "/"}`,
                    `总片数: ${chunkCount}，每片上限: ${chunkSize} 字符`,
                    "说明: 我会按顺序发送分片，请在收到最后一片前先不要分析。"
                ].join("\n");
            };
            const buildDiagChunkText = (payload, summaryText, chunks, index) => {
                const total = Math.max(chunks?.length || 0, 1);
                const safeIndex = Math.max(0, Math.min(Number(index) || 0, total - 1));
                const chunkBody = chunks?.[safeIndex] || "";
                const header = [
                    `[NSX_LAYOUT_DIAG_PART ${safeIndex + 1}/${total}]`,
                    `页面: ${payload?.location?.pathname || location.pathname || "/"}`,
                    `诊断类型: ${(payload?.source || "NSX_LAYOUT_DIAG")}@${(payload?.schemaVersion || "unknown")}`,
                    "说明: 收齐全部分片后再开始分析。"
                ];
                if (safeIndex === 0 && summaryText) {
                    header.push("摘要:");
                    header.push(summaryText);
                }
                return `${header.join("\n")}\n\n${chunkBody}`;
            };
            const buildDiagTopicChunks = (payload, summaryText) => {
                const common = {
                    source: payload?.source || "NSX_LAYOUT_DIAG",
                    schemaVersion: payload?.schemaVersion || "unknown",
                    generatedAt: payload?.generatedAt || "",
                    location: payload?.location || {}
                };
                const makeTopic = (id, name, desc, data) => {
                    const body = JSON.stringify({ ...common, summaryText, data }, null, 2);
                    const text = [
                        `[NSX_LAYOUT_DIAG_TOPIC ${id}]`,
                        `页面: ${common.location?.pathname || location.pathname || "/"}`,
                        `主题: ${name}`,
                        `说明: ${desc}`,
                        "",
                        body
                    ].join("\n");
                    return { id, name, desc, text, size: text.length };
                };

                return [
                    makeTopic("overview", "基础上下文", "页面与视口基础信息", {
                        viewport: payload?.viewport || {},
                        flags: payload?.flags || {},
                        classes: payload?.classes || {},
                        selectorStats: payload?.selectorStats || {}
                    }),
                    makeTopic("editor", "编辑器与工具栏", "编辑器结构与工具栏状态", {
                        editors: payload?.editors || [],
                        selectorStats: payload?.selectorStats || {},
                        runtimeHooks: payload?.runtimeHooks || {}
                    }),
                    makeTopic("layout", "页面布局与区域", "关键区域、可见节点与容器结构", {
                        keyRegions: payload?.keyRegions || [],
                        visibleNodes: payload?.visibleNodes || [],
                        page: {
                            title: payload?.page?.title || "",
                            bodyHtmlSnippet: payload?.page?.bodyHtmlSnippet || ""
                        }
                    }),
                    makeTopic("style", "样式与主题", "样式资源、主题状态、样式标签", {
                        styleTags: payload?.styleTags || {},
                        classes: payload?.classes || {},
                        flags: payload?.flags || {},
                        page: {
                            headStyles: payload?.page?.headStyles || []
                        }
                    }),
                    makeTopic("runtime", "NSX运行时", "NSX节点与运行时接口", {
                        nsxNodes: payload?.nsxNodes || [],
                        runtimeHooks: payload?.runtimeHooks || {},
                        location: payload?.location || {}
                    })
                ];
            };
            const findDiagTopicChunk = (topicChunks, topicKey) => {
                if (!Array.isArray(topicChunks) || topicChunks.length <= 0) return null;
                if (typeof topicKey === "number" && Number.isFinite(topicKey)) {
                    const idx = Math.max(0, Math.min(topicChunks.length - 1, Math.floor(topicKey)));
                    return topicChunks[idx];
                }
                const raw = String(topicKey ?? "").trim().toLowerCase();
                if (!raw) return topicChunks[0];
                const byId = topicChunks.find(t => String(t?.id || "").toLowerCase() === raw);
                if (byId) return byId;
                const indexBased = Number(raw);
                if (Number.isFinite(indexBased)) {
                    const idx = Math.max(0, Math.min(topicChunks.length - 1, Math.floor(indexBased) - 1));
                    return topicChunks[idx];
                }
                return topicChunks[0];
            };
            const buildDiagTopicGuide = (payload, topicChunks) => {
                const lines = [
                    "[NSX_LAYOUT_DIAG_TOPIC_GUIDE]",
                    `页面: ${payload?.location?.pathname || location.pathname || "/"}`,
                    "可选主题分片（按需发送）："
                ];
                topicChunks.forEach((topic, idx) => {
                    lines.push(`${idx + 1}. ${topic.id} | ${topic.name} | ${topic.size} 字符 | ${topic.desc}`);
                });
                lines.push("先发送主题目录，再按需发送对应主题分片。");
                return lines.join("\n");
            };
            const exportEditorDiag = () => {
                ensureDiagModalStyle();
                const payload = collectEditorDiag();
                const pretty = JSON.stringify(payload, null, 2);
                const summaryText = payload.summaryText || "";
                const chunkSize = resolveDiagChunkSize();
                const chunks = splitTextForDiag(pretty, chunkSize);
                const chunkCount = chunks.length || 1;
                const topicChunks = buildDiagTopicChunks(payload, summaryText);
                const topicGuideText = buildDiagTopicGuide(payload, topicChunks);
                const ts = new Date().toISOString().replace(/[:.]/g, "-");
                const filename = `nsx-layout-diag-${ts}.json`;

                window.__nsxRuntime ||= {};
                window.__nsxRuntime.lastEditorDiag = payload;
                window.__nsxRuntime.lastEditorDiagText = pretty;
                window.__nsxRuntime.lastLayoutDiagSummary = summaryText;
                window.__nsxRuntime.lastLayoutDiagChunks = chunks;
                window.__nsxRuntime.lastLayoutDiagChunkSize = chunkSize;
                window.__nsxRuntime.lastLayoutDiagTopicChunks = topicChunks;
                window.__nsxRuntime.getLayoutDiagTopicGuide = () => topicGuideText;
                window.__nsxRuntime.getLayoutDiagChunk = (index = 0) =>
                    buildDiagChunkText(payload, summaryText, chunks, index);
                window.__nsxRuntime.copyLayoutDiagChunk = (index = 0) =>
                    copyTextForDiag(buildDiagChunkText(payload, summaryText, chunks, index));
                window.__nsxRuntime.getLayoutDiagTopicChunk = (topicKey = "overview") =>
                    (findDiagTopicChunk(topicChunks, topicKey)?.text || "");
                window.__nsxRuntime.copyLayoutDiagTopicChunk = (topicKey = "overview") =>
                    copyTextForDiag(findDiagTopicChunk(topicChunks, topicKey)?.text || "");
                window.__nsxRuntime.exportEditorDiag = exportEditorDiag;
                window.__nsxRuntime.exportLayoutDiag = exportEditorDiag;

                try { console.log("[NSX_LAYOUT_DIAG]", payload); } catch { }

                const preCopyText = chunkCount > 1
                    ? topicGuideText
                    : pretty;
                const preCopied = copyTextForDiag(preCopyText);

                if (ctx.ui?.layer) {
                    const regionStats = payload.keyRegions.reduce((acc, r) => {
                        if (r?.exists) acc.hit += 1;
                        return acc;
                    }, { hit: 0 });
                    const chunkTips = chunkCount > 1
                        ? `总长度 ${pretty.length} 字符，建议按 ${chunkCount} 片发送（每片 ≤ ${chunkSize} 字符）。`
                        : `总长度 ${pretty.length} 字符，可一次性发送。`;
                    const topicButtonsHtml = topicChunks.map((topic, idx) =>
                        `<button type="button" class="layui-btn layui-btn-primary layui-btn-sm nsx-editor-diag-topic-btn" data-topic-id="${escapeHtmlForDiag(topic.id)}">${idx + 1}. ${escapeHtmlForDiag(topic.name)}</button>`
                    ).join("");
                    const html = `
                        <div class="nsx-diag-modal-wrap">
                            <div class="nsx-diag-card">
                                <div class="nsx-diag-card-title">全页面布局诊断已生成</div>
                                <div>路径：${escapeHtmlForDiag(payload.location.pathname)}</div>
                                <div>关键区域：${regionStats.hit}/${payload.keyRegions.length}，可见节点采样：${payload.visibleNodes.length}，NSX 节点：${payload.nsxNodes.length}</div>
                                <div class="nsx-diag-card-sub">用于分析真实布局结构、节点关系、样式与尺寸。</div>
                            </div>
                            <div class="nsx-diag-card is-accent">
                                <div class="nsx-diag-card-title">分片发送辅助</div>
                                <div id="nsx-editor-diag-chunk-state">${escapeHtmlForDiag(chunkTips)}</div>
                                <div class="nsx-diag-actions">
                                    <button type="button" id="nsx-editor-diag-copy-guide" class="layui-btn layui-btn-primary layui-btn-sm">复制分片开场白</button>
                                    <button type="button" id="nsx-editor-diag-copy-chunk" class="layui-btn layui-btn-normal layui-btn-sm">复制第 1/${chunkCount} 片</button>
                                    <button type="button" id="nsx-editor-diag-reset-chunk" class="layui-btn layui-btn-sm">重置到第 1 片</button>
                                </div>
                            </div>
                            <div class="nsx-diag-card is-success">
                                <div class="nsx-diag-card-title">按主题分片（推荐）</div>
                                <div id="nsx-editor-diag-topic-state" class="nsx-diag-topic-state">先复制“主题目录”，再按需发送主题分片。</div>
                                <div class="nsx-diag-actions">
                                    <button type="button" id="nsx-editor-diag-copy-topic-guide" class="layui-btn layui-btn-normal layui-btn-sm">复制主题目录</button>
                                    ${topicButtonsHtml}
                                </div>
                            </div>
                            <textarea id="nsx-editor-diag-textarea" class="layui-textarea nsx-diag-textarea">${escapeHtmlForDiag(pretty)}</textarea>
                            <div class="nsx-diag-hint">提示：可直接复制 JSON，或使用上方分片按钮逐片发送；也可下载文件后上传。</div>
                        </div>
                    `;
                    let chunkCursor = 0;
                    const updateChunkUi = (root) => {
                        const btn = root?.querySelector?.("#nsx-editor-diag-copy-chunk");
                        const state = root?.querySelector?.("#nsx-editor-diag-chunk-state");
                        if (btn) {
                            if (chunkCount <= 1) {
                                btn.textContent = "复制第 1/1 片";
                            } else if (chunkCursor >= chunkCount) {
                                btn.textContent = `已完成 ${chunkCount}/${chunkCount}（点重置）`;
                            } else {
                                btn.textContent = `复制第 ${chunkCursor + 1}/${chunkCount} 片`;
                            }
                        }
                        if (state) {
                            if (chunkCount <= 1) {
                                state.textContent = `总长度 ${pretty.length} 字符，可一次性发送。`;
                            } else if (chunkCursor >= chunkCount) {
                                state.textContent = `分片已全部复制完成（${chunkCount}/${chunkCount}）。如需重发请点“重置到第 1 片”。`;
                            } else {
                                state.textContent = `总长度 ${pretty.length} 字符，当前进度 ${chunkCursor}/${chunkCount}。`;
                            }
                        }
                    };
                    ctx.ui.layer.open({
                        type: 1,
                        title: "全页面布局诊断输出",
                        area: [window.innerWidth <= 768 ? "96%" : "820px", "76vh"],
                        content: html,
                        success: (layero) => {
                            const root = layero?.[0] || layero;
                            const guideBtn = root?.querySelector?.("#nsx-editor-diag-copy-guide");
                            const chunkBtn = root?.querySelector?.("#nsx-editor-diag-copy-chunk");
                            const resetBtn = root?.querySelector?.("#nsx-editor-diag-reset-chunk");
                            const topicGuideBtn = root?.querySelector?.("#nsx-editor-diag-copy-topic-guide");
                            const topicState = root?.querySelector?.("#nsx-editor-diag-topic-state");
                            const topicBtns = root?.querySelectorAll?.(".nsx-editor-diag-topic-btn") || [];
                            updateChunkUi(root);
                            guideBtn?.addEventListener?.("click", () => {
                                const ok = copyTextForDiag(buildDiagChunkGuide(payload, chunkCount, chunkSize));
                                if (ok) ctx.ui?.success?.("已复制分片开场白");
                                else ctx.ui?.info?.("复制失败，请手动复制");
                            });
                            chunkBtn?.addEventListener?.("click", () => {
                                if (chunkCount <= 0) {
                                    ctx.ui?.info?.("当前无可复制内容");
                                    return;
                                }
                                if (chunkCursor >= chunkCount) {
                                    ctx.ui?.info?.("分片已复制完成，请先重置");
                                    return;
                                }
                                const text = buildDiagChunkText(payload, summaryText, chunks, chunkCursor);
                                const ok = copyTextForDiag(text);
                                if (!ok) {
                                    ctx.ui?.info?.("复制失败，请手动复制");
                                    return;
                                }
                                const copied = chunkCursor + 1;
                                chunkCursor += 1;
                                if (chunkCount > 1) {
                                    if (chunkCursor >= chunkCount) ctx.ui?.success?.(`已复制第 ${copied}/${chunkCount} 片（最后一片）`);
                                    else ctx.ui?.success?.(`已复制第 ${copied}/${chunkCount} 片`);
                                } else {
                                    ctx.ui?.success?.("已复制诊断分片");
                                }
                                updateChunkUi(root);
                            });
                            resetBtn?.addEventListener?.("click", () => {
                                chunkCursor = 0;
                                updateChunkUi(root);
                                ctx.ui?.info?.("已重置到第 1 片");
                            });
                            topicGuideBtn?.addEventListener?.("click", () => {
                                const ok = copyTextForDiag(topicGuideText);
                                if (ok) ctx.ui?.success?.("已复制主题目录");
                                else ctx.ui?.info?.("复制失败，请手动复制");
                            });
                            topicBtns?.forEach?.(btn => {
                                btn?.addEventListener?.("click", () => {
                                    const topicId = btn.getAttribute("data-topic-id") || "";
                                    const topic = findDiagTopicChunk(topicChunks, topicId);
                                    if (!topic) {
                                        ctx.ui?.info?.("未找到对应主题分片");
                                        return;
                                    }
                                    const ok = copyTextForDiag(topic.text);
                                    if (!ok) {
                                        ctx.ui?.info?.("复制失败，请手动复制");
                                        return;
                                    }
                                    if (topicState) topicState.textContent = `已复制主题：${topic.name}（${topic.id}，${topic.size} 字符）`;
                                    ctx.ui?.success?.(`已复制主题分片：${topic.name}`);
                                });
                            });
                        },
                        btn: ["复制 JSON", "复制摘要", "下载 JSON", "关闭"],
                        yes: () => {
                            const ta = document.getElementById("nsx-editor-diag-textarea");
                            const ok = copyTextForDiag(ta?.value || pretty);
                            if (ok) ctx.ui?.success?.("已复制诊断 JSON");
                            else ctx.ui?.info?.("复制失败，请手动全选复制");
                            return false;
                        },
                        btn2: () => {
                            const ok = copyTextForDiag(summaryText || pretty);
                            if (ok) ctx.ui?.success?.("已复制诊断摘要");
                            else ctx.ui?.info?.("复制失败，请手动复制");
                            return false;
                        },
                        btn3: () => {
                            const ok = downloadTextForDiag(pretty, filename);
                            if (ok) ctx.ui?.success?.("已下载诊断 JSON");
                            else ctx.ui?.info?.("下载失败，请手动复制 JSON");
                            return false;
                        },
                        btn4: (idx) => { ctx.ui.layer.close(idx); }
                    });
                } else {
                    try { prompt("全页面布局诊断 JSON（请全选复制）", pretty); } catch { }
                }

                if (preCopied && chunkCount > 1) ctx.ui?.success?.("已复制主题目录，可按需发送主题分片");
                else if (preCopied) ctx.ui?.success?.("已复制诊断 JSON");
                else ctx.ui?.info?.("诊断已输出到弹窗与控制台");
                return payload;
            };

	            const advSettings = () => {
	                if (!ctx.ui.layer || !window.layui) {
	                    try { ctx.ui?.toast?.("设置面板依赖未加载，请稍后再试"); } catch { }
	                    try { alert("设置面板依赖未加载，请稍后再试"); } catch { }
	                    return;
	                }
	                addStyle("nsx-cfg", CSS$1);

	                // App 内置“下拉刷新”会根据 WebView 自身滚动位置判断是否触发；
	                // 设置面板内部使用独立滚动容器（#nsx-config-content），WebView 可能仍处于顶部，
	                // 导致在面板内滑动也触发下拉刷新。这里通过桥接通知 App 暂时禁用下拉刷新。
	                const setAppPullToRefreshSuppressed = (suppressed) => {
	                    try { window.NSXBridge?.setPullToRefreshSuppressed?.(!!suppressed); } catch { }
	                };
	                setAppPullToRefreshSuppressed(true);

	                // 获取所有模块的 cfg 和 meta
	                const defs = store.getDefaults(), metas = store.getMeta();
	                const ignore = new Set(["version", "debug", "ui"]);

                // 建立 meta key 到 order 的映射关系
                const metaToOrder = new Map();
                modules.forEach(m => {
                    if (m.meta) {
                        Object.keys(m.meta).forEach(k => metaToOrder.set(k, m.order || 999));
                    }
                });

                // 获取所有设置条目并附加 order
                const entries = Object.entries(metas)
                    .filter(([k]) => defs[k] && !ignore.has(k))
                    .map(([k, m]) => {
                        const metaOrder = Number(m?.order);
                        return {
                            key: k,
                            meta: m,
                            order: Number.isFinite(metaOrder) ? metaOrder : (metaToOrder.get(k) || 999)
                        };
                    });

                // 核心：按照 order 从小到大排序
                entries.sort((a, b) => a.order - b.order);

                const groups = {};
                const groupOrder = []; // 记录分组出现的先后顺序
                entries.forEach(e => {
                    const g = e.meta.group || "其他设置";
                    if (!groups[g]) {
                        groups[g] = [];
                        groupOrder.push(g);
                    }
                    groups[g].push(e);
                });

                const cont = document.createElement("div");
                cont.className = "layui-row";
                cont.style.cssText = "display:flex;height:100%";
                const menuDiv = el("div", "layui-panel layui-col-xs3", cont);
                menuDiv.id = "nsx-config-menu";
                const menuList = el("ul", "layui-menu", menuDiv);
                const wrapper = el("div", "layui-col-xs9", cont);
                wrapper.id = "nsx-config-content";

                const isObj = v => v && typeof v === "object" && !Array.isArray(v);
                const inferType = (v, m) => m?.type || (Array.isArray(v) ? "TEXTAREA" : typeof v === "boolean" ? "SWITCH" : typeof v === "number" ? "NUMBER" : "TEXT");
                const inferVT = (v, m) => m?.valueType || (Array.isArray(v) ? "array" : typeof v === "number" ? "number" : typeof v === "boolean" ? "boolean" : "string");

                const makeField = (f, path, val, defaultCol = 12) => {
                    const col = f.col ?? defaultCol;
                    const w = el("div", `layui-col-md${col}`), item = el("div", "layui-form-item", w);
                    const lbl = el("label", "layui-form-label", item); lbl.textContent = f.label || f.key;
                    const blk = el("div", "layui-input-block", item);

                    if (f.type === "SWITCH") {
                        item.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:15px;";
                        lbl.style.cssText = "float:none;display:inline-block;padding:0 15px 0 0;width:auto;text-align:left;line-height:normal;flex:1 1 auto;min-width:0;";
                        blk.style.cssText = "margin-left:0;min-height:auto;flex:0 0 auto;display:flex;align-items:center;";
                        let inp = el("input", "", blk); inp.type = "checkbox"; if (val) inp.setAttribute("checked", ""); inp.setAttribute("lay-skin", "switch"); inp.setAttribute("lay-text", "开启|关闭"); inp.name = path;
                    }
                    else if (f.type === "TEXTAREA") { let inp = el("textarea", "layui-textarea", blk); inp.setAttribute("placeholder", f.placeholder || ""); inp.textContent = Array.isArray(val) ? val.join("\n") : (val ?? ""); inp.name = path; }
                    else if (f.type === "RADIO" && f.options) {
                        f.options.forEach(opt => {
                            const r = el("input", "", blk); r.type = "radio"; r.name = path; r.setAttribute("value", opt.value);
                            r.dataset.valueType = f.valueType || "";
                            if (String(val) === String(opt.value)) r.setAttribute("checked", "");
                            r.setAttribute("title", opt.text);
                        });
                    }
                    else if (f.type === "SELECT" && f.options) {
                        const sel = el("select", "", blk); sel.name = path;
                        sel.dataset.valueType = f.valueType || "";
                        Object.entries(f.options).forEach(([k, v]) => {
                            const opt = el("option", "", sel);
                            opt.value = k; opt.textContent = v;
                            if (String(val) === String(k)) opt.setAttribute("selected", "selected");
                        });
                    }
                    else if (f.type === "COLOR") {
                        item.classList.add("nsx-color-form-item");
                        const colorVal = String(val ?? "").trim();
                        let inp = el("input", "nsx-color-hidden", blk);
                        inp.type = "hidden";
                        inp.setAttribute("name", path);
                        inp.setAttribute("value", colorVal);

                        const row = el("div", "nsx-color-row", blk);

                        const codeText = el("span", "nsx-color-code", row);
                        codeText.setAttribute("data-color-code", path);
                        codeText.textContent = colorVal || "默认";

                        const cpWrap = el("div", "nsx-color-picker", row);
                        const chip = el("span", "nsx-color-chip", cpWrap);
                        chip.setAttribute("data-color-chip", path);
                        chip.setAttribute("data-empty", colorVal ? "0" : "1");
                        if (colorVal) chip.style.background = colorVal;
                        const host = el("span", "nsx-color-host", cpWrap);
                        host.setAttribute("title", "点击选择颜色");
                        host.setAttribute("data-color-path", path);
                        host.setAttribute("data-color-val", colorVal);
                        host.setAttribute("data-color-inp", path);
                        host.setAttribute("data-color-default", f.defaultVal ?? "");
                    }
                    else {
                        let inp = el("input", "layui-input", blk);
                        inp.type = f.type === "NUMBER" ? "number" : "text";
                        inp.setAttribute("value", val ?? "");
                        inp.setAttribute("name", path);
                        inp.dataset.valueType = f.valueType || "";
                    }

                    const firstInp = w.querySelector("input, textarea");
                    if (firstInp && !firstInp.dataset.valueType) firstInp.dataset.valueType = f.valueType || "";
                    return w;
                };

                const makeCard = (entry, siteCode) => {
                    const m = entry.meta || {};
                    let base = entry.key, cfg = defs[entry.key];
                    if (entry.key === "sign_in") { cfg = defs.sign_in?.[siteCode] || defs.sign_in?.ns || {}; base = `sign_in.${siteCode}`; }
                    if (!isObj(cfg)) return null;
                    const card = el("div", "layui-card layui-form nsx-config-card");
                    card.setAttribute("lay-filter", `nsx-${entry.key}`);
                    const hdr = el("div", "layui-card-header", card); hdr.textContent = m.label || entry.key;
                    if (typeof cfg.enabled === "boolean") {
                        const cbW = el("div", "header-checkbox", hdr), cb = el("input", "", cbW);
                        cb.type = "checkbox"; cb.name = `${base}.enabled`; if (store.get(`${base}.enabled`, cfg.enabled)) cb.setAttribute("checked", "");
                        cb.setAttribute("lay-skin", "switch"); cb.setAttribute("lay-text", "开启|关闭");
                        cb.setAttribute("lay-filter", "nsx-main-switch");
                    }
                    const body = el("div", "layui-card-body layui-row layui-col-space10", card);
                    const fields = m.fields || {}, hidden = new Set(m.hidden || []);
                    const cols = m.cols || 1, defaultCol = Math.floor(12 / cols);
                    Object.keys(cfg).filter(k => k !== "enabled" && !isObj(cfg[k]) && !hidden.has(k)).forEach(k => {
                        const fm = fields[k] || {};
                        const f = { key: k, label: fm.label || k, type: inferType(cfg[k], fm), options: fm.options, placeholder: fm.placeholder, valueType: inferVT(cfg[k], fm), col: fm.col, defaultVal: cfg[k] };
                        let cur = store.get(`${base}.${k}`, cfg[k]);
                        // 处理旧版本 hide -> official 的映射
                        if (k === 'blacklist_mode' && cur === 'hide') cur = 'official';

                        const fe = makeField(f, `${base}.${k}`, cur, defaultCol);
                        if (fe) body.appendChild(fe);
                    });
                    return card;
                };

                // 按照排好序的分组进行渲染
                groupOrder.forEach((g, i) => {
                    const list = groups[g];
                    const fs = el("fieldset", "layui-elem-field layui-field-title", wrapper); fs.id = `group-${i}`;
                    const lg = el("legend", "", fs); lg.textContent = g;
                    const fd = el("div", "layui-form", wrapper);
                    list.forEach(e => { const c = makeCard(e, code); if (c) fd.appendChild(c); });
                    const mi = el("li", "", menuList); if (i === 0) mi.classList.add("layui-menu-item-checked");
                    const mb = el("div", "layui-menu-body-title", mi), a = el("a", "", mb); a.href = `#group-${i}`; a.textContent = g;
                });

                // 底部提示
                const endFs = el("fieldset", "layui-elem-field layui-field-title", wrapper, "text-align:center");
                const endLg = el("legend", "", endFs, "font-size:0.8em;opacity:0.5");
                endLg.textContent = "到底了";

                const w = window.layui.device().mobile ? "100%" : "620px";
	                ctx.ui.layer.open({
	                    type: 1, offset: "r", anim: "slideLeft", area: [w, "100%"], scrollbar: false, shade: 0.1, shadeClose: false,
	                    btn: ["保存设置", "取消"], btnAlign: "r", title: "Nodeseek Pro 设置", id: "setting-layer-direction-r", content: cont.outerHTML,
	                    end: () => setAppPullToRefreshSuppressed(false),
	                    success: ly => {
	                        const r = ly?.[0] || ly;
	                        try { window.layui.form?.render(); } catch { }
	                        // 滚动同步：右侧滚动时高亮左侧菜单
                        const content = r?.querySelector?.("#nsx-config-content");
                        const menu = r?.querySelector?.("#nsx-config-menu");
                        if (content && menu) {
                            const items = menu.querySelectorAll("li");
                            content.addEventListener("scroll", () => {
                                const groups = content.querySelectorAll("fieldset[id^='group-']");
                                let activeIdx = 0;
                                groups.forEach((g, i) => { if (g.offsetTop - content.scrollTop <= 50) activeIdx = i; });
                                items.forEach((li, i) => li.classList.toggle("layui-menu-item-checked", i === activeIdx));
                            }, { passive: true });
                        }
                        // 主开关联动
                        const toggleCard = (card, on) => {
                            card.querySelectorAll(".layui-card-body input,.layui-card-body select,.layui-card-body textarea").forEach(el => {
                                el.disabled = !on;
                                el.closest(".layui-form-item")?.classList.toggle("layui-disabled", !on);
                            });
                            window.layui.form?.render(null, card.getAttribute("lay-filter"));
                        };
                        // 初始 + 监听
                        r?.querySelectorAll?.(".header-checkbox input").forEach(cb => !cb.checked && toggleCard(cb.closest(".nsx-config-card"), false));
                        window.layui.form?.on("switch(nsx-main-switch)", d => toggleCard(d.elem.closest(".nsx-config-card"), d.elem.checked));
                        window.layui.use("colorpicker", () => {
                            const cp = window.layui.colorpicker;
                            r?.querySelectorAll?.("[data-color-path]").forEach(host => {
                                const path = host.getAttribute("data-color-inp");
                                const inp = r.querySelector(`input[name="${path}"]`);
                                const chip = r.querySelector(`[data-color-chip="${path}"]`);
                                const codeText = r.querySelector(`[data-color-code="${path}"]`);
                                const init = host.getAttribute("data-color-val") || "";
                                const def = host.getAttribute("data-color-default") || "";
                                if (!inp || !chip) return;

                                const normalizeColor = (v) => String(v ?? "").trim();
                                const setPreview = (v) => {
                                    const color = normalizeColor(v);
                                    chip.style.background = color || "";
                                    chip.setAttribute("data-empty", color ? "0" : "1");
                                    if (codeText) codeText.textContent = color || "默认";
                                };
                                setPreview(init || inp.value || def);
                                cp.render({
                                    elem: host, color: init, alpha: true, predefine: true, format: "rgb",
                                    change: setPreview,
                                    done(c) {
                                        const final = normalizeColor(c || def);
                                        inp.value = final;
                                        setPreview(final);
                                    },
                                    cancel() { setPreview(inp.value || def); }
                                });
                            });
                        });
                    },
                    yes: (idx, ly) => {
                        const r = ly?.[0] || ly, sc = r?.querySelector ? r : document;
                        const changedKeys = [];
                        sc.querySelectorAll("input,select,textarea").forEach(el => {
                            if (!el.name) return;
                            // radio 只保存选中的那个
                            if (el.type === "radio" && !el.checked) return;
                            let v;
                            const vt = el.dataset.valueType;
                            if (el.type === "checkbox") v = el.checked;
                            else if (el.type === "radio") v = vt === "number" ? Number(el.value) : el.value;
                            else if (el.tagName === "TEXTAREA") v = vt === "array" ? el.value.split("\n").map(s => s.trim()).filter(Boolean) : el.value;
                            else if (el.type === "number" || vt === "number") { const n = Number(el.value); v = Number.isFinite(n) ? n : 0; }
                            else v = el.value;
                            if (v !== undefined) {
                                const oldV = store.get(el.name);
                                const o = typeof oldV === "object" ? JSON.stringify(oldV) : String(oldV);
                                const n = typeof v === "object" ? JSON.stringify(v) : String(v);
                                if (o !== n) changedKeys.push(el.name);
                                store.set(el.name, v);
                            }
                        });
                        applyRuntimeSettings(ctx, changedKeys);
                        if (changedKeys.some(k => k === "developer_tools.enabled" || k.startsWith("developer_tools."))) {
                            try { document.getElementById(FLOAT_MENU_ID)?.remove(); } catch { }
                            try { ensureFloatMenu(); } catch { }
                        }
                        regMenus();
                        ctx.ui.layer.msg("设置已保存，已即时生效");
                        setTimeout(() => ctx.ui.layer.close(idx), 300);
                    }
                });
            };

            const ensureSheetStyle = () => addStyle("nsx-sheet", `
#nsx-sheet-mask{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:999999;display:none}
#nsx-sheet-mask.show{display:block}
#nsx-sheet{position:absolute;left:0;right:0;bottom:0;max-height:85vh;background:var(--bg-color,#fff);color:var(--text-color,#111);border-radius:16px 16px 0 0;border:1px solid var(--border-color,#e5e7eb);border-bottom:0;box-shadow:0 -2px 8px rgba(15,23,42,.1);transform:translateY(110%);transition:transform .18s ease}
#nsx-sheet-mask.show #nsx-sheet{transform:translateY(0)}
#nsx-sheet-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border-color,#e5e7eb)}
#nsx-sheet-title{font-weight:700;font-size:15px}
#nsx-sheet-close{border:0;background:transparent;font-size:20px;line-height:1;cursor:pointer;color:inherit;opacity:.75;padding:4px 6px}
#nsx-sheet-body{padding:8px 12px 14px;overflow:auto;max-height:calc(85vh - 52px)}
.nsx-sheet-item{width:100%;text-align:left;border:1px solid rgba(15,23,42,.08);background:rgba(248,250,252,.86);border-radius:11px;padding:10px 11px;margin:7px 0;font-size:13px;display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;transition:background .16s ease,border-color .16s ease}
.nsx-sheet-item:hover{background:rgba(241,245,249,.94)}
.nsx-sheet-item:active{transform:scale(.99);opacity:.95}
.nsx-sheet-item-main{display:flex;align-items:center;gap:9px;min-width:0}
.nsx-sheet-item-icon{width:clamp(20px,5.2vw,23px);height:clamp(20px,5.2vw,23px);border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(59,130,246,.22);background:rgba(239,246,255,.92);color:#1d4ed8;flex:0 0 auto}
.nsx-sheet-item-icon svg{width:clamp(12px,3.4vw,14px);height:clamp(12px,3.4vw,14px);display:block;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.nsx-sheet-item-text{font-weight:760;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nsx-sheet-item-arrow{display:flex;align-items:center;color:#64748b}
.nsx-sheet-item-arrow svg{width:clamp(11px,3.1vw,13px);height:clamp(11px,3.1vw,13px);display:block;stroke:currentColor;fill:none;stroke-width:2.25;stroke-linecap:round;stroke-linejoin:round}
.nsx-sheet-item[data-a="settings"] .nsx-sheet-item-icon{border-color:rgba(37,99,235,.28);background:rgba(219,234,254,.9);color:#1d4ed8}
.nsx-sheet-item[data-a="editor_diag"] .nsx-sheet-item-icon{border-color:rgba(249,115,22,.28);background:rgba(255,237,213,.92);color:#c2410c}
.nsx-sheet-item[data-a="relation"] .nsx-sheet-item-icon{border-color:rgba(14,165,233,.28);background:rgba(224,242,254,.9);color:#0369a1}
.nsx-sheet-item[data-a="history"] .nsx-sheet-item-icon{border-color:rgba(16,185,129,.28);background:rgba(209,250,229,.9);color:#047857}
.nsx-sheet-item[data-a="filter"] .nsx-sheet-item-icon{border-color:rgba(239,68,68,.3);background:rgba(255,228,230,.92);color:#be123c}
body.dark-layout #nsx-sheet-mask,html.dark #nsx-sheet-mask{background:rgba(0,0,0,.62)}
body.dark-layout #nsx-sheet,html.dark #nsx-sheet{background:#0f172a;color:#e2e8f0;border:1px solid rgba(148,163,184,.24);border-bottom:0;box-shadow:0 -4px 12px rgba(2,6,23,.3)}
body.dark-layout #nsx-sheet-header,html.dark #nsx-sheet-header{border-bottom-color:rgba(148,163,184,.24);background:rgba(15,23,42,.42)}
body.dark-layout #nsx-sheet-title,html.dark #nsx-sheet-title{color:#f8fafc}
body.dark-layout #nsx-sheet-close,html.dark #nsx-sheet-close{color:#cbd5e1}
body.dark-layout .nsx-sheet-item,html.dark .nsx-sheet-item{border-color:rgba(148,163,184,.2);background:rgba(15,23,42,.56);color:#e2e8f0}
body.dark-layout .nsx-sheet-item:hover,html.dark .nsx-sheet-item:hover{background:rgba(15,23,42,.68)}
body.dark-layout .nsx-sheet-item-icon,html.dark .nsx-sheet-item-icon{border-color:rgba(96,165,250,.3);background:rgba(30,64,175,.24);color:#bfdbfe}
body.dark-layout .nsx-sheet-item-arrow,html.dark .nsx-sheet-item-arrow{color:#94a3b8}
body.dark-layout .nsx-sheet-item[data-a="editor_diag"] .nsx-sheet-item-icon,html.dark .nsx-sheet-item[data-a="editor_diag"] .nsx-sheet-item-icon{border-color:rgba(251,146,60,.32);background:rgba(194,65,12,.26);color:#fdba74}
body.dark-layout .nsx-sheet-item[data-a="relation"] .nsx-sheet-item-icon,html.dark .nsx-sheet-item[data-a="relation"] .nsx-sheet-item-icon{border-color:rgba(56,189,248,.32);background:rgba(3,105,161,.24);color:#7dd3fc}
body.dark-layout .nsx-sheet-item[data-a="history"] .nsx-sheet-item-icon,html.dark .nsx-sheet-item[data-a="history"] .nsx-sheet-item-icon{border-color:rgba(52,211,153,.3);background:rgba(4,120,87,.24);color:#86efac}
body.dark-layout .nsx-sheet-item[data-a="filter"] .nsx-sheet-item-icon,html.dark .nsx-sheet-item[data-a="filter"] .nsx-sheet-item-icon{border-color:rgba(248,113,113,.34);background:rgba(159,18,57,.28);color:#fda4af}
`);

            const openSheet = ({ title = "", content, onClose } = {}) => {
                ensureSheetStyle();

                let mask = document.getElementById("nsx-sheet-mask");
                if (!mask) {
                    mask = document.createElement("div");
                    mask.id = "nsx-sheet-mask";
                    mask.innerHTML = `<div id="nsx-sheet"><div id="nsx-sheet-header"><div id="nsx-sheet-title"></div><button type="button" id="nsx-sheet-close" aria-label="关闭">✕</button></div><div id="nsx-sheet-body"></div></div>`;
                    document.body.appendChild(mask);

                    const close = () => {
                        mask.classList.remove("show");
                        try { mask._nsxOnClose?.(); } catch { }
                        mask._nsxOnClose = null;
                    };
                    mask._nsxClose = close;

                    mask.addEventListener("click", ev => {
                        if (ev.target === mask) close();
                    });
                    mask.querySelector("#nsx-sheet-close")?.addEventListener("click", close);
                    document.addEventListener("keydown", ev => {
                        if (ev.key === "Escape" && mask.classList.contains("show")) close();
                    });
                }

                mask._nsxOnClose = typeof onClose === "function" ? onClose : null;

                const titleEl = document.getElementById("nsx-sheet-title");
                const bodyEl = document.getElementById("nsx-sheet-body");
                if (titleEl) titleEl.textContent = title || "";
                if (bodyEl) {
                    bodyEl.innerHTML = "";
                    if (typeof content === "string") bodyEl.innerHTML = content;
                    else if (content) bodyEl.appendChild(content);
                }

                mask.classList.add("show");
                return { close: () => document.getElementById("nsx-sheet-mask")?._nsxClose?.() };
            };

            window.__nsxRuntime ||= {};
            window.__nsxRuntime.openSheet = openSheet;

            const openAdvancedSettings = e => {
                e?.preventDefault?.();
                e?.stopPropagation?.();
                advSettings();
            };

            const triggerEditorDiag = () => {
                if (!isLayoutDiagEnabled()) {
                    try { ctx.ui?.info?.("请先在高级设置中开启“开发者工具（布局诊断）”"); } catch { }
                    try { alert("请先在高级设置中开启“开发者工具（布局诊断）”"); } catch { }
                    return null;
                }
                const diagFn = typeof exportEditorDiag === "function" ? exportEditorDiag : window.__nsxRuntime?.exportEditorDiag;
                if (typeof diagFn !== "function") {
                    try { ctx.ui?.warning?.("诊断功能尚未就绪，请稍后重试"); } catch { }
                    try { alert("诊断功能尚未就绪，请稍后重试"); } catch { }
                    return null;
                }
                try {
                    return diagFn();
                } catch (err) {
                    const msg = `诊断执行失败：${err?.message || err || "未知错误"}`;
                    try { env.error("[NSX] editor_diag failed", err); } catch { }
                    try { ctx.ui?.error?.(msg); } catch { }
                    try { alert(msg); } catch { }
                    return null;
                }
            };

            const openProMenu = e => {
                e?.preventDefault?.();
                e?.stopPropagation?.();

	                const cont = document.createElement("div");
	                const showLayoutDiagEntry = isLayoutDiagEnabled();
	                cont.innerHTML = `
	                    <button type="button" class="nsx-sheet-item" data-a="settings">
	                        <span class="nsx-sheet-item-main">
	                            <span class="nsx-sheet-item-icon" aria-hidden="true">
	                                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path><path d="M5 5l2.2 2.2"></path><path d="M16.8 16.8L19 19"></path><path d="M5 19l2.2-2.2"></path><path d="M16.8 7.2L19 5"></path></svg>
	                            </span>
	                            <span class="nsx-sheet-item-text">设置</span>
	                        </span>
	                        <span class="nsx-sheet-item-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg></span>
	                    </button>
	                    ${showLayoutDiagEntry ? `
	                    <button type="button" class="nsx-sheet-item" data-a="editor_diag">
	                        <span class="nsx-sheet-item-main">
	                            <span class="nsx-sheet-item-icon" aria-hidden="true">
	                                <svg viewBox="0 0 24 24"><path d="M9 3h6"></path><path d="M10 3v5l-4.8 8.2A2 2 0 0 0 7 19h10a2 2 0 0 0 1.7-3L14 8V3"></path><path d="M9.5 13h5"></path></svg>
	                            </span>
	                            <span class="nsx-sheet-item-text">导出布局诊断</span>
	                        </span>
	                        <span class="nsx-sheet-item-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg></span>
	                    </button>` : ""}
	                    <button type="button" class="nsx-sheet-item" data-a="relation">
	                        <span class="nsx-sheet-item-main">
	                            <span class="nsx-sheet-item-icon" aria-hidden="true">
	                                <svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3"></circle><circle cx="16" cy="11" r="3"></circle><path d="M3 19c.8-2.6 2.5-4 5-4"></path><path d="M10.5 19c.8-2.3 2.7-3.6 5.5-3.6"></path></svg>
	                            </span>
	                            <span class="nsx-sheet-item-text">黑名单 / 好友</span>
	                        </span>
	                        <span class="nsx-sheet-item-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg></span>
	                    </button>
	                    <button type="button" class="nsx-sheet-item" data-a="history">
	                        <span class="nsx-sheet-item-main">
	                            <span class="nsx-sheet-item-icon" aria-hidden="true">
	                                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>
	                            </span>
	                            <span class="nsx-sheet-item-text">历史记录</span>
	                        </span>
	                        <span class="nsx-sheet-item-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg></span>
	                    </button>
	                    <button type="button" class="nsx-sheet-item" data-a="filter">
	                        <span class="nsx-sheet-item-main">
	                            <span class="nsx-sheet-item-icon" aria-hidden="true">
	                                <svg viewBox="0 0 24 24"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5z"></path></svg>
	                            </span>
	                            <span class="nsx-sheet-item-text">关键字过滤</span>
	                        </span>
	                        <span class="nsx-sheet-item-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg></span>
	                    </button>
	                `.trim();

	                const sheet = openSheet({ title: "Nodeseek Pro", content: cont });
	                const openLater = (fn) => {
	                    try { setTimeout(() => { try { fn?.(); } catch { } }, 0); } catch { try { fn?.(); } catch { } }
	                };
	                cont.addEventListener("click", ev => {
	                    const b = ev.target.closest("button[data-a]");
	                    if (!b) return;
	                    ev.preventDefault();
	                    ev.stopPropagation();
	                    const act = b.dataset.a;
	                    sheet.close();
	                    if (act === "editor_diag") return triggerEditorDiag();

	                    openLater(() => {
	                        if (act === "settings") return advSettings();
	                        if (act === "history") {
	                            try {
	                                if (window.__nsxPanelCtrl?.history?.open) return window.__nsxPanelCtrl.history.open();
	                            } catch { }
	                            try { return document.querySelector("#nsx-icon-group .history-dropdown-on")?.click(); } catch { }
	                            return;
	                        }
	                        if (act === "relation") {
	                            try { return document.querySelector("#nsx-icon-group .relation-dropdown-on")?.click(); } catch { }
	                            return;
	                        }
	                        if (act === "filter") {
	                            try { return document.querySelector("#nsx-icon-group .filter-dropdown-on")?.click(); } catch { }
	                            return;
	                        }
	                    });
	                }, { capture: true });
	            };

            // 手机端编辑器头部仅做最小修正：防止“支持MD语法”换行撑高整行
            addStyle("nsx-mobile-editor-header-fix", `
@media (max-width:768px){
  .md-editor .tab-select.window_header{display:flex!important;align-items:center!important;flex-wrap:nowrap!important;overflow:hidden!important}
  .md-editor .tab-select.window_header .editor-top-button{flex:0 0 auto!important;margin-left:2px!important}
  .md-editor .tab-select.window_header .editor-top-button:first-of-type{margin-left:auto!important}
  .md-editor .tab-select.window_header>div:nth-child(2),
  .md-editor .tab-select.window_header>div[style*="margin-left:auto"],
  .md-editor .tab-select.window_header>div[style*="margin-left: auto"]{
    white-space:nowrap!important;
    word-break:keep-all!important;
    overflow:hidden!important;
    text-overflow:ellipsis!important;
    max-width:88px!important;
    line-height:1.2!important;
  }
}
@media (max-width:420px){
  .md-editor .tab-select.window_header>div:nth-child(2),
  .md-editor .tab-select.window_header>div[style*="margin-left:auto"],
  .md-editor .tab-select.window_header>div[style*="margin-left: auto"]{
    max-width:72px!important;
    font-size:12px!important;
  }
}
@media (max-width:360px){
  .md-editor .tab-select.window_header>div:nth-child(2),
  .md-editor .tab-select.window_header>div[style*="margin-left:auto"],
  .md-editor .tab-select.window_header>div[style*="margin-left: auto"]{display:none!important}
}
`);

            // 手机端工具栏最小修复：避免末端按钮被 auto-margin / right 分组推到最右侧孤立显示
            addStyle("nsx-mobile-toolbar-right-fix", `
@media (max-width:768px){
  .md-editor .mde-toolbar .toolbar-item.right,
  .md-editor .mde-toolbar .right,
  .md-editor .mde-toolbar [class*=" right"]{
    margin-left:0!important;
    border-left:0!important;
    padding-left:4px!important;
    float:none!important;
  }
  .md-editor .mde-toolbar [style*="margin-left:auto"],
  .md-editor .mde-toolbar [style*="margin-left: auto"]{margin-left:0!important}
  .md-editor .mde-toolbar .nodeimage-toolbar-container{
    margin-left:0!important;
    margin-right:6px!important;
  }
  .md-editor .mde-toolbar #nodeimage-status{display:none!important}

  /* 仅针对帖子下方默认回复栏（未进入 nsx-mobile-docked-editor） */
  .md-editor:not(.nsx-mobile-docked-editor) .mde-toolbar{
    display:flex!important;
    flex-wrap:nowrap!important;
    align-items:center!important;
    overflow-x:auto!important;
    overflow-y:hidden!important;
    white-space:nowrap!important;
    -webkit-overflow-scrolling:touch;
  }
  .md-editor:not(.nsx-mobile-docked-editor) .mde-toolbar>*{
    flex:0 0 auto!important;
    float:none!important;
    clear:none!important;
    position:static!important;
    left:auto!important;
    right:auto!important;
    transform:none!important;
  }
  .md-editor:not(.nsx-mobile-docked-editor) .mde-toolbar .toolbar-item.right,
  .md-editor:not(.nsx-mobile-docked-editor) .mde-toolbar .right,
  .md-editor:not(.nsx-mobile-docked-editor) .mde-toolbar [class*=" right"]{
    margin-left:0!important;
    border-left:0!important;
    padding-left:4px!important;
  }
  .md-editor:not(.nsx-mobile-docked-editor) .mde-toolbar [style*="margin-left:auto"],
  .md-editor:not(.nsx-mobile-docked-editor) .mde-toolbar [style*="margin-left: auto"]{margin-left:0!important}
}
`);

	            addStyle("nsx-icon-group-fix", `
	                #nsx-icon-group{pointer-events:none!important}
	                #nsx-icon-group>*{pointer-events:auto!important}
	                #nsx-icon-group>.filter-dropdown-on,
	                #nsx-icon-group>.relation-dropdown-on,
	                #nsx-icon-group>.history-dropdown-on{top:0!important}

                /* 顶部入口统一由悬浮按钮承担，隐藏图标组中的按钮 */
                #nsx-icon-group>.filter-dropdown-on,
                #nsx-icon-group>.relation-dropdown-on,
                #nsx-icon-group>.history-dropdown-on{display:none!important}

                /* 图标组插入头部时使用内容流，避免占位撑高 */
                #nsk-head #nsx-icon-group{display:contents!important}
		            `);

			            // 移动端图钉 / HOT 角标防遮挡：
			            // - 站点在列表项右侧使用角标（置顶/图钉、HOT 等）提示帖子状态
			            // - 小屏下角标容易覆盖作者行/统计信息（右侧内容）
			            // - 通过识别角标元素，并为对应列表项动态增加右侧“安全内边距”，避免内容被角标遮挡
			            addStyle("nsx-corner-badge-style", `
			                .nsx-corner-badge{
			                    position:relative!important;
			                    display:inline-flex!important;
			                    align-items:center!important;
			                    justify-content:center!important;
			                    box-sizing:border-box!important;
			                    vertical-align:middle!important;
			                    min-height:14px!important;
			                    height:14px!important;
			                    line-height:14px!important;
			                    padding:0 5px!important;
			                    border-radius:999px!important;
			                    font-size:9.5px!important;
			                    font-weight:760!important;
			                    letter-spacing:.1px!important;
			                    box-shadow:0 1px 3px rgba(0,0,0,.1)!important;
			                    text-transform:none!important;
			                    overflow:hidden!important;
			                    background-image:none!important;
			                }
			                .nsx-corner-badge::before{
			                    content:"";
			                    position:absolute;
			                    left:0;
			                    top:0;
			                    bottom:0;
			                    width:2px;
			                    opacity:.96
			                }
			                .nsx-corner-badge svg,.nsx-corner-badge use{pointer-events:none}
			                .nsx-hot-badge{
			                    border:1px solid rgba(251,146,60,.42)!important;
			                    background:linear-gradient(180deg,rgba(255,247,237,.98),rgba(255,237,213,.9))!important;
			                    color:#c2410c!important;
			                }
			                .nsx-hot-badge::before{
			                    background:linear-gradient(180deg,#fb923c 0%,#f97316 58%,#c2410c 100%)
			                }
			                .nsx-hot-badge[data-nsx-corner-label]{
			                    min-width:27px!important;
			                    padding:0 6px 0 8px!important;
			                    font-size:0!important
			                }
			                .nsx-hot-badge[data-nsx-corner-label]::after{
			                    content:attr(data-nsx-corner-label);
			                    position:relative;
			                    z-index:1;
			                    font-size:9px;
			                    font-weight:820;
			                    letter-spacing:.25px;
			                    line-height:1
			                }
			                .nsx-pin-badge{
			                    border:1px solid rgba(37,99,235,.34)!important;
			                    background:linear-gradient(180deg,rgba(239,246,255,.98),rgba(219,234,254,.88))!important;
			                    color:#1d4ed8!important;
			                }
			                .nsx-pin-badge::before{
			                    background:linear-gradient(180deg,#60a5fa 0%,#2563eb 58%,#1d4ed8 100%)
			                }
			                svg.nsx-pin-badge{
			                    width:clamp(16px,4.2vw,18px)!important;
			                    height:clamp(13px,3.4vw,14px)!important;
			                    min-width:clamp(16px,4.2vw,18px)!important;
			                    padding:0 3px!important
			                }
			                svg.nsx-pin-badge use{fill:currentColor!important;stroke:currentColor!important}
			                .dark-layout .nsx-hot-badge,html.dark .nsx-hot-badge{
			                    border-color:rgba(251,146,60,.5)!important;
			                    background:linear-gradient(180deg,rgba(67,35,20,.94),rgba(58,31,19,.86))!important;
			                    color:#fdba74!important
			                }
			                .dark-layout .nsx-pin-badge,html.dark .nsx-pin-badge{
			                    border-color:rgba(96,165,250,.44)!important;
			                    background:linear-gradient(180deg,rgba(30,64,175,.32),rgba(30,58,138,.24))!important;
			                    color:#bfdbfe!important
			                }
			                .dark-layout svg.nsx-pin-badge use,html.dark svg.nsx-pin-badge use{fill:currentColor!important;stroke:currentColor!important}
			                .nsk-content-meta-info .floor-link-wrapper{
			                    display:inline-flex!important;
			                    align-items:center!important;
			                    justify-content:flex-end!important;
			                    gap:2px!important;
			                    min-width:max-content!important
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a[href^="#"],.nsk-content-meta-info .floor-link-wrapper > a.floor-link{
			                    position:relative!important;
			                    display:inline-flex!important;
			                    align-items:center!important;
			                    justify-content:center!important;
			                    line-height:1!important;
			                    overflow:visible!important
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused{
			                    padding:1px 4px!important;
			                    border-radius:999px!important;
			                    border:1px solid rgba(148,163,184,.28)!important;
			                    background:linear-gradient(180deg,rgba(248,250,252,.96),rgba(241,245,249,.88))!important;
			                    color:#334155!important;
			                    box-shadow:0 1px 3px rgba(15,23,42,.12)!important
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused::before,.nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused::after{
			                    position:absolute;
			                    z-index:2;
			                    font-size:9px;
			                    line-height:1;
			                    pointer-events:none;
			                    text-shadow:0 1px 2px rgba(15,23,42,.26)
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-hot{
			                    border-color:rgba(251,146,60,.4)!important;
			                    background:linear-gradient(180deg,rgba(255,247,237,.98),rgba(255,237,213,.9))!important;
			                    color:#c2410c!important
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-hot::after{
			                    content:"🔥";
			                    right:-7px;
			                    top:-7px
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-pin{
			                    border-color:rgba(96,165,250,.42)!important;
			                    background:linear-gradient(180deg,rgba(239,246,255,.98),rgba(219,234,254,.88))!important;
			                    color:#1d4ed8!important
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-pin::after{
			                    content:"📌";
			                    right:-7px;
			                    top:-7px
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-both{
			                    border-color:rgba(167,139,250,.45)!important;
			                    background:linear-gradient(180deg,rgba(245,243,255,.98),rgba(237,233,254,.88))!important;
			                    color:#6d28d9!important
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-both::before{
			                    content:"📌";
			                    right:-8px;
			                    top:4px
			                }
			                .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-both::after{
			                    content:"🔥";
			                    right:-8px;
			                    top:-8px
			                }
			                .dark-layout .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused,html.dark .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused{
			                    border-color:rgba(148,163,184,.34)!important;
			                    background:linear-gradient(180deg,rgba(30,41,59,.92),rgba(15,23,42,.86))!important;
			                    color:#cbd5e1!important
			                }
			                .dark-layout .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-hot,html.dark .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-hot{
			                    border-color:rgba(251,146,60,.48)!important;
			                    background:linear-gradient(180deg,rgba(67,35,20,.94),rgba(58,31,19,.86))!important;
			                    color:#fdba74!important
			                }
			                .dark-layout .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-pin,html.dark .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-pin{
			                    border-color:rgba(96,165,250,.5)!important;
			                    background:linear-gradient(180deg,rgba(30,64,175,.34),rgba(30,58,138,.24))!important;
			                    color:#bfdbfe!important
			                }
			                .dark-layout .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-both,html.dark .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-both{
			                    border-color:rgba(196,181,253,.5)!important;
			                    background:linear-gradient(180deg,rgba(55,48,163,.34),rgba(76,29,149,.24))!important;
			                    color:#ddd6fe!important
			                }
			                @media (max-width:768px){
			                    .nsx-corner-badge{
			                        min-height:13px!important;
			                        height:13px!important;
			                        line-height:13px!important;
			                        padding:0 4px!important;
			                        font-size:9px!important
			                    }
			                    .nsx-hot-badge[data-nsx-corner-label]{
			                        min-width:24px!important;
			                        padding:0 5px 0 7px!important
			                    }
			                    .nsx-hot-badge[data-nsx-corner-label]::after{font-size:8.5px}
			                    svg.nsx-pin-badge{
			                        width:clamp(15px,4.4vw,16px)!important;
			                        height:clamp(12px,3.6vw,13px)!important;
			                        min-width:clamp(15px,4.4vw,16px)!important;
			                        padding:0 2px!important
			                    }
			                    .nsk-content-meta-info .floor-link-wrapper{gap:1px!important}
			                    .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused{padding:0 3px!important}
			                    .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused::before,.nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused::after{font-size:8px}
			                    .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-hot::after,.nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-pin::after{right:-6px;top:-6px}
			                    .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-both::before{right:-7px;top:3px}
			                    .nsk-content-meta-info .floor-link-wrapper > a.nsx-floor-fused-both::after{right:-7px;top:-7px}
			                }
			            `);

			            const detectCornerBadgesInHost = (host) => {
			                const badges = [];
			                if (!host || host.nodeType !== 1) return badges;

		                const seen = new Set();
		                const push = (el, type) => {
		                    if (!el || el.nodeType !== 1) return;
		                    // 角标检测仅针对“楼层容器外部”的原始角标，避免把融合后的楼层链接本体误判为角标
		                    if (el.closest?.(".floor-link-wrapper")) return;
		                    if (seen.has(el)) return;
		                    if (type !== "hot" && type !== "pin") return;
		                    seen.add(el);
		                    badges.push({ el, type });
		                };

		                // 先收集已标记的角标，避免重复扫描导致“找不到角标”而误恢复 padding
		                try {
		                    host.querySelectorAll?.("[data-nsx-corner-badge]")?.forEach?.(el => {
		                        const type = el?.dataset?.nsxCornerBadge;
		                        if (type) push(el, type);
		                    });
		                } catch { }

		                // HOT：按文本精确匹配（避免误伤正文中的 “hot”）
		                try {
		                    host.querySelectorAll?.("span,div,a,i,em,strong,b")?.forEach?.(el => {
		                        if (!el || el.nodeType !== 1) return;
		                        if (el.dataset?.nsxCornerBadge) return;
		                        if (el.classList?.contains?.("floor-link-wrapper")) return;
		                        const t = String(el.textContent || "").trim();
		                        const title = el.getAttribute?.("title") || "";
		                        const aria = el.getAttribute?.("aria-label") || "";
		                        const id = el.id || "";
		                        const cls = el.className || "";
		                        const clsHasHot = /(^|[\s_-])hot([\s_-]|$)/i.test(String(cls));
		                        const idHasHot = /(^|[\s_-])hot([\s_-]|$)/i.test(String(id));
		                        const attrHasHot = /\bhot\b/i.test(String(title)) || /\bhot\b/i.test(String(aria));
		                        const txtIsHot = t && t.length <= 8 && t.toUpperCase() === "HOT";

		                        if (!(txtIsHot || clsHasHot || idHasHot || attrHasHot)) return;
		                        // 避免把整块容器误判成角标（仅处理较小的徽章节点）
		                        try {
		                            const r = el.getBoundingClientRect?.();
		                            if (r && (r.width > 240 || r.height > 120)) return;
		                        } catch { }
		                        push(el, "hot");
		                    });
		                } catch { }

		                // 置顶/图钉：按文本/属性/类名兜底识别
		                const isPinKw = (s) => {
		                    const v = String(s || "").trim();
		                    if (!v) return false;
		                    const t = v.replace(/\s+/g, "");
		                    if (t === "置顶" || t === "图钉") return true;
		                    const up = t.toUpperCase();
		                    if (up === "PIN" || up === "PINNED" || up === "TOP" || up === "STICKY") return true;
		                    return false;
		                };

		                const clsHasPinToken = (cls) => {
		                    const c = String(cls || "");
		                    return /(^|[\s_-])(pin|pinned|sticky|top)([\s_-]|$)/i.test(c);
		                };

		                try {
		                    host.querySelectorAll?.("span,div,a,i,em,strong,b,svg")?.forEach?.(el => {
		                        if (!el || el.nodeType !== 1) return;
		                        if (el.dataset?.nsxCornerBadge) return;
		                        if (el.classList?.contains?.("floor-link-wrapper")) return;
		                        const txt = String(el.textContent || "").trim();
		                        const title = el.getAttribute?.("title") || "";
		                        const aria = el.getAttribute?.("aria-label") || "";
		                        const cls = el.className || "";
		                        if (!(isPinKw(txt) || isPinKw(title) || isPinKw(aria) || clsHasPinToken(cls))) return;

		                        // 避免把整块容器误判成“置顶标签”（仅处理较小的徽章节点）
		                        try {
		                            const r = el.getBoundingClientRect?.();
		                            if (r && (r.width > 240 || r.height > 120)) return;
		                        } catch { }

		                        push(el, "pin");
		                    });
		                } catch { }

		                // SVG 图标兜底：<use href="#pin"> / <use xlink:href="#pin">
		                try {
		                    host.querySelectorAll?.("use")?.forEach?.(use => {
		                        const href = use?.getAttribute?.("href") || use?.getAttribute?.("xlink:href") || "";
		                        if (!href) return;
		                        if (!/(^|#)(pin|pinned|sticky|top)\b/i.test(href)) return;
		                        const svg = use.closest?.("svg") || use.parentElement;
		                        const el = svg?.closest?.(".pined-comment-badge,.pin-badge,[class*=\"pin\" i]") || svg;
		                        if (!el || el.nodeType !== 1) return;
		                        if (el.classList?.contains?.("floor-link-wrapper")) return;
		                        if (el.dataset?.nsxCornerBadge) return;
		                        push(el, "pin");
		                    });
		                } catch { }

			                return badges;
			            };

		            const FUSED_FLOOR_CLASSES = ["nsx-floor-fused", "nsx-floor-fused-hot", "nsx-floor-fused-pin", "nsx-floor-fused-both"];
		            const getFloorLinkInHost = (host) => {
		                if (!host || host.nodeType !== 1) return null;
		                const floorWrap = host.querySelector?.(".floor-link-wrapper");
		                if (!floorWrap || floorWrap.nodeType !== 1) return null;
		                let link = floorWrap.querySelector?.("a.floor-link,a[href^=\"#\"]");
		                if (link) return link;
		                try {
		                    const links = Array.from(floorWrap.querySelectorAll?.("a[href]") || []);
		                    link = links.find((a) => /^#\d+$/.test(String(a.textContent || "").trim()) || /^#\d*$/.test(String(a.getAttribute?.("href") || "").trim())) || null;
		                } catch { link = null; }
		                return link;
		            };

		            const restoreHiddenCornerBadgesInHost = (host) => {
		                if (!host || host.nodeType !== 1) return;
		                try {
		                    host.querySelectorAll?.("[data-nsx-corner-hidden-by-fused='1']")?.forEach?.((el) => {
		                        if (!el || el.nodeType !== 1) return;
		                        try {
		                            const display0 = String(el.dataset?.nsxCornerDisplay0 || "");
		                            const displayPriority0 = String(el.dataset?.nsxCornerDisplayPriority0 || "");
		                            if (display0) {
		                                el.style.setProperty("display", display0, displayPriority0 === "important" ? "important" : "");
		                            } else {
		                                el.style.removeProperty("display");
		                            }
		                            delete el.dataset.nsxCornerDisplay0;
		                            delete el.dataset.nsxCornerDisplayPriority0;
		                            delete el.dataset.nsxCornerHiddenByFused;
		                        } catch { }
		                    });
		                } catch { }
		            };

		            const clearFloorCornerFusionState = (host) => {
		                if (!host || host.nodeType !== 1) return;
		                const link = getFloorLinkInHost(host);
		                if (link) {
		                    try { link.classList.remove(...FUSED_FLOOR_CLASSES); } catch { }
		                }
		                restoreHiddenCornerBadgesInHost(host);
		            };

		            const applyFloorCornerFusionState = (host, badges) => {
		                if (!host || host.nodeType !== 1) return false;
		                const link = getFloorLinkInHost(host);
		                if (!link) return false;

		                const hasHot = (badges || []).some((x) => x?.type === "hot");
		                const hasPin = (badges || []).some((x) => x?.type === "pin");
		                const stateCls = hasHot && hasPin
		                    ? "nsx-floor-fused-both"
		                    : (hasHot ? "nsx-floor-fused-hot" : (hasPin ? "nsx-floor-fused-pin" : ""));
		                if (!stateCls) {
		                    clearFloorCornerFusionState(host);
		                    return true;
		                }

		                clearFloorCornerFusionState(host);
		                try { link.classList.add("nsx-floor-fused", stateCls); } catch { }
		                (badges || []).forEach(({ el }) => {
		                    if (!el || el.nodeType !== 1) return;
		                    // 保护：绝不隐藏楼层链接本体及其子节点
		                    if (el === link || link.contains?.(el)) return;
		                    // 融合模式下隐藏原角标节点，避免额外占位
		                    try {
		                        if (el.dataset?.nsxCornerHiddenByFused !== "1") {
		                            el.dataset.nsxCornerDisplay0 = el.style.getPropertyValue("display") || "";
		                            el.dataset.nsxCornerDisplayPriority0 = el.style.getPropertyPriority("display") || "";
		                        }
		                        el.style.setProperty("display", "none", "important");
		                        el.dataset.nsxCornerHiddenByFused = "1";
		                    } catch { }
		                });
		                return true;
		            };

		            const clearCornerBadgeSafePadding = (host) => {
		                if (!host || host.nodeType !== 1) return;
		                if (host.dataset?.nsxCornerPadR0 !== undefined) {
		                    try { host.style.paddingRight = host.dataset.nsxCornerPadR0 || ""; } catch { }
		                    try { delete host.dataset.nsxCornerPadR0; } catch { }
		                }
		                try { host.classList.remove("nsx-has-corner-badge"); } catch { }
		            };

		            const applyCornerBadgeSafePadding = (host) => {
		                if (!host || host.nodeType !== 1) return;
		                restoreHiddenCornerBadgesInHost(host);

		                const found = detectCornerBadgesInHost(host);
		                if (!found.length) {
		                    clearCornerBadgeSafePadding(host);
		                    clearFloorCornerFusionState(host);
		                    return;
		                }

		                // 标记角标：用于避免重复识别，并可作为后续样式/调试锚点
		                found.forEach(({ el, type }) => {
		                    if (!el || el.nodeType !== 1) return;
		                    try { el.dataset.nsxCornerBadge = type; } catch { }
		                    if (type === "hot") {
		                        const text = String(el.textContent || "").trim();
		                        if (!text) {
		                            try { el.dataset.nsxCornerLabel = "HOT"; } catch { }
		                        } else {
		                            try { delete el.dataset.nsxCornerLabel; } catch { }
		                        }
		                    } else {
		                        try { delete el.dataset.nsxCornerLabel; } catch { }
		                    }
		                    try { el.classList.add("nsx-corner-badge", type === "hot" ? "nsx-hot-badge" : "nsx-pin-badge"); } catch { }
		                });

		                // 目标行为：融合到楼层号本体（不额外占位）
		                if (applyFloorCornerFusionState(host, found)) {
		                    clearCornerBadgeSafePadding(host);
		                    return;
		                }

		                // 计算右侧安全间距：取角标最大宽度 + 额外边距，避免遮挡作者行/统计信息
		                const measureAndApply = () => {
		                    try {
		                        let maxW = 0;
		                        let minLeft = Number.POSITIVE_INFINITY;
		                        const hostRect = host.getBoundingClientRect?.();
		                        found.forEach(({ el }) => {
		                            const r = el?.getBoundingClientRect?.();
		                            const w = r?.width || 0;
		                            if (w > maxW) maxW = w;
		                            if (r && Number.isFinite(r.left) && r.left < minLeft) minLeft = r.left;
		                        });
		                        if (!(maxW > 0)) return;

		                        const cs = getComputedStyle(host);
		                        const base = parseFloat(cs?.paddingRight || "0") || 0;
		                        // 多角标并存时按“整体占用宽度”计算安全区，避免仅取单个角标宽度导致遮挡
		                        const occupied = (hostRect && Number.isFinite(minLeft))
		                            ? Math.max(maxW, Math.round((hostRect.right - minLeft) + 10))
		                            : Math.round(maxW + 16);
		                        const safe = Math.min(160, Math.max(52, occupied));
		                        const next = Math.max(base, safe);

		                        if (host.dataset?.nsxCornerPadR0 === undefined) {
		                            host.dataset.nsxCornerPadR0 = host.style.paddingRight || "";
		                        }
		                        host.style.paddingRight = `${next}px`;
		                        host.classList.add("nsx-has-corner-badge");
		                    } catch { }
		                };

		                // 两帧后测量，兼容字体/图片加载导致的尺寸变化；并延迟再测一次兜底
		                try { requestAnimationFrame(() => requestAnimationFrame(measureAndApply)); } catch { setTimeout(measureAndApply, 0); }
		                try { setTimeout(measureAndApply, 120); } catch { }
		            };

		            const cornerBadgeHostSel = ".post-list-item, .post-list .list-item, .nsk-content-meta-info";
		            const processCornerBadgeHosts = (els) => (els || []).forEach(el => {
		                if (!el || el.nodeType !== 1) return;
		                applyCornerBadgeSafePadding(el);
		            });
		            try { processCornerBadgeHosts($$(cornerBadgeHostSel)); } catch { }
		            try { ctx.watch(cornerBadgeHostSel, (els) => processCornerBadgeHosts(els), { debounce: 160 }); } catch { }
		            // 悬浮入口（小白点）：
		            // - 作为全端统一设置入口（移动端 + PC）
		            // - 点击弹出二级菜单（设置/关系/历史/过滤）
		            // - 可拖动并记住位置；松手后吸附左右边缘
		            try { window.addEventListener("resize", debounce(() => { try { processCornerBadgeHosts($$(cornerBadgeHostSel)); } catch { } }, 180), { passive: true }); } catch { }

		            const FLOAT_TRIGGER_ID = "nsx-float-trigger";
		            const FLOAT_TRIGGER_POS_KEY = "nsx_float_trigger_pos_v1";
		            const FLOAT_MENU_ID = "nsx-float-menu";
		            const FLOAT_TRIGGER_SIZE = 44;
		            const FLOAT_TRIGGER_MARGIN = 10;
		            const FLOAT_TRIGGER_IDLE_DELAY = 800;
		            const FLOAT_TRIGGER_IDLE_SCALE = 0.78;
		            const FLOAT_TRIGGER_IDLE_SHIFT = 46;

		            // 读取视口尺寸（兼容部分 WebView 的 innerWidth/innerHeight 异常）
		            const getViewportSize = () => {
		                const docW = document.documentElement?.clientWidth || 0;
		                const docH = document.documentElement?.clientHeight || 0;
		                const innerW = window.innerWidth || 0;
		                const innerH = window.innerHeight || 0;
		                const vvW = window.visualViewport?.width || 0;
		                const vvH = window.visualViewport?.height || 0;
		                return {
		                    w: Math.max(docW, innerW, vvW),
		                    h: Math.max(docH, innerH, vvH)
		                };
		            };

		            // 读写悬浮按钮位置（优先 GM_*，避免与站点 localStorage 冲突）
		            const readFloatTriggerPos = () => {
		                try { return GM_getValue(FLOAT_TRIGGER_POS_KEY, null); } catch { return null; }
		            };

		            const saveFloatTriggerPos = (pos) => {
		                try { GM_setValue(FLOAT_TRIGGER_POS_KEY, pos); } catch { }
		            };

	            const parseFloatTriggerPos = (raw) => {
	                if (!raw) return null;
	                if (typeof raw === "object") return raw;
	                if (typeof raw === "string") {
	                    try { return JSON.parse(raw); } catch { return null; }
	                }
		                return null;
		            };

		            // 位置约束：避免拖出屏幕外
		            const clampFloatTriggerPos = (pos) => {
		                const { w, h } = getViewportSize();
		                const size = FLOAT_TRIGGER_SIZE;
		                const margin = FLOAT_TRIGGER_MARGIN;
	                const maxX = Math.max(margin, w - size - margin);
	                const maxY = Math.max(margin, h - size - margin);
	                const x = Math.min(Math.max(margin, Number(pos?.x) || 0), maxX);
	                const y = Math.min(Math.max(margin, Number(pos?.y) || 0), maxY);
		                return { x, y };
		            };

		            // 吸附左右边缘（更符合小白点体验）
		            const snapFloatTriggerPos = (pos) => {
		                const { w } = getViewportSize();
		                const size = FLOAT_TRIGGER_SIZE;
		                const margin = FLOAT_TRIGGER_MARGIN;
	                const center = (Number(pos?.x) || 0) + size / 2;
	                const x = center < (w / 2) ? margin : Math.max(margin, w - size - margin);
		                return { x, y: Number(pos?.y) || margin };
		            };

		            // 应用位置（left/top）
		            const applyFloatTriggerPos = (btn, pos) => {
		                if (!btn) return;
		                btn.style.left = `${Math.round(pos.x)}px`;
		                btn.style.top = `${Math.round(pos.y)}px`;
		                const { w } = getViewportSize();
		                const center = (Number(pos?.x) || 0) + (FLOAT_TRIGGER_SIZE / 2);
		                btn.dataset.edge = center < (w / 2) ? "left" : "right";
		            };

		            const clearFloatTriggerIdle = (btn) => {
		                if (!btn) return;
		                try { clearTimeout(btn.__nsxIdleTimer); } catch { }
		                try { btn.classList.remove("is-idle"); } catch { }
		            };

		            const scheduleFloatTriggerIdle = (btn, delay = FLOAT_TRIGGER_IDLE_DELAY) => {
		                if (!btn) return;
		                try { clearTimeout(btn.__nsxIdleTimer); } catch { }
		                btn.__nsxIdleTimer = setTimeout(() => {
		                    try {
		                        if (btn.classList.contains("is-dragging")) return;
		                        if (isFloatMenuOpen()) return;
		                        btn.classList.add("is-idle");
		                    } catch { }
		                }, Math.max(300, Number(delay) || FLOAT_TRIGGER_IDLE_DELAY));
		            };

		            // 悬浮按钮样式（含深色模式）
		            const ensureFloatTriggerStyle = () => addStyle("nsx-float-trigger-style", `
		                #${FLOAT_TRIGGER_ID}{
		                    position:fixed;
		                    width:${FLOAT_TRIGGER_SIZE}px;
	                    height:${FLOAT_TRIGGER_SIZE}px;
	                    border-radius:15px;
	                    background:rgba(248,250,252,.94);
	                    border:1px solid rgba(15,23,42,.1);
		                    box-shadow:0 3px 8px rgba(15,23,42,.12);
	                    z-index:100000;
	                    display:flex;
	                    align-items:center;
	                    justify-content:center;
	                    color:#1d4ed8;
	                    user-select:none;
	                    -webkit-user-select:none;
	                    touch-action:none;
	                    cursor:pointer;
	                    opacity:.95;
	                    -webkit-tap-highlight-color:transparent;
	                    overflow:hidden;
	                    transition:transform .24s cubic-bezier(.2,.7,.2,1), opacity .2s ease, border-color .2s ease, background .2s ease, filter .2s ease;
	                }
	                #${FLOAT_TRIGGER_ID}::before{
	                    display:none;
	                }
	                #${FLOAT_TRIGGER_ID}:not(.is-idle):active{transform:scale(.97);opacity:.98}
	                #${FLOAT_TRIGGER_ID}.is-idle{
	                    opacity:.84;
		                    box-shadow:0 2px 6px rgba(15,23,42,.1);
	                    filter:saturate(.9);
	                }
	                #${FLOAT_TRIGGER_ID}.is-idle[data-edge="right"]{transform:translateX(${FLOAT_TRIGGER_IDLE_SHIFT}%) scale(${FLOAT_TRIGGER_IDLE_SCALE})}
	                #${FLOAT_TRIGGER_ID}.is-idle[data-edge="left"]{transform:translateX(-${FLOAT_TRIGGER_IDLE_SHIFT}%) scale(${FLOAT_TRIGGER_IDLE_SCALE})}
	                #${FLOAT_TRIGGER_ID} svg{position:relative;z-index:1;width:clamp(18px,4.8vw,20px);height:clamp(18px,4.8vw,20px);display:block;stroke:currentColor;fill:none;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round}
	                #${FLOAT_TRIGGER_ID}.is-init{transition:none!important}
	                #${FLOAT_TRIGGER_ID}.is-dragging{transition:none!important}
	                body.dark-layout #${FLOAT_TRIGGER_ID},html.dark #${FLOAT_TRIGGER_ID}{
	                    background:rgba(15,23,42,.86);
	                    border-color:rgba(148,163,184,.22);
		                    box-shadow:0 4px 10px rgba(2,6,23,.24);
	                    color:#bfdbfe;
	                    opacity:.92;
	                }
	                body.dark-layout #${FLOAT_TRIGGER_ID}::before,html.dark #${FLOAT_TRIGGER_ID}::before{
	                    display:none;
	                }
		            `);

		            // 二级菜单样式（含深色模式）
			            const ensureFloatMenuStyle = () => addStyle("nsx-float-menu-style", `
			                #${FLOAT_MENU_ID}{
		                    position:fixed;
		                    left:${FLOAT_TRIGGER_MARGIN}px;
		                    top:${FLOAT_TRIGGER_MARGIN}px;
		                    z-index:100001;
		                    display:grid;
		                    grid-template-columns:repeat(2, minmax(0,1fr));
			                    gap:9px;
			                    padding:12px;
			                    border-radius:18px;
				                    background:rgba(248,250,252,.94);
			                    color:#334155;
				                    border:1px solid rgba(15,23,42,.08);
				                    box-shadow:0 4px 12px rgba(15,23,42,.12);
		                    overflow:hidden;
		                    opacity:0;
		                    transform:scale(.94);
		                    transform-origin:100% 50%;
		                    visibility:hidden;
		                    pointer-events:none;
		                    transition:opacity .14s ease, transform .14s ease, visibility 0s linear .14s;
		                }
			                #${FLOAT_MENU_ID}::before{display:none}
		                #${FLOAT_MENU_ID}.show{
		                    opacity:1;
		                    transform:scale(1);
		                    visibility:visible;
		                    pointer-events:auto;
		                    transition:opacity .14s ease, transform .14s ease;
		                }
			                #${FLOAT_MENU_ID} .nsx-fm-btn{
			                    height:50px;
			                    border-radius:13px;
			                    border:1px solid rgba(15,23,42,.08);
			                    background:rgba(255,255,255,.76);
		                    display:flex;
		                    flex-direction:row;
		                    align-items:center;
		                    justify-content:flex-start;
		                    gap:8px;
		                    color:inherit;
		                    cursor:pointer;
		                    padding:0 10px;
		                    line-height:1.1;
		                    -webkit-tap-highlight-color:transparent;
			                    box-shadow:none;
			                    transition:background .16s ease,border-color .16s ease;
			                }
			                #${FLOAT_MENU_ID} .nsx-fm-btn:hover{background:rgba(241,245,249,.92)}
			                #${FLOAT_MENU_ID} .nsx-fm-btn:active{transform:scale(.99);opacity:.96}
		                #${FLOAT_MENU_ID} .nsx-fm-i{
		                    width:clamp(20px,5vw,22px);
		                    height:clamp(20px,5vw,22px);
		                    border-radius:8px;
		                    display:inline-flex;
		                    align-items:center;
			                    justify-content:center;
			                    border:none;
				                    background:rgba(239,246,255,.92);
			                    color:#1d4ed8;
			                    box-shadow:none;
			                    flex:0 0 auto;
			                }
		                #${FLOAT_MENU_ID} .nsx-fm-i svg{width:clamp(12px,3.4vw,14px);height:clamp(12px,3.4vw,14px);display:block;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
		                #${FLOAT_MENU_ID} .nsx-fm-t{font-size:12px;font-weight:760;white-space:nowrap;letter-spacing:.1px}
			                #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="settings"] .nsx-fm-i{background:rgba(219,234,254,.9);color:#1d4ed8}
			                #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="relation"] .nsx-fm-i{background:rgba(224,242,254,.9);color:#0369a1}
			                #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="history"] .nsx-fm-i{background:rgba(209,250,229,.9);color:#047857}
			                #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="filter"] .nsx-fm-i{background:rgba(255,228,230,.92);color:#be123c}
			                #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="editor_diag"] .nsx-fm-i{background:rgba(255,237,213,.92);color:#c2410c}
	                body.dark-layout #${FLOAT_MENU_ID},html.dark #${FLOAT_MENU_ID}{
	                    background:rgba(15,23,42,.9);
	                    border:1px solid rgba(148,163,184,.2);
		                    box-shadow:0 6px 14px rgba(2,6,23,.3);
	                    color:#e2e8f0;
	                }
	                body.dark-layout #${FLOAT_MENU_ID}::before,html.dark #${FLOAT_MENU_ID}::before{display:none}
	                body.dark-layout #${FLOAT_MENU_ID} .nsx-fm-btn,html.dark #${FLOAT_MENU_ID} .nsx-fm-btn{
	                    border-color:rgba(148,163,184,.2);
	                    background:rgba(15,23,42,.64);
	                    box-shadow:none;
	                }
	                body.dark-layout #${FLOAT_MENU_ID} .nsx-fm-btn:hover,html.dark #${FLOAT_MENU_ID} .nsx-fm-btn:hover{background:rgba(15,23,42,.76)}
		                body.dark-layout #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="settings"] .nsx-fm-i,html.dark #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="settings"] .nsx-fm-i{background:rgba(30,64,175,.28);color:#bfdbfe;box-shadow:none}
		                body.dark-layout #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="relation"] .nsx-fm-i,html.dark #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="relation"] .nsx-fm-i{background:rgba(3,105,161,.28);color:#7dd3fc;box-shadow:none}
		                body.dark-layout #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="history"] .nsx-fm-i,html.dark #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="history"] .nsx-fm-i{background:rgba(4,120,87,.26);color:#86efac;box-shadow:none}
		                body.dark-layout #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="filter"] .nsx-fm-i,html.dark #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="filter"] .nsx-fm-i{background:rgba(159,18,57,.3);color:#fda4af;box-shadow:none}
		                body.dark-layout #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="editor_diag"] .nsx-fm-i,html.dark #${FLOAT_MENU_ID} .nsx-fm-btn[data-a="editor_diag"] .nsx-fm-i{background:rgba(194,65,12,.28);color:#fdba74;box-shadow:none}
			            `);

		            // 创建并绑定二级菜单（设置/关系/历史/过滤/诊断）
		            const ensureFloatMenu = () => {
		                ensureFloatMenuStyle();
		                const showLayoutDiagEntry = isLayoutDiagEnabled();
		                let menu = document.getElementById(FLOAT_MENU_ID);
		                const hasDiagEntry = !!menu?.querySelector?.("button[data-a='editor_diag']");
		                if (menu && hasDiagEntry !== showLayoutDiagEntry) {
		                    try { menu.remove(); } catch { }
		                    menu = null;
		                }
		                if (!menu) {
		                    menu = document.createElement("div");
		                    menu.id = FLOAT_MENU_ID;
		                    menu.innerHTML = `
		                        <button type="button" class="nsx-fm-btn" data-a="settings"><span class="nsx-fm-i" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path><path d="M5 5l2.2 2.2"></path><path d="M16.8 16.8L19 19"></path><path d="M5 19l2.2-2.2"></path><path d="M16.8 7.2L19 5"></path></svg></span><span class="nsx-fm-t">设置</span></button>
		                        <button type="button" class="nsx-fm-btn" data-a="relation"><span class="nsx-fm-i" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3"></circle><circle cx="16" cy="11" r="3"></circle><path d="M3 19c.8-2.6 2.5-4 5-4"></path><path d="M10.5 19c.8-2.3 2.7-3.6 5.5-3.6"></path></svg></span><span class="nsx-fm-t">关系</span></button>
		                        <button type="button" class="nsx-fm-btn" data-a="history"><span class="nsx-fm-i" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg></span><span class="nsx-fm-t">历史</span></button>
		                        <button type="button" class="nsx-fm-btn" data-a="filter"><span class="nsx-fm-i" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5z"></path></svg></span><span class="nsx-fm-t">过滤</span></button>
		                        ${showLayoutDiagEntry ? '<button type="button" class="nsx-fm-btn" data-a="editor_diag"><span class="nsx-fm-i" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 3h6"></path><path d="M10 3v5l-4.8 8.2A2 2 0 0 0 7 19h10a2 2 0 0 0 1.7-3L14 8V3"></path><path d="M9.5 13h5"></path></svg></span><span class="nsx-fm-t">布局诊断</span></button>' : ""}
		                    `.trim();
		                    document.body.appendChild(menu);

		                    const openLater = (fn) => {
		                        try { setTimeout(() => { try { fn?.(); } catch { } }, 0); } catch { try { fn?.(); } catch { } }
		                    };

		                    menu.addEventListener("click", ev => {
		                        const b = ev.target.closest?.("button[data-a]");
		                        if (!b) return;
		                        ev.preventDefault();
		                        ev.stopPropagation();
		                        const act = b.dataset.a;
		                        closeFloatMenu();
		                        if (act === "editor_diag") return triggerEditorDiag();
		                        openLater(() => {
		                            if (act === "settings") return advSettings();
		                            if (act === "history") {
		                                try { if (window.__nsxPanelCtrl?.history?.open) return window.__nsxPanelCtrl.history.open(); } catch { }
		                                try { return document.querySelector("#nsx-icon-group .history-dropdown-on")?.click(); } catch { }
		                                return;
		                            }
		                            if (act === "relation") {
		                                try { return document.querySelector("#nsx-icon-group .relation-dropdown-on")?.click(); } catch { }
		                                return;
		                            }
		                            if (act === "filter") {
		                                try { return document.querySelector("#nsx-icon-group .filter-dropdown-on")?.click(); } catch { }
		                                return;
		                            }
		                        });
		                    }, { capture: true });

		                    const onOutside = (ev) => {
		                        if (!menu.classList.contains("show")) return;
		                        const btn = document.getElementById(FLOAT_TRIGGER_ID);
		                        const t = ev.target;
		                        if (menu.contains(t) || btn?.contains(t)) return;
		                        closeFloatMenu();
		                    };
		                    document.addEventListener("pointerdown", onOutside, true);
		                    document.addEventListener("touchstart", onOutside, true);
		                    document.addEventListener("mousedown", onOutside, true);
		                    window.addEventListener("scroll", () => { try { closeFloatMenu(); } catch { } }, { passive: true });
		                    window.addEventListener("resize", () => { try { closeFloatMenu(); } catch { } }, { passive: true });
		                }
		                return menu;
		            };

		            // 二级菜单定位：根据按钮位置自动向左/右展开，并 clamp 在可视区域内
		            const positionFloatMenu = () => {
		                const btn = document.getElementById(FLOAT_TRIGGER_ID);
		                if (!btn) return false;
		                const menu = ensureFloatMenu();
		                const br = btn.getBoundingClientRect();
		                const mr = menu.getBoundingClientRect();
		                const { w, h } = getViewportSize();
		                const gap = 10;
		                const preferLeft = (br.left + br.width / 2) > (w / 2);
		                let left = preferLeft ? (br.left - gap - mr.width) : (br.right + gap);
		                let top = br.top + br.height / 2 - mr.height / 2;
		                left = Math.min(Math.max(FLOAT_TRIGGER_MARGIN, left), Math.max(FLOAT_TRIGGER_MARGIN, w - mr.width - FLOAT_TRIGGER_MARGIN));
		                top = Math.min(Math.max(FLOAT_TRIGGER_MARGIN, top), Math.max(FLOAT_TRIGGER_MARGIN, h - mr.height - FLOAT_TRIGGER_MARGIN));
		                menu.style.left = `${Math.round(left)}px`;
		                menu.style.top = `${Math.round(top)}px`;
		                menu.style.transformOrigin = preferLeft ? "100% 50%" : "0% 50%";
		                return true;
		            };

		            const isFloatMenuOpen = () => {
		                const menu = document.getElementById(FLOAT_MENU_ID);
		                return !!menu?.classList?.contains("show");
		            };

		            // 收起二级菜单
		            const closeFloatMenu = () => {
		                const menu = document.getElementById(FLOAT_MENU_ID);
		                if (!menu) return false;
		                menu.classList.remove("show");
		                const btn = document.getElementById(FLOAT_TRIGGER_ID);
		                if (btn) scheduleFloatTriggerIdle(btn, 600);
		                return true;
		            };

		            // 打开二级菜单
		            const openFloatMenu = () => {
		                if (!positionFloatMenu()) return false;
		                const menu = ensureFloatMenu();
		                menu.classList.add("show");
		                const btn = document.getElementById(FLOAT_TRIGGER_ID);
		                if (btn) clearFloatTriggerIdle(btn);
		                return true;
		            };

		            // 切换二级菜单显示状态
		            const toggleFloatMenu = () => {
		                if (isFloatMenuOpen()) return closeFloatMenu();
		                return openFloatMenu();
		            };

		            // 挂载悬浮入口：全端显示（不删除，避免重复绑定/泄漏）
		            const mountFloatTrigger = () => {
		                const existing = document.getElementById(FLOAT_TRIGGER_ID);
	                ensureFloatTriggerStyle();

	                let btn = existing;
	                if (!btn) {
	                    btn = document.createElement("div");
	                    btn.id = FLOAT_TRIGGER_ID;
	                    btn.title = "Nodeseek Pro";
	                    btn.setAttribute("aria-label", "Nodeseek Pro");
	                    btn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle><path d="M12 5v14"></path><path d="M5 12h14"></path><circle cx="12" cy="12" r="2"></circle></svg>`;
	                    document.body.appendChild(btn);
	                }
	                if (!btn.dataset.nsxFloatInitDone) {
	                    btn.dataset.nsxFloatInitDone = "1";
	                    btn.classList.add("is-init");
	                    if (!isFloatMenuOpen()) btn.classList.add("is-idle");
	                }

	                const rawPos = parseFloatTriggerPos(readFloatTriggerPos());
	                const defaultPos = (() => {
	                    const { w, h } = getViewportSize();
	                    const size = FLOAT_TRIGGER_SIZE;
	                    const margin = FLOAT_TRIGGER_MARGIN;
	                    const headBottom = getHeadBottom();
	                    const x = Math.max(margin, w - size - margin);
	                    const y = Math.min(
	                        Math.max(margin, headBottom + margin + 64),
	                        Math.max(margin, h - size - margin)
	                    );
	                    return { x, y };
	                })();

	                const fixedPos = clampFloatTriggerPos(rawPos || defaultPos);
	                applyFloatTriggerPos(btn, fixedPos);
	                btn.style.display = "flex";
	                if (btn.classList.contains("is-init")) {
	                    try {
	                        requestAnimationFrame(() => {
	                            try { btn.classList.remove("is-init"); } catch { }
	                        });
	                    } catch {
	                        try { btn.classList.remove("is-init"); } catch { }
	                    }
	                }
	                scheduleFloatTriggerIdle(btn);

		                if (!btn.dataset.nsxFloatBound) {
		                    btn.dataset.nsxFloatBound = "1";
		                    const drag = { active: false, inputType: "", pointerId: null, startX: 0, startY: 0, baseX: 0, baseY: 0, moved: false, downAt: 0, ignoreClickUntil: 0 };

		                    const onDown = (e) => {
		                        if (drag.active) return;
		                        try { e.preventDefault(); } catch { }
		                        try { e.stopPropagation(); } catch { }
		                        if (e.button !== undefined && e.button !== 0) return;
		                        clearFloatTriggerIdle(btn);
		                        closeFloatMenu();

		                        const rect = btn.getBoundingClientRect();
		                        drag.active = true;
		                        drag.inputType = "pointer";
		                        drag.pointerId = e.pointerId;
		                        drag.startX = e.clientX;
		                        drag.startY = e.clientY;
	                        drag.baseX = rect.left;
	                        drag.baseY = rect.top;
	                        drag.moved = false;
	                        drag.downAt = Date.now();
	                        try { btn.setPointerCapture?.(e.pointerId); } catch { }
	                        try { btn.classList.add("is-dragging"); } catch { }
	                    };

		                    const onMove = (e) => {
		                        if (!drag.active) return;
		                        if (drag.inputType !== "pointer") return;
		                        if (drag.pointerId != null && e.pointerId !== drag.pointerId) return;
		                        try { e.preventDefault(); } catch { }
		                        try { e.stopPropagation(); } catch { }
	                        const dx = e.clientX - drag.startX;
	                        const dy = e.clientY - drag.startY;
	                        if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true;
	                        const pos = clampFloatTriggerPos({ x: drag.baseX + dx, y: drag.baseY + dy });
	                        applyFloatTriggerPos(btn, pos);
	                    };

		                    const onUp = (e) => {
		                        if (!drag.active) return;
		                        if (drag.inputType !== "pointer") return;
		                        if (drag.pointerId != null && e.pointerId !== drag.pointerId) return;
		                        try { e.preventDefault(); } catch { }
		                        try { e.stopPropagation(); } catch { }

		                        drag.active = false;
		                        drag.inputType = "";
		                        drag.ignoreClickUntil = Date.now() + 450;
		                        try { btn.releasePointerCapture?.(e.pointerId); } catch { }
		                        try { btn.classList.remove("is-dragging"); } catch { }

	                        const rect = btn.getBoundingClientRect();
	                        let pos = clampFloatTriggerPos({ x: rect.left, y: rect.top });
	                        if (drag.moved) {
	                            pos = clampFloatTriggerPos(snapFloatTriggerPos(pos));
	                            applyFloatTriggerPos(btn, pos);
	                            saveFloatTriggerPos(pos);
	                            scheduleFloatTriggerIdle(btn, 350);
	                            return;
	                        }

		                        // Click (tap)
		                        saveFloatTriggerPos(pos);
		                        try {
		                            // 打开二级菜单
		                            toggleFloatMenu();
		                        } catch {
		                            try { openAdvancedSettings(e); } catch { }
		                        }
		                    };

		                    const onTouchStart = (e) => {
		                        if (drag.active) return;
		                        const t = e.touches?.[0];
		                        if (!t) return;
		                        try { e.preventDefault(); } catch { }
		                        try { e.stopPropagation(); } catch { }
		                        clearFloatTriggerIdle(btn);
		                        closeFloatMenu();

		                        const rect = btn.getBoundingClientRect();
		                        drag.active = true;
		                        drag.inputType = "touch";
		                        drag.pointerId = null;
		                        drag.startX = t.clientX;
		                        drag.startY = t.clientY;
		                        drag.baseX = rect.left;
		                        drag.baseY = rect.top;
		                        drag.moved = false;
		                        drag.downAt = Date.now();
		                        try { btn.classList.add("is-dragging"); } catch { }
		                    };

		                    const onTouchMove = (e) => {
		                        if (!drag.active) return;
		                        if (drag.inputType !== "touch") return;
		                        const t = e.touches?.[0];
		                        if (!t) return;
		                        try { e.preventDefault(); } catch { }
		                        try { e.stopPropagation(); } catch { }
		                        const dx = t.clientX - drag.startX;
		                        const dy = t.clientY - drag.startY;
		                        if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true;
		                        const pos = clampFloatTriggerPos({ x: drag.baseX + dx, y: drag.baseY + dy });
		                        applyFloatTriggerPos(btn, pos);
		                    };

		                    const onTouchEnd = (e) => {
		                        if (!drag.active) return;
		                        if (drag.inputType !== "touch") return;
		                        try { e.preventDefault(); } catch { }
		                        try { e.stopPropagation(); } catch { }

		                        drag.active = false;
		                        drag.inputType = "";
		                        drag.ignoreClickUntil = Date.now() + 450;
		                        try { btn.classList.remove("is-dragging"); } catch { }

		                        const rect = btn.getBoundingClientRect();
		                        let pos = clampFloatTriggerPos({ x: rect.left, y: rect.top });
		                        if (drag.moved) {
		                            pos = clampFloatTriggerPos(snapFloatTriggerPos(pos));
		                            applyFloatTriggerPos(btn, pos);
		                            saveFloatTriggerPos(pos);
		                            scheduleFloatTriggerIdle(btn, 350);
		                            return;
		                        }

		                        // Tap
		                        saveFloatTriggerPos(pos);
		                        try { toggleFloatMenu(); } catch { try { openAdvancedSettings(e); } catch { } }
		                    };

		                    btn.addEventListener("pointerdown", onDown, { passive: false });
		                    window.addEventListener("pointermove", onMove, { passive: false });
		                    window.addEventListener("pointerup", onUp, { passive: false });
		                    window.addEventListener("pointercancel", onUp, { passive: false });
		                    btn.addEventListener("touchstart", onTouchStart, { passive: false });
		                    window.addEventListener("touchmove", onTouchMove, { passive: false });
		                    window.addEventListener("touchend", onTouchEnd, { passive: false });
		                    window.addEventListener("touchcancel", onTouchEnd, { passive: false });
		                    btn.addEventListener("click", e => {
		                        try { e.preventDefault(); } catch { }
		                        try { e.stopPropagation(); } catch { }
		                        try { e.stopImmediatePropagation?.(); } catch { }
		                        clearFloatTriggerIdle(btn);
		                        if (Date.now() < (drag.ignoreClickUntil || 0)) return;
		                        try { toggleFloatMenu(); } catch { try { openAdvancedSettings(e); } catch { } }
		                    }, true);
		                }

		                return true;
		            };

            const syncIconGroupLayout = () => {
                try {
                    const head = ctx.$("#nsk-head");
                    const grp = ensureIconGroup(head);
                    if (!head || !grp) return false;

                    grp.querySelectorAll(":scope > *").forEach(child => {
                        child.style.pointerEvents = "auto";
                        child.style.top = "0px";
                    });

                    return true;
                } catch {
                    return false;
                }
            };

	            const mountSettingsEntry = () => {
	                mountFloatTrigger();
	                const head = ctx.$("#nsk-head");
	                if (!head) return false;

	                const grp = ensureIconGroup(head);
	                if (!grp) return false;

                const trigger = document.getElementById("nsx-settings-trigger");
                if (trigger) {
                    try { trigger.remove(); } catch { }
                }

                syncIconGroupLayout();
                return true;
            };

            window.__nsxRuntime ||= {};
            window.__nsxRuntime.openSettings = () => advSettings();
            window.__nsxRuntime.exportEditorDiag = exportEditorDiag;
            window.__nsxRuntime.exportLayoutDiag = exportEditorDiag;

            const buildMenuDefs = () => {
                const defs = [
                    { name: "sign_in", cb: switchState, text: "自动签到", states: [{ s1: "❌", s2: "关闭" }, { s1: "🎲", s2: "随机🍗" }, { s1: "📌", s2: "5个🍗" }] },
                    { name: "re_sign", cb: reSign, text: "🔂 重试签到", states: [] },
                    { name: "open_post_in_new_tab", cb: switchNewTab, text: "新标签页打开帖子", states: [{ s1: "❌", s2: "关闭" }, { s1: "✅", s2: "开启" }] },
                    { name: "advanced_settings", cb: advSettings, text: "⚙️ 高级设置", states: [] },
                    { name: "feedback", cb: () => GM_openInTab("https://greasyfork.org/zh-CN/scripts/567109/feedback", { active: true, insert: true, setParent: true }), text: "💬 反馈 & 建议", states: [] }
                ];
                if (isLayoutDiagEnabled()) {
                    defs.splice(4, 0, { name: "editor_diag", cb: exportEditorDiag, text: "🧪 导出布局诊断", states: [] });
                }
                return defs;
            };

            regMenus();
            mountSettingsEntry();
            [250, 600, 1200, 2600, 4200].forEach(ms => setTimeout(mountSettingsEntry, ms));
            window.addEventListener("pageshow", mountSettingsEntry);
            document.addEventListener("visibilitychange", () => {
                if (!document.hidden) mountSettingsEntry();
            });
            window.addEventListener("resize", debounce(mountSettingsEntry, 180), { passive: true });
        }
    };

    const __vite_glob_0_13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: menus
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🧭 辅助工具 ] - 快捷评论 (快捷回复区)
       ========================================================================== */

    const quickComment = {
        id: "quickComment",
        order: 120,
        cfg: { quick_comment: { enabled: true } },
        meta: { quick_comment: { label: "快捷评论", group: "🧭 辅助工具" } },
        match: ctx => ctx.loggedIn && ctx.isPost && ctx.store.get("quick_comment.enabled", true),
        init(ctx) {
            const editor = $(".md-editor"), parent = $("#back-to-parent"), group = $("#fast-nav-button-group");
            if (!editor || !parent || !group) return;
            let open = false;
            addStyle("nsx-quick-reply", `
.mde-toolbar > .sep{width:2px !important;height:20px !important;background:#e5e7eb !important;margin:0 6px !important;flex-shrink:0 !important;display:inline-block !important}
@media (max-width:768px){
.md-editor.nsx-mobile-docked-editor{left:0!important;right:0!important;bottom:0!important;width:100vw!important;max-width:none!important;margin:0!important;transform:none!important;z-index:999!important}
.md-editor.nsx-mobile-docked-editor .mde-toolbar{display:flex!important;flex-wrap:nowrap!important;align-items:center!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;-webkit-overflow-scrolling:touch}
.md-editor.nsx-mobile-docked-editor .mde-toolbar>*{float:none!important;clear:none!important;position:static!important;flex:0 0 auto!important;margin-left:0!important}
.md-editor.nsx-mobile-docked-editor .mde-toolbar .toolbar-item.right,
.md-editor.nsx-mobile-docked-editor .mde-toolbar .right,
.md-editor.nsx-mobile-docked-editor .mde-toolbar [class*=" right"]{margin-left:0!important;border-left:0!important;padding-left:4px!important}
.md-editor.nsx-mobile-docked-editor .mde-toolbar [style*="margin-left:auto"],
.md-editor.nsx-mobile-docked-editor .mde-toolbar [style*="margin-left: auto"]{margin-left:0!important}
.md-editor.nsx-mobile-docked-editor .mde-toolbar #nodeimage-toolbar-container{display:none!important}
.md-editor.nsx-mobile-docked-editor .mde-toolbar>.sep{display:none!important}
}
.nsx-quick-reply-wrap{position:relative;display:inline-flex;align-items:center}
.nsx-quick-reply-btn{height:auto;line-height:1;border:none;background:transparent;color:var(--text-color,#333);padding:0;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px}
.nsx-quick-reply-btn:hover{color:#1677ff}
.nsx-quick-reply-menu{position:absolute;left:0;top:36px;z-index:1002;min-width:280px;max-width:min(500px,88vw);background:var(--bg-color,#fff);border:1px solid var(--border-color,#e5e7eb);border-radius:10px;box-shadow:0 2px 8px rgba(15,23,42,.1);padding:8px;display:none}
.nsx-quick-reply-menu.show{display:block}
.nsx-quick-reply-tabs-wrap{display:flex;align-items:flex-start;gap:6px;padding-bottom:11px;margin-bottom:6px;border-bottom:1px solid #eee}
.nsx-quick-reply-tabs{flex:1;display:flex;gap:6px;overflow:auto hidden;scrollbar-width:thin;overflow-y:hidden}
.nsx-quick-reply-tab{flex:0 0 calc((100% - 12px)/3);max-width:calc((100% - 12px)/3);border:1px solid #e4e6eb;background:#fff;border-radius:999px;padding:3px 8px;cursor:pointer;font-size:12px;white-space:nowrap;overflow:hidden;text-align:center;display:flex;align-items:center;justify-content:center;gap:6px}
.nsx-quick-reply-tab .nsx-quick-reply-tab-text{min-width:0;overflow:hidden;text-overflow:ellipsis}
.nsx-quick-reply-tab .nsx-quick-reply-tab-del{flex:0 0 auto;border:0;background:transparent;color:#999;cursor:pointer;line-height:1;padding:0 2px;font-size:12px}
.nsx-quick-reply-tab .nsx-quick-reply-tab-del:hover{color:#ff4d4f}
.nsx-quick-reply-tab.active{background:#1677ff;color:#fff;border-color:#1677ff}
.nsx-quick-reply-tab.active .nsx-quick-reply-tab-del{color:rgba(255,255,255,.85)}
.nsx-quick-reply-tab.active .nsx-quick-reply-tab-del:hover{color:#fff}
.nsx-quick-reply-tab-add-fixed{flex:0 0 auto;border:1px solid #1677ff;background:#fff;color:#1677ff;border-radius:999px;padding:3px 10px;cursor:pointer;font-size:12px;white-space:nowrap}
.nsx-quick-reply-list{height:216px;overflow-y:auto;overflow-x:hidden;padding-right:2px}
.nsx-quick-reply-item{display:flex;align-items:center;width:100%;text-align:left;border:0;background:transparent;color:inherit;cursor:pointer;border-radius:8px;padding:0 6px 0 10px;height:36px;box-sizing:border-box}
.nsx-quick-reply-item .nsx-quick-reply-item-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.nsx-quick-reply-item .nsx-quick-reply-item-del{flex:0 0 auto;border:0;background:transparent;color:#999;cursor:pointer;line-height:1;padding:4px 6px;font-size:12px;border-radius:6px}
.nsx-quick-reply-item .nsx-quick-reply-item-del:hover{color:#ff4d4f;background:rgba(255,77,79,.12)}
.nsx-quick-reply-item:hover{background:var(--hover-color,#f3f4f6)}
.nsx-quick-reply-empty{padding:10px;color:#999;font-size:12px}
.nsx-quick-reply-foot{display:flex;justify-content:space-between;align-items:center;padding-top:6px;margin-top:6px;border-top:1px solid #eee}
.nsx-quick-reply-autosend-wrap{display:flex;align-items:center;gap:4px;font-size:12px;color:#666}
.nsx-quick-reply-autosend-check{width:14px;height:14px;cursor:pointer;accent-color:#1677ff}
.nsx-quick-reply-autosend-label{cursor:pointer;user-select:none}
.nsx-quick-reply-op{border:1px solid #e4e6eb;background:#fff;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:12px}
.nsx-quick-reply-op:disabled{opacity:.45;cursor:not-allowed}
.nsx-quick-reply-add{border:1px solid #1677ff;background:#1677ff;color:#fff;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:12px}
.dark-layout .mde-toolbar > .sep{background:#666 !important}
.dark-layout .nsx-quick-reply-btn:hover{color:#64b5f6}
.dark-layout .nsx-quick-reply-menu{background:#222;border-color:#3a3a3a;box-shadow:0 4px 10px rgba(0,0,0,.24)}
.dark-layout .nsx-quick-reply-tabs-wrap{border-bottom-color:#3a3a3a}
.dark-layout .nsx-quick-reply-tabs{border-bottom-color:#3a3a3a}
.dark-layout .nsx-quick-reply-tab{background:#2a2a2a;border-color:#444;color:#ddd}
.dark-layout .nsx-quick-reply-tab.active{background:#1677ff;border-color:#1677ff;color:#fff}
.dark-layout .nsx-quick-reply-tab-add-fixed{background:#2a2a2a;border-color:#1677ff;color:#8dbdff}
.dark-layout .nsx-quick-reply-item .nsx-quick-reply-item-del:hover{background:rgba(255,77,79,.18)}
.dark-layout .nsx-quick-reply-item:hover{background:#333}
.dark-layout .nsx-quick-reply-foot{border-top-color:#3a3a3a}
.dark-layout .nsx-quick-reply-autosend-wrap{color:#aaa}
.dark-layout .nsx-quick-reply-op{background:#2a2a2a;border-color:#444;color:#ddd}
`);

            let prevEditorInlineStyle = "";
            const normalizeDockedToolbar = () => {
                const bar = editor.querySelector(".mde-toolbar");
                if (!bar) return;
                Array.from(bar.children).forEach(node => {
                    if (!(node instanceof HTMLElement)) return;
                    const cls = String(node.className || "");
                    const inline = String(node.getAttribute("style") || "");
                    if (/margin-left\s*:\s*auto/i.test(inline)) {
                        node.style.setProperty("margin-left", "0", "important");
                    }
                    if (/(^|\s)right(\s|$)/.test(cls) || /toolbar-item\s+right/.test(cls)) {
                        node.style.setProperty("margin-left", "0", "important");
                        node.style.setProperty("float", "none", "important");
                        node.style.setProperty("border-left", "0", "important");
                    }
                });
            };

            const show = e => {
                if (open) return;
                e?.preventDefault?.();
                prevEditorInlineStyle = editor.getAttribute("style") || "";
                if (isSmallScreen(768)) {
                    editor.classList.add("nsx-mobile-docked-editor");
                    editor.style.cssText = "position:fixed;left:0;right:0;bottom:0;margin:0;width:100vw;max-width:none;z-index:999;box-sizing:border-box;transform:none";
                    normalizeDockedToolbar();
                    try { requestAnimationFrame(() => normalizeDockedToolbar()); } catch { }
                    try { setTimeout(() => normalizeDockedToolbar(), 120); } catch { }
                } else {
                    editor.classList.remove("nsx-mobile-docked-editor");
                    editor.style.cssText = `position:fixed;bottom:0;left:50%;transform:translateX(-50%);margin:0;width:100%;max-width:${editor.clientWidth || 720}px;z-index:999`;
                }
                addClose();
                open = true;
            };

            const btn = parent.cloneNode(true);
            btn.id = "back-to-comment";
            btn.innerHTML = `<svg class="iconpark-icon" style="width:24px;height:24px"><use href="#comments"></use></svg>`;
            btn.onclick = show;
            parent.before(btn);

            $$(".nsk-post .comment-menu,.comment-container .comments").forEach(el => el.addEventListener("click", e => {
                if (["引用", "回复", "编辑"].includes(e.target?.textContent)) show(e);
            }, true));

            mountQuickReplyMenu();

            function addClose() {
                const tb = $("#editor-body .window_header > :last-child");
                if (!tb || $(".nsx-close-editor")) return;
                const cb = tb.cloneNode(true);
                cb.classList.add("nsx-close-editor");
                cb.title = "关闭";
                const sp = cb.querySelector("span");
                if (sp) {
                    sp.classList.replace("i-icon-full-screen-one", "i-icon-close");
                    sp.innerHTML = `<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M8 8L40 40M8 40L40 8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                }
                cb.onclick = () => {
                    editor.classList.remove("nsx-mobile-docked-editor");
                    if (prevEditorInlineStyle) editor.setAttribute("style", prevEditorInlineStyle);
                    else editor.removeAttribute("style");
                    cb.remove();
                    open = false;
                };
                tb.after(cb);
            }

            function mountQuickReplyMenu() {
                const bar = editor.querySelector(".mde-toolbar");
                if (!bar || bar.querySelector(".nsx-quick-reply-wrap")) return;
                const state = { groupIdx: 0 };

                const sep = document.createElement("div");
                const wrap = document.createElement("div");
                wrap.className = "nsx-quick-reply-wrap toolbar-item";
                const btn = document.createElement("span");
                btn.className = "nsx-quick-reply-btn i-icon";
                btn.title = "快捷回复 - Nodeseek Pro";
                btn.textContent = "快捷回复";
                const menu = document.createElement("div");
                menu.className = "nsx-quick-reply-menu";

                // 让菜单始终可见：窗口缩放/滚动时自动贴边，避免跑出视窗外
                const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
                const placeMenu = () => {
                    if (!menu.classList.contains("show")) return;

                    // 覆盖 CSS 里的 absolute，避免父容器溢出/裁剪导致看不到
                    menu.style.position = "fixed";
                    menu.style.margin = "0";

                    const pad = 8;
                    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
                    const vh = window.innerHeight || document.documentElement.clientHeight || 0;

                    const bRect = btn.getBoundingClientRect();
                    const mRect = menu.getBoundingClientRect();
                    const w = mRect.width || Math.min(500, Math.max(280, vw * 0.88));
                    const h = mRect.height || 320;

                    let left = clamp(bRect.left, pad, Math.max(pad, vw - w - pad));
                    let top = bRect.bottom + 6;

                    // 优先显示在按钮下方；放不下就翻到上方
                    if (top + h + pad > vh && bRect.top - 6 - h - pad >= 0) {
                        top = bRect.top - 6 - h;
                    }
                    top = clamp(top, pad, Math.max(pad, vh - h - pad));

                    menu.style.left = `${left}px`;
                    menu.style.top = `${top}px`;
                };

                // 支持拖拽移动：按住标签栏区域拖动菜单
                let dragOn = false, dragStartX = 0, dragStartY = 0, dragLeft = 0, dragTop = 0;
                const onDragMove = (e) => {
                    if (!dragOn) return;
                    const pad = 8;
                    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
                    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
                    const r = menu.getBoundingClientRect();
                    const nextLeft = clamp(dragLeft + (e.clientX - dragStartX), pad, Math.max(pad, vw - r.width - pad));
                    const nextTop = clamp(dragTop + (e.clientY - dragStartY), pad, Math.max(pad, vh - r.height - pad));
                    menu.style.left = `${nextLeft}px`;
                    menu.style.top = `${nextTop}px`;
                };
                const onDragEnd = () => { dragOn = false; };

                const tabsWrap = document.createElement("div");
                tabsWrap.className = "nsx-quick-reply-tabs-wrap";
                const tabs = document.createElement("div");
                tabs.className = "nsx-quick-reply-tabs";
                const addGroupTab = document.createElement("button");
                addGroupTab.type = "button";
                addGroupTab.className = "nsx-quick-reply-tab-add-fixed";
                addGroupTab.textContent = "+ 分组";
                addGroupTab.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    openAddGroupDialog(() => {
                        state.groupIdx = Math.max(0, getQuickReplyGroups().length - 1);
                        state.page = 1;
                        renderMenu();
                    });
                };
                const list = document.createElement("div");
                list.className = "nsx-quick-reply-list";
                const foot = document.createElement("div");
                foot.className = "nsx-quick-reply-foot";
                tabsWrap.append(tabs, addGroupTab);
                menu.append(tabsWrap, list, foot);

                tabsWrap.style.cursor = "move";
                tabsWrap.addEventListener("pointerdown", (e) => {
                    if (!menu.classList.contains("show")) return;
                    if (e.button !== 0) return;
                    if (e.target?.closest?.("button,input,select,textarea,a,.nsx-quick-reply-tab,.nsx-quick-reply-tab-add-fixed")) return;
                    e.preventDefault();
                    e.stopPropagation();

                    placeMenu();
                    const r = menu.getBoundingClientRect();
                    dragOn = true;
                    dragStartX = e.clientX;
                    dragStartY = e.clientY;
                    dragLeft = r.left;
                    dragTop = r.top;
                    try { tabsWrap.setPointerCapture(e.pointerId); } catch { }
                }, { passive: false });
                tabsWrap.addEventListener("pointermove", onDragMove);
                tabsWrap.addEventListener("pointerup", onDragEnd);
                tabsWrap.addEventListener("pointercancel", onDragEnd);

                const renderMenu = () => {
                    const groups = getQuickReplyGroups();
                    tabs.innerHTML = "";
                    list.innerHTML = "";
                    foot.innerHTML = "";
                    if (!groups.length) {
                        const empty = document.createElement("div");
                        empty.className = "nsx-quick-reply-empty";
                        empty.textContent = "未找到快捷回复，请先在快捷回复面板中配置。";
                        list.appendChild(empty);
                        const addBtn = document.createElement("button");
                        addBtn.type = "button";
                        addBtn.className = "nsx-quick-reply-add";
                        addBtn.textContent = "新增";
                        addBtn.onclick = () => openAddDialog("", () => {
                            state.groupIdx = 0;
                            renderMenu();
                        });
                        foot.appendChild(addBtn);
                        return;
                    }

                    state.groupIdx = Math.max(0, Math.min(state.groupIdx, groups.length - 1));
                    groups.forEach((g, i) => {
                        // 不要在 button 里嵌套 button（浏览器行为不一致，可能导致误触发关闭）
                        const t = document.createElement("div");
                        t.className = `nsx-quick-reply-tab${i === state.groupIdx ? " active" : ""}`;
                        t.setAttribute("role", "button");
                        t.tabIndex = 0;

                        const label = g.name || `分组${i + 1}`;
                        const text = document.createElement("span");
                        text.className = "nsx-quick-reply-tab-text";
                        text.textContent = label;

                        const del = document.createElement("span");
                        del.className = "nsx-quick-reply-tab-del";
                        del.title = "删除分组";
                        del.textContent = "✕";
                        del.setAttribute("role", "button");
                        del.tabIndex = 0;
                        del.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const groupName = g.name || "";
                            if (!groupName) return;
                            const doDel = () => {
                                let parsed = {};
                                try { parsed = JSON.parse(localStorage.getItem("nodeseek_quick_reply") || "{}") || {}; } catch { parsed = {}; }
                                delete parsed[groupName];
                                localStorage.setItem("nodeseek_quick_reply", JSON.stringify(parsed));
                                state.groupIdx = Math.max(0, Math.min(state.groupIdx, Object.keys(parsed).length - 1));
                                renderMenu();
                            };
                            if (ctx.ui?.confirm) ctx.ui.confirm("确认删除?", `确定要删除分组【${groupName}】吗？（该分组下的快捷回复会一起删除）`, doDel);
                            else if (window.confirm(`确定要删除分组【${groupName}】吗？（该分组下的快捷回复会一起删除）`)) doDel();
                        };

                        const pick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            state.groupIdx = i;
                            renderMenu();
                        };
                        t.onclick = pick;
                        t.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") pick(e); };

                        t.append(text, del);
                        tabs.appendChild(t);
                    });
                    const curGroup = groups[state.groupIdx];
                    const curItems = curGroup.items || [];
                    if (!curItems.length) {
                        const empty = document.createElement("div");
                        empty.className = "nsx-quick-reply-empty";
                        empty.textContent = "当前分组暂无内容，点击右下角“新增”添加。";
                        list.appendChild(empty);
                    }

                    const curGroupName = curGroup?.name || "";
                    curItems.forEach((item, idx) => {
                        // 同理：避免在 button 里嵌套 button
                        const it = document.createElement("div");
                        it.className = "nsx-quick-reply-item";
                        it.setAttribute("role", "button");
                        it.tabIndex = 0;
                        it.title = item.text;

                        const text = document.createElement("span");
                        text.className = "nsx-quick-reply-item-text";
                        text.textContent = item.label;

                        const del = document.createElement("span");
                        del.className = "nsx-quick-reply-item-del";
                        del.title = "删除";
                        del.textContent = "✕";
                        del.setAttribute("role", "button");
                        del.tabIndex = 0;
                        del.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!curGroupName) return;
                            const doDel = () => {
                                let parsed = {};
                                try { parsed = JSON.parse(localStorage.getItem("nodeseek_quick_reply") || "{}") || {}; } catch { parsed = {}; }
                                const raw = parsed[curGroupName];
                                const arr = normalizeItems(raw).map(x => ({ title: x.label, content: x.text }));
                                arr.splice(idx, 1);
                                parsed[curGroupName] = arr;
                                localStorage.setItem("nodeseek_quick_reply", JSON.stringify(parsed));
                                renderMenu();
                            };
                            if (ctx.ui?.confirm) ctx.ui.confirm("确认删除?", `确定要删除这条快捷回复吗？`, doDel);
                            else if (window.confirm("确定要删除这条快捷回复吗？")) doDel();
                        };

                        it.append(text, del);
                        const doInsert = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            insertReplyText(item.text);
                            menu.classList.remove("show");
                            // 检查是否自动点击提交按钮
                            const autoSendCheck = document.getElementById("nsx-quick-reply-autosend");
                            if (autoSendCheck && autoSendCheck.checked) {
                                setTimeout(() => {
                                    const submitBtn = editor.querySelector(".md-editor button.submit.btn");
                                    if (submitBtn) submitBtn.click();
                                }, 100);
                            }
                        };
                        it.onclick = doInsert;
                        it.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") doInsert(e); };
                        list.appendChild(it);
                    });

                    // 自动发送勾选框
                    const autoSendWrap = document.createElement("div");
                    autoSendWrap.className = "nsx-quick-reply-autosend-wrap";
                    const autoSendCheck = document.createElement("input");
                    autoSendCheck.type = "checkbox";
                    autoSendCheck.id = "nsx-quick-reply-autosend";
                    autoSendCheck.className = "nsx-quick-reply-autosend-check";
                    // 从localStorage读取上次设置（兼容NS综合.js的key）
                    const savedAutoSend = localStorage.getItem("nodeseek_quick_reply_auto_submit") === "true";
                    autoSendCheck.checked = savedAutoSend;
                    const autoSendLabel = document.createElement("label");
                    autoSendLabel.htmlFor = "nsx-quick-reply-autosend";
                    autoSendLabel.className = "nsx-quick-reply-autosend-label";
                    autoSendLabel.textContent = "自动提交";
                    // 保存设置到localStorage（使用NS综合.js的key保持兼容）
                    autoSendCheck.onchange = () => {
                        localStorage.setItem("nodeseek_quick_reply_auto_submit", autoSendCheck.checked);
                    };
                    autoSendWrap.append(autoSendCheck, autoSendLabel);

                    const addBtn = document.createElement("button");
                    addBtn.type = "button";
                    addBtn.className = "nsx-quick-reply-add";
                    addBtn.textContent = "新增";
                    addBtn.onclick = () => openAddDialog(curGroup.name || "", () => renderMenu());
                    foot.append(autoSendWrap, addBtn);
                };

                btn.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    renderMenu();
                    menu.classList.toggle("show");
                    if (menu.classList.contains("show")) requestAnimationFrame(placeMenu);
                };

                document.addEventListener("click", e => {
                    // 当 layui 弹窗打开时（例如“新建分组”的确认/取消），不要自动关闭快捷回复面板
                    // 处理两类情况：1) 点击发生在 layer 内部；2) layer 存在时点击落在外部但仍希望保持面板不被误关
                    if (e.target?.closest?.(".layui-layer,.layui-layer-page,.layui-layer-dialog,.layui-layer-content,.layui-layer-btn,.layui-layer-shade,.layui-colorpicker,.layui-form-select")) return;
                    if (menu.classList.contains("show") && document.querySelector(".layui-layer")) return;
                    if (!wrap.contains(e.target)) menu.classList.remove("show");
                });

                // 窗口变化时重新定位，避免面板被挤出屏幕
                addEventListener("resize", placeMenu, { passive: true });
                addEventListener("scroll", placeMenu, { passive: true });

                sep.className = "sep";
                wrap.append(btn, menu);
                bar.append(sep, wrap);
            }

            function insertReplyText(text) {
                if (!text) return;
                const cm = editor.querySelector(".CodeMirror")?.CodeMirror;
                if (cm) {
                    const doc = cm.getDoc();
                    const cur = doc.getCursor();
                    doc.replaceRange(text, cur);
                    cm.focus();
                    return;
                }
                const ta = editor.querySelector("textarea");
                if (!ta) return;
                const start = ta.selectionStart ?? ta.value.length;
                const end = ta.selectionEnd ?? ta.value.length;
                ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
                const pos = start + text.length;
                ta.setSelectionRange(pos, pos);
                ta.dispatchEvent(new Event("input", { bubbles: true }));
                ta.focus();
            }

            function getQuickReplyGroups() {
                const raw = localStorage.getItem("nodeseek_quick_reply");
                if (!raw) return [];
                let parsed;
                try { parsed = JSON.parse(raw); } catch { return []; }
                if (!parsed || typeof parsed !== "object") return [];
                const groups = [];
                Object.entries(parsed).forEach(([name, val]) => {
                    const items = normalizeItems(val);
                    groups.push({ name, items });
                });
                return groups;
            }

            function openAddGroupDialog(onDone) {
                const layer = ctx.ui?.layer;
                if (!layer) {
                    const val = window.prompt("请输入分组名：", "默认");
                    const groupName = String(val ?? "").trim();
                    if (!groupName) return;
                    ensureQuickReplyGroup(groupName);
                    ctx.ui?.success?.("分组已创建");
                    onDone?.();
                    return;
                }
                layer.prompt({ title: "新建分组", formType: 0, value: "默认" }, (val, idx) => {
                    const groupName = String(val ?? "").trim();
                    if (!groupName) return ctx.ui?.warning?.("分组名不能为空");
                    ensureQuickReplyGroup(groupName);
                    layer.close(idx);
                    ctx.ui?.success?.("分组已创建");
                    onDone?.();
                });
            }

            function openAddDialog(defaultGroupName, onDone) {
                const layer = ctx.ui?.layer;
                let groups = getQuickReplyGroups().map(g => g.name).filter(Boolean);
                if (!layer || !window.layui) {
                    const ask = (label, def = "") => {
                        const v = window.prompt(label, def);
                        return v == null ? null : String(v).trim();
                    };
                    const group = ask("请输入分组名：", defaultGroupName || groups[0] || "默认");
                    if (group == null) return;
                    if (!group) { ctx.ui?.warning?.("分组名不能为空"); return; }
                    const content = ask("请输入快捷回复内容：", "");
                    if (content == null) return;
                    if (!content.trim()) { ctx.ui?.warning?.("内容不能为空"); return; }
                    const title = ask("请输入标题（可留空自动截断内容）：", "") || shrink(content);
                    saveQuickReplyItem(group, { title, content: content.trim() });
                    ctx.ui?.success?.("快捷回复已添加");
                    onDone?.();
                    return;
                }

                // 没有任何分组时，先创建一个默认分组，避免下拉为空无法选择
                if (!groups.length) {
                    ensureQuickReplyGroup("默认");
                    groups = getQuickReplyGroups().map(g => g.name).filter(Boolean);
                }

                const escHtml = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
                const defaultGroup = defaultGroupName || groups[0] || "默认";
                const optsHtml = groups.map(g => `<option value="${escHtml(g)}"${g === defaultGroup ? " selected" : ""}>${escHtml(g)}</option>`).join("");
                const html = `
                    <style>
                        .nsx-qr-form .layui-form-label{width:70px}
                        .nsx-qr-form .layui-input-block{margin-left:100px}
                        .nsx-qr-tip{font-size:12px;color:#999;margin-top:4px}
                    </style>
                    <div class="layui-form nsx-qr-form" style="padding:16px 16px 0;">
                        <div class="layui-form-item">
                            <label class="layui-form-label">分组</label>
                            <div class="layui-input-block">
                                <select id="nsx-qr-group">
                                    ${optsHtml}
                                </select>
                                <div class="nsx-qr-tip">需要新分组请点工具栏右侧的“+ 分组”。</div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">内容</label>
                            <div class="layui-input-block">
                                <textarea id="nsx-qr-content" class="layui-textarea" style="min-height:130px" placeholder="输入快捷回复正文"></textarea>
                                <div class="nsx-qr-tip">支持多行文本，插入时会保持换行。标题将自动使用内容前 28 字。</div>
                            </div>
                        </div>
                    </div>
                `;
                layer.open({
                    type: 1,
                    title: "新增快捷回复",
                    area: [window.layui.device().mobile ? "95%" : "560px", "420px"],
                    btn: ["保存", "取消"],
                    content: html,
                    success: ly => {
                        const r = ly?.[0] || ly;
                        if (window.layui?.form) {
                            layui.use("form", () => {
                                const form = layui.form;
                                form.render("select");
                            });
                        }
                        const c = r?.querySelector?.("#nsx-qr-content");
                        c?.focus?.();
                    },
                    yes: idx => {
                        const r = document.getElementById("layui-layer" + idx) || document;
                        const group = r.querySelector("#nsx-qr-group")?.value?.trim() || "";
                        const content = r.querySelector("#nsx-qr-content")?.value || "";
                        if (!group) return ctx.ui?.warning?.("分组名不能为空");
                        if (!content.trim()) return ctx.ui?.warning?.("内容不能为空");
                        const title = shrink(content);
                        saveQuickReplyItem(group, { title, content: content.trim() });
                        layer.close(idx);
                        ctx.ui?.success?.("快捷回复已添加");
                        onDone?.();
                    }
                });
            }

            function ensureQuickReplyGroup(groupName) {
                let parsed = {};
                try { parsed = JSON.parse(localStorage.getItem("nodeseek_quick_reply") || "{}") || {}; } catch { parsed = {}; }
                if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) parsed = {};
                if (!Object.prototype.hasOwnProperty.call(parsed, groupName)) parsed[groupName] = [];
                localStorage.setItem("nodeseek_quick_reply", JSON.stringify(parsed));
            }

            function saveQuickReplyItem(groupName, item) {
                let parsed = {};
                try { parsed = JSON.parse(localStorage.getItem("nodeseek_quick_reply") || "{}") || {}; } catch { parsed = {}; }
                if (!parsed[groupName]) parsed[groupName] = [];
                if (Array.isArray(parsed[groupName])) {
                    parsed[groupName].push(item);
                } else if (parsed[groupName] && typeof parsed[groupName] === "object") {
                    const arr = normalizeItems(parsed[groupName]).map(i => ({ title: i.label, content: i.text }));
                    arr.push(item);
                    parsed[groupName] = arr;
                } else {
                    parsed[groupName] = [item];
                }
                localStorage.setItem("nodeseek_quick_reply", JSON.stringify(parsed));
            }

            function normalizeItems(src) {
                const arr = Array.isArray(src) ? src : (src && typeof src === "object" ? Object.values(src) : []);
                return arr.map(v => {
                    if (typeof v === "string") return { label: shrink(v), text: v };
                    if (!v || typeof v !== "object") return null;
                    const text = String(v.content ?? v.text ?? v.value ?? "").trim();
                    if (!text) return null;
                    const label = String(v.title ?? v.name ?? v.label ?? shrink(text));
                    return { label, text };
                }).filter(Boolean);
            }

            function shrink(s) {
                const t = String(s).replace(/\s+/g, " ").trim();
                return t.length > 28 ? `${t.slice(0, 28)}...` : t;
            }
        }
    };

    const __vite_glob_0_14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: quickComment
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🚀 基础功能 ] - 自动签到系统
       ========================================================================== */
    const signIn = {
        id: "signIn",
        deps: ["ui"],
        order: 80,
        cfg: {
            sign_in: {
                ns: { enabled: true, method: 1, last_date: "" },
                df: { enabled: true, method: 1, last_date: "" }
            }
        },
        meta: {
            sign_in: {
                label: "自动签到", group: "🚀 基础功能",
                fields: { method: { type: "RADIO", label: "签到方式", valueType: "number", options: [{ value: 1, text: "随机🍗" }, { value: 2, text: "5个🍗" }] } },
                hidden: ["last_date"]
            }
        },
        match: ctx => ctx.site && ctx.loggedIn && ctx.store.get(`sign_in.${ctx.site.code}.enabled`, true),
        async init(ctx) {
            const code = ctx.site.code;
            const method = ctx.store.get(`sign_in.${code}.method`, 0);
            const now = (() => {
                const off = new Date().getTimezoneOffset() + 480;
                const bj = new Date(Date.now() + off * 60000);
                return `${bj.getFullYear()}/${bj.getMonth() + 1}/${bj.getDate()}`;
            })();
            if (ctx.store.get(`sign_in.${code}.last_date`) === now) return;
            ctx.store.set(`sign_in.${code}.last_date`, now);
            try {
                const r = await net.post(`/api/attendance?random=${method === 1}`);
                r?.success ? ctx.ui.success?.(`签到成功！+${r.gain}🍗，共${r.current}🍗`) : ctx.ui.info?.(r?.message || "签到失败");
            } catch (e) { ctx.ui.info?.(e?.message || "签到错误"); }
        }
    };

    const __vite_glob_0_16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: signIn
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🚀 基础功能 ] - 签到过期提醒
       ========================================================================== */

    const CSS = `.nsplus-tip{background:rgba(255,217,0,.8);padding:3px;text-align:center;animation:blink 5s ease infinite}.nsplus-tip p,.nsplus-tip p a{color:#f00}.nsplus-tip p a:hover{color:#0ff}`;

    const signinTips = {
        id: "signinTips",
        deps: ["ui"],
        order: 79,
        cfg: { signin_tips: { enabled: true } },
        meta: { signin_tips: { label: "签到提示", group: "🚀 基础功能" } },
        match(ctx) {
            if (!ctx.site || !ctx.loggedIn || !ctx.store.get("signin_tips.enabled", true)) return false;
            return ctx.store.get(`sign_in.${ctx.site.code}.enabled`, true) === false;
        },
        init(ctx) {
            addStyle("nsx-signtip", CSS);
            const code = ctx.site.code;
            const now = (() => { const d = new Date(Date.now() + (new Date().getTimezoneOffset() + 480) * 6e4); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`; })();
            if (now === ctx.store.get(`sign_in.${code}.ignore_date`) || now === ctx.store.get(`sign_in.${code}.last_date`)) return;

            const header = $("header");
            if (!header) return;
            const tip = document.createElement("div");
            tip.className = "nsplus-tip";
            tip.innerHTML = `<p>今天还没签到！【<a class="nsx-sign" data-r="1">随机🍗</a>】【<a class="nsx-sign" data-r="0">5个🍗</a>】【<a class="nsx-ign">今天不提示</a>】</p>`;
            header.appendChild(tip);

            $$(".nsx-sign", tip).forEach(a => a.onclick = async e => {
                e.preventDefault();
                try {
                    const r = await net.post(`/api/attendance?random=${a.dataset.r === "1"}`);
                    r?.success ? ctx.ui.success?.(`签到成功！+${r.gain}🍗`) : ctx.ui.info?.(r?.message || "签到失败");
                } catch (e) { ctx.ui.warning?.(e?.message || "失败"); }
                tip.remove();
                ctx.store.set(`sign_in.${code}.last_date`, now);
            });
            $(".nsx-ign", tip).onclick = e => { e.preventDefault(); tip.remove(); ctx.store.set(`sign_in.${code}.ignore_date`, now); };
        }
    };

    const __vite_glob_0_17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: signinTips
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🧭 辅助工具 ] - 网页平滑滚动
       ========================================================================== */
    const smoothScroll = {
        id: "smoothScroll",
        order: 340,
        cfg: { smooth_scroll: { enabled: true } },
        meta: { smooth_scroll: { label: "网页平滑滚动", group: "🧭 辅助工具" } },
        match: ctx => ctx.store.get("smooth_scroll.enabled", true),
        init() {
            addStyle("nsx-smooth", "html{scroll-behavior:smooth}");
        }
    };

    const __vite_glob_0_18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: smoothScroll
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🧭 辅助工具 ] - 侧边卡片通知增强
       ========================================================================== */

    class Broadcast {
        static ins = new Map();
        constructor(name) {
            if (Broadcast.ins.has(name)) return Broadcast.ins.get(name);
            this.myId = `${Date.now()}-${Math.random()}`;
            this.recv = [];
            this.KEY = `nsx_tab_${name}`;
            try { this.ch = new BroadcastChannel(name); this.ch.onmessage = e => this.recv.forEach(f => f(e.data)); } catch { this.ch = null; }
            addEventListener("storage", e => { if (e.key === this.KEY) { e.newValue || localStorage.setItem(this.KEY, this.myId); this._up(); } });
            addEventListener("beforeunload", () => { if (this.active) localStorage.removeItem(this.KEY); });
            localStorage.setItem(this.KEY, this.myId);
            this._up();
            Broadcast.ins.set(name, this);
        }
        _up() { this.active = localStorage.getItem(this.KEY) === this.myId; }
        on(fn) { this.recv.push(fn); }
        send(data) { if (!this.ch) return; const m = { sender: this.myId, data }; this.ch.postMessage(m); this.recv.forEach(f => f(m)); }
        task(fn, ms) {
            let timer = null;
            let backoff = 1;
            const run = async () => {
                if (!this.active || document.hidden) {
                    timer = setTimeout(run, ms);
                    return;
                }
                try {
                    const d = await fn();
                    if (d !== undefined) this.send(d);
                    backoff = 1;
                } catch {
                    backoff = Math.min(backoff * 2, 6);
                }
                timer = setTimeout(run, ms * backoff);
            };
            run();
            return () => timer && clearTimeout(timer);
        }
    }

    const userCardExt = {
        id: "userCardExt",
        order: 200,
        cfg: { user_card_ext: { enabled: true } },
        meta: { user_card_ext: { label: "侧边卡片通知增强", group: "🧭 辅助工具" } },
        match: ctx => ctx.loggedIn && (ctx.isPost || ctx.isList) && ctx.store.get("user_card_ext.enabled", true),
        async init(ctx) {
            const bn = new Broadcast("nsx_notify");
            const card = $(".user-card .user-stat");
            const last = card?.querySelector(".stat-block:first-child > :last-child");
            if (!card || !last) return;

            const atEl = last.cloneNode(true), msgEl = last.cloneNode(true);
            last.after(atEl);
            card.querySelector(".stat-block:last-child")?.append(msgEl);

            const up = (el, href, icon, text, cnt) => {
                const a = el.querySelector("a");
                if (!a) return;
                a.href = href;
                el.querySelector("a svg use")?.setAttribute("href", icon);
                const t = el.querySelector("a > :nth-child(2)");
                if (t) t.textContent = `${text} `;
                const c = el.querySelector("a > :last-child");
                if (c) { c.textContent = cnt; c.classList.toggle("notify-count", cnt > 0); }
            };
            const upAll = c => { up(atEl, "/notification#/atMe", "#at-sign", "我", c.atMe); up(msgEl, "/notification#/message?mode=list", "#envelope-one", "私信", c.message); up(last, "/notification#/reply", "#remind-6nce9p47", "回复", c.reply); };

            bn.on(({ data }) => { if (data?.type === "unreadCount" && data.counts) upAll(data.counts); });
            bn.send({ type: "unreadCount", counts: ctx.user?.unViewedCount || {}, timestamp: Date.now() });
            bn.task(async () => {
                const r = await fetch("/api/notification/unread-count", { credentials: "include" });
                if (!r.ok) throw 0;
                const d = await r.json();
                if (d?.success && d.unreadCount) return { type: "unreadCount", counts: d.unreadCount, timestamp: Date.now() };
                throw 0;
            }, 5000);
        }
    };

    const __vite_glob_0_19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: userCardExt
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🎨 视觉美化 ] - 已访问帖子链接染色
       ========================================================================== */

    const DEFAULT_LIGHT = "#afb9c1";
    const DEFAULT_DARK = "#393f4e";

    const visitedColor = {
        id: "visitedColor",
        order: 350,
        cfg: { visited_color: { enabled: true, light: DEFAULT_LIGHT, dark: DEFAULT_DARK } },
        meta: {
            visited_color: {
                label: "已访问颜色",
                group: "🎨 视觉美化",
                cols: 2,
                fields: {
                    light: { type: "COLOR", label: "浅色模式" },
                    dark: { type: "COLOR", label: "深色模式" }
                }
            }
        },
        match: ctx => ctx.isList && ctx.store.get("visited_color.enabled", true),
        init(ctx) {
            const light = ctx.store.get("visited_color.light", DEFAULT_LIGHT);
            const dark = ctx.store.get("visited_color.dark", DEFAULT_DARK);
            addStyle("nsx-visited-color", `.post-list .post-title a:visited{color:${light}}body.dark-layout .post-list .post-title a:visited{color:${dark}}`);
        }
    };

    const __vite_glob_0_20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: visitedColor
    }, Symbol.toStringTag, { value: 'Module' }));

    /* ==========================================================================
       [ 🎨 视觉美化 ] - 相对时间中文化
       ========================================================================== */
    const timeChinese = {
        id: "timeChinese",
        order: 110,
        cfg: { time_chinese: { enabled: true } },
        meta: { time_chinese: { label: "时间中文化", group: "🎨 视觉美化" } },
        match: ctx => ctx.store.get("time_chinese.enabled", true),
        init(ctx) {
            const trans = (text) => {
                if (!text) return text;
                let res = text.trim();
                const lower = res.toLowerCase();
                if (lower.includes('just now')) return '刚刚';

                let prefix = "";
                if (lower.startsWith('edited')) {
                    prefix = "编辑于 ";
                    res = res.substring(6).trim();
                }

                res = res.replace(/(\d+)\s*y(ears?)?/gi, '$1年');
                res = res.replace(/(\d+)\s*mo(nths?)?/gi, '$1月');
                res = res.replace(/(\d+)\s*d(ays?)?/gi, '$1天');
                res = res.replace(/(\d+)\s*h(ours?)?/gi, '$1小时');
                res = res.replace(/(\d+)\s*min(utes?)?/gi, '$1分钟');
                res = res.replace(/(\d+)\s*s(econds?)?(?!\w)/gi, '$1秒');
                res = res.replace(/ago/gi, '前');

                return prefix + res.replace(/\s+/g, '');
            };
            const run = (els) => {
                els.forEach(el => {
                    const target = el.tagName === 'TIME' ? el : (el.querySelector('time') || el);
                    if (target.dataset.nsxTime) return;
                    const orig = target.textContent.trim();
                    if (!orig || /^\d{4}-\d{2}-\d{2}/.test(orig)) return;

                    const translated = trans(orig);
                    if (orig !== translated) {
                        target.dataset.nsxTime = orig;
                        target.textContent = translated;
                    }
                });
            };
            const sels = 'time, .date-created, .date-updated, .post-info, .comment-info';
            const doRun = () => run(ctx.$$(sels));
            doRun();
            ctx.watch(sels, doRun, { debounce: 200 });
        }
    };

    const __vite_glob_0_21 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: timeChinese
    }, Symbol.toStringTag, { value: 'Module' }));


    // ===== SVG 图标 =====
    const SVG_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
<symbol id="copy" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M13 12.432v-4.62A2.813 2.813 0 0 1 15.813 5h24.374A2.813 2.813 0 0 1 43 7.813v24.375A2.813 2.813 0 0 1 40.188 35h-4.672M7.813 13h24.374A2.813 2.813 0 0 1 35 15.813v24.374A2.813 2.813 0 0 1 32.188 43H7.813A2.813 2.813 0 0 1 5 40.188V15.813A2.813 2.813 0 0 1 7.813 13Z"/></symbol>
<symbol id="check" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m4 24 5-5 10 10L39 9l5 5-25 25L4 24Z"/></symbol>
<symbol id="history" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M5.818 6.727V14h7.273"/><path d="M4 24c0 11.046 8.954 20 20 20s20-8.954 20-20S35.046 4 24 4c-7.32 0-13.715 3.932-17.192 9.8"/><path d="M24 12v14l9.33 9.33"/></g></symbol>
<symbol id="comments" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M44 6H4v30h8.5v7l9-7H44V6Z"/><path stroke-linecap="round" d="M14 19.5h20M14 27.5h12"/></g></symbol>
<symbol id="at-sign" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20"/><path d="M32 24c0 4.418-3.582 10-8 10s-8-5.582-8-10 3.582-8 8-8 8 3.582 8 8m0 0v10c0 3 3 6 6 6"/></g></symbol>
<symbol id="envelope-one" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M4 39h40V9H4z"/><path d="m4 9 20 15L44 9"/></g></symbol>
<symbol id="remind-6nce9p47" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M24 44c1.387 0 2.732-.123 4.023-.357M44 24a20 20 0 0 0-40 0c0 4.59 1.55 8.82 4.157 12.194L4 44l7.806-4.157A19.9 19.9 0 0 0 24 44a20 20 0 0 0 4.023-.357"/><path d="M33.805 40a6 6 0 1 0 5.857-9.805"/></g></symbol>
<symbol id="down" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m36 18-12 12-12-12"/></symbol>
</svg>`;

    // ===== 基础 CSS =====
    const BASE_CSS = `.blocked-post{display:none!important}#nsx-toggle-autoload{display:flex;justify-content:center;align-items:center}#back-to-comment{display:flex}#fast-nav-button-group .nav-item-btn:nth-last-child(4){bottom:120px}#fast-nav-button-group .nav-item-btn:nth-last-child(5){bottom:160px}#fast-nav-button-group .nav-item-btn:nth-last-child(6){bottom:200px}#fast-nav-button-group .nav-item-btn:nth-last-child(7){bottom:240px}#nsx-icon-group{position:fixed;right:40px;top:0;height:56px;display:flex;align-items:center;justify-content:flex-end;gap:0!important;margin:0!important;z-index:1001}#nsx-icon-group>*{flex:0 0 auto!important;margin-left:0!important;margin-right:0!important}#nsx-icon-group>.ml-auto,#nsx-icon-group>[class*="ml-auto"]{margin-left:0!important}#nsx-icon-group>.filter-dropdown-on,#nsx-icon-group>.relation-dropdown-on,#nsx-icon-group>.history-dropdown-on{cursor:pointer;display:flex!important;align-items:center;justify-content:center;height:56px!important;padding:0 4px!important;min-width:auto!important;width:auto!important;margin:0!important;position:relative!important;top:-7px!important;transition:opacity .1s}#nsx-icon-group>.filter-dropdown-on svg,#nsx-icon-group>.relation-dropdown-on svg,#nsx-icon-group>.history-dropdown-on svg{display:block!important;width:clamp(15px,4vw,17px)!important;height:clamp(15px,4vw,17px)!important;transform:translateY(0)!important}#nsx-icon-group>.filter-dropdown-on:hover,#nsx-icon-group>.relation-dropdown-on:hover,#nsx-icon-group>.history-dropdown-on:hover{opacity:.6}#nsx-filter-panel,#nsx-history-panel,#nsx-rel-panel{position:fixed;right:12px;top:60px;width:min(380px,94vw);height:min(700px,80vh);background:#fff;border:1px solid #e4e4e4;border-radius:12px;box-shadow:0 4px 12px rgba(15,23,42,.11);z-index:99999;display:none;flex-direction:column;overflow:hidden}#nsx-filter-panel.show,#nsx-history-panel.show,#nsx-rel-panel.show{display:flex}.dark-layout #nsx-filter-panel,.dark-layout #nsx-history-panel,.dark-layout #nsx-rel-panel{background:#1e1e1e;border-color:#3a3a3a;color:#e0e0e0}.msc-overlay{background-color:var(--bg-sub-color)}`;
    const PANEL_SHELL_CSS = `
    #nsx-filter-panel,#nsx-history-panel,#nsx-rel-panel{
        right:10px;
        width:min(430px,96vw);
        height:min(78vh,760px);
        border-radius:16px;
        border:1px solid rgba(15,23,42,.1);
        background:rgba(248,250,252,.96);
        box-shadow:0 4px 12px rgba(15,23,42,.11);
        opacity:0;
        transform:translateY(10px) scale(.985);
        pointer-events:none;
        overscroll-behavior:contain;
        touch-action:pan-y;
        transition:opacity .16s ease,transform .16s ease,border-color .16s ease,background .16s ease;
    }
    #nsx-filter-panel.show,#nsx-history-panel.show,#nsx-rel-panel.show{
        opacity:1;
        transform:translateY(0) scale(1);
        pointer-events:auto;
    }
    body.dark-layout #nsx-filter-panel,html.dark #nsx-filter-panel,
    body.dark-layout #nsx-history-panel,html.dark #nsx-history-panel,
    body.dark-layout #nsx-rel-panel,html.dark #nsx-rel-panel{
        border-color:rgba(148,163,184,.2);
        background:rgba(15,23,42,.86);
        box-shadow:0 6px 14px rgba(2,6,23,.3);
    }
    @media (max-width:768px){
        #nsx-filter-panel,#nsx-history-panel,#nsx-rel-panel{
            right:8px;
            width:min(96vw,420px);
            border-radius:14px;
        }
    }`;

    const setAppPullToRefreshSuppressed = (suppressed) => {
        try { window.NSXBridge?.setPullToRefreshSuppressed?.(!!suppressed); } catch { }
    };
    // 兜底：上一个页面如果异常退出（未走到 close），Bridge 侧抑制状态可能残留为 true。
    // 每次脚本启动时先主动恢复一次，避免下拉刷新被长期禁用。
    setAppPullToRefreshSuppressed(false);
    addEventListener("pagehide", () => setAppPullToRefreshSuppressed(false), { capture: true });
    addEventListener("beforeunload", () => setAppPullToRefreshSuppressed(false), { capture: true });

    const panelRefreshGuard = (() => {
        let opened = 0;
        return {
            open() {
                opened += 1;
                if (opened > 0) setAppPullToRefreshSuppressed(true);
            },
            close() {
                opened = Math.max(0, opened - 1);
                setAppPullToRefreshSuppressed(opened > 0);
            }
        };
    })();

    const applyRuntimeSettings = (ctx, changedKeys = []) => {
        const changed = new Set(changedKeys || []);
        const has = (prefix) => [...changed].some(k => k === prefix || k.startsWith(prefix + "."));

        if (has("block_posts")) window.__nsxRuntime?.reapplyKeywords?.();
        if (has("relation")) window.__nsxRuntime?.reapplyRelation?.();
        if (has("history")) window.__nsxRuntime?.refreshHistory?.();
        if (has("visited_color")) {
            const styleId = "nsx-visited-color";
            const enabled = ctx.store.get("visited_color.enabled", true);
            const old = document.getElementById(styleId);
            if (!enabled) {
                old?.remove();
            } else {
                const light = ctx.store.get("visited_color.light", DEFAULT_LIGHT);
                const dark = ctx.store.get("visited_color.dark", DEFAULT_DARK);
                const css = `.post-list .post-title a:visited{color:${light}}body.dark-layout .post-list .post-title a:visited{color:${dark}}`;
                if (old && old.tagName === "STYLE") {
                    old.textContent = css;
                } else {
                    old?.remove();
                    const el = document.createElement("style");
                    el.id = styleId;
                    el.textContent = css;
                    document.head?.appendChild(el);
                }
            }
        }

        if (has("button_pos") || has("layout") || has("ui")) {
            // 小屏移动端：图标组跟随网页头部，不走“浮动定位”逻辑
            if (isSmallScreen()) {
                document.getElementById("nsx-icon-pos-runtime")?.remove();
            } else {
                const right = Number(ctx.store.get("button_pos.right", 40));
                const top = Number(ctx.store.get("button_pos.top", 0));
                const iconTop = Number(ctx.store.get("button_pos.icon_top", -7));
                addStyle(
                    "nsx-icon-pos-runtime",
                    `#nsx-icon-group{right:${Number.isFinite(right) ? right : 40}px!important;top:${Number.isFinite(top) ? top : 0}px!important}#nsx-icon-group>.filter-dropdown-on,#nsx-icon-group>.relation-dropdown-on,#nsx-icon-group>.history-dropdown-on{top:${Number.isFinite(iconTop) ? iconTop : -7}px!important}`
                );
            }
        }
    };

    // ===== Observer =====
    class Observer {
        constructor() { this.listeners = []; this.mo = null; }
        watch(sel, fn, opts = {}) {
            this.listeners.push({ sel, fn, opts });
            if (!this.mo) {
                this.mo = new MutationObserver(debounce((muts) => {
                    if (!muts?.some(m => m.addedNodes?.length)) return;
                    this._run();
                }, 50));
                this.mo.observe(document.body, { childList: true, subtree: true });
            }
        }
        _run() {
            this.listeners.forEach(({ sel, fn, opts }) => {
                const els = $$(sel);
                if (els.length) fn(els, opts);
            });
        }
    }

    // ===== 创建 ctx =====
    function createCtx(obs) {
        const uw = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
        return {
            env, $, $$, addStyle, store, net,
            uw,
            get loggedIn() { return !!uw?.__config__?.user; },
            get user() { return uw?.__config__?.user; },
            get uid() { return uw?.__config__?.user?.member_id; },
            site: env.site,
            isPost: /^\/post-/.test(location.pathname),
            isList: /^\/(categories\/|page|award|search|$)/.test(location.pathname),
            watch: obs.watch.bind(obs),
            ui: {}
        };
    }

    // ===== 启动 =====
    function start() {
        // 注入资源
        document.body?.insertAdjacentHTML("beforeend", SVG_SPRITE);
        addStyle("nsx-base", BASE_CSS);
        addStyle("nsx-panel-shell", PANEL_SHELL_CSS);
        // layui CSS
        addStyle("nsx-layui-css", "https://s.cfn.pp.ua/layui/2.10.3/css/layui.css");
        addStyle("nsx-layui-dark", "https://s.cfn.pp.ua/layui/theme-dark/2.10.3/css/layui-theme-dark-selector.css");

        // highlight.js 脚本
        addScript("nsx-hljs-script", "https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/highlight.min.js");
        // highlight.js 样式
        addStyle("hightlight-style", GM_getResourceURL("highlightStyle"));
        // hljs 初始化
        addScript("nsx-hljs-onload", `(()=>{const r=()=>{if(window.hljs&&typeof hljs.highlightAll==="function")hljs.highlightAll()};document.readyState==="complete"?r():window.addEventListener("load",r,{once:true})})()`);

        // 加载模块
        const mods = /* #__PURE__ */ Object.assign({ "./features/autoJump.js": __vite_glob_0_0, "./features/autoLoading.js": __vite_glob_0_1, "./features/callout.js": __vite_glob_0_5, "./features/codeHighlight.js": __vite_glob_0_6, "./features/commentShortcut.js": __vite_glob_0_7, "./features/darkMode.js": __vite_glob_0_8, "./features/history.js": __vite_glob_0_9, "./features/imageSlide.js": __vite_glob_0_10, "./features/instantPage.js": __vite_glob_0_11, "./features/levelTag.js": __vite_glob_0_12, "./features/menus.js": __vite_glob_0_13, "./features/quickComment.js": __vite_glob_0_14, "./features/signIn.js": __vite_glob_0_16, "./features/signinTips.js": __vite_glob_0_17, "./features/smoothScroll.js": __vite_glob_0_18, "./features/userCardExt.js": __vite_glob_0_19, "./features/visitedColor.js": __vite_glob_0_20, "./features/timeChinese.js": __vite_glob_0_21 });
        Object.values(mods).forEach(m => m.default && define(m.default));

        // 创建 Observer & ctx
        const obs = new Observer();
        const ctx = createCtx(obs);

        // 初始化 UI (依赖 layui)
        const initUI = () => {
            if (!window.layui?.layer) return (ctx.ui = {});
            const layer = window.layui.layer, uw = ctx.uw;
            ctx.ui = {
                layer,
                toast: (text, style) => { const idx = layer.msg(text, { offset: 't', area: ['100%', 'auto'], anim: 'slideDown' }); layer.style(idx, Object.assign({ opacity: 0.9 }, style)); return idx; },
                info: msg => ctx.ui.toast(msg, { "background-color": "#4D82D6" }),
                success: msg => ctx.ui.toast(msg, { "background-color": "#57BF57" }),
                warning: msg => ctx.ui.toast(msg, { "background-color": "#D6A14D" }),
                error: msg => ctx.ui.toast(msg, { "background-color": "#E1715B" }),
                alert: (t, c, fn) => uw?.mscAlert ? (c === undefined ? uw.mscAlert(t) : uw.mscAlert(t, c)) : layer.alert(c, { title: t, icon: 0, btn: ["确定"] }, fn),
                confirm: (t, c, y, n) => uw?.mscConfirm ? uw.mscConfirm(t, c, y, n) : layer.confirm(c, { title: t, icon: 0, btn: ["确定", "取消"] }, y, n),
                tips: (msg, el, opts) => layer.tips(msg, el, opts)
            };
        };
        initUI();
        if (!ctx.ui.layer) {
            const timer = setInterval(() => { if (window.layui?.layer) { initUI(); clearInterval(timer); } }, 100);
            setTimeout(() => clearInterval(timer), 5000);
        }

        // 启动所有模块
        /* ==========================================================================
           [ 🚀 基础功能 ] - 图床上传助手 (NodeImage)
           ========================================================================== */
        const imageUpload = {
            id: "imageUpload",
            deps: ["ui"],
            order: 150,
            cfg: { image_upload: { enabled: true, api_key: "" } },
            meta: {
                image_upload: {
                    label: "图床上传助手",
                    group: "🚀 基础功能",
                    fields: {
                        api_key: { type: "TEXT", label: "NodeImage API Key", placeholder: "留空或填写 API Key" }
                    }
                }
            },
            match: ctx => (ctx.isPost || location.pathname.startsWith('/new-discussion')) && ctx.store.get("image_upload.enabled", true),
            init(ctx) {
                const APP = {
                    api: {
                        key: ctx.store.get("image_upload.api_key", ""),
                        setKey: key => {
                            ctx.store.set("image_upload.api_key", key);
                            APP.api.key = key;
                            UI.updateState();
                        },
                        clearKey: () => {
                            ctx.store.set("image_upload.api_key", "");
                            APP.api.key = '';
                            UI.updateState();
                        },
                        endpoints: {
                            upload: 'https://api.nodeimage.com/api/upload',
                            apiKey: 'https://api.nodeimage.com/api/user/api-key'
                        }
                    },
                    site: { url: 'https://www.nodeimage.com' },
                    storage: {
                        keys: { loginCheck: 'nodeimage_login_check', loginStatus: 'nodeimage_login_status', logout: 'nodeimage_logout' },
                        get: key => localStorage.getItem(APP.storage.keys[key]),
                        set: (key, value) => localStorage.setItem(APP.storage.keys[key], value),
                        remove: key => localStorage.removeItem(APP.storage.keys[key])
                    },
                    retry: { max: 2, delay: 1000 },
                    statusTimeout: 2000,
                    auth: { recentLoginGracePeriod: 30000, loginCheckInterval: 3000, loginCheckTimeout: 300000 }
                };

                const SELECTORS = { editor: '.CodeMirror', toolbar: '.mde-toolbar', imgBtn: '.toolbar-item.i-icon.i-icon-pic[title="图片"]', container: '#nodeimage-toolbar-container' };

                const STATUS = {
                    SUCCESS: { class: 'success', color: '#42d392' },
                    ERROR: { class: 'error', color: '#f56c6c' },
                    WARNING: { class: 'warning', color: '#e6a23c' },
                    INFO: { class: 'info', color: '#0078ff' }
                };

                const MESSAGE = {
                    READY: '图床已就绪',
                    NEED_API_KEY: '未配置 API Key',
                    UPLOADING: '上传中...',
                    UPLOAD_SUCCESS: '上传成功！',
                    LOGIN_EXPIRED: '图床登录已失效',
                    LOGOUT: '图床已退出登录',
                    RETRY: (c, m) => `重试 (${c}/${m})`
                };

                const DOM = { editor: null, statusElements: new Set(), loginButtons: new Set(), getEditor: () => DOM.editor?.CodeMirror };

                addStyle("nsx-image-upload", `
                #nodeimage-status { margin-left: 10px; display: inline-block; font-size: 13px; height: 28px; line-height: 28px; transition: all 0.3s ease; }
                #nodeimage-status.success { color: ${STATUS.SUCCESS.color}; }
                #nodeimage-status.error { color: ${STATUS.ERROR.color}; }
                #nodeimage-status.warning { color: ${STATUS.WARNING.color}; }
                #nodeimage-status.info { color: ${STATUS.INFO.color}; }
                .nodeimage-login-btn { cursor: pointer; margin-left: 10px; color: ${STATUS.WARNING.color}; font-size: 13px; background: rgba(230,162,60,0.1); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(230,162,60,0.2); }
                .nodeimage-toolbar-container { display: flex; align-items: center; margin-left: auto; margin-right: 10px; }
            `);

                const Utils = {
                    waitForElement: selector => new Promise(res => {
                        const el = document.querySelector(selector);
                        if (el) return res(el);
                        new MutationObserver((_, o) => { const found = document.querySelector(selector); if (found) { o.disconnect(); res(found); } }).observe(document.body, { childList: true, subtree: true });
                    }),
                    isEditingInEditor: () => { const a = document.activeElement; return a && (a.classList.contains('CodeMirror') || a.closest('.CodeMirror') || a.tagName === 'TEXTAREA'); },
                    createFileInput: cb => { const i = Object.assign(document.createElement('input'), { type: 'file', multiple: true, accept: 'image/*' }); i.onchange = e => cb([...e.target.files]); i.click(); },
                    delay: ms => new Promise(r => setTimeout(r, ms))
                };

                const API = {
                    request: ({ url, method = 'GET', data = null, headers = {}, withAuth = false }) => {
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method, url,
                                headers: { 'Accept': 'application/json', ...(withAuth && APP.api.key ? { 'X-API-Key': APP.api.key } : {}), ...headers },
                                data, withCredentials: true, responseType: 'json',
                                onload: response => { if (response.status === 200 && response.response) resolve(response.response); else reject(response); },
                                onerror: reject
                            });
                        });
                    },
                    checkLoginAndGetKey: async () => {
                        try {
                            const response = await API.request({ url: APP.api.endpoints.apiKey });
                            if (response.api_key) { APP.api.setKey(response.api_key); return true; }
                            if (response.error) APP.api.clearKey();
                            return false;
                        } catch (error) { APP.api.clearKey(); return false; }
                    },
                    uploadImage: async (file, retries = 0) => {
                        try {
                            const formData = new FormData();
                            formData.append('image', file);
                            const result = await API.request({ url: APP.api.endpoints.upload, method: 'POST', data: formData, withAuth: true });
                            if (result.success) return { url: result.links.direct, markdown: result.links.markdown };
                            else {
                                const errorMsg = result.error || '未知错误';
                                if (errorMsg.toLowerCase().match(/unauthorized|invalid api key|未授权|无效的api密钥/)) { APP.api.clearKey(); throw new Error(MESSAGE.LOGIN_EXPIRED); }
                                throw new Error(errorMsg);
                            }
                        } catch (error) {
                            if (error.status === 401 || error.status === 403) { APP.api.clearKey(); throw new Error(MESSAGE.LOGIN_EXPIRED); }
                            if (retries < APP.retry.max) {
                                setStatus(STATUS.WARNING.class, MESSAGE.RETRY(retries + 1, APP.retry.max));
                                await Utils.delay(APP.retry.delay);
                                return API.uploadImage(file, retries + 1);
                            }
                            throw error instanceof Error ? error : new Error(String(error));
                        }
                    }
                };

                const setStatus = (cls, msg, ttl = 0) => { DOM.statusElements.forEach(el => { el.className = cls; el.textContent = msg; }); if (ttl) return Utils.delay(ttl).then(UI.updateState); };

                const UI = {
                    updateState: () => {
                        const isLoggedIn = Boolean(APP.api.key);
                        DOM.loginButtons.forEach(btn => { btn.style.display = isLoggedIn ? 'none' : 'inline-block'; });
                        DOM.statusElements.forEach(el => {
                            if (isLoggedIn) { el.className = STATUS.SUCCESS.class; el.textContent = MESSAGE.READY; }
                            else { el.className = STATUS.WARNING.class; el.textContent = MESSAGE.NEED_API_KEY; }
                        });
                    },
                    openLoginPage: () => {
                        try {
                            if (typeof GM_openInTab === "function") return GM_openInTab(APP.site.url, { active: true, insert: true, setParent: true });
                        } catch { }
                        try { window.open(APP.site.url, '_blank'); } catch { }
                    },
                    promptApiKey: () => {
                        const title = "请输入 NodeImage API Key";
                        const tip = "提示：App 内外浏览器登录态通常不互通，建议直接粘贴 API Key。";
                        const save = (raw) => {
                            const key = String(raw ?? "").trim();
                            if (!key) return false;
                            APP.api.setKey(key);
                            try { ctx.ui?.success?.("NodeImage API Key 已保存"); } catch { }
                            return true;
                        };
                        if (ctx.ui?.layer?.prompt) {
                            ctx.ui.layer.prompt({ title: `${title}<br><span style="font-size:12px;opacity:.72">${tip}</span>`, formType: 0, value: APP.api.key || "" }, (val, idx) => {
                                if (!save(val)) {
                                    try { ctx.ui?.warning?.("API Key 不能为空"); } catch { }
                                    return;
                                }
                                ctx.ui.layer.close(idx);
                            });
                            return;
                        }
                        try {
                            const val = prompt(`${title}\n${tip}`, APP.api.key || "");
                            if (val != null) save(val);
                        } catch { }
                    },
                    openLogin: () => UI.promptApiKey(),
                    setupToolbar: toolbar => {
                        if (!toolbar || toolbar.querySelector(SELECTORS.container)) return;
                        const container = document.createElement('div'); container.id = 'nodeimage-toolbar-container'; container.className = 'nodeimage-toolbar-container';

                        const fullScreenBtn = toolbar.querySelector('.i-icon-full-screen-one')?.parentElement || toolbar.querySelector('.i-icon-off-screen-one')?.parentElement || toolbar.querySelector('.toolbar-item.right');
                        if (fullScreenBtn) {
                            toolbar.insertBefore(container, fullScreenBtn);
                        } else {
                            toolbar.appendChild(container);
                        }

                        const imgBtn = toolbar.querySelector(SELECTORS.imgBtn);
                        if (imgBtn) {
                            const newBtn = imgBtn.cloneNode(true);
                            imgBtn.parentNode.replaceChild(newBtn, imgBtn);
                            newBtn.addEventListener('click', async () => {
                                if (!(await Auth.ensureAuthForUpload())) return;
                                Utils.createFileInput(ImageHandler.handleFiles);
                            });
                        }

                        const statusEl = document.createElement('div'); statusEl.id = 'nodeimage-status'; statusEl.className = STATUS.INFO.class;
                        container.appendChild(statusEl); DOM.statusElements.add(statusEl);
                        const loginBtn = document.createElement('div'); loginBtn.className = 'nodeimage-login-btn'; loginBtn.textContent = '设置 API Key';
                        loginBtn.addEventListener('click', UI.openLogin); loginBtn.style.display = 'none';
                        container.appendChild(loginBtn); DOM.loginButtons.add(loginBtn);
                        UI.updateState();
                    }
                };

                const ImageHandler = {
                    handlePaste: async e => {
                        if (!Utils.isEditingInEditor()) return;
                        const dt = e.clipboardData || e.originalEvent?.clipboardData; if (!dt) return;
                        let files = [];
                        if (dt.files && dt.files.length) { files = Array.from(dt.files).filter(f => f.type.startsWith('image/')); }
                        else if (dt.items && dt.items.length) { files = Array.from(dt.items).filter(i => i.kind === 'file' && i.type.startsWith('image/')).map(i => i.getAsFile()).filter(Boolean); }
                        if (files.length) {
                            e.preventDefault(); e.stopPropagation();
                            if (!(await Auth.ensureAuthForUpload())) return;
                            ImageHandler.handleFiles(files);
                        }
                    },
                    handleFiles: async files => {
                        if (!(await Auth.ensureAuthForUpload())) return;
                        files.filter(file => file?.type.startsWith('image/')).forEach(ImageHandler.uploadAndInsert);
                    },
                    uploadAndInsert: async file => {
                        setStatus(STATUS.INFO.class, MESSAGE.UPLOADING);
                        try {
                            const result = await API.uploadImage(file);
                            ImageHandler.insertMarkdown(result.markdown);
                            await setStatus(STATUS.SUCCESS.class, MESSAGE.UPLOAD_SUCCESS, APP.statusTimeout);
                        } catch (error) {
                            if (error.message === MESSAGE.LOGIN_EXPIRED) {
                                APP.api.clearKey();
                                await Auth.ensureAuthForUpload(true);
                            }
                            console.error('[NodeImage]', error);
                            await setStatus(STATUS.ERROR.class, `上传失败: ${error.message}`, APP.statusTimeout);
                            ctx.ui.error?.(`图片上传失败: ${error.message}`);
                        }
                    },
                    insertMarkdown: markdown => {
                        const cm = DOM.getEditor();
                        if (cm) { const cursor = cm.getCursor(); cm.replaceRange(`\n${markdown}\n`, cursor); }
                    }
                };

                const Auth = {
                    ensureAuthForUpload: async (showPrompt = true) => {
                        if (APP.api.key) return true;
                        const ok = await API.checkLoginAndGetKey();
                        if (ok) return true;
                        if (showPrompt) UI.promptApiKey();
                        return false;
                    },
                    checkLoginIfNeeded: async (forceCheck = false) => {
                        if (APP.api.key && !forceCheck) return true;
                        const isLoggedIn = await Auth.ensureAuthForUpload(false);
                        UI.updateState();
                        return isLoggedIn;
                    },
                    checkLogoutFlag: () => { if (APP.storage.get('logout') === 'true') { APP.api.clearKey(); APP.storage.remove('logout'); setStatus(STATUS.WARNING.class, MESSAGE.LOGOUT); } },
                    checkRecentLogin: async () => { const lastLoginCheck = APP.storage.get('loginCheck'); if (lastLoginCheck && (Date.now() - parseInt(lastLoginCheck) < APP.auth.recentLoginGracePeriod)) { await API.checkLoginAndGetKey(); APP.storage.remove('loginCheck'); } },
                    setupStorageListener: () => {
                        window.addEventListener('storage', event => {
                            const { loginStatus, logout } = APP.storage.keys;
                            if (event.key === loginStatus && event.newValue === 'login_success') { API.checkLoginAndGetKey(); localStorage.removeItem(loginStatus); }
                            else if (event.key === logout && event.newValue === 'true') { APP.api.clearKey(); localStorage.removeItem(logout); }
                        });
                    }
                };

                const initModule = async () => {
                    document.addEventListener('paste', ImageHandler.handlePaste, true);
                    window.addEventListener('focus', () => Auth.checkLoginIfNeeded());
                    Utils.waitForElement(SELECTORS.editor).then(editor => {
                        DOM.editor = editor;
                        editor.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
                        editor.addEventListener('drop', e => { e.preventDefault(); ImageHandler.handleFiles(Array.from(e.dataTransfer.files)); });
                    });
                    Utils.waitForElement(SELECTORS.toolbar).then(UI.setupToolbar);
                    ctx.watch(SELECTORS.toolbar, () => {
                        const toolbar = document.querySelector(SELECTORS.toolbar);
                        if (toolbar && !toolbar.querySelector(SELECTORS.container)) UI.setupToolbar(toolbar);
                    }, { debounce: 200 });

                    Auth.checkLogoutFlag(); Auth.setupStorageListener(); await Auth.checkRecentLogin(); await Auth.checkLoginIfNeeded();
                };

                initModule();
            }
        };
        define(imageUpload);

        /* ==========================================================================
           [ 🧭 辅助工具 ] - 新标签页打开链接修复
           ========================================================================== */
        const openInNewTabFix = {
            id: "openInNewTabFix",
            order: 390,
            match: ctx => ctx.store.get("open_post_in_new_tab.enabled", false),
            meta: { open_post_in_new_tab: { label: "新标签页打开帖子", group: "🧭 辅助工具" } },
            init(ctx) {
                const addTarget = (els) => {
                    els.forEach(a => {
                        if (a.getAttribute("target") !== "_blank") {
                            a.setAttribute("target", "_blank");
                        }
                    });
                };
                addTarget(document.querySelectorAll('a[href^="/post-"]'));
                ctx.watch('a[href^="/post-"]', addTarget, { debounce: 100 });
            }
        };
        define(openInNewTabFix);

        /* ==========================================================================
           [ 🧭 辅助工具 ] - 首页置顶轮播点击兜底
           ========================================================================== */
        const topicCarouselTapFix = {
            id: "topicCarouselTapFix",
            order: 395,
            match: ctx => ctx.isList,
            init() {
                addStyle("nsx-topic-carousel-tap-fix", `
                .topic-carousel-wrapper .carousel-mask{pointer-events:none!important}
                .topic-carousel-panel .topic-carousel-item.slide-fade-leave-to,
                .topic-carousel-panel .topic-carousel-item.animate__fadeOutLeft,
                .topic-carousel-panel .topic-carousel-item.animate__fadeOut{pointer-events:none!important}
                `);

                window.__nsxRuntime ||= {};
                if (window.__nsxRuntime.topicCarouselTapFixBound) return;
                window.__nsxRuntime.topicCarouselTapFixBound = true;

                const resolvePostLink = (item) => item?.querySelector?.(
                    '.post-title a[href^="/post-"], .post-title a[href*="/post-"], a[href^="/post-"], a[href*="/post-"]'
                );

                const isPrimaryClick = (e) => {
                    if (e.button !== undefined && e.button !== 0) return false;
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
                    return true;
                };

                document.addEventListener("click", e => {
                    if (!isPrimaryClick(e) || e.defaultPrevented) return;

                    const target = e.target;
                    if (!(target instanceof Element)) return;

                    const item = target.closest(".topic-carousel-item");
                    if (!item || !item.closest(".topic-carousel-panel")) return;
                    if (target.closest("a[href],button,input,textarea,select,label,summary")) return;

                    const sel = window.getSelection?.();
                    if (sel && String(sel.type || "").toLowerCase() === "range") return;

                    const postLink = resolvePostLink(item);
                    const href = String(postLink?.getAttribute?.("href") || "").trim();
                    if (!href || href.startsWith("#") || /^javascript:/i.test(href)) return;

                    try { e.preventDefault(); } catch { }
                    try { e.stopPropagation(); } catch { }
                    try {
                        const next = new URL(href, location.href);
                        location.assign(next.href);
                    } catch {
                        location.assign(href);
                    }
                }, true);
            }
        };
        define(topicCarouselTapFix);

        /* ==========================================================================
