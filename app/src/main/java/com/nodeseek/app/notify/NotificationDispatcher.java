package com.nodeseek.app.notify;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import com.nodeseek.app.MainActivity;

final class NotificationDispatcher {
    private static final String CHANNEL_NAME_AT = "@提醒";
    private static final String CHANNEL_NAME_REPLY = "回复提醒";
    private static final String CHANNEL_NAME_MESSAGE = "私信提醒";

    private NotificationDispatcher() {
    }

    static void ensureChannels(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }
        NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
        if (notificationManager == null) {
            return;
        }
        createChannel(
            notificationManager,
            NotificationKind.AT_ME.channelId,
            CHANNEL_NAME_AT,
            "NodeSeek 新@提醒"
        );
        createChannel(
            notificationManager,
            NotificationKind.REPLY.channelId,
            CHANNEL_NAME_REPLY,
            "NodeSeek 新回复提醒"
        );
        createChannel(
            notificationManager,
            NotificationKind.MESSAGE.channelId,
            CHANNEL_NAME_MESSAGE,
            "NodeSeek 新私信提醒"
        );
    }

    static void dispatchIncrement(
        Context context,
        NotificationKind kind,
        int delta,
        String baseUrl
    ) {
        if (context == null || kind == null || delta <= 0) {
            return;
        }
        if (!canPostNotification(context)) {
            return;
        }

        ensureChannels(context);
        String targetUrl = buildTargetUrl(baseUrl, kind.path);
        PendingIntent intent = buildTargetIntent(context, kind.requestCode, targetUrl);
        NotificationCompat.Builder builder =
            new NotificationCompat.Builder(context, kind.channelId)
                .setSmallIcon(android.R.drawable.stat_notify_chat)
                .setContentTitle(kind.title)
                .setContentText("新增 " + delta + " 条")
                .setNumber(delta)
                .setAutoCancel(true)
                .setContentIntent(intent)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        NotificationManagerCompat.from(context).notify(kind.notificationId, builder.build());
    }

    private static void createChannel(
        NotificationManager notificationManager,
        String channelId,
        String channelName,
        String description
    ) {
        NotificationChannel channel =
            new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_DEFAULT);
        channel.setDescription(description);
        notificationManager.createNotificationChannel(channel);
    }

    private static boolean canPostNotification(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
            && ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS)
            != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        return NotificationManagerCompat.from(context).areNotificationsEnabled();
    }

    private static PendingIntent buildTargetIntent(Context context, int requestCode, String targetUrl) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.putExtra(MainActivity.EXTRA_TARGET_URL, targetUrl);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getActivity(context, requestCode, intent, flags);
    }

    private static String buildTargetUrl(String baseUrl, String path) {
        String resolvedBase =
            (baseUrl == null || baseUrl.trim().isEmpty()) ? "https://www.nodeseek.com" : baseUrl.trim();
        if (resolvedBase.endsWith("/")) {
            resolvedBase = resolvedBase.substring(0, resolvedBase.length() - 1);
        }
        if (path == null || path.trim().isEmpty()) {
            return resolvedBase;
        }
        if (path.startsWith("/")) {
            return resolvedBase + path;
        }
        return resolvedBase + "/" + path;
    }
}
