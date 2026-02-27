           [ 🎨 视觉美化 ] - 名望诊断系统 (Reputation System)
           ========================================================================== */
        const inlineUserInfo = {
            id: "inlineUserInfo",
            deps: ["ui"],
            order: 390,
            cfg: {
                inline_user_info: {
                    enabled: true,
                    show_op: true,
                    show_cmt: true,
                    mobile_detail_card: true
                }
            },
            meta: {
                inline_user_info: {
                    label: "名望诊断系统",
                    group: "🧭 辅助工具",
                    fields: {
                        show_op: { type: "SWITCH", label: "作用于楼主" },
                        show_cmt: { type: "SWITCH", label: "作用于评论" },
                        mobile_detail_card: { type: "SWITCH", label: "手机端显示详细诊断卡片" }
                    }
                }
            },
            match: ctx => ctx.loggedIn && ctx.isPost && (ctx.store.get("inline_user_info.enabled", true) || ctx.store.get("relation.show_friend_btn", true) || ctx.store.get("relation.show_block_btn", true)),
            init(ctx) {
                const isShowOpEnabled = () => ctx.store.get("inline_user_info.show_op", true);
                const isShowCmtEnabled = () => ctx.store.get("inline_user_info.show_cmt", true);
                const isMobileDetailCardEnabled = () => ctx.store.get("inline_user_info.mobile_detail_card", true);
                const cache = new Map();
                const fetching = new Map();
                let fetchQueue = Promise.resolve(); // 用于控制并发的队列列车

                addStyle("nsx-lv-colors", `.role-tag.user-level{color:#fafafa;font-weight:bold;}.user-lv0{background:#b71c1c;border-color:#b71c1c}.user-lv1{background:#e53935;border-color:#e53935}.user-lv2{background:#f57c00;border-color:#f57c00}.user-lv3{background:#ffca28;border-color:#ffca28;color:#333}.user-lv4{background:#cddc39;border-color:#cddc39;color:#333}.user-lv5{background:#7cb342;border-color:#7cb342}.user-lv6{background:#43a047;border-color:#43a047}.user-lv7{background:#00897b;border-color:#00897b}.user-lv8{background:#039be5;border-color:#039be5}.user-lv9{background:#1e88e5;border-color:#1e88e5}.user-lv10{background:#3949ab;border-color:#3949ab}.user-lv11{background:#5e35b1;border-color:#5e35b1}.user-lv12{background:#8e24aa;border-color:#8e24aa}.user-lv13{background:#d81b60;border-color:#d81b60}.user-lv14{background:#546e7a;border-color:#546e7a}.user-lv15{background:#212121;border-color:#212121;color:#ffca28}`);

		                addStyle("nsx-mobile-user-actions", `
		.nsx-user-actions-btn{margin-left:6px;border:0;background:transparent;color:inherit;opacity:.75;font-size:clamp(16px,4.5vw,18px);line-height:1;padding:0 4px;cursor:pointer}
		.nsx-user-actions-btn:active{opacity:1}
		@media (min-width:481px){.nsx-user-actions-btn{display:none!important}}
		.nsx-user-sheet{
			--nsx-sheet-border:rgba(15,23,42,.12);
			--nsx-sheet-soft:#f8fafc;
			--nsx-sheet-muted:#64748b;
			--nsx-sheet-title:#0f172a;
			display:flex;
			flex-direction:column;
			gap:8px;
			padding:1px 0;
			max-width:min(100%,346px);
			margin:0 auto
		}
		body.dark-layout .nsx-user-sheet,html.dark .nsx-user-sheet{
			--nsx-sheet-border:rgba(148,163,184,.28);
			--nsx-sheet-soft:#111827;
			--nsx-sheet-muted:#94a3b8;
			--nsx-sheet-title:#e2e8f0
		}
		.nsx-user-sheet-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:1px 1px 0}
		.nsx-user-sheet-name-wrap{display:flex;flex-direction:column;min-width:0}
		.nsx-user-sheet-name{font-weight:840;font-size:15px;line-height:1.15;color:var(--nsx-sheet-title);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
		.nsx-user-sheet-id{margin-top:1px;font-size:10px;font-weight:700;letter-spacing:.15px;color:var(--nsx-sheet-muted)}
		.nsx-user-sheet-meta{font-size:11px;line-height:1.45;color:var(--nsx-sheet-muted,#64748b);border:1px solid rgba(15,23,42,.08);border-radius:10px;background:rgba(248,250,252,.82);padding:7px 9px}
		body.dark-layout .nsx-user-sheet-meta,html.dark .nsx-user-sheet-meta{border-color:rgba(148,163,184,.2);background:rgba(15,23,42,.48)}
		.nsx-user-sheet-diagnosis-host{font-size:11px;color:var(--nsx-sheet-muted,#64748b);line-height:1.45;border:0;border-radius:0;background:transparent;padding:0}
		.nsx-user-sheet-diagnosis-host .nsx-user-sheet-diagnosis{margin:0}
		.nsx-user-sheet-diagnosis{
			border:1px solid rgba(15,23,42,.08);
			border-radius:10px;
			padding:8px 9px;
			background:rgba(248,250,252,.9);
			box-shadow:none;
			font-size:11px;
			line-height:1.45
		}
		body.dark-layout .nsx-user-sheet-diagnosis,html.dark .nsx-user-sheet-diagnosis{
			border-color:rgba(148,163,184,.18);
			background:rgba(15,23,42,.5);
			box-shadow:none
		}
		.nsx-user-sheet-diag-card{display:flex;flex-direction:column;gap:6px}
		.nsx-user-sheet-diag-head{display:flex;align-items:center;justify-content:space-between;gap:6px}
		.nsx-user-sheet-diag-title{font-size:13px;font-weight:820;color:var(--nsx-sheet-title,#0f172a)}
		.nsx-user-sheet-diag-lv{font-size:19px;line-height:1;font-weight:900;letter-spacing:.1px}
		.nsx-user-sheet-diag-sub{font-size:11px;color:var(--nsx-sheet-muted,#64748b)}
		.nsx-user-sheet-diag-badge{
			display:inline-flex;align-items:center;justify-content:center;
			min-width:22px;height:18px;padding:0 5px;
			border-radius:999px;
			font-weight:800;
			color:#0b4fcf;
			border:1px solid rgba(59,130,246,.34);
			background:linear-gradient(180deg,#e0f2fe,#dbeafe)
		}
		body.dark-layout .nsx-user-sheet-diag-badge,html.dark .nsx-user-sheet-diag-badge{color:#bfdbfe;border-color:rgba(96,165,250,.4);background:linear-gradient(180deg,rgba(30,64,175,.32),rgba(30,58,138,.22))}
		.nsx-user-sheet-diag-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
		.nsx-user-sheet-diag-item{
			display:flex;align-items:center;justify-content:space-between;
			gap:6px;padding:6px 7px;
			border-radius:7px;
			border:1px solid rgba(15,23,42,.06);
			background:rgba(255,255,255,.48)
		}
		body.dark-layout .nsx-user-sheet-diag-item,html.dark .nsx-user-sheet-diag-item{border-color:rgba(148,163,184,.16);background:rgba(15,23,42,.34)}
		.nsx-user-sheet-diag-item-label{font-size:11px;color:var(--nsx-sheet-muted,#64748b)}
		.nsx-user-sheet-diag-item-value{font-size:14px;font-weight:860;line-height:1}
		.nsx-user-sheet-diag-item a.nsx-user-sheet-diag-item-value{color:#0ea5e9;text-decoration:none}
		.nsx-user-sheet-diag-item a.nsx-user-sheet-diag-item-value:hover{text-decoration:underline}
		.nsx-user-sheet-diag-foot{
			display:flex;align-items:center;justify-content:space-between;gap:8px;
			border-top:1px solid rgba(15,23,42,.08);
			padding-top:7px;
			font-size:12px
		}
		body.dark-layout .nsx-user-sheet-diag-foot,html.dark .nsx-user-sheet-diag-foot{border-top-color:rgba(148,163,184,.16)}
		.nsx-user-sheet-diag-score,.nsx-user-sheet-diag-tag{font-weight:700;color:var(--nsx-sheet-muted,#64748b)}
		.nsx-user-sheet-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
		.nsx-user-sheet-btn{
			border:1px solid var(--nsx-sheet-border);
			background:#fff;
			border-radius:10px;
			padding:8px 8px;
			font-size:12px;
			font-weight:800;
			letter-spacing:.1px;
			color:#334155;
			cursor:pointer;
			transition:all .16s ease
		}
		body.dark-layout .nsx-user-sheet-btn,html.dark .nsx-user-sheet-btn{background:#121a27;color:#d1d5db}
		.nsx-user-sheet-btn.home{padding:6px 10px;border-color:rgba(59,130,246,.38);background:linear-gradient(180deg,#eff6ff,#e0ecff);color:#1d4ed8}
		body.dark-layout .nsx-user-sheet-btn.home,html.dark .nsx-user-sheet-btn.home{border-color:rgba(96,165,250,.45);background:linear-gradient(180deg,rgba(30,64,175,.35),rgba(30,58,138,.24));color:#bfdbfe}
		.nsx-user-sheet-actions .nsx-user-sheet-btn.friend{border-color:rgba(14,165,233,.42);background:linear-gradient(180deg,#ecfeff,#e0f2fe);color:#0369a1}
		.nsx-user-sheet-actions .nsx-user-sheet-btn.block{border-color:rgba(239,68,68,.42);background:linear-gradient(180deg,#fff1f2,#ffe4e6);color:#be123c}
		body.dark-layout .nsx-user-sheet-actions .nsx-user-sheet-btn.friend,html.dark .nsx-user-sheet-actions .nsx-user-sheet-btn.friend{border-color:rgba(56,189,248,.44);background:linear-gradient(180deg,rgba(3,105,161,.26),rgba(12,74,110,.2));color:#7dd3fc}
		body.dark-layout .nsx-user-sheet-actions .nsx-user-sheet-btn.block,html.dark .nsx-user-sheet-actions .nsx-user-sheet-btn.block{border-color:rgba(248,113,113,.44);background:linear-gradient(180deg,rgba(159,18,57,.34),rgba(136,19,55,.24));color:#fda4af}
		.nsx-user-sheet-btn:hover{transform:translateY(-1px)}
		.nsx-user-sheet-btn:active{transform:scale(.985);opacity:.96}
		/* 身份标签（楼主/博主/频道主/OneMan/管理/Dev/侦探/交易中介）：统一胶囊体系，小尺寸不抢主视觉 */
		.nsx-op-badge,.nsx-blogger-badge,.nsx-owner-badge,.nsx-oneman-badge,.nsx-admin-badge,.nsx-dev-badge,.nsx-detective-badge,.nsx-broker-badge{position:relative;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;height:14px!important;line-height:14px!important;padding:0 5px 0 7px!important;margin-left:5px!important;border-radius:999px!important;box-shadow:0 1px 3px rgba(0,0,0,.1)!important;font-size:9.5px!important;font-weight:760!important;letter-spacing:.1px!important;overflow:hidden}
		.nsx-op-badge{border:1px solid rgba(124,58,237,.32)!important;background:linear-gradient(180deg,rgba(245,243,255,.98),rgba(237,233,254,.86))!important;color:#6d28d9!important}
		.nsx-op-badge::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#a855f7 0%,#7c3aed 55%,#6d28d9 100%);opacity:.98}
		body.dark-layout .nsx-op-badge,html.dark .nsx-op-badge{border-color:rgba(167,139,250,.36)!important;background:linear-gradient(180deg,rgba(56,34,95,.98),rgba(38,24,68,.9))!important;box-shadow:0 1px 4px rgba(0,0,0,.32)!important;color:#ddd6fe!important}
		.nsx-blogger-badge{border:1px solid rgba(217,119,6,.34)!important;background:linear-gradient(180deg,rgba(255,247,237,.98),rgba(254,215,170,.86))!important;color:#b45309!important}
		.nsx-blogger-badge::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#fb923c 0%,#f59e0b 55%,#b45309 100%);opacity:.98}
		body.dark-layout .nsx-blogger-badge,html.dark .nsx-blogger-badge{border-color:rgba(251,146,60,.42)!important;background:linear-gradient(180deg,rgba(124,45,18,.92),rgba(99,34,18,.84))!important;box-shadow:0 1px 4px rgba(0,0,0,.32)!important;color:#fdba74!important}
		.nsx-owner-badge{border:1px solid rgba(5,150,105,.32)!important;background:linear-gradient(180deg,rgba(236,253,245,.98),rgba(209,250,229,.88))!important;color:#047857!important}
		.nsx-owner-badge::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#34d399 0%,#10b981 55%,#047857 100%);opacity:.98}
		body.dark-layout .nsx-owner-badge,html.dark .nsx-owner-badge{border-color:rgba(52,211,153,.42)!important;background:linear-gradient(180deg,rgba(6,78,59,.94),rgba(6,95,70,.86))!important;box-shadow:0 1px 4px rgba(0,0,0,.32)!important;color:#a7f3d0!important}
		/* OneMan 标签通常包含小图标，单独放宽高度与溢出，避免图标被裁切 */
		.nsx-oneman-badge{border:1px solid rgba(8,145,178,.34)!important;background:linear-gradient(180deg,rgba(236,254,255,.98),rgba(207,250,254,.88))!important;color:#0e7490!important;min-height:16px!important;height:auto!important;line-height:1.08!important;padding:1px 6px 1px 8px!important;gap:3px!important;overflow:visible!important}
		.nsx-oneman-badge::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#22d3ee 0%,#06b6d4 55%,#0e7490 100%);opacity:.98}
		.nsx-oneman-badge > i,.nsx-oneman-badge > svg,.nsx-oneman-badge > img{width:10px!important;height:10px!important;display:inline-block!important;flex:0 0 auto!important;vertical-align:middle!important;margin-right:2px!important;max-width:none!important;max-height:none!important}
		body.dark-layout .nsx-oneman-badge,html.dark .nsx-oneman-badge{border-color:rgba(34,211,238,.42)!important;background:linear-gradient(180deg,rgba(8,47,73,.92),rgba(12,74,110,.82))!important;box-shadow:0 1px 4px rgba(0,0,0,.32)!important;color:#a5f3fc!important}
		.nsx-admin-badge{border:1px solid rgba(37,99,235,.32)!important;background:linear-gradient(180deg,rgba(239,246,255,.98),rgba(219,234,254,.86))!important;color:#1d4ed8!important}
		.nsx-admin-badge::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#60a5fa 0%,#2563eb 55%,#1d4ed8 100%);opacity:.98}
		body.dark-layout .nsx-admin-badge,html.dark .nsx-admin-badge{border-color:rgba(96,165,250,.42)!important;background:linear-gradient(180deg,rgba(30,64,175,.34),rgba(30,58,138,.24))!important;box-shadow:0 1px 4px rgba(0,0,0,.32)!important;color:#bfdbfe!important}
		.nsx-dev-badge{border:1px solid rgba(8,145,178,.32)!important;background:linear-gradient(180deg,rgba(236,254,255,.98),rgba(207,250,254,.86))!important;color:#0e7490!important}
		.nsx-dev-badge::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#22d3ee 0%,#06b6d4 55%,#0e7490 100%);opacity:.98}
		body.dark-layout .nsx-dev-badge,html.dark .nsx-dev-badge{border-color:rgba(34,211,238,.42)!important;background:linear-gradient(180deg,rgba(8,47,73,.92),rgba(12,74,110,.82))!important;box-shadow:0 1px 4px rgba(0,0,0,.32)!important;color:#a5f3fc!important}
		.nsx-detective-badge{border:1px solid rgba(14,116,144,.34)!important;background:linear-gradient(180deg,rgba(236,254,255,.98),rgba(186,230,253,.86))!important;color:#0e7490!important}
		.nsx-detective-badge::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#22d3ee 0%,#0891b2 55%,#0e7490 100%);opacity:.98}
		body.dark-layout .nsx-detective-badge,html.dark .nsx-detective-badge{border-color:rgba(125,211,252,.42)!important;background:linear-gradient(180deg,rgba(8,47,73,.92),rgba(14,116,144,.72))!important;box-shadow:0 1px 4px rgba(0,0,0,.32)!important;color:#bae6fd!important}
		.nsx-broker-badge{border:1px solid rgba(217,119,6,.34)!important;background:linear-gradient(180deg,rgba(255,251,235,.98),rgba(254,243,199,.86))!important;color:#b45309!important}
		.nsx-broker-badge::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#fbbf24 0%,#f59e0b 55%,#b45309 100%);opacity:.98}
		body.dark-layout .nsx-broker-badge,html.dark .nsx-broker-badge{border-color:rgba(251,191,36,.42)!important;background:linear-gradient(180deg,rgba(120,53,15,.92),rgba(146,64,14,.82))!important;box-shadow:0 1px 4px rgba(0,0,0,.32)!important;color:#fde68a!important}
		.nsx-mute-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;height:14px!important;line-height:14px!important;padding:0 5px!important;margin-left:5px!important;border-radius:999px!important;border:1px solid #ffc1bb!important;background:#fff2f1!important;box-shadow:none!important;font-size:9.5px!important;font-weight:760!important;letter-spacing:0!important;color:#cf1322!important}
		.nsx-mute-badge.nsx-mute-badge-secondary{height:13px!important;line-height:13px!important;padding:0 4px!important;margin:0 6px 0 0!important;font-size:9px!important;vertical-align:middle!important;opacity:.95}
		.nsk-content-meta-info time + .nsx-mute-badge.nsx-mute-badge-secondary{margin-left:6px!important}
		body.dark-layout .nsx-mute-badge,html.dark .nsx-mute-badge{border-color:#8f3f46!important;background:#3a2225!important;color:#ffb9be!important}
		.nsx-user-info-display{--nsx-user-accent:#f59e0b;--nsx-user-accent-solid:#f59e0b;--nsx-user-side-accent:#f59e0b}
		.nsk-content-meta-info .author-info > a[href*="/space/"].nsx-user-id-main{font-weight:760!important;letter-spacing:.15px;color:var(--nsx-user-name-color,#3f3f46)!important;text-shadow:none}
		body.dark-layout .nsk-content-meta-info .author-info > a[href*="/space/"].nsx-user-id-main,html.dark .nsk-content-meta-info .author-info > a[href*="/space/"].nsx-user-id-main{color:var(--nsx-user-name-color-dark,#e7e5e4)!important;text-shadow:none}
		.nsx-user-id-meta{position:relative;display:inline-flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;flex:0 1 auto;min-width:0;max-width:min(56vw,360px);margin-left:6px;padding:3px 9px 4px 12px!important;font-size:11px!important;font-weight:630;line-height:1.06!important;color:var(--nsx-user-accent-solid,#334155);vertical-align:middle;border-radius:11px!important;border:1px solid rgba(15,23,42,.12);background:linear-gradient(180deg,rgba(255,255,255,.98) 0%,rgba(248,250,252,.84) 60%,rgba(241,245,249,.72) 100%);box-shadow:0 2px 8px rgba(15,23,42,.12),inset 0 1px 0 rgba(255,255,255,.7);backdrop-filter:saturate(1.15) blur(1px)}
		.nsx-user-id-meta::before{content:"";position:absolute;left:0;top:2px;bottom:2px;width:3.5px;border-radius:999px;background:var(--nsx-user-side-accent,var(--nsx-user-accent));opacity:.96;box-shadow:0 0 0 1px rgba(255,255,255,.16) inset}
		.nsx-user-id-meta::after{content:"";position:absolute;left:8px;right:8px;top:0;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.7),rgba(255,255,255,0));pointer-events:none}
		body.dark-layout .nsx-user-id-meta,html.dark .nsx-user-id-meta{color:var(--nsx-user-accent-solid-dark,var(--nsx-user-accent-solid,#fbbf24));border-color:rgba(255,255,255,.14);background:linear-gradient(180deg,rgba(36,41,51,.96),rgba(20,25,34,.9));box-shadow:0 2px 10px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.06)}
		body.dark-layout .nsx-user-id-meta::after,html.dark .nsx-user-id-meta::after{background:linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,0))}
		.nsx-user-id-meta .nsx-user-id-line1{display:inline-flex;align-items:center;min-width:0;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:760}
		.nsx-user-id-meta .nsx-user-id-lv{font-weight:840;opacity:1;color:var(--nsx-user-accent-solid,#1d4ed8);-webkit-text-stroke:.24px rgba(15,23,42,.2);text-shadow:0 1px 1px rgba(15,23,42,.14)}
		body.dark-layout .nsx-user-id-meta .nsx-user-id-lv,html.dark .nsx-user-id-meta .nsx-user-id-lv{color:var(--nsx-user-accent-solid-dark,var(--nsx-user-accent-solid,#93c5fd));-webkit-text-stroke:.24px rgba(255,255,255,.18);text-shadow:0 1px 2px rgba(0,0,0,.45)}
		.nsx-user-id-meta .nsx-user-id-level{font-weight:780;opacity:1;color:var(--nsx-user-trust-solid,#b91c1c);-webkit-text-stroke:.24px rgba(15,23,42,.18);text-shadow:0 1px 1px rgba(15,23,42,.12)}
		body.dark-layout .nsx-user-id-meta .nsx-user-id-level,html.dark .nsx-user-id-meta .nsx-user-id-level{color:var(--nsx-user-trust-solid-dark,var(--nsx-user-trust-solid,#fdba74));-webkit-text-stroke:.24px rgba(255,255,255,.16);text-shadow:0 1px 2px rgba(0,0,0,.45)}
		.nsx-user-id-meta .nsx-user-id-sep{opacity:.45;padding:0 3px;user-select:none}
		.nsx-user-id-meta .nsx-user-id-reg{font-size:.84em;line-height:1;opacity:.92;font-weight:680;white-space:nowrap;color:var(--nsx-user-reg-color,#475569)}
		body.dark-layout .nsx-user-id-meta .nsx-user-id-reg,html.dark .nsx-user-id-meta .nsx-user-id-reg{color:var(--nsx-user-reg-color-dark,#d4d4d8)}
		/* 作者行拥挤时：不换行下沉，改为单行逐级紧凑与自动缩写 */
		.nsk-content-meta-info .author-info.nsx-role-abbrev-1 .nsx-op-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-1 .nsx-blogger-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-1 .nsx-owner-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-1 .nsx-oneman-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-1 .nsx-admin-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-1 .nsx-dev-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-1 .nsx-detective-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-1 .nsx-broker-badge{font-size:9px!important;padding:0 4px 0 6px!important;margin-left:3px!important}
		.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-op-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-blogger-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-owner-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-oneman-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-admin-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-dev-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-detective-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-broker-badge{font-size:8.6px!important;padding:0 3px 0 5px!important;margin-left:2px!important;letter-spacing:0!important}
		.nsk-content-meta-info .author-info .nsx-badge-abbrev{cursor:pointer}
		@media (max-width:768px){
		.nsk-content-meta-info .author-info.nsx-author-nowrap{display:flex;align-items:center;justify-content:flex-start;flex-wrap:nowrap;max-width:100%;min-width:0;overflow:hidden}
		.nsk-content-meta-info .author-info.nsx-author-nowrap > a[href*="/space/"]{flex:0 1 auto;min-width:0}
		.nsk-content-meta-info .author-info.nsx-author-nowrap > :not(a[href*="/space/"]){flex:0 0 auto}
		.nsk-content-meta-info .author-info.nsx-author-nowrap .nsx-user-id-meta{flex:0 1 auto;min-width:0}
		.nsk-content-meta-info .author-info > a[href*="/space/"],.nsk-content-meta-info .author-info > a[href*="/space/"] *{white-space:nowrap!important;word-break:keep-all!important;overflow-wrap:normal!important}
		.nsk-content-meta-info .author-info > a[href*="/space/"]{display:inline-block!important;max-width:clamp(140px,44vw,320px)!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;vertical-align:middle!important}
		.nsx-user-id-meta{max-width:min(50vw,250px);font-size:10px!important;gap:0;padding:1px 6px 2px 9px!important;border-radius:10px!important;line-height:1.06!important}
		.nsx-user-id-meta .nsx-user-id-reg{font-size:.82em}
		.nsx-user-id-meta .nsx-user-id-level{display:inline-block;max-width:8.4em;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom}
		.nsk-content-meta-info .author-info.nsx-author-tight > a[href*="/space/"]{max-width:clamp(90px,30vw,170px)!important}
		.nsk-content-meta-info .author-info.nsx-author-tight .nsx-user-id-meta{max-width:min(40vw,180px)!important;margin-left:4px!important}
		.nsk-content-meta-info .author-info.nsx-author-tight .nsx-user-id-sep{padding:0 2px!important}
		.nsk-content-meta-info .author-info.nsx-author-tight .nsx-user-id-level{max-width:6.6em!important}
		.nsk-content-meta-info .author-info.nsx-author-tight .nsx-op-badge,.nsk-content-meta-info .author-info.nsx-author-tight .nsx-blogger-badge,.nsk-content-meta-info .author-info.nsx-author-tight .nsx-owner-badge,.nsk-content-meta-info .author-info.nsx-author-tight .nsx-oneman-badge,.nsk-content-meta-info .author-info.nsx-author-tight .nsx-admin-badge,.nsk-content-meta-info .author-info.nsx-author-tight .nsx-dev-badge,.nsk-content-meta-info .author-info.nsx-author-tight .nsx-detective-badge,.nsk-content-meta-info .author-info.nsx-author-tight .nsx-broker-badge,.nsk-content-meta-info .author-info.nsx-author-tight .nsx-mute-badge{margin-left:3px!important}
		.nsx-op-badge,.nsx-blogger-badge,.nsx-owner-badge,.nsx-admin-badge,.nsx-dev-badge,.nsx-detective-badge,.nsx-broker-badge{height:13px!important;line-height:13px!important;font-size:9px!important;padding:0 4px 0 6px!important}
		.nsx-oneman-badge{min-height:13px!important;height:auto!important;line-height:1.04!important;font-size:9px!important;padding:1px 4px 1px 6px!important}
		.nsx-mute-badge{height:13px!important;line-height:13px!important;font-size:9px!important;padding:0 4px!important}
		.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-op-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-blogger-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-owner-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-oneman-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-admin-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-dev-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-detective-badge,.nsk-content-meta-info .author-info.nsx-role-abbrev-2 .nsx-broker-badge{font-size:8px!important;padding:0 3px 0 4px!important;margin-left:2px!important}
		}
		`);

	                const calculateJoinDays = (createdAt) => {
	                    if (!createdAt) return null;
	                    const t = new Date(createdAt).getTime();
	                    if (!Number.isFinite(t)) return null;
	                    return Math.max(1, Math.ceil(Math.abs(Date.now() - t) / (1000 * 60 * 60 * 24)));
	                };
	                const formatJoinDays = joinDays => Number.isFinite(joinDays) && joinDays > 0 ? String(joinDays) : "未知";
	                const escHtml = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
	                const getThemePalette = () => {
	                    const isDark = document.body.classList.contains("dark-layout") || document.documentElement.classList.contains("dark");
	                    return {
	                        isDark,
	                        bg: isDark ? "#2a2a2a" : "#fff",
	                        fg: isDark ? "#e0e0e0" : "#1f1f1f",
	                        border: isDark ? "#444" : "#e4e4e4",
	                        div: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
	                    };
	                };
	                // 等级与称号刻意分离色域：
	                // - Lv 只用冷色（蓝/青）表达“系统成长”
	                // - 称号只用暖色与洋红/紫表达“信誉画像”
	                // 这样两者无论语义还是视觉都不会混成同一套
	                const getLvTheme = (rank) => {
	                    const r = Math.max(0, Number(rank) || 0);
	                    if (r >= 6) {
	                        return {
	                            gradient: "linear-gradient(118deg,#ecfeff 0%,#67e8f9 18%,#38bdf8 46%,#2563eb 74%,#312e81 100%)",
	                            solidLight: "#1e3a8a",
	                            solidDark: "#c7d2fe"
	                        };
	                    }
	                    if (r === 5) {
	                        return {
	                            gradient: "linear-gradient(118deg,#e0e7ff 0%,#818cf8 34%,#4f46e5 68%,#3730a3 100%)",
	                            solidLight: "#4338ca",
	                            solidDark: "#c7d2fe"
	                        };
	                    }
	                    if (r === 4) {
	                        return {
	                            gradient: "linear-gradient(118deg,#dbeafe 0%,#60a5fa 34%,#2563eb 68%,#4338ca 100%)",
	                            solidLight: "#2563eb",
	                            solidDark: "#a5b4fc"
	                        };
	                    }
	                    if (r === 3) {
	                        return {
	                            gradient: "linear-gradient(118deg,#cffafe 0%,#22d3ee 36%,#0ea5e9 72%,#0369a1 100%)",
	                            solidLight: "#0369a1",
	                            solidDark: "#67e8f9"
	                        };
	                    }
	                    if (r === 2) {
	                        return {
	                            gradient: "linear-gradient(118deg,#d1fae5 0%,#34d399 38%,#10b981 72%,#047857 100%)",
	                            solidLight: "#047857",
	                            solidDark: "#86efac"
	                        };
	                    }
	                    if (r === 1) {
	                        return {
	                            gradient: "linear-gradient(118deg,#ecfeff 0%,#67e8f9 42%,#06b6d4 100%)",
	                            solidLight: "#0891b2",
	                            solidDark: "#a5f3fc"
	                        };
	                    }
	                    return {
	                        gradient: "linear-gradient(118deg,#f1f5f9 0%,#94a3b8 46%,#475569 100%)",
	                        solidLight: "#475569",
	                        solidDark: "#cbd5e1"
	                    };
	                };
	                const getTrustTheme = (trustLevel) => {
	                    const map = {
	                        // 10个称号与纯色一一对应（无渐变）
	                        "疑似小号": {
	                            gradient: "#991b1b",
	                            solidLight: "#991b1b",
	                            solidDark: "#fca5a5"
	                        },
	                        "新手上路": {
	                            gradient: "#84cc16",
	                            solidLight: "#65a30d",
	                            solidDark: "#d9f99d"
	                        },
	                        "灌水机器": {
	                            gradient: "#be123c",
	                            solidLight: "#be123c",
	                            solidDark: "#fda4af"
	                        },
	                        "潜水员": {
	                            gradient: "#0f172a",
	                            solidLight: "#0f172a",
	                            solidDark: "#cbd5e1"
	                        },
	                        "名震天下": {
	                            gradient: "#b45309",
	                            solidLight: "#b45309",
	                            solidDark: "#fde68a"
	                        },
	                        "声名大噪": {
	                            gradient: "#c026d3",
	                            solidLight: "#c026d3",
	                            solidDark: "#e9d5ff"
	                        },
	                        "活跃精英": {
	                            gradient: "#c2410c",
	                            solidLight: "#c2410c",
	                            solidDark: "#fdba74"
	                        },
	                        "初露锋芒": {
	                            gradient: "#f97316",
	                            solidLight: "#f97316",
	                            solidDark: "#fed7aa"
	                        },
	                        "籍籍无名": {
	                            gradient: "#78716c",
	                            solidLight: "#78716c",
	                            solidDark: "#d1d5db"
	                        },
	                        "深度隐匿": {
	                            gradient: "#1f2937",
	                            solidLight: "#1f2937",
	                            solidDark: "#cbd5e1"
	                        }
	                    };
		                    return map[trustLevel] || map["籍籍无名"];
		                };
		                const computeReputationMetrics = (userData) => {
	                    const joinDays = calculateJoinDays(userData?.created_at);
	                    const joinDaysSafe = Number.isFinite(joinDays) ? joinDays : 1;
	                    const coins = Number(userData?.coin || 0);
	                    const nPost = Number(userData?.nPost || 0);
	                    const nComment = Number(userData?.nComment || 0);
	                    const stardust = Number(userData?.stardust || 0);
	                    const totalAct = nPost + nComment;
	                    const dailyAct = totalAct / joinDaysSafe;
	                    const coinPerDay = coins / joinDaysSafe;
	                    const rank = Math.min(6, Math.floor(Math.sqrt(coins || 0) / 10));

	                    const alpha = Math.min(coins / 400, 1);
	                    const baseSeniority = Math.min(20, joinDaysSafe / 25);
	                    const lowSeniority = Math.min(5, joinDaysSafe / 100);
	                    const seniorityScore = baseSeniority * alpha + lowSeniority * (1 - alpha);

	                    const actVal = Math.max(Math.min(25, dailyAct * 15), Math.min(25, totalAct / 15));
	                    const spamPenalty = dailyAct > 20 ? Math.max(0.5, 1 - (dailyAct - 20) / 40) : 1;
	                    const actScore = actVal * spamPenalty;
	                    const wealthScore = Math.max(Math.min(25, coinPerDay * 5), Math.min(25, coins / 80));
	                    const qualityConfidence = Math.min(totalAct / 10, 1);
	                    const rawQualityScore = (coins / (totalAct || 1)) * 3.5;
	                    const qualityScore = Math.min(30, rawQualityScore) * qualityConfidence;

		                    let trustScore = seniorityScore + actScore + wealthScore + qualityScore;
		                    const isLegend = trustScore >= 90 && coins >= 3000 && nPost >= 500 && nComment >= 5000;
		                    const isFamous = trustScore >= 75 && coins >= 1500 && nPost >= 200 && nComment >= 2000;
		                    if (isLegend) trustScore += 15;

		                    let trustLevel = "正常用户";
		                    let trustColor = "#c2410c";
		                    const isAbandoned = joinDaysSafe > 500 && coins < 400;
		                    const isNewbie = joinDaysSafe < 60;

		                    if (isAbandoned) {
		                        trustScore *= 0.2;
		                        trustLevel = "疑似小号";
		                    } else if (isNewbie && coins < 400) {
		                        trustLevel = "新手上路";
		                        trustScore = Math.min(trustScore, 70);
		                    } else if (dailyAct > 30 && qualityScore < 5) {
		                        trustLevel = "灌水机器";
		                        trustScore *= 0.6;
		                    } else if (totalAct < 5) {
		                        trustLevel = "潜水员";
		                    } else if (trustScore >= 90 && isLegend) {
		                        trustLevel = "名震天下";
		                    } else if (trustScore >= 75 && isFamous) {
		                        trustLevel = "声名大噪";
		                    } else if (trustScore >= 60) {
		                        trustLevel = "活跃精英";
		                    } else if (trustScore >= 40) {
		                        trustLevel = "初露锋芒";
		                    } else if (trustScore >= 20) {
		                        trustLevel = "籍籍无名";
		                    } else {
		                        trustLevel = "深度隐匿";
		                    }

			                    const lvTheme = getLvTheme(rank);
			                    const trustTheme = getTrustTheme(trustLevel);
			                    trustColor = trustTheme.solidLight;
			                    const lvGradient = lvTheme.solidLight;
			                    return {
		                        rank,
		                        joinDays,
		                        joinDaysText: formatJoinDays(joinDays),
		                        coins,
	                        nPost,
	                        nComment,
	                        stardust,
			                        trustScore: Math.floor(Math.min(100, Math.max(0, trustScore))),
			                        trustLevel,
			                        trustColor,
			                        trustGradientReadable: trustTheme.solidLight,
			                        trustColorReadable: trustTheme.solidLight,
			                        trustColorReadableDark: trustTheme.solidDark,
			                        lvGradient,
			                        lvGradientReadable: lvTheme.solidLight,
			                        lvColorReadable: lvTheme.solidLight,
		                        lvColorReadableDark: lvTheme.solidDark
		                    };
		                };
	                const buildDiagnosisHtml = (username, userId, metrics, palette) => {
	                    const levelColor = metrics.lvColorReadable || metrics.lvGradientReadable || metrics.lvGradient || "#1d4ed8";
	                    const trustColor = metrics.trustColorReadable || metrics.trustGradientReadable || metrics.trustColor || "#c2410c";
	                    return `
	                        <div class="nsx-user-sheet-diagnosis">
	                        	<div class="nsx-user-sheet-diag-card">
	                            <div class="nsx-user-sheet-diag-head">
	                                <div class="nsx-user-sheet-diag-title">信誉诊断</div>
	                                <div class="nsx-user-sheet-diag-lv" style="color:${levelColor};">Lv ${metrics.rank}</div>
	                            </div>
	                            <div class="nsx-user-sheet-diag-sub">注册 <span class="nsx-user-sheet-diag-badge">${metrics.joinDaysText}</span> 天</div>
	                            <div class="nsx-user-sheet-diag-grid">
	                                <div class="nsx-user-sheet-diag-item"><span class="nsx-user-sheet-diag-item-label">主题</span><a class="nsx-user-sheet-diag-item-value" href="/space/${userId}#/discussions" target="_blank">${metrics.nPost}</a></div>
	                                <div class="nsx-user-sheet-diag-item"><span class="nsx-user-sheet-diag-item-label">评论</span><a class="nsx-user-sheet-diag-item-value" href="/space/${userId}#/comments" target="_blank">${metrics.nComment}</a></div>
	                                <div class="nsx-user-sheet-diag-item"><span class="nsx-user-sheet-diag-item-label">鸡腿</span><span class="nsx-user-sheet-diag-item-value" style="color:#ca8a04;">${metrics.coins}</span></div>
	                                <div class="nsx-user-sheet-diag-item"><span class="nsx-user-sheet-diag-item-label">星尘</span><span class="nsx-user-sheet-diag-item-value" style="color:#a21caf;">${metrics.stardust}</span></div>
	                            </div>
	                            <div class="nsx-user-sheet-diag-foot">
	                                <div class="nsx-user-sheet-diag-score">评分 <b style="color:${trustColor};">${metrics.trustScore}</b>/100</div>
	                                <div class="nsx-user-sheet-diag-tag">诊断 <b style="color:${trustColor};">${metrics.trustLevel}</b></div>
	                            </div>
	                        	</div>
	                        </div>
	                    `;
	                };

	                // 优化作者行身份标识：
	                // - 楼主/博主/频道主/OneMan/管理/Dev/侦探/交易中介 统一为主题小胶囊
	                // - 临时禁言/禁言 统一为警示胶囊
	                // - 若标签被布局到右侧（靠近楼层号），尝试移动到用户名后方
	                const applyOpBadgeStyle = (authorLink) => {
	                    const authorInfo = authorLink?.closest?.(".author-info");
	                    if (!authorInfo) return false;
	                    if (authorInfo.dataset.nsxOpStyled) return false;
	                    authorInfo.dataset.nsxOpStyled = "1";

	                    const candidates = [];
	                    const seenCandidate = new Set();
	                    const pushCandidate = (node) => {
	                        if (!node || seenCandidate.has(node)) return;
	                        seenCandidate.add(node);
	                        candidates.push(node);
	                    };
	                    const resolveBadgeHost = (node) => {
	                        if (!node || node === authorLink) return null;
	                        try {
	                            const roleTag = node.closest?.(".role-tag");
	                            if (roleTag && authorInfo.contains(roleTag)) return roleTag;
	                        } catch { }
	                        try {
	                            const nestedRoleTag = node.querySelector?.(".role-tag");
	                            if (nestedRoleTag && authorInfo.contains(nestedRoleTag)) return nestedRoleTag;
	                        } catch { }
	                        return node;
	                    };
	                    try {
	                        Array.from(authorInfo.children || []).forEach((node) => {
	                            const host = resolveBadgeHost(node);
	                            if (host) pushCandidate(host);
	                        });
	                    } catch { }

	                    let found = false;
	                    let opTag = null;
	                    let bloggerTag = null;
	                    let ownerTag = null;
	                    let oneManTag = null;
	                    let adminTag = null;
	                    let devTag = null;
	                    let detectiveTag = null;
	                    let brokerTag = null;
	                    let muteTag = null;
	                    for (const el of candidates) {
	                        if (!el || el === authorLink) continue;
	                        if (el.parentElement && /nsx-(op|blogger|owner|oneman|admin|dev|detective|broker|mute)-badge/.test(el.parentElement.className || "")) continue;
	                        const text = (el.textContent || "").trim();
	                        const norm = text.replace(/\s+/g, "");
	                        const lower = norm.toLowerCase();
	                        if (norm === "博主") {
	                            found = true;
	                            if (!bloggerTag) bloggerTag = el;
	                            try { el.classList.add("nsx-blogger-badge"); } catch { }
	                            continue;
	                        }
	                        if (norm === "楼主" || norm === "OP" || norm === "op") {
	                            found = true;
	                            if (!opTag) opTag = el;
	                            try { el.classList.add("nsx-op-badge"); } catch { }
	                            continue;
	                        }
	                        if (
	                            norm === "频道主"
	                            || norm === "频道管理"
	                            || norm === "频道管理员"
	                            || norm === "CHANNELOWNER"
	                            || lower === "channelowner"
	                        ) {
	                            found = true;
	                            if (!ownerTag) ownerTag = el;
	                            try { el.classList.add("nsx-owner-badge"); } catch { }
	                            continue;
	                        }
	                        if (/oneman/i.test(norm)) {
	                            found = true;
	                            if (!oneManTag) oneManTag = el;
	                            try { el.classList.add("nsx-oneman-badge"); } catch { }
	                            continue;
	                        }
	                        if (
	                            norm === "管理"
	                            || norm === "管理员"
	                            || norm === "版主"
	                            || lower === "admin"
	                            || lower === "mod"
	                            || lower === "moderator"
	                        ) {
	                            found = true;
	                            if (!adminTag) adminTag = el;
	                            try { el.classList.add("nsx-admin-badge"); } catch { }
	                            continue;
	                        }
	                        if (
	                            lower === "dev"
	                            || norm === "DEV"
	                            || norm === "Dev"
	                            || norm === "开发"
	                            || norm === "开发者"
	                        ) {
	                            found = true;
	                            if (!devTag) devTag = el;
	                            try { el.classList.add("nsx-dev-badge"); } catch { }
	                            continue;
	                        }
	                        if (
	                            norm === "侦探"
	                            || norm === "探员"
	                            || /侦探/.test(norm)
	                            || lower === "detective"
	                        ) {
	                            found = true;
	                            if (!detectiveTag) detectiveTag = el;
	                            try { el.classList.add("nsx-detective-badge"); } catch { }
	                            continue;
	                        }
	                        if (
	                            norm === "交易中介"
	                            || norm === "中介"
	                            || /交易中介/.test(norm)
	                            || /中介/.test(norm)
	                            || lower === "broker"
	                            || lower === "tradebroker"
	                        ) {
	                            found = true;
	                            if (!brokerTag) brokerTag = el;
	                            try { el.classList.add("nsx-broker-badge"); } catch { }
	                            continue;
	                        }
	                        if (norm === "临时禁言" || norm === "禁言" || /禁言/.test(norm)) {
	                            found = true;
	                            if (!muteTag) muteTag = el;
	                            try { el.classList.add("nsx-mute-badge"); } catch { }
	                        }
	                    }
	                    if (found) {
	                        // 楼主/博主/频道主/OneMan/管理/Dev/侦探/交易中介 保持在用户名后；禁言标签优先挪到“时间行”减少拥挤
	                        let lastRoleAnchor = authorLink;
	                        try {
	                            [opTag, bloggerTag, ownerTag, detectiveTag, brokerTag, oneManTag, adminTag, devTag].forEach(tag => {
	                                if (!tag || tag === lastRoleAnchor.nextSibling) return;
	                                lastRoleAnchor.insertAdjacentElement?.("afterend", tag);
	                                lastRoleAnchor = tag;
	                            });
	                        } catch { }
	                        if (muteTag) {
	                            let movedToMetaLine = false;
	                            try {
	                                const parentLine = authorInfo.parentElement;
	                                const metaLine = parentLine
	                                    ? Array.from(parentLine.children || []).find(n => n && n !== authorInfo && n.nodeType === 1)
	                                    : null;
	                                if (metaLine) {
	                                    const t = metaLine.querySelector?.("time");
	                                    try { muteTag.classList.add("nsx-mute-badge-secondary"); } catch { }
	                                    if (t && t.parentElement) t.insertAdjacentElement?.("afterend", muteTag);
	                                    else metaLine.insertAdjacentElement?.("afterbegin", muteTag);
	                                    movedToMetaLine = true;
	                                }
	                            } catch { }
	                            if (!movedToMetaLine) {
	                                try { muteTag.classList.remove("nsx-mute-badge-secondary"); } catch { }
	                                try { lastRoleAnchor.insertAdjacentElement?.("afterend", muteTag); } catch { }
	                            }
	                        }
	                    }
	                    return found;
	                };
	                const ROLE_BADGE_SELECTOR = ".nsx-op-badge,.nsx-blogger-badge,.nsx-owner-badge,.nsx-oneman-badge,.nsx-admin-badge,.nsx-dev-badge,.nsx-detective-badge,.nsx-broker-badge";
	                const ROLE_BADGE_PRIORITY = ["nsx-oneman-badge", "nsx-detective-badge", "nsx-broker-badge", "nsx-dev-badge", "nsx-admin-badge", "nsx-owner-badge", "nsx-blogger-badge", "nsx-op-badge"];
	                const ROLE_BADGE_REVEAL_MS = 1800;
	                const getRoleOverflowRow = (authorInfo) => {
	                    const parent = authorInfo?.parentElement;
	                    if (!parent) return null;
	                    try {
	                        return Array.from(parent.children || []).find((n) => n?.classList?.contains?.("nsx-role-overflow-row")) || null;
	                    } catch {
	                        return null;
	                    }
	                };
	                const collectRoleBadges = (root) => {
	                    if (!root) return [];
	                    try { return Array.from(root.querySelectorAll?.(ROLE_BADGE_SELECTOR) || []); } catch { return []; }
	                };
	                const restoreRoleBadgesToMainRow = (authorInfo) => {
	                    if (!authorInfo) return;
	                    const row = getRoleOverflowRow(authorInfo);
	                    if (!row) return;
	                    const tags = collectRoleBadges(row);
	                    if (!tags.length) {
	                        try { row.remove(); } catch { }
	                        return;
	                    }
	                    let anchor = authorInfo.querySelector?.(".nsx-user-info-display")
	                        || authorInfo.querySelector?.('a[href*="/space/"]')
	                        || authorInfo.lastElementChild
	                        || authorInfo;
	                    tags.forEach((tag) => {
	                        if (!tag) return;
	                        try {
	                            anchor.insertAdjacentElement?.("afterend", tag);
	                            anchor = tag;
	                        } catch { }
	                    });
	                    try { row.remove(); } catch { }
	                };
	                const getRoleBadgeRawText = (tag) => {
	                    if (!tag) return "";
	                    if (!tag.dataset.nsxBadgeRawHtml) {
	                        try { tag.dataset.nsxBadgeRawHtml = String(tag.innerHTML || ""); } catch { }
	                    }
	                    if (!tag.dataset.nsxBadgeHasIcon) {
	                        try { tag.dataset.nsxBadgeHasIcon = tag.querySelector?.("img,svg,i") ? "1" : "0"; } catch { tag.dataset.nsxBadgeHasIcon = "0"; }
	                    }
	                    const txt = String(tag.dataset.nsxBadgeRawText || tag.textContent || "").trim();
	                    if (!tag.dataset.nsxBadgeRawText && txt) tag.dataset.nsxBadgeRawText = txt;
	                    return String(tag.dataset.nsxBadgeRawText || txt || "").trim();
	                };
	                const setRoleBadgeText = (tag, text, restoreRaw = false) => {
	                    if (!tag) return;
	                    const target = String(text ?? "").trim();
	                    if (restoreRaw) {
	                        const rawHtml = String(tag.dataset.nsxBadgeRawHtml || "");
	                        if (rawHtml) {
	                            try { tag.innerHTML = rawHtml; return; } catch { }
	                        }
	                    }
	                    if (String(tag.dataset.nsxBadgeHasIcon || "0") === "1") {
	                        let iconNode = null;
	                        try { iconNode = tag.querySelector?.("img,svg,i") || null; } catch { }
	                        if (!iconNode) {
	                            try {
	                                const rawHtml = String(tag.dataset.nsxBadgeRawHtml || "");
	                                if (rawHtml) {
	                                    const tmp = document.createElement("span");
	                                    tmp.innerHTML = rawHtml;
	                                    iconNode = tmp.querySelector?.("img,svg,i") || null;
	                                }
	                            } catch { }
	                        }
	                        try {
	                            tag.textContent = "";
	                            if (iconNode) tag.appendChild(iconNode.cloneNode(true));
	                            if (target) tag.appendChild(document.createTextNode(target));
	                            return;
	                        } catch { }
	                    }
	                    tag.textContent = target;
	                };
	                const updateRoleBadgeAbbrevMark = (tag) => {
	                    if (!tag) return;
	                    const raw = getRoleBadgeRawText(tag);
	                    const cur = String(tag.textContent || "").trim();
	                    const isAbbrev = !!raw && !!cur && cur !== raw;
	                    try { tag.classList.toggle("nsx-badge-abbrev", isAbbrev); } catch { }
	                    try { tag.dataset.nsxBadgeAbbrev = isAbbrev ? "1" : "0"; } catch { }
	                    try {
	                        if (isAbbrev && raw) tag.title = raw;
	                        else if (tag.getAttribute?.("title") === raw) tag.removeAttribute("title");
	                    } catch { }
	                };
	                const isRoleBadgeRevealLocked = (tag) => String(tag?.dataset?.nsxBadgeReveal || "0") === "1";
	                const bindRoleBadgeReveal = (tag, authorInfo) => {
	                    if (!tag || !authorInfo) return;
	                    if (tag.dataset.nsxBadgeRevealBound === "1") return;
	                    tag.dataset.nsxBadgeRevealBound = "1";
	                    tag.addEventListener("click", (ev) => {
	                        const raw = getRoleBadgeRawText(tag);
	                        if (!raw) return;
	                        const isRevealed = isRoleBadgeRevealLocked(tag);
	                        const isAbbrev = String(tag.dataset.nsxBadgeAbbrev || "0") === "1";
	                        if (!isRevealed && !isAbbrev) return;
	                        try { ev.preventDefault(); } catch { }
	                        try { ev.stopPropagation(); } catch { }
	                        try { ev.stopImmediatePropagation?.(); } catch { }
	                        if (isRevealed) {
	                            tag.dataset.nsxBadgeReveal = "0";
	                            const shouldCompact = authorInfo.classList?.contains?.("nsx-author-tight");
	                            autoAbbrevRoleBadges(authorInfo, !!shouldCompact);
	                            return;
	                        }
	                        tag.dataset.nsxBadgeReveal = "1";
	                        setRoleBadgeText(tag, raw, true);
	                        updateRoleBadgeAbbrevMark(tag);
	                        try { clearTimeout(tag.__nsxBadgeRevealTimer); } catch { }
	                        tag.__nsxBadgeRevealTimer = setTimeout(() => {
	                            if (!tag.isConnected) return;
	                            if (String(tag.dataset.nsxBadgeReveal || "0") !== "1") return;
	                            tag.dataset.nsxBadgeReveal = "0";
	                            const shouldCompact = authorInfo.classList?.contains?.("nsx-author-tight");
	                            autoAbbrevRoleBadges(authorInfo, !!shouldCompact);
	                        }, ROLE_BADGE_REVEAL_MS);
	                    }, true);
	                };
	                const getRoleBadgeAbbrevText = (tag, level) => {
	                    const raw = getRoleBadgeRawText(tag);
	                    const lower = raw.toLowerCase();
	                    if (!raw) return "";
	                    const iconOnly = level >= 2;
	                    if (tag.classList?.contains?.("nsx-op-badge")) {
	                        if (iconOnly) return "👤";
	                        return raw;
	                    }
	                    if (tag.classList?.contains?.("nsx-oneman-badge") || /oneman/i.test(raw)) {
	                        if (iconOnly) return "①";
	                        return raw;
	                    }
	                    if (tag.classList?.contains?.("nsx-admin-badge") || /admin|mod|管理|版主/.test(lower) || /管理|版主/.test(raw)) {
	                        if (iconOnly) return "🛡";
	                        return raw;
	                    }
	                    if (tag.classList?.contains?.("nsx-owner-badge") || /owner|频道/.test(lower) || /频道/.test(raw)) {
	                        if (iconOnly) return "📡";
	                        return raw;
	                    }
	                    if (tag.classList?.contains?.("nsx-blogger-badge") || /博主/.test(raw)) {
	                        if (iconOnly) return "✍";
	                        return raw;
	                    }
	                    if (tag.classList?.contains?.("nsx-dev-badge") || /dev|开发/.test(lower) || /开发/.test(raw)) {
	                        if (iconOnly) return "⚙";
	                        return raw;
	                    }
	                    if (tag.classList?.contains?.("nsx-detective-badge") || /侦探/.test(raw) || /detective/.test(lower)) {
	                        if (iconOnly) return "🔎";
	                        return raw;
	                    }
	                    if (tag.classList?.contains?.("nsx-broker-badge") || /交易中介|中介/.test(raw) || /tradebroker|broker/.test(lower)) {
	                        if (iconOnly) return "🤝";
	                        return raw;
	                    }
	                    if (iconOnly) return "🏷";
	                    return raw;
	                };
	                const autoAbbrevRoleBadges = (authorInfo, shouldCompact) => {
	                    if (!authorInfo) return;
	                    restoreRoleBadgesToMainRow(authorInfo);
	                    const tags = collectRoleBadges(authorInfo);
	                    if (!tags.length) return;
	                    const clearClasses = () => {
	                        try { authorInfo.classList.remove("nsx-role-abbrev-1", "nsx-role-abbrev-2"); } catch { }
	                    };
	                    tags.forEach((tag) => bindRoleBadgeReveal(tag, authorInfo));
	                    const resetText = () => tags.forEach((tag) => {
	                        if (isRoleBadgeRevealLocked(tag)) return;
	                        setRoleBadgeText(tag, getRoleBadgeAbbrevText(tag, 0), true);
	                        updateRoleBadgeAbbrevMark(tag);
	                    });
	                    const isCrowded = () => {
	                        try { return (authorInfo.scrollWidth - authorInfo.clientWidth) > 4; } catch { return false; }
	                    };
	                    clearClasses();
	                    resetText();
	                    if (!shouldCompact) return;
	                    const ordered = [];
	                    ROLE_BADGE_PRIORITY.forEach((cls) => {
	                        tags.forEach((tag) => {
	                            if (!ordered.includes(tag) && tag?.classList?.contains?.(cls)) ordered.push(tag);
	                        });
	                    });
	                    tags.forEach((tag) => { if (!ordered.includes(tag)) ordered.push(tag); });
	                    try { authorInfo.classList.add("nsx-role-abbrev-1"); } catch { }
	                    // 进入紧凑模式后，至少执行一级文本缩写，避免“看起来未触发”
	                    ordered.forEach((tag) => {
	                        if (isRoleBadgeRevealLocked(tag)) return;
	                        setRoleBadgeText(tag, getRoleBadgeAbbrevText(tag, 2));
	                        updateRoleBadgeAbbrevMark(tag);
	                    });
	                    if (!isCrowded()) return;
	                    try { authorInfo.classList.add("nsx-role-abbrev-2"); } catch { }
	                    ordered.forEach((tag) => {
	                        if (isRoleBadgeRevealLocked(tag)) return;
	                        setRoleBadgeText(tag, getRoleBadgeAbbrevText(tag, 3));
	                        updateRoleBadgeAbbrevMark(tag);
	                    });
	                };

	                const getUserInfo = async (uid) => {
	                    if (!uid) return null;
	                    const cached = cache.get(uid);
	                    if (cached) return cached;
                    if (fetching.has(uid)) return fetching.get(uid);

                    const p = (async () => {
                        try {
                            const r = await ctx.net.get(`/api/account/getInfo/${uid}`);
                            return r?.success ? r.detail : null;
                        } catch {
                            return null;
                        }
                    })();

                    fetching.set(uid, p);
                    const data = await p;
                    fetching.delete(uid);
                    if (data) cache.set(uid, data);
                    return data;
                };

                const openUserActions = (username, userId, cachedMetrics = null) => {
                    const openSheet = window.__nsxRuntime?.openSheet;
                    if (typeof openSheet !== "function") return;

                    const blacklistKey = 'nsx_advanced_blacklist';
                    const friendsKey = 'nsx_advanced_friends';
                    const showDetailCard = isMobileDetailCardEnabled() && isSmallScreen();

                    const readMap = (key) => {
                        try { return JSON.parse(localStorage.getItem(key) || '{}'); }
                        catch { return {}; }
                    };
                    const state = {
                        blacklist: readMap(blacklistKey),
                        friends: readMap(friendsKey)
                    };

	                    const cont = document.createElement("div");
	                    cont.className = "nsx-user-sheet";
	                    cont.innerHTML = `
	                        <div class="nsx-user-sheet-top">
	                            <div class="nsx-user-sheet-name-wrap">
	                                <div class="nsx-user-sheet-name">@${escHtml(username)}</div>
	                                <div class="nsx-user-sheet-id">UID ${escHtml(String(userId || "-"))}</div>
	                            </div>
	                            <button type="button" class="nsx-user-sheet-btn home" data-a="space">主页</button>
	                        </div>
	                        ${showDetailCard ? '<div class="nsx-user-sheet-diagnosis-host" data-role="diagnosis">正在加载诊断数据…</div>' : ''}
	                        ${showDetailCard ? '' : '<div class="nsx-user-sheet-meta" data-role="meta">正在加载…</div>'}
	                        <div class="nsx-user-sheet-actions">
	                            <button type="button" class="nsx-user-sheet-btn friend" data-a="friend"></button>
	                            <button type="button" class="nsx-user-sheet-btn block" data-a="block"></button>
	                        </div>
	                    `.trim();

                    const sheet = openSheet({ title: "用户", content: cont });
                    const toast = (msg) => ctx.ui.toast ? ctx.ui.toast(msg) : alert(msg);

	                    const render = () => {
	                        const isFriend = !!state.friends[username];
	                        const isBlocked = !!state.blacklist[username];
	                        cont.querySelector('button[data-a="friend"]').textContent = isFriend ? '已加好友 · 取消' : '＋ 加为好友';
	                        cont.querySelector('button[data-a="block"]').textContent = isBlocked ? '已屏蔽 · 解除' : '屏蔽此人';
	                    };
                    render();

                    const persist = (key, obj) => localStorage.setItem(key, JSON.stringify(obj));
                    const apply = () => window.__nsxRuntime?.reapplyRelation?.();
                    const metaEl = cont.querySelector('[data-role="meta"]');
                    const diagEl = cont.querySelector('[data-role="diagnosis"]');
                    const renderProfile = (metrics) => {
                        if (metaEl) {
                            metaEl.textContent = `Lv ${metrics.rank} · 注册${metrics.joinDaysText}天 · 主题${metrics.nPost} · 评论${metrics.nComment} · 鸡腿${metrics.coins}`;
                        }
                        if (diagEl) {
                            diagEl.innerHTML = buildDiagnosisHtml(username, userId, metrics, getThemePalette());
                        }
                    };
                    if (cachedMetrics) renderProfile(cachedMetrics);

                    cont.addEventListener("click", async (ev) => {
                        const b = ev.target.closest("button[data-a]");
                        if (!b) return;
                        ev.preventDefault();
                        ev.stopPropagation();
                        const act = b.dataset.a;

                        if (act === "space") {
                            sheet.close();
                            location.href = `/space/${userId}#/general`;
                            return;
                        }

                        if (act === "friend") {
                            const isFriend = !!state.friends[username];
                            if (isFriend) delete state.friends[username];
                            else state.friends[username] = { remark: "", time: new Date().toLocaleString(), userId };
                            persist(friendsKey, state.friends);
                            toast(isFriend ? `已取消关注 ${username}` : `已添加 ${username} 为好友`);
                            apply();
                            render();
                            return;
                        }

                        if (act === "block") {
                            const isBlocked = !!state.blacklist[username];
                            if (isBlocked) {
                                delete state.blacklist[username];
                            } else {
                                const blMode = ctx.store.get("relation.blacklist_mode", "fold");
                                if (blMode === 'official') {
                                    try {
                                        const r = await ctx.net.post("/api/block-list/add", { block_member_name: username });
                                        if (!r?.success) ctx.ui.alert?.("同步失败", r?.message || "官方接口调用失败，仅保存本地备注");
                                    } catch (e) {
                                        env.error("Sync Official Block Failed", e);
                                    }
                                }
                                state.blacklist[username] = { remark: "", time: new Date().toLocaleString(), userId };
                            }
                            persist(blacklistKey, state.blacklist);
                            toast(isBlocked ? `已解除屏蔽 ${username}` : `已屏蔽 ${username}`);
                            apply();
                            render();
                        }
                    }, { capture: true });

                    getUserInfo(userId).then(userData => {
                        if (!metaEl && !diagEl) return;
                        if (!userData) {
                            if (metaEl) metaEl.textContent = "信息加载失败";
                            if (diagEl) diagEl.textContent = "诊断数据加载失败";
                            return;
                        }
                        renderProfile(computeReputationMetrics(userData));
                    });
                };

	                const display = async (el) => {
	                    const isCmt = el.closest('.comment-item, .comments > li') !== null;
	                    if (isCmt && !isShowCmtEnabled()) return;
	                    if (!isCmt && !isShowOpEnabled()) return;

                    const metaInfo = el.closest('.nsk-content-meta-info');
                    if (!metaInfo) return;
                    // 兼容旧版本残留的内联样式，确保同帖所有徽章使用统一尺寸
                    try {
                        metaInfo.querySelectorAll?.(".nsx-user-id-meta")?.forEach?.((node) => {
                            node?.style?.removeProperty?.("font-size");
                            node?.style?.removeProperty?.("padding");
                            node?.style?.removeProperty?.("border-radius");
                            node?.style?.removeProperty?.("line-height");
                        });
                    } catch { }

                    if (el.dataset.nsxInfoLoaded) return;
                    el.dataset.nsxInfoLoaded = "1";

		                    const match = el.href.match(/\/space\/(\d+)/);
		                    const userId = match ? match[1] : null;
		                    const username = el.textContent.trim();

		                    const smallScreen = isSmallScreen();
		                    const narrowScreen = isSmallScreen(768);
		                    if (narrowScreen) {
		                        try { el.querySelectorAll?.("wbr")?.forEach?.(n => n.remove()); } catch { }
		                        try { if (username && !el.title) el.title = username; } catch { }
		                    }
				                    const authorInfo = el.closest?.(".author-info");
				                    applyOpBadgeStyle(el);
				                    const floorTightHost = (() => {
				                        try {
				                            if (metaInfo?.querySelector?.(".floor-link-wrapper")) return metaInfo;
				                            const lineHost = authorInfo?.parentElement;
				                            if (lineHost?.querySelector?.(".floor-link-wrapper")) return lineHost;
				                        } catch { }
				                        return metaInfo || null;
				                    })();
				                    if (!narrowScreen && authorInfo) {
				                        try { authorInfo.classList.remove("nsx-author-tight"); } catch { }
				                        try { authorInfo.classList.remove("nsx-author-nowrap"); } catch { }
				                        try { floorTightHost?.classList?.remove?.("nsx-floor-tight"); } catch { }
				                        try { floorTightHost?.classList?.remove?.("nsx-floor-tight-2"); } catch { }
				                        autoAbbrevRoleBadges(authorInfo, false);
				                    }
				                    const scheduleAuthorNoWrapIfWrapped = () => {
			                        if (!authorInfo) return;
			                        // 兜底：当作者行“确实发生拥挤/换行”时，启用紧凑模式并自动缩写身份标签；
			                        // 保持单行展示，不再把标签下沉到第二行
			                        const run = () => {
			                            let wrapped = false;
			                            let crowded = false;
			                            let floorTightLevel = 0; // 0=不收缩, 1=轻度, 2=重度
		                            try {
		                                if (narrowScreen) authorInfo.classList.add("nsx-author-nowrap");
		                                else authorInfo.classList.remove("nsx-author-nowrap");
		                            } catch { }
		                            let baseTop = NaN;
		                            try { baseTop = Number(el.getBoundingClientRect?.().top); } catch { }
		                            if (!Number.isFinite(baseTop)) return;

		                            // 1) 用户名自身换行（少见）
		                            try {
		                                const rects = el.getClientRects?.();
		                                if (rects && rects.length > 1) wrapped = true;
		                            } catch { }

		                            // 2) 其余徽章/统计被挤到下一行（常见：长用户名 + 右侧楼层号挤压）
		                            if (!wrapped) {
		                                try {
		                                    const threshold = 6; // 同行 top 差一般 < 2，换行通常 >= 16
		                                    const candidates = new Set();
		                                    try { Array.from(authorInfo.children || []).forEach(n => candidates.add(n)); } catch { }
		                                    // 兜底：显式取到用户信息徽标节点参与换行判定
		                                    try { authorInfo.querySelectorAll?.(".nsx-user-id-meta,.nsx-lv-badge,.nsx-user-mini-meta")?.forEach?.(n => candidates.add(n)); } catch { }
		                                    for (const child of candidates) {
		                                        if (!child || child === el) continue;
		                                        const r = child.getBoundingClientRect?.();
		                                        if (!r || r.width < 1 || r.height < 1) continue;
		                                        if ((r.top - baseTop) > threshold) { wrapped = true; break; }
		                                    }
		                                } catch { }
		                            }

		                            // 3) 同行未换行但被右侧楼层/信息挤压（例如 #13、其它右侧标识）
		                            if (!wrapped) {
		                                try {
		                                    const metaHost = authorInfo.closest?.(".nsk-content-meta-info");
		                                    const ar = authorInfo.getBoundingClientRect?.();
		                                    if (metaHost && ar && ar.width > 0 && ar.height > 0) {
		                                        const rightNodes = metaHost.querySelectorAll?.(".floor-link-wrapper,.floor-link,.post-info,.comment-info,.post-floor,.comment-floor") || [];
		                                        for (const node of rightNodes) {
		                                            if (!node || node === authorInfo || authorInfo.contains(node)) continue;
		                                            const rr = node.getBoundingClientRect?.();
		                                            if (!rr || rr.width < 1 || rr.height < 1) continue;
		                                            const overlapY = rr.bottom > (ar.top + 2) && rr.top < (ar.bottom - 2);
		                                            if (overlapY && rr.left < (ar.right + 6)) {
		                                                crowded = true;
		                                                const intrusion = ar.right - rr.left;
		                                                floorTightLevel = Math.max(floorTightLevel, intrusion > 2 ? 2 : 1);
		                                                break;
		                                            }
		                                        }
		                                    }
		                                } catch { }
		                            }

		                            // 4) 内部内容总宽超出可用宽度（未必触发浏览器换行，但会造成视觉拥挤）
			                            if (!wrapped && !crowded) {
			                                try {
			                                    const overflow = (authorInfo.scrollWidth - authorInfo.clientWidth);
			                                    crowded = overflow > 4;
			                                    if (crowded) floorTightLevel = Math.max(floorTightLevel, overflow > 14 ? 2 : 1);
			                                } catch { }
			                            }
		                            // 5) 元素被 authorInfo 自身裁切（overflow hidden 场景）
		                            if (!wrapped && !crowded) {
		                                try {
		                                    const ar = authorInfo.getBoundingClientRect?.();
		                                    if (ar && ar.width > 0 && ar.height > 0) {
		                                        const watch = new Set();
		                                        try { authorInfo.querySelectorAll?.(".nsx-user-id-meta,.nsx-lv-badge,.nsx-user-mini-meta,.nsx-op-badge,.nsx-blogger-badge,.nsx-owner-badge,.nsx-oneman-badge,.nsx-admin-badge,.nsx-dev-badge,.nsx-detective-badge,.nsx-broker-badge")?.forEach?.(n => watch.add(n)); } catch { }
		                                        for (const node of watch) {
		                                            if (!node) continue;
		                                            const rr = node.getBoundingClientRect?.();
		                                            if (!rr || rr.width < 1 || rr.height < 1) continue;
		                                            if (rr.right > (ar.right + 1) || rr.left < (ar.left - 1)) {
		                                                crowded = true;
		                                                const overflowRight = rr.right - ar.right;
		                                                const overflowLeft = ar.left - rr.left;
		                                                floorTightLevel = Math.max(floorTightLevel, (overflowRight > 8 || overflowLeft > 8) ? 2 : 1);
		                                                break;
		                                            }
		                                        }
		                                    }
		                                } catch { }
		                            }
		                            // 6) 泛化检测：同一行右侧有其它元素占位，导致作者行可用宽度不足
		                            if (!wrapped && !crowded) {
		                                try {
		                                    const lineHost = authorInfo.parentElement;
		                                    const ar = authorInfo.getBoundingClientRect?.();
		                                    if (lineHost && ar && ar.width > 0 && ar.height > 0) {
		                                        let nearestRightLeft = Infinity;
		                                        Array.from(lineHost.children || []).forEach((node) => {
		                                            if (!node || node === authorInfo) return;
		                                            const rr = node.getBoundingClientRect?.();
		                                            if (!rr || rr.width < 1 || rr.height < 1) return;
		                                            const overlapY = rr.bottom > (ar.top + 2) && rr.top < (ar.bottom - 2);
		                                            if (!overlapY) return;
		                                            if (rr.left >= ar.left) nearestRightLeft = Math.min(nearestRightLeft, rr.left);
		                                        });
		                                        if (Number.isFinite(nearestRightLeft) && nearestRightLeft < Infinity && ar.right > (nearestRightLeft - 6)) {
		                                            crowded = true;
		                                            const gap = nearestRightLeft - ar.right;
		                                            floorTightLevel = Math.max(floorTightLevel, gap < 2 ? 2 : 1);
		                                        }
		                                    }
		                                } catch { }
		                            }
		                            // 7) 兜底：开启“楼层号融合”后，右侧占位更紧凑但仍会压缩作者行；
		                            // 某些机型/WebView 下前述几何检测可能误判为“不拥挤”，这里按场景兜底触发紧凑缩写
		                            if (!wrapped && !crowded) {
		                                try {
		                                    const metaHost = authorInfo.closest?.(".nsk-content-meta-info");
		                                    const hasFusedFloor = !!metaHost?.querySelector?.(".floor-link-wrapper > a.nsx-floor-fused");
		                                    if (narrowScreen && hasFusedFloor) {
		                                        const roleCount = collectRoleBadges(authorInfo).length;
		                                        if (roleCount >= 2) {
		                                            crowded = true;
		                                            floorTightLevel = Math.max(floorTightLevel, roleCount >= 3 ? 2 : 1);
		                                        }
		                                    }
		                                } catch { }
		                            }
					                            const shouldCompact = wrapped || crowded;
					                            if (shouldCompact) {
					                                try { if (username && !el.title) el.title = username; } catch { }
					                                try { authorInfo.classList.add("nsx-author-tight"); } catch { }
					                                try { floorTightHost?.classList?.add?.("nsx-floor-tight"); } catch { }
					                                try {
					                                    if ((floorTightLevel || 0) >= 2) floorTightHost?.classList?.add?.("nsx-floor-tight-2");
					                                    else floorTightHost?.classList?.remove?.("nsx-floor-tight-2");
					                                } catch { }
					                            } else {
					                                try { authorInfo.classList.remove("nsx-author-tight"); } catch { }
					                                try { floorTightHost?.classList?.remove?.("nsx-floor-tight"); } catch { }
					                                try { floorTightHost?.classList?.remove?.("nsx-floor-tight-2"); } catch { }
					                            }
				                            autoAbbrevRoleBadges(authorInfo, shouldCompact);
				                        };
		                        try {
		                            requestAnimationFrame(() => requestAnimationFrame(run));
		                        } catch {
		                            setTimeout(run, 0);
		                        }
		                        try {
		                            // 兜底：部分 WebView/SPA 在资源加载后才改变排版（如头像/字体/右侧楼层号渲染），延迟再判一次
		                            setTimeout(run, 120);
		                            setTimeout(run, 600);
		                        } catch { }
		                    };
		                    scheduleAuthorNoWrapIfWrapped();

	                    // 小屏移动端：直接显示（更紧凑），并支持点击徽章展开详情

	                    // --- A. 帖内信息扩展逻辑 ---
                    const showInfo = ctx.store.get("inline_user_info.enabled", true);
                    if (showInfo && userId) {
                        let userData = cache.get(userId);
                        if (!userData) {
                            if (!fetching.has(userId)) {
                                const p = fetchQueue.then(() => new Promise((resolve) => {
                                    setTimeout(async () => {
                                        try {
                                            const r = await ctx.net.get(`/api/account/getInfo/${userId}`);
                                            resolve(r?.success ? r.detail : null);
                                        } catch (e) { resolve(null); }
                                    }, 300);
                                }));
                                fetching.set(userId, p);
                                fetchQueue = p;
                            }
                            userData = await fetching.get(userId);
                            if (userData) cache.set(userId, userData);
                        }

	                        if (userData && !metaInfo.querySelector('.nsx-user-info-display')) {
	                            const metrics = computeReputationMetrics(userData);
	                            const infoSpanDiv = document.createElement('span');
	                            infoSpanDiv.className = 'nsx-user-info-display';
	                            infoSpanDiv.style.cssText = `display:inline-flex;align-items:center;opacity:0.95;user-select:text;`;
	                            infoSpanDiv.style.cursor = smallScreen ? 'pointer' : 'help';
		                            const accentGradient = String(metrics.lvColorReadable || metrics.lvGradientReadable || metrics.lvGradient || "").trim() || "#b45309";
		                            const accentSolid = String(metrics.lvColorReadable || "").trim() || "#b45309";
		                            const accentSolidDark = String(metrics.lvColorReadableDark || "").trim() || accentSolid;
		                            const trustGradient = String(metrics.trustColorReadable || metrics.trustGradientReadable || metrics.trustColor || "").trim() || "#c2410c";
		                            const trustSolid = String(metrics.trustColorReadable || "").trim() || "#c2410c";
		                            const trustSolidDark = String(metrics.trustColorReadableDark || "").trim() || trustSolid;
		                            const sideAccent = accentSolid;
		                            infoSpanDiv.style.setProperty("--nsx-user-accent", accentGradient);
		                            infoSpanDiv.style.setProperty("--nsx-user-accent-solid", accentSolid);
		                            infoSpanDiv.style.setProperty("--nsx-user-accent-solid-dark", accentSolidDark);
		                            infoSpanDiv.style.setProperty("--nsx-user-trust-accent", trustGradient);
		                            infoSpanDiv.style.setProperty("--nsx-user-trust-solid", trustSolid);
		                            infoSpanDiv.style.setProperty("--nsx-user-trust-solid-dark", trustSolidDark);
		                            infoSpanDiv.style.setProperty("--nsx-user-side-accent", sideAccent);
		                            try {
		                                el.classList.add("nsx-user-id-main");
		                                el.style.setProperty("--nsx-user-accent", accentGradient);
		                                el.style.setProperty("--nsx-user-name-color", "#3f3f46");
		                                el.style.setProperty("--nsx-user-name-color-dark", "#e7e5e4");
		                                authorInfo?.style?.setProperty?.("--nsx-user-accent", accentGradient);
		                                authorInfo?.style?.setProperty?.("--nsx-user-accent-solid", accentSolid);
		                                authorInfo?.style?.setProperty?.("--nsx-user-accent-solid-dark", accentSolidDark);
		                                authorInfo?.style?.setProperty?.("--nsx-user-trust-accent", trustGradient);
		                                authorInfo?.style?.setProperty?.("--nsx-user-trust-solid", trustSolid);
		                                authorInfo?.style?.setProperty?.("--nsx-user-trust-solid-dark", trustSolidDark);
		                                authorInfo?.style?.setProperty?.("--nsx-user-side-accent", sideAccent);
		                            } catch { }
		                            const mergedMeta = document.createElement('span');
		                            mergedMeta.className = 'nsx-user-id-meta';
			                            mergedMeta.title = `Lv${metrics.rank}（系统等级） · ${metrics.trustLevel}（信誉称号） · 注册${metrics.joinDaysText}天`;
		                            mergedMeta.style.cursor = smallScreen ? 'pointer' : 'help';

	                            const line1 = document.createElement('span');
	                            line1.className = 'nsx-user-id-line1';

	                            const lvText = document.createElement('span');
	                            lvText.className = 'nsx-user-id-lv';
	                            lvText.textContent = `Lv${metrics.rank}`;

		                            const levelText = document.createElement('span');
		                            levelText.className = 'nsx-user-id-level';
		                            levelText.textContent = metrics.trustLevel;

	                            const registerText = document.createElement('span');
	                            registerText.className = 'nsx-user-id-reg';
	                            registerText.textContent = `注册${metrics.joinDaysText}天`;

	                            const sep1 = document.createElement('span');
	                            sep1.className = 'nsx-user-id-sep';
	                            sep1.textContent = '·';

		                            line1.appendChild(lvText);
		                            line1.appendChild(sep1);
		                            line1.appendChild(levelText);
	                            mergedMeta.appendChild(line1);
	                            mergedMeta.appendChild(registerText);
	                            infoSpanDiv.appendChild(mergedMeta);

	                            if (smallScreen) {
	                                infoSpanDiv.addEventListener('click', (e) => {
	                                    e.preventDefault();
	                                    e.stopPropagation();
	                                    openUserActions(username, userId, metrics);
	                                }, true);
	                            }

                            if (!smallScreen) {
                                let hoverTimer;
                                infoSpanDiv.onmouseenter = () => {
                                    clearTimeout(hoverTimer);
                                    const palette = getThemePalette();
                                    const hoverContent = buildDiagnosisHtml(username, userId, metrics, palette);
                                    ctx.ui.tips?.(hoverContent, infoSpanDiv, {
                                        tips: [3, palette.bg],
                                        time: 0,
                                        success: (layero, index) => {
                                            if (layero && layero[0]) {
                                                layero.css({ 'background-color': 'transparent', 'box-shadow': 'none', 'border': 'none' });
                                                layero.find('.layui-layer-content').css({ 'padding': '0', 'overflow': 'visible' });
                                                layero.find('.layui-layer-TipsG').css('display', 'none');
                                                layero[0].onmouseenter = () => clearTimeout(hoverTimer);
                                                layero[0].onmouseleave = () => hoverTimer = setTimeout(() => ctx.ui.layer?.close?.(index), 200);
                                            }
                                        }
                                    });
                                };
                                infoSpanDiv.onmouseleave = () => {
                                    hoverTimer = setTimeout(() => ctx.ui.layer?.closeAll?.('tips'), 250);
                                };
                            }
	                            el.after(infoSpanDiv);
	                            // 插入徽章/统计后再测一次（常见：长用户名把徽章/统计挤到下一行）
	                            scheduleAuthorNoWrapIfWrapped();
	                        }
	                    }

                    // --- B. 独立社交按钮逻辑 ---
                    const showFriend = ctx.store.get("relation.show_friend_btn", true);
                    const showBlock = ctx.store.get("relation.show_block_btn", true);
                    if (!smallScreen && (showFriend || showBlock)) {
                        const blacklist = JSON.parse(localStorage.getItem('nsx_advanced_blacklist') || '{}');
                        const friends = JSON.parse(localStorage.getItem('nsx_advanced_friends') || '{}');
                        const isBlocked = !!blacklist[username];
                        const isFriend = !!friends[username];

                        const bindInlineAction = (btn, isTrue, key, map, msgOn, msgOff, targetUserId) => {
                            btn.onclick = () => {
                                if (isTrue) {
                                    delete map[username];
                                    localStorage.setItem(key, JSON.stringify(map));
                                    ctx.ui.toast(msgOff);
                                    window.__nsxRuntime?.reapplyRelation?.();
                                } else {
                                    ctx.ui.layer.prompt({ title: msgOn }, async (val, pIndex) => {
                                        // 如果是黑名单且开启了官方 API 屏蔽模式，同步调用接口
                                        if (key === 'nsx_advanced_blacklist') {
                                            const blMode = ctx.store.get("relation.blacklist_mode", "fold");
                                            if (blMode === 'official') {
                                                try {
                                                    const r = await ctx.net.post("/api/block-list/add", { block_member_name: username });
                                                    if (!r?.success) {
                                                        ctx.ui.alert("同步失败", r?.message || "官方接口调用失败，仅保存本地备注");
                                                    }
                                                } catch (e) {
                                                    env.error("Sync Official Block Failed", e);
                                                }
                                            }
                                        }

                                        map[username] = { remark: val, time: new Date().toLocaleString(), userId: targetUserId };
                                        localStorage.setItem(key, JSON.stringify(map));
                                        ctx.ui.layer.close(pIndex);
                                        ctx.ui.toast("操作成功");
                                        window.__nsxRuntime?.reapplyRelation?.();
                                    });
                                }
                            };
                        };

                        const btnWrap = document.createElement('span');
                        btnWrap.className = 'nsx-relation-btn-wrap';
                        btnWrap.style.cssText = 'display:inline-flex;flex-wrap:wrap;gap:4px;vertical-align:middle;margin-left:6px;margin-right:6px;align-items:center;';

                        if (showFriend) {
                            const frBtn = document.createElement('span');
                            frBtn.className = 'nsx-relation-btn nsx-btn-friend';
                            frBtn.innerHTML = isFriend ? '✖ 好友' : '➕ 好友';
                            bindInlineAction(frBtn, isFriend, 'nsx_advanced_friends', friends, `添加 ${username} 为好友`, `已取消关注 ${username}`, userId);
                            btnWrap.appendChild(frBtn);
                        }
                        if (showBlock) {
                            const blBtn = document.createElement('span');
                            blBtn.className = 'nsx-relation-btn nsx-btn-block';
                            blBtn.innerHTML = isBlocked ? '⭕ 解除' : '🚫 屏蔽';
                            bindInlineAction(blBtn, isBlocked, 'nsx_advanced_blacklist', blacklist, `屏蔽 ${username}`, `已解除屏蔽 ${username}`, userId);
                            btnWrap.appendChild(blBtn);
                        }

                        const floorWrapper = metaInfo.querySelector('.floor-link-wrapper');
                        if (floorWrapper) floorWrapper.before(btnWrap);
                        else {
                            const anchor = metaInfo.querySelector('.floor-link, .post-info, .comment-info');
                            if (anchor) anchor.before(btnWrap);
                        }
                    }
                };

	                const processUsers = () => ctx.$$('.nsk-content-meta-info .author-info > a[href*="/space/"]').filter(a => a?.textContent?.trim?.()).forEach(display);
	                processUsers();
	                ctx.watch('.nsk-content-meta-info .author-info > a[href*="/space/"]', processUsers, { debounce: 200 });
            }
        };
        define(inlineUserInfo);

        /* ==========================================================================
