package com.nodeseek.app.notify;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import java.io.IOException;
import java.util.List;

public class NotificationSyncWorker extends Worker {
    public NotificationSyncWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context appContext = getApplicationContext();
        try {
            NotificationSessionStore.Session session = NotificationSessionStore.read(appContext);
            if (session.cookie == null || session.cookie.trim().isEmpty()) {
                return Result.success();
            }

            UnreadCounts counts =
                NotificationApiClient.fetchUnreadCounts(session.baseUrl, session.cookie, session.userAgent);
            if (counts == null) {
                return Result.success();
            }

            List<NotificationStateStore.NotificationEvent> events =
                NotificationStateStore.collectIncrementEvents(
                    appContext,
                    counts,
                    System.currentTimeMillis()
                );
            for (NotificationStateStore.NotificationEvent event : events) {
                NotificationDispatcher.dispatchIncrement(
                    appContext,
                    event.kind,
                    event.delta,
                    session.baseUrl
                );
            }
            return Result.success();
        } catch (IOException ioException) {
            return Result.retry();
        } catch (Exception ignored) {
            return Result.success();
        }
    }
}
