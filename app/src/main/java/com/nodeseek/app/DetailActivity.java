package com.nodeseek.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

public class DetailActivity extends Activity {
    public static final String EXTRA_POST_URL = "extra_post_url";
    public static final String EXTRA_POST_TITLE = "extra_post_title";

    private static final int APP_BAR_COLOR = 0xFF13A6E3;
    private static final String HOST_PRIMARY = "www.nodeseek.com";
    private static final String HOST_FALLBACK = "nodeseek.com";

    private View detailRoot;
    private View statusBarScrim;
    private TextView titleView;
    private TextView loadingView;
    private WebView webView;
    private String initialUrl;

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
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.setAcceptThirdPartyCookies(webView, true);
        }

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }
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
                String host = uri.getHost();
                if (HOST_PRIMARY.equals(host) || HOST_FALLBACK.equals(host)) {
                    return false;
                }
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(intent);
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
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            onBackPressedCompat();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
