package com.nodeseek.app;

import android.app.Activity;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.nodeseek.app.notify.NotificationScheduler;

public class DetailActivity extends Activity {
    public static final String EXTRA_POST_URL = "extra_post_url";
    public static final String EXTRA_POST_TITLE = "extra_post_title";
    private static final String TAG = "NS_DETAIL";

    private static final int APP_BAR_COLOR = 0xFF13A6E3;
    private static final String HOST_PRIMARY = "www.nodeseek.com";
    private static final String HOST_FALLBACK = "nodeseek.com";

    private View detailRoot;
    private View statusBarScrim;
    private TextView titleView;
    private TextView loadingView;
    private WebView webView;
    private String initialUrl;
    private OnBackInvokedCallback backInvokedCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail);

        detailRoot = findViewById(R.id.detail_root);
        statusBarScrim = findViewById(R.id.detail_status_bar_scrim);
        titleView = findViewById(R.id.text_detail_title);
        loadingView = findViewById(R.id.text_detail_loading);
        webView = findViewById(R.id.detail_web_view);
        ImageButton backButton = findViewById(R.id.btn_detail_back);
        ImageButton externalButton = findViewById(R.id.btn_detail_external);

        initialUrl = getIntent().getStringExtra(EXTRA_POST_URL);
        String title = getIntent().getStringExtra(EXTRA_POST_TITLE);
        if (title == null || title.trim().isEmpty()) {
            titleView.setText(R.string.detail_unknown_title);
        } else {
            titleView.setText(title.trim());
        }

        statusBarScrim.setBackgroundColor(APP_BAR_COLOR);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        applyInsets();
        setupWebView();
        registerBackNavigationCallback();
        NotificationScheduler.ensureScheduled(getApplicationContext());

        backButton.setOnClickListener(v -> onBackPressedCompat());
        externalButton.setOnClickListener(v -> openExternalCurrentUrl());

        if (initialUrl != null && !initialUrl.trim().isEmpty()) {
            webView.loadUrl(initialUrl);
        } else {
            loadingView.setText(getString(R.string.detail_error, "URL为空"));
            loadingView.setVisibility(View.VISIBLE);
        }
    }

    private void applyInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(detailRoot, (view, insets) -> {
            Insets statusInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars());
            Insets navInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
            Insets imeInsets = insets.getInsets(WindowInsetsCompat.Type.ime());
            int bottomInset = Math.max(navInsets.bottom, imeInsets.bottom);
            ViewGroup.LayoutParams params = statusBarScrim.getLayoutParams();
            if (params != null && params.height != statusInsets.top) {
                params.height = statusInsets.top;
                statusBarScrim.setLayoutParams(params);
            }
            view.setPadding(
                view.getPaddingLeft(),
                view.getPaddingTop(),
                view.getPaddingRight(),
                bottomInset
            );
            return insets;
        });
        ViewCompat.requestApplyInsets(detailRoot);
    }

    private void setupWebView() {
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        NodeseekUserscriptRuntime.attach(this, webView);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                loadingView.setText(R.string.detail_loading);
                loadingView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                NodeseekUserscriptRuntime.inject(DetailActivity.this, view, url);
                NotificationScheduler.syncSessionFromPage(
                    DetailActivity.this,
                    url,
                    view.getSettings().getUserAgentString()
                );
                loadingView.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedHttpError(
                WebView view,
                WebResourceRequest request,
                WebResourceResponse errorResponse
            ) {
                if (request != null && request.isForMainFrame() && errorResponse != null
                    && errorResponse.getStatusCode() == 403) {
                    loadingView.setText(getString(R.string.detail_error, "403，可能需要先登录"));
                    loadingView.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri == null) {
                    return true;
                }
                String host = uri.getHost();
                if (HOST_PRIMARY.equals(host) || HOST_FALLBACK.equals(host)) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    startActivity(intent);
                } catch (Exception ignored) {
                }
                return true;
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                String reason = (detail != null && detail.didCrash()) ? "crashed" : "killed";
                Log.e(TAG, "webview_render_process_gone=" + reason);

                loadingView.setText(getString(R.string.detail_error, "渲染进程异常，正在恢复"));
                loadingView.setVisibility(View.VISIBLE);
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
                recreate();
                return true;
            }
        });
    }

    private void onBackPressedCompat() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        finish();
    }

    private void openExternalCurrentUrl() {
        String currentUrl = webView == null ? null : webView.getUrl();
        if (currentUrl == null || currentUrl.trim().isEmpty()) {
            currentUrl = initialUrl;
        }
        if (currentUrl == null || currentUrl.trim().isEmpty()) {
            return;
        }
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(currentUrl));
        startActivity(intent);
    }

    @Override
    @SuppressWarnings("deprecation")
    @SuppressLint("GestureBackNavigation")
    public void onBackPressed() {
        onBackPressedCompat();
    }

    private void registerBackNavigationCallback() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return;
        }
        if (backInvokedCallback != null) {
            return;
        }
        backInvokedCallback = this::onBackPressedCompat;
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
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
