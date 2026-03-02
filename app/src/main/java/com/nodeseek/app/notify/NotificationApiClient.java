package com.nodeseek.app.notify;

import android.text.TextUtils;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

final class NotificationApiClient {
    private static final int TIMEOUT_MS = 15_000;
    private static final String DEFAULT_USER_AGENT =
        "Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 "
            + "(KHTML, like Gecko) Version/4.0 Chrome/120.0 Mobile Safari/537.36";

    private NotificationApiClient() {
    }

    static UnreadCounts fetchUnreadCounts(String baseUrl, String cookie, String userAgent) throws IOException {
        if (TextUtils.isEmpty(baseUrl) || TextUtils.isEmpty(cookie)) {
            return null;
        }

        HttpURLConnection connection = null;
        try {
            String endpoint = joinUrl(baseUrl, "/api/notification/unread-count");
            connection = (HttpURLConnection) new URL(endpoint).openConnection();
            connection.setConnectTimeout(TIMEOUT_MS);
            connection.setReadTimeout(TIMEOUT_MS);
            connection.setRequestMethod("GET");
            connection.setUseCaches(false);
            connection.setInstanceFollowRedirects(true);
            connection.setRequestProperty("Accept", "application/json, text/plain, */*");
            connection.setRequestProperty("Cookie", cookie);
            connection.setRequestProperty(
                "User-Agent",
                TextUtils.isEmpty(userAgent) ? DEFAULT_USER_AGENT : userAgent
            );

            int code = connection.getResponseCode();
            if (code == HttpURLConnection.HTTP_UNAUTHORIZED || code == HttpURLConnection.HTTP_FORBIDDEN) {
                return null;
            }

            InputStream bodyStream =
                code >= 400 ? connection.getErrorStream() : connection.getInputStream();
            String body = readAsText(bodyStream);
            if (code < 200 || code >= 300 || TextUtils.isEmpty(body)) {
                return null;
            }

            JSONObject json = new JSONObject(body);
            return UnreadCounts.fromApiResponse(json);
        } catch (IOException ioException) {
            throw ioException;
        } catch (Exception ignored) {
            return null;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private static String joinUrl(String baseUrl, String path) {
        String normalizedBase = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        if (path.startsWith("/")) {
            return normalizedBase + path;
        }
        return normalizedBase + "/" + path;
    }

    private static String readAsText(InputStream inputStream) throws IOException {
        if (inputStream == null) {
            return "";
        }
        try (InputStream in = inputStream;
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int len;
            while ((len = in.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
            return out.toString(StandardCharsets.UTF_8.name());
        }
    }
}
