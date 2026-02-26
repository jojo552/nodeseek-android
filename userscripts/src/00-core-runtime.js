// ==UserScript==
// @name         Nodeseek Pro
// @description  用于增强 NodeSeek/DeepFlood 论坛体验的用户脚本：提供自动签到、下拉加载、快速评论、内容过滤、等级标记、浏览历史、Callout 渲染、图片预览、快捷键等功能，并带可视化设置面板可自由开关配置。
// @namespace    http://www.nodeseek.com/
// @version      1.0.0
// @match        *://www.nodeseek.com/*
// @match        *://www.deepflood.com/*
// @require      https://s4.zstatic.net/ajax/libs/layui/2.10.3/layui.min.js
// @resource     highlightStyle https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css
// @resource     highlightStyle_dark https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getResourceURL
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @license      GPL-3.0
// ==/UserScript==
(function () {
    'use strict';

    // NSX Core - 核心
    // 环境 + DOM + 网络 + 存储 + 模块管理

    const SITES = [
        { host: "www.nodeseek.com", code: "ns", name: "NodeSeek" },
        { host: "nodeseek.com", code: "ns", name: "NodeSeek" },
        { host: "www.deepflood.com", code: "df", name: "DeepFlood" },
        { host: "deepflood.com", code: "df", name: "DeepFlood" }
    ];

    const info = GM_info?.script || {};
    const currentHost = (location.hostname || location.host || "").toLowerCase();
    const site = SITES.find(s => s.host === currentHost);
    let debug = false;
    try { debug = GM_getValue("settings", {})?.debug?.enabled; } catch { }

    // ===== 环境 =====
    const env = {
        info, site, BASE_URL: location.origin,
        log: (...a) => debug && console.log(`[NSX]`, ...a),
        warn: (...a) => debug && console.warn(`[NSX]`, ...a),
        error: (...a) => console.error(`[NSX]`, ...a)
    };

    // ===== DOM =====
    const $ = (s, r = document) => r?.querySelector(s);
    const $$ = (s, r = document) => [...(r?.querySelectorAll(s) || [])];

    function addStyle(id, val) {
        const existing = document.getElementById(id);
        const isUrl = /^(https?:)?\/\//.test(val);
        if (existing) {
            // 允许在 SPA / 不刷新场景下更新样式内容（否则同 id 会直接 return 导致新样式不生效）
            if (isUrl) {
                if (existing.tagName === "LINK") {
                    existing.rel = "stylesheet";
                    existing.href = val;
                    return;
                }
                const link = document.createElement("link");
                link.id = id;
                link.rel = "stylesheet";
                link.href = val;
                existing.replaceWith(link);
                return;
            }
            if (existing.tagName === "STYLE") {
                existing.textContent = val;
                return;
            }
            const style = document.createElement("style");
            style.id = id;
            style.textContent = val;
            existing.replaceWith(style);
            return;
        }
        const el = document.createElement(isUrl ? "link" : "style");
        el.id = id;
        isUrl ? (el.rel = "stylesheet", el.href = val) : (el.textContent = val);
        document.head?.appendChild(el);
    }

    function addScript(id, val) {
        if (document.getElementById(id)) return;
        const el = document.createElement("script");
        el.id = id;
        /^(https?:)?\/\//.test(val) ? (el.src = val) : (el.textContent = val);
        document.body?.appendChild(el);
    }

    const debounce = (fn, ms) => {
        let t; const d = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
        d.cancel = () => clearTimeout(t); return d;
    };

    const throttle = (fn, ms) => {
        let last = 0;
        return (...a) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...a); } };
    };

    const getViewportWidth = () => Math.max(document.documentElement?.clientWidth || 0, window.innerWidth || 0);

    const isSmallScreen = (maxWidth = 480) => {
        const w = getViewportWidth();
        return w > 0 && w <= maxWidth;
    };

    const getHeadBottom = () => {
        const head = document.getElementById("nsk-head");
        const r = head?.getBoundingClientRect?.();
        if (r && Number.isFinite(r.bottom) && r.bottom > 0) return r.bottom;
        return 56;
    };

    const ensureIconGroup = (headEl) => {
        const head = headEl || document.getElementById("nsk-head");
        if (!head) return null;

        let grp = document.getElementById("nsx-icon-group");
        if (!grp) {
            grp = document.createElement("div");
            grp.id = "nsx-icon-group";
        }

        // 重置为“跟随网页头部”的布局（避免遮挡/错位）
        grp.style.position = "static";
        grp.style.right = "auto";
        grp.style.top = "auto";
        grp.style.height = "auto";
        grp.style.zIndex = "auto";
        grp.style.display = "flex";
        grp.style.alignItems = "center";
        grp.style.justifyContent = "flex-end";
        grp.style.gap = "2px";

        const viewportWidth = getViewportWidth();
        const candidates = Array.from(head.querySelectorAll("a,button,div"))
            .filter(el => el && el !== grp && !grp.contains(el) && el.querySelector?.("svg"))
            .map(el => ({ el, rect: el.getBoundingClientRect() }))
            .filter(({ rect }) => rect
                && rect.width >= 16 && rect.width <= 120
                && rect.height >= 16
                && rect.right >= viewportWidth * 0.55
                && rect.top >= -20
            );

        const anchor = candidates.length
            ? candidates.reduce((a, b) => (a.rect.right >= b.rect.right ? a : b)).el
            : null;

        const parent = anchor?.parentElement || head;
        if (grp.parentElement !== parent) {
            try { grp.remove(); } catch { }
            anchor ? parent.insertBefore(grp, anchor) : parent.appendChild(grp);
        } else if (anchor && grp.nextSibling !== anchor) {
            parent.insertBefore(grp, anchor);
        } else if (!anchor && grp.parentElement === head && grp !== head.lastElementChild) {
            head.appendChild(grp);
        }

        if (anchor) {
            const color = getComputedStyle(anchor).color;
            if (color) grp.style.color = color;
        }

        return grp;
    };

    // ===== 存储 =====
    const cfgFragments = new Map(), metaFragments = new Map();
    let cfgCache = null;

    const isObj = v => v && typeof v === "object" && !Array.isArray(v);
    const merge = (t, s) => { for (const k in s) isObj(s[k]) ? (isObj(t[k]) || (t[k] = {}), merge(t[k], s[k])) : t[k] === undefined && (t[k] = s[k]); };
    const getPath = (o, p) => p.split(".").reduce((a, k) => a?.[k], o);
    const setPath = (o, p, v) => { const ks = p.split("."), l = ks.pop(); ks.reduce((a, k) => a[k] ??= {}, o)[l] = v; };

    const store = {
        reg(id, cfg, meta) { cfg && cfgFragments.set(id, cfg); meta && metaFragments.set(id, meta); },
        getDefaults() { const d = { version: info.version, debug: { enabled: false } }; cfgFragments.forEach(f => merge(d, f)); return d; },
        getMeta() { const m = {}; metaFragments.forEach(f => merge(m, f)); return m; },
        init() {
            if (cfgCache) return cfgCache;
            const def = this.getDefaults();
            cfgCache = GM_getValue("settings", null) || {};
            merge(cfgCache, def);
            cfgCache.version = def.version;
            GM_setValue("settings", cfgCache);
            return cfgCache;
        },
        get(p, fb) { const v = getPath(this.init(), p); return v === undefined ? fb : v; },
        set(p, v) { setPath(this.init(), p, v); GM_setValue("settings", cfgCache); }
    };

    // ===== 网络 =====
    const net = {
        async fetch(url, { method = "GET", data, headers = {}, type = "json" } = {}) {
            const r = await fetch(url.startsWith("http") ? url : env.BASE_URL + url, {
                method, credentials: "include",
                headers: { ...(data ? { "Content-Type": "application/json" } : {}), ...headers },
                body: data ? JSON.stringify(data) : undefined
            });
            return r[type]().catch(() => null);
        },
        get: (u, h, t) => net.fetch(u, { headers: h, type: t }),
        post: (u, d, h, t) => net.fetch(u, { method: "POST", data: d, headers: h, type: t })
    };

    // ===== 模块管理 =====
    const modules = new Map();

    function define(cfg) {
        if (!cfg?.id) throw new Error("id required");
        cfg.deps ??= [];
        cfg.order ??= 100;
        modules.set(cfg.id, cfg);
        cfg.cfg && store.reg(cfg.id, cfg.cfg, cfg.meta);
        return cfg;
    }

    function boot(ctx) {
        store.init();
        // 拓扑排序
        const list = [...modules.values()];
        const indeg = new Map(list.map(m => [m.id, 0]));
        const edges = new Map(list.map(m => [m.id, []]));
        list.forEach(m => m.deps.forEach(d => { if (modules.has(d)) { edges.get(d).push(m.id); indeg.set(m.id, indeg.get(m.id) + 1); } }));
        const q = list.filter(m => indeg.get(m.id) === 0).sort((a, b) => a.order - b.order);
        const sorted = [];
        while (q.length) {
            const cur = q.shift(); sorted.push(cur);
            edges.get(cur.id).forEach(n => { indeg.set(n, indeg.get(n) - 1); if (!indeg.get(n)) q.push(modules.get(n)); });
            q.sort((a, b) => a.order - b.order);
        }
        // 初始化和监听
        sorted.forEach(m => {
            if (m.match?.(ctx) !== false) {
                try { m.init?.(ctx); } catch (e) { env.error(m.id, e); }
                if (ctx.watch) {
                    const w = typeof m.watch === "function" ? m.watch(ctx) : m.watch;
                    [].concat(w || []).filter(Boolean).forEach(i => ctx.watch(i.sel, i.fn, i.opts));
                }
            }
        });
    }

    /* ==========================================================================
