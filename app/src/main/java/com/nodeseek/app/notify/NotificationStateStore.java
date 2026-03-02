package com.nodeseek.app.notify;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.ArrayList;
import java.util.List;

final class NotificationStateStore {
    private static final String PREFS_NAME = "nsx_notify_state";
    private static final String KEY_INITIALIZED = "initialized";
    private static final String KEY_LAST_SYNC_AT = "last_sync_at";
    private static final long MIN_NOTIFY_INTERVAL_MS = 60_000L;

    private NotificationStateStore() {
    }

    static List<NotificationEvent> collectIncrementEvents(
        Context context,
        UnreadCounts current,
        long nowMs
    ) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        boolean initialized = prefs.getBoolean(KEY_INITIALIZED, false);
        SharedPreferences.Editor editor = prefs.edit();
        List<NotificationEvent> events = new ArrayList<>();

        if (!initialized) {
            saveCounts(editor, current);
            editor.putBoolean(KEY_INITIALIZED, true);
            editor.putLong(KEY_LAST_SYNC_AT, nowMs);
            editor.apply();
            return events;
        }

        collectByKind(events, editor, prefs, NotificationKind.AT_ME, current.atMe, nowMs);
        collectByKind(events, editor, prefs, NotificationKind.REPLY, current.reply, nowMs);
        collectByKind(events, editor, prefs, NotificationKind.MESSAGE, current.message, nowMs);
        editor.putLong(KEY_LAST_SYNC_AT, nowMs);
        editor.apply();
        return events;
    }

    private static void collectByKind(
        List<NotificationEvent> events,
        SharedPreferences.Editor editor,
        SharedPreferences prefs,
        NotificationKind kind,
        int currentCount,
        long nowMs
    ) {
        int previousCount = prefs.getInt(countKey(kind), 0);
        int delta = Math.max(currentCount - previousCount, 0);
        long lastNotifyAt = prefs.getLong(lastNotifyKey(kind), 0L);
        if (delta > 0 && nowMs - lastNotifyAt >= MIN_NOTIFY_INTERVAL_MS) {
            events.add(new NotificationEvent(kind, delta));
            editor.putLong(lastNotifyKey(kind), nowMs);
        }
        editor.putInt(countKey(kind), currentCount);
    }

    private static void saveCounts(SharedPreferences.Editor editor, UnreadCounts counts) {
        editor.putInt(countKey(NotificationKind.AT_ME), counts.atMe);
        editor.putInt(countKey(NotificationKind.REPLY), counts.reply);
        editor.putInt(countKey(NotificationKind.MESSAGE), counts.message);
    }

    private static String countKey(NotificationKind kind) {
        return "count_" + kind.key;
    }

    private static String lastNotifyKey(NotificationKind kind) {
        return "last_notify_" + kind.key;
    }

    static final class NotificationEvent {
        final NotificationKind kind;
        final int delta;

        NotificationEvent(NotificationKind kind, int delta) {
            this.kind = kind;
            this.delta = delta;
        }
    }
}
