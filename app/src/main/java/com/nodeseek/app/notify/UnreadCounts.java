package com.nodeseek.app.notify;

import org.json.JSONObject;

final class UnreadCounts {
    final int atMe;
    final int reply;
    final int message;

    UnreadCounts(int atMe, int reply, int message) {
        this.atMe = Math.max(atMe, 0);
        this.reply = Math.max(reply, 0);
        this.message = Math.max(message, 0);
    }

    static UnreadCounts fromApiResponse(JSONObject root) {
        if (root == null || !root.optBoolean("success", false)) {
            return null;
        }
        JSONObject unread = root.optJSONObject("unreadCount");
        if (unread == null) {
            return null;
        }
        return new UnreadCounts(
            unread.optInt("atMe", 0),
            unread.optInt("reply", 0),
            unread.optInt("message", 0)
        );
    }
}
