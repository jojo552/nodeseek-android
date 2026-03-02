package com.nodeseek.app.notify;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.webkit.CookieManager;
import java.util.Locale;

final class NotificationSessionStore {
    private static final String PREFS_NAME = "nsx_notify_session";
    private static final String KEY_BASE_URL = "base_url";
    private static final String KEY_COOKIE = "cookie";
    private static final String KEY_USER_AGENT = "user_agent";
    private static final String DEFAULT_BASE_URL = "https://www.nodeseek.com";

    private NotificationSessionStore() {
    }

    static void syncFromPage(Context context, String pageUrl, String userAgent) {
        if (context == null) {
            return;
        }
        String baseUrl = normalizeBaseUrl(pageUrl);
        if (baseUrl == null) {
            return;
        }

        String cookie = null;
        try {
            cookie = CookieManager.getInstance().getCookie(baseUrl);
        } catch (Exception ignored) {
        }
        if (cookie == null || cookie.trim().isEmpty()) {
            return;
        }

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs
            .edit()
            .putString(KEY_BASE_URL, baseUrl)
            .putString(KEY_COOKIE, cookie)
            .putString(KEY_USER_AGENT, userAgent == null ? "" : userAgent)
            .apply();
    }

    static Session read(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String baseUrl = prefs.getString(KEY_BASE_URL, DEFAULT_BASE_URL);
        String cookie = prefs.getString(KEY_COOKIE, "");
        String userAgent = prefs.getString(KEY_USER_AGENT, "");
        if (baseUrl == null || baseUrl.trim().isEmpty()) {
            baseUrl = DEFAULT_BASE_URL;
        }
        return new Session(baseUrl, cookie == null ? "" : cookie, userAgent == null ? "" : userAgent);
    }

    private static String normalizeBaseUrl(String urlText) {
        if (urlText == null || urlText.trim().isEmpty()) {
            return null;
        }
        Uri uri = Uri.parse(urlText);
        String host = uri.getHost();
        if (host == null) {
            return null;
        }
        String lowerHost = host.toLowerCase(Locale.ROOT);
        if (!isSupportedHost(lowerHost)) {
            return null;
        }
        return "https://" + lowerHost;
    }

    private static boolean isSupportedHost(String host) {
        return "www.nodeseek.com".equals(host)
            || "nodeseek.com".equals(host);
    }

    static final class Session {
        final String baseUrl;
        final String cookie;
        final String userAgent;

        Session(String baseUrl, String cookie, String userAgent) {
            this.baseUrl = baseUrl;
            this.cookie = cookie;
            this.userAgent = userAgent;
        }
    }
}
