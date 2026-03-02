package com.nodeseek.app;

import android.app.Activity;
import android.annotation.SuppressLint;
import android.Manifest;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebBackForwardList;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.nodeseek.app.notify.NotificationScheduler;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MainActivity extends Activity {
    private static final String BASELINE_TAG = "NS_BASELINE";
    public static final String EXTRA_TARGET_URL = "extra_target_url";
    private static final String URL_HOME = "https://www.nodeseek.com/";
    private static final String HOST_PRIMARY = "www.nodeseek.com";
    private static final String HOST_FALLBACK = "nodeseek.com";
    private static final long REFRESH_TIMEOUT_MS = 15000L;
    private static final int WEB_THEME_SYNC_RETRY_COUNT = 2;
    private static final long WEB_THEME_SYNC_RETRY_DELAY_MS = 450L;
    private static final long WEB_THEME_SYNC_RESUME_DELAY_MS = 220L;
    private static final long WEB_THEME_SYNC_AFTER_CLICK_DELAY_MS = 280L;
    private static final int REQUEST_CODE_FILE_CHOOSER = 61201;
    private static final int REQUEST_CODE_POST_NOTIFICATIONS = 61202;
    private static final int DEFAULT_STATUS_BAR_COLOR_LIGHT = 0xFFFFFFFF;
    private static final int DEFAULT_STATUS_BAR_COLOR_DARK = 0xFF121212;
    private static final Pattern URL_IN_TEXT_PATTERN = Pattern.compile("(https?://\\S+)");
    private static final String STATE_WEBVIEW = "state_webview";

    private View rootContainer;
    private View statusBarScrim;
    private SwipeRefreshLayout swipeRefreshLayout;
    private WebView webContent;
    private TextView textEmpty;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final Runnable refreshTimeoutRunnable = this::stopRefreshingIndicator;
    private final Runnable statusBarSyncRunnable = this::requestStatusBarColorSync;
    private final Runnable webThemeSyncRunnable = this::syncWebThemeWithSystem;
    private int swipeRefreshBaseTopPadding;
    private int swipeRefreshBaseBottomPadding;
    private long launchStartElapsedMs;
    private long lastPauseElapsedMs = -1L;
    private boolean hasEnteredBackground;
    private boolean firstPageLoaded;
    private ValueCallback<Uri[]> pendingFilePathCallback;
    private OnBackInvokedCallback backInvokedCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        launchStartElapsedMs = SystemClock.elapsedRealtime();
        Log.i(BASELINE_TAG, "activity_onCreate");
        setContentView(R.layout.activity_main);

        bindViews();
        setupWebView();
        setupPullToRefresh();
        configureEdgeToEdgeInsets();
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        applyStatusBarScrimColor(getDefaultStatusBarColor());
        registerBackNavigationCallback();
        NotificationScheduler.ensureScheduled(getApplicationContext());
        ensureNotificationPermission();
        if (!restoreWebViewState(savedInstanceState)) {
            webContent.loadUrl(resolveLaunchUrl(getIntent()));
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (webContent == null) {
            return;
        }
        if (!shouldHandleLaunchIntent(intent)) {
            return;
        }
        String targetUrl = resolveLaunchUrl(intent);
        String currentUrl = webContent.getUrl();
        if (currentUrl != null && currentUrl.equals(targetUrl)) {
            return;
        }
        webContent.loadUrl(targetUrl);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (hasEnteredBackground && lastPauseElapsedMs > 0) {
            long resumeCost = SystemClock.elapsedRealtime() - lastPauseElapsedMs;
            Log.i(BASELINE_TAG, "resume_to_foreground_ms=" + resumeCost);
        }
        mainHandler.removeCallbacks(webThemeSyncRunnable);
        mainHandler.postDelayed(webThemeSyncRunnable, WEB_THEME_SYNC_RESUME_DELAY_MS);
    }

    @Override
    protected void onPause() {
        super.onPause();
        hasEnteredBackground = true;
        lastPauseElapsedMs = SystemClock.elapsedRealtime();
        mainHandler.removeCallbacks(webThemeSyncRunnable);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webContent == null) {
            return;
        }
        Bundle webState = new Bundle();
        webContent.saveState(webState);
        outState.putBundle(STATE_WEBVIEW, webState);
    }

    private void bindViews() {
        rootContainer = findViewById(R.id.root_container);
        statusBarScrim = findViewById(R.id.status_bar_scrim);
        swipeRefreshLayout = findViewById(R.id.swipe_refresh);
        webContent = findViewById(R.id.web_content);
        textEmpty = findViewById(R.id.text_empty);
        swipeRefreshBaseTopPadding = swipeRefreshLayout.getPaddingTop();
        swipeRefreshBaseBottomPadding = swipeRefreshLayout.getPaddingBottom();
    }

    private void setupWebView() {
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webContent, true);

        WebSettings settings = webContent.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        NodeseekUserscriptRuntime.attach(this, webContent);

        webContent.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                textEmpty.setVisibility(View.GONE);
                // 兜底恢复下拉刷新开关，避免上个页面异常退出导致抑制状态残留。
                NodeseekUserscriptRuntime.setPullToRefreshSuppressed(false);
                startRefreshingIndicator();
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                NodeseekUserscriptRuntime.inject(MainActivity.this, view, url);
                NotificationScheduler.syncSessionFromPage(
                    MainActivity.this,
                    url,
                    view.getSettings().getUserAgentString()
                );
                stopRefreshingIndicator();
                syncWebThemeWithSystem();
                syncStatusBarWithPage();
                textEmpty.setVisibility(View.GONE);
                if (!firstPageLoaded) {
                    firstPageLoaded = true;
                    long firstPageCost = SystemClock.elapsedRealtime() - launchStartElapsedMs;
                    Log.i(BASELINE_TAG, "cold_start_first_page_ms=" + firstPageCost);
                }
            }

            @Override
            public void onReceivedHttpError(
                WebView view,
                WebResourceRequest request,
                WebResourceResponse errorResponse
            ) {
                if (request != null && request.isForMainFrame() && errorResponse != null) {
                    showMainFrameError("HTTP " + errorResponse.getStatusCode());
                }
            }

            @Override
            public void onReceivedError(
                WebView view,
                WebResourceRequest request,
                WebResourceError error
            ) {
                if (request != null && request.isForMainFrame() && error != null) {
                    showMainFrameError(String.valueOf(error.getDescription()));
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri == null ? null : uri.getHost();
                if (isNodeSeekHost(host)) {
                    return false;
                }
                if (uri == null) {
                    return true;
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception ignored) {
                }
                return true;
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                String reason = (detail != null && detail.didCrash()) ? "crashed" : "killed";
                Log.e(BASELINE_TAG, "webview_render_process_gone=" + reason);

                stopRefreshingIndicator();
                NodeseekUserscriptRuntime.setPullToRefreshSuppressed(false);
                mainHandler.removeCallbacks(webThemeSyncRunnable);
                mainHandler.removeCallbacks(statusBarSyncRunnable);
                mainHandler.removeCallbacks(refreshTimeoutRunnable);

                try {
                    if (view != null) {
                        view.stopLoading();
                        view.setWebChromeClient(null);
                        view.setWebViewClient(null);
                        ViewGroup parent = (ViewGroup) view.getParent();
                        if (parent != null) {
                            parent.removeView(view);
                        }
                        view.destroy();
                    }
                } catch (Throwable ignored) {
                }

                textEmpty.setText(getString(R.string.error_load_posts, "WebView 渲染进程异常，正在恢复"));
                textEmpty.setVisibility(View.VISIBLE);
                recreate();
                return true;
            }
        });
        webContent.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(
                WebView webView,
                ValueCallback<Uri[]> filePathCallback,
                FileChooserParams fileChooserParams
            ) {
                openFileChooser(filePathCallback, fileChooserParams);
                return true;
            }
        });
    }

    private void setupPullToRefresh() {
        swipeRefreshLayout.setEnabled(true);
        swipeRefreshLayout.setOnRefreshListener(this::reloadCurrentPage);
        swipeRefreshLayout.setOnChildScrollUpCallback(
            // 当 Userscript 打开独立滚动面板时（例如设置页），允许脚本临时抑制下拉刷新，避免滑动误触。
            (parent, child) -> NodeseekUserscriptRuntime.isPullToRefreshSuppressed()
                || webContent.canScrollVertically(-1)
        );
    }

    private void configureEdgeToEdgeInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(rootContainer, (view, insets) -> {
            Insets statusBarInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars());
            Insets navigationBarInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
            Insets imeInsets = insets.getInsets(WindowInsetsCompat.Type.ime());
            int bottomInset = Math.max(navigationBarInsets.bottom, imeInsets.bottom);

            ViewGroup.LayoutParams params = statusBarScrim.getLayoutParams();
            if (params != null && params.height != statusBarInsets.top) {
                params.height = statusBarInsets.top;
                statusBarScrim.setLayoutParams(params);
            }

            swipeRefreshLayout.setPadding(
                swipeRefreshLayout.getPaddingLeft(),
                swipeRefreshBaseTopPadding + statusBarInsets.top,
                swipeRefreshLayout.getPaddingRight(),
                swipeRefreshBaseBottomPadding + bottomInset
            );
            return insets;
        });
        ViewCompat.requestApplyInsets(rootContainer);
    }

    private void reloadCurrentPage() {
        startRefreshingIndicator();
        String currentUrl = webContent.getUrl();
        if (currentUrl == null || currentUrl.trim().isEmpty()) {
            webContent.loadUrl(URL_HOME);
            return;
        }
        webContent.reload();
    }

    private boolean isNodeSeekHost(String host) {
        if (host == null) {
            return false;
        }
        String lowerHost = host.toLowerCase(Locale.ROOT);
        if (HOST_PRIMARY.equals(lowerHost) || HOST_FALLBACK.equals(lowerHost)) {
            return true;
        }
        return lowerHost.endsWith("." + HOST_FALLBACK);
    }

    private String resolveLaunchUrl(Intent intent) {
        if (intent == null) {
            return URL_HOME;
        }
        String targetUrl = extractNotificationTargetUrl(intent);
        if (targetUrl != null) {
            return targetUrl;
        }
        String action = intent.getAction();
        if (Intent.ACTION_VIEW.equals(action)) {
            return normalizeIncomingUrl(intent.getData());
        }
        if (Intent.ACTION_SEND.equals(action)) {
            String text = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (text == null) {
                ClipData clipData = intent.getClipData();
                if (clipData != null && clipData.getItemCount() > 0) {
                    CharSequence clipText = clipData.getItemAt(0).coerceToText(this);
                    text = clipText == null ? null : clipText.toString();
                }
            }
            return normalizeIncomingUrl(extractFirstUrl(text));
        }
        return URL_HOME;
    }

    private boolean shouldHandleLaunchIntent(Intent intent) {
        if (intent == null) {
            return false;
        }
        if (extractNotificationTargetUrl(intent) != null) {
            return true;
        }
        String action = intent.getAction();
        return Intent.ACTION_VIEW.equals(action) || Intent.ACTION_SEND.equals(action);
    }

    private String extractNotificationTargetUrl(Intent intent) {
        if (intent == null) {
            return null;
        }
        String raw = intent.getStringExtra(EXTRA_TARGET_URL);
        if (raw == null || raw.trim().isEmpty()) {
            return null;
        }
        Uri uri;
        try {
            uri = Uri.parse(raw.trim());
        } catch (Exception ignored) {
            return null;
        }
        String normalized = normalizeIncomingUrl(uri);
        if (URL_HOME.equals(normalized) && !URL_HOME.equals(raw.trim())) {
            return null;
        }
        return normalized;
    }

    private boolean restoreWebViewState(Bundle savedInstanceState) {
        if (savedInstanceState == null || webContent == null) {
            return false;
        }
        Bundle webState = savedInstanceState.getBundle(STATE_WEBVIEW);
        if (webState == null) {
            return false;
        }
        WebBackForwardList restored = webContent.restoreState(webState);
        if (restored == null || restored.getSize() == 0) {
            return false;
        }
        firstPageLoaded = true;
        textEmpty.setVisibility(View.GONE);
        mainHandler.removeCallbacks(webThemeSyncRunnable);
        mainHandler.postDelayed(webThemeSyncRunnable, WEB_THEME_SYNC_RESUME_DELAY_MS);
        return true;
    }

    private Uri extractFirstUrl(String rawText) {
        if (rawText == null) {
            return null;
        }
        String text = rawText.trim();
        if (text.isEmpty()) {
            return null;
        }
        Matcher matcher = URL_IN_TEXT_PATTERN.matcher(text);
        if (!matcher.find()) {
            return null;
        }
        String url = matcher.group(1);
        if (url == null) {
            return null;
        }
        url = trimUrlPunctuation(url);
        if (url.isEmpty()) {
            return null;
        }
        return Uri.parse(url);
    }

    private String trimUrlPunctuation(String url) {
        String value = url.trim();
        while (!value.isEmpty()) {
            char tail = value.charAt(value.length() - 1);
            if (tail == ')' || tail == ']' || tail == '}' || tail == ',' || tail == '.' || tail == '，'
                || tail == '。' || tail == '；' || tail == ';' || tail == '!' || tail == '！'
                || tail == '?' || tail == '？') {
                value = value.substring(0, value.length() - 1).trim();
                continue;
            }
            break;
        }
        return value;
    }

    private String normalizeIncomingUrl(Uri uri) {
        if (uri == null) {
            return URL_HOME;
        }
        String scheme = uri.getScheme();
        String host = uri.getHost();
        if (scheme == null || host == null) {
            return URL_HOME;
        }
        if (!"https".equalsIgnoreCase(scheme) && !"http".equalsIgnoreCase(scheme)) {
            return URL_HOME;
        }
        if (!isNodeSeekHost(host)) {
            return URL_HOME;
        }
        if ("http".equalsIgnoreCase(scheme)) {
            return uri.buildUpon().scheme("https").build().toString();
        }
        return uri.toString();
    }

    private void syncStatusBarWithPage() {
        mainHandler.removeCallbacks(statusBarSyncRunnable);
        requestStatusBarColorSync();
        mainHandler.postDelayed(statusBarSyncRunnable, 500L);
    }

    private void syncWebThemeWithSystem() {
        syncWebThemeWithSystem(WEB_THEME_SYNC_RETRY_COUNT);
    }

    private void syncWebThemeWithSystem(int remainingRetries) {
        if (webContent == null) {
            return;
        }
        String currentUrl = webContent.getUrl();
        if (currentUrl == null || currentUrl.trim().isEmpty()) {
            return;
        }
        Uri pageUri = Uri.parse(currentUrl);
        if (!isNodeSeekHost(pageUri.getHost())) {
            return;
        }
        webContent.evaluateJavascript(buildWebThemeSyncScript(isSystemDarkMode()), jsResult -> {
            String result = parseJsString(jsResult);
            if ("clicked".equals(result)) {
                mainHandler.postDelayed(
                    this::syncStatusBarWithPage,
                    WEB_THEME_SYNC_AFTER_CLICK_DELAY_MS
                );
                return;
            }
            if ("retry".equals(result) && remainingRetries > 0) {
                mainHandler.postDelayed(
                    () -> syncWebThemeWithSystem(remainingRetries - 1),
                    WEB_THEME_SYNC_RETRY_DELAY_MS
                );
            }
        });
    }

    private String buildWebThemeSyncScript(boolean darkModeEnabled) {
        String expectedDark = darkModeEnabled ? "true" : "false";
        return "(function(){"
            + "var wantDark=" + expectedDark + ";"
            + "function lower(v){return (v||'').toString().toLowerCase();}"
            + "function tokenToDark(v){"
                + "var t=lower(v);"
                + "if(!t){return null;}"
                + "if(/dark|night|theme-dark|深色|夜间|暗黑/.test(t)){return true;}"
                + "if(/light|day|theme-light|浅色|日间|明亮/.test(t)){return false;}"
                + "return null;"
            + "}"
            + "function parseCssColor(input){"
                + "var text=(input||'').trim();"
                + "if(!text){return null;}"
                + "if(text==='transparent'||text==='rgba(0, 0, 0, 0)'){return null;}"
                + "if(text.charAt(0)==='#'){"
                    + "var hex=text.slice(1);"
                    + "if(hex.length===3){hex=hex.replace(/(.)/g,'$1$1');}"
                    + "if(hex.length===6){"
                        + "var r=parseInt(hex.slice(0,2),16);"
                        + "var g=parseInt(hex.slice(2,4),16);"
                        + "var b=parseInt(hex.slice(4,6),16);"
                        + "if(!isNaN(r)&&!isNaN(g)&&!isNaN(b)){return [r,g,b];}"
                    + "}"
                + "}"
                + "var m=text.match(/^rgba?\\(([^)]+)\\)$/i);"
                + "if(!m){return null;}"
                + "var parts=m[1].split(',');"
                + "if(parts.length<3){return null;}"
                + "var red=parseInt(parts[0],10);"
                + "var green=parseInt(parts[1],10);"
                + "var blue=parseInt(parts[2],10);"
                + "if(isNaN(red)||isNaN(green)||isNaN(blue)){return null;}"
                + "return [red,green,blue];"
            + "}"
            + "function isDarkByRgb(rgb){"
                + "if(!rgb){return null;}"
                + "var lum=(0.299*rgb[0]+0.587*rgb[1]+0.114*rgb[2])/255;"
                + "return lum<0.55;"
            + "}"
            + "function readDarkByBackground(){"
                + "var nodes=["
                    + "document.querySelector('header'),"
                    + "document.querySelector('.header'),"
                    + "document.querySelector('.topbar'),"
                    + "document.body,"
                    + "document.documentElement"
                + "];"
                + "for(var i=0;i<nodes.length;i++){"
                    + "var el=nodes[i];"
                    + "if(!el){continue;}"
                    + "var color=getComputedStyle(el).backgroundColor;"
                    + "var guess=isDarkByRgb(parseCssColor(color));"
                    + "if(guess!==null){return guess;}"
                + "}"
                + "return null;"
            + "}"
            + "function detectCurrentDark(){"
                + "var html=document.documentElement;"
                + "var body=document.body;"
                + "var attrs=["
                    + "html?html.getAttribute('data-theme'):'',"
                    + "html?html.getAttribute('theme'):'',"
                    + "body?body.getAttribute('data-theme'):'',"
                    + "body?body.getAttribute('theme'):''"
                + "];"
                + "for(var i=0;i<attrs.length;i++){"
                    + "var fromAttr=tokenToDark(attrs[i]);"
                    + "if(fromAttr!==null){return fromAttr;}"
                + "}"
                + "var classes=[html?html.className:'',body?body.className:''];"
                + "for(var j=0;j<classes.length;j++){"
                    + "var fromClass=tokenToDark(classes[j]);"
                    + "if(fromClass!==null){return fromClass;}"
                + "}"
                + "var meta=document.querySelector('meta[name=\"theme-color\"]');"
                + "if(meta&&meta.content){"
                    + "var byMeta=isDarkByRgb(parseCssColor(meta.content));"
                    + "if(byMeta!==null){return byMeta;}"
                + "}"
                + "return readDarkByBackground();"
            + "}"
            + "function canClick(el){"
                + "if(!el){return false;}"
                + "if(el.disabled){return false;}"
                + "var style=getComputedStyle(el);"
                + "if(!style){return false;}"
                + "if(style.display==='none'||style.visibility==='hidden'||style.pointerEvents==='none'){"
                    + "return false;"
                + "}"
                + "return true;"
            + "}"
            + "function clickBySelectors(selectors){"
                + "for(var i=0;i<selectors.length;i++){"
                    + "var el=document.querySelector(selectors[i]);"
                    + "if(canClick(el)){el.click();return true;}"
                + "}"
                + "return false;"
            + "}"
            + "function clickByKeywords(){"
                + "var roots=[document.querySelector('header'),document.body];"
                + "for(var r=0;r<roots.length;r++){"
                    + "var root=roots[r];"
                    + "if(!root){continue;}"
                    + "var nodes=root.querySelectorAll('button,a,[role=\"button\"],.dropdown-item,.menu-item');"
                    + "for(var i=0;i<nodes.length;i++){"
                        + "var node=nodes[i];"
                        + "if(!canClick(node)){continue;}"
                        + "var text=(node.getAttribute('aria-label')||'')+' '"
                            + "+(node.getAttribute('title')||'')+' '"
                            + "+(node.id||'')+' '"
                            + "+(node.className||'')+' '"
                            + "+(node.textContent||'');"
                        + "if(/theme|dark|light|night|mode|深色|浅色|夜间|日间/.test(lower(text))){"
                            + "node.click();"
                            + "return true;"
                        + "}"
                    + "}"
                + "}"
                + "return false;"
            + "}"
            + "var currentDark=detectCurrentDark();"
            + "if(currentDark!==null&&currentDark===wantDark){return 'noop';}"
            + "var selectors=["
                + "'[data-theme-toggle]',"
                + "'.color-theme-switcher',"
                + "'.theme-toggle',"
                + "'.dark-mode-toggle',"
                + "'#theme-toggle',"
                + "'#dark-mode-toggle',"
                + "'[aria-label*=\"theme\"]',"
                + "'[aria-label*=\"dark\"]',"
                + "'[title*=\"theme\"]',"
                + "'[title*=\"dark\"]',"
                + "'[aria-label*=\"深色\"]',"
                + "'[aria-label*=\"夜间\"]',"
                + "'[title*=\"深色\"]',"
                + "'[title*=\"夜间\"]'"
            + "];"
            + "var clicked=clickBySelectors(selectors);"
            + "if(!clicked){clicked=clickByKeywords();}"
            + "if(clicked){return 'clicked';}"
            + "if(currentDark===null){return 'retry';}"
            + "return 'missing';"
        + "})();";
    }

    private void requestStatusBarColorSync() {
        if (webContent == null) {
            return;
        }
        String script =
            "(function(){"
                + "function bg(el){"
                    + "if(!el){return '';}"
                    + "var c=getComputedStyle(el).backgroundColor||'';"
                    + "if(c==='rgba(0, 0, 0, 0)'||c==='transparent'){return '';}"
                    + "return c;"
                + "}"
                + "var color='';"
                + "var meta=document.querySelector('meta[name=\"theme-color\"]');"
                + "if(meta&&meta.content){color=meta.content.trim();}"
                + "if(!color){"
                    + "var hit=document.elementFromPoint(Math.floor(window.innerWidth/2),2);"
                    + "color=bg(hit);"
                + "}"
                + "if(!color){"
                    + "var sels=['header','.header','.top','.topbar','.navbar','#header'];"
                    + "for(var i=0;i<sels.length&&!color;i++){"
                        + "color=bg(document.querySelector(sels[i]));"
                    + "}"
                + "}"
                + "if(!color){color=bg(document.body);}"
                + "return color||'';"
            + "})();";
        webContent.evaluateJavascript(script, value -> {
            Integer color = parseJsCssColor(value);
            if (color == null) {
                return;
            }
            applyStatusBarScrimColor(color);
        });
    }

    private Integer parseJsCssColor(String jsResult) {
        if (jsResult == null) {
            return null;
        }
        String value = jsResult.trim();
        if (value.isEmpty() || "null".equals(value)) {
            return null;
        }
        if (value.length() >= 2 && value.charAt(0) == '"' && value.charAt(value.length() - 1) == '"') {
            value = value.substring(1, value.length() - 1);
        }
        value = value.replace("\\\"", "\"").replace("\\\\", "\\").trim();
        if (value.isEmpty()) {
            return null;
        }
        try {
            if (value.startsWith("#")) {
                return Color.parseColor(value);
            }
            String lower = value.toLowerCase(Locale.ROOT);
            if (lower.startsWith("rgba(") || lower.startsWith("rgb(")) {
                int left = value.indexOf('(');
                int right = value.indexOf(')');
                if (left < 0 || right < 0 || right <= left + 1) {
                    return null;
                }
                String[] parts = value.substring(left + 1, right).split(",");
                if (parts.length < 3) {
                    return null;
                }
                int red = clampColorInt(parts[0]);
                int green = clampColorInt(parts[1]);
                int blue = clampColorInt(parts[2]);
                return Color.rgb(red, green, blue);
            }
            return Color.parseColor(value);
        } catch (Exception ignored) {
            return null;
        }
    }

    private int clampColorInt(String raw) {
        int value;
        try {
            value = Integer.parseInt(raw.trim());
        } catch (Exception ignored) {
            return 0;
        }
        if (value < 0) {
            return 0;
        }
        if (value > 255) {
            return 255;
        }
        return value;
    }

    private void applyStatusBarScrimColor(int color) {
        int safeColor = normalizeStatusBarColor(color);
        statusBarScrim.setBackgroundColor(safeColor);
        WindowInsetsControllerCompat controller =
            WindowCompat.getInsetsController(getWindow(), rootContainer);
        if (controller == null) {
            return;
        }
        controller.setAppearanceLightStatusBars(isLightColor(safeColor));
    }

    private int normalizeStatusBarColor(int color) {
        if (isGreenDominant(color)) {
            return getDefaultStatusBarColor();
        }
        return color;
    }

    private String parseJsString(String jsResult) {
        if (jsResult == null) {
            return "";
        }
        String value = jsResult.trim();
        if (value.isEmpty() || "null".equals(value)) {
            return "";
        }
        if (value.length() >= 2 && value.charAt(0) == '"' && value.charAt(value.length() - 1) == '"') {
            value = value.substring(1, value.length() - 1);
        }
        return value.replace("\\\"", "\"").replace("\\\\", "\\").trim();
    }

    private int getDefaultStatusBarColor() {
        if (isSystemDarkMode()) {
            return DEFAULT_STATUS_BAR_COLOR_DARK;
        }
        return DEFAULT_STATUS_BAR_COLOR_LIGHT;
    }

    private boolean isSystemDarkMode() {
        int nightModeFlags = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return nightModeFlags == Configuration.UI_MODE_NIGHT_YES;
    }

    private boolean isGreenDominant(int color) {
        int red = Color.red(color);
        int green = Color.green(color);
        int blue = Color.blue(color);
        return green >= 80 && green >= red + 24 && green >= blue + 20;
    }

    private boolean isLightColor(int color) {
        int red = Color.red(color);
        int green = Color.green(color);
        int blue = Color.blue(color);
        double luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255.0;
        return luminance > 0.72;
    }

    private void showMainFrameError(String message) {
        stopRefreshingIndicator();
        textEmpty.setText(getString(R.string.error_load_posts, message));
        textEmpty.setVisibility(View.VISIBLE);
    }

    private void ensureNotificationPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return;
        }
        if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
            == PackageManager.PERMISSION_GRANTED) {
            return;
        }
        try {
            requestPermissions(
                new String[] {Manifest.permission.POST_NOTIFICATIONS},
                REQUEST_CODE_POST_NOTIFICATIONS
            );
        } catch (Exception ignored) {
        }
    }

    private void startRefreshingIndicator() {
        mainHandler.removeCallbacks(refreshTimeoutRunnable);
        if (!swipeRefreshLayout.isRefreshing()) {
            swipeRefreshLayout.setRefreshing(true);
        }
        mainHandler.postDelayed(refreshTimeoutRunnable, REFRESH_TIMEOUT_MS);
    }

    private void stopRefreshingIndicator() {
        mainHandler.removeCallbacks(refreshTimeoutRunnable);
        if (swipeRefreshLayout.isRefreshing()) {
            swipeRefreshLayout.setRefreshing(false);
        }
    }

    private void openFileChooser(
        ValueCallback<Uri[]> filePathCallback,
        WebChromeClient.FileChooserParams fileChooserParams
    ) {
        if (pendingFilePathCallback != null) {
            pendingFilePathCallback.onReceiveValue(null);
        }
        pendingFilePathCallback = filePathCallback;
        Intent chooserIntent;
        try {
            chooserIntent = fileChooserParams == null
                ? new Intent(Intent.ACTION_GET_CONTENT)
                : fileChooserParams.createIntent();
        } catch (Exception ignored) {
            chooserIntent = new Intent(Intent.ACTION_GET_CONTENT);
        }

        boolean allowMultiple = shouldAllowMultipleSelection(fileChooserParams);
        configureFileChooserIntent(chooserIntent, fileChooserParams, allowMultiple);
        try {
            String title = allowMultiple ? "选择文件（可多选）" : "选择文件";
            startActivityForResult(Intent.createChooser(chooserIntent, title), REQUEST_CODE_FILE_CHOOSER);
        } catch (Exception ignored) {
            if (pendingFilePathCallback != null) {
                pendingFilePathCallback.onReceiveValue(null);
                pendingFilePathCallback = null;
            }
        }
    }

    private boolean shouldAllowMultipleSelection(WebChromeClient.FileChooserParams fileChooserParams) {
        return fileChooserParams != null
            && fileChooserParams.getMode() == WebChromeClient.FileChooserParams.MODE_OPEN_MULTIPLE;
    }

    private void configureFileChooserIntent(
        Intent chooserIntent,
        WebChromeClient.FileChooserParams fileChooserParams,
        boolean allowMultiple
    ) {
        if (chooserIntent == null) {
            return;
        }
        String action = chooserIntent.getAction();
        if (Intent.ACTION_CHOOSER.equals(action)) {
            Intent targetIntent = chooserIntent.getParcelableExtra(Intent.EXTRA_INTENT);
            if (targetIntent != null) {
                configureFileIntentTarget(targetIntent, fileChooserParams, allowMultiple);
                chooserIntent.putExtra(Intent.EXTRA_INTENT, targetIntent);
            }
            chooserIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, allowMultiple);
            chooserIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            return;
        }
        configureFileIntentTarget(chooserIntent, fileChooserParams, allowMultiple);
    }

    private void configureFileIntentTarget(
        Intent intent,
        WebChromeClient.FileChooserParams fileChooserParams,
        boolean allowMultiple
    ) {
        if (intent == null) {
            return;
        }
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(resolveMimeType(fileChooserParams));
        String[] mimeTypes = resolveMimeTypes(fileChooserParams);
        if (mimeTypes.length > 0) {
            intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
        }
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, allowMultiple);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    }

    private String resolveMimeType(WebChromeClient.FileChooserParams fileChooserParams) {
        String[] mimeTypes = resolveMimeTypes(fileChooserParams);
        if (mimeTypes.length == 1) {
            return mimeTypes[0];
        }
        return "*/*";
    }

    private String[] resolveMimeTypes(WebChromeClient.FileChooserParams fileChooserParams) {
        if (fileChooserParams == null) {
            return new String[0];
        }
        String[] acceptTypes = fileChooserParams.getAcceptTypes();
        if (acceptTypes == null || acceptTypes.length == 0) {
            return new String[0];
        }
        LinkedHashSet<String> mimeTypes = new LinkedHashSet<>();
        for (String acceptType : acceptTypes) {
            if (acceptType == null) {
                continue;
            }
            String[] segments = acceptType.split(",");
            for (String segment : segments) {
                if (segment == null) {
                    continue;
                }
                String candidate = segment.trim();
                if (candidate.isEmpty() || "*/*".equals(candidate)) {
                    continue;
                }
                mimeTypes.add(candidate);
            }
        }
        return mimeTypes.toArray(new String[0]);
    }

    private Uri[] parseFileChooserResultCompat(int resultCode, Intent data) {
        if (resultCode != RESULT_OK || data == null) {
            return null;
        }
        LinkedHashSet<Uri> uris = new LinkedHashSet<>();
        Uri single = data.getData();
        if (single != null) {
            uris.add(single);
        }
        ClipData clipData = data.getClipData();
        if (clipData != null) {
            for (int i = 0; i < clipData.getItemCount(); i++) {
                ClipData.Item item = clipData.getItemAt(i);
                if (item == null) {
                    continue;
                }
                Uri uri = item.getUri();
                if (uri != null) {
                    uris.add(uri);
                }
            }
        }
        if (uris.isEmpty()) {
            return null;
        }
        return uris.toArray(new Uri[0]);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE_FILE_CHOOSER) {
            if (pendingFilePathCallback != null) {
                Uri[] result = parseFileChooserResultCompat(resultCode, data);
                if (result == null || result.length == 0) {
                    result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                }
                pendingFilePathCallback.onReceiveValue(result);
                pendingFilePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    @SuppressWarnings("deprecation")
    @SuppressLint("GestureBackNavigation")
    public void onBackPressed() {
        handleBackNavigation();
    }

    private void handleBackNavigation() {
        if (webContent != null && webContent.canGoBack()) {
            webContent.goBack();
            return;
        }
        finish();
    }

    private void registerBackNavigationCallback() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return;
        }
        if (backInvokedCallback != null) {
            return;
        }
        backInvokedCallback = this::handleBackNavigation;
        try {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                backInvokedCallback
            );
        } catch (Throwable ignored) {
            backInvokedCallback = null;
        }
    }

    private void unregisterBackNavigationCallback() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return;
        }
        if (backInvokedCallback == null) {
            return;
        }
        try {
            getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(backInvokedCallback);
        } catch (Throwable ignored) {
        } finally {
            backInvokedCallback = null;
        }
    }

    @Override
    protected void onDestroy() {
        unregisterBackNavigationCallback();
        mainHandler.removeCallbacks(webThemeSyncRunnable);
        mainHandler.removeCallbacks(statusBarSyncRunnable);
        mainHandler.removeCallbacks(refreshTimeoutRunnable);
        if (pendingFilePathCallback != null) {
            pendingFilePathCallback.onReceiveValue(null);
            pendingFilePathCallback = null;
        }
        if (webContent != null) {
            webContent.destroy();
        }
        super.onDestroy();
    }
}
