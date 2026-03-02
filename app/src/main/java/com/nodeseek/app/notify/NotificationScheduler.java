package com.nodeseek.app.notify;

import android.content.Context;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import java.util.concurrent.TimeUnit;

public final class NotificationScheduler {
    private static final String UNIQUE_WORK_NAME = "nsx_notification_sync";

    private NotificationScheduler() {
    }

    public static void ensureScheduled(Context context) {
        if (context == null) {
            return;
        }
        Context appContext = context.getApplicationContext();
        Constraints constraints =
            new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        PeriodicWorkRequest request =
            new PeriodicWorkRequest.Builder(NotificationSyncWorker.class, 15, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .build();
        WorkManager
            .getInstance(appContext)
            .enqueueUniquePeriodicWork(
                UNIQUE_WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                request
            );
    }

    public static void syncSessionFromPage(Context context, String pageUrl, String userAgent) {
        NotificationSessionStore.syncFromPage(context, pageUrl, userAgent);
    }
}
