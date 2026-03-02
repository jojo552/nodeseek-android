package com.nodeseek.app.notify;

enum NotificationKind {
    AT_ME(
        "at_me",
        "nsx_at_me",
        "NodeSeek 新@提醒",
        "/notification#/atMe",
        8101,
        9101
    ),
    REPLY(
        "reply",
        "nsx_reply",
        "NodeSeek 新回复",
        "/notification#/reply",
        8102,
        9102
    ),
    MESSAGE(
        "message",
        "nsx_message",
        "NodeSeek 新私信",
        "/notification#/message?mode=list",
        8103,
        9103
    );

    final String key;
    final String channelId;
    final String title;
    final String path;
    final int requestCode;
    final int notificationId;

    NotificationKind(
        String key,
        String channelId,
        String title,
        String path,
        int requestCode,
        int notificationId
    ) {
        this.key = key;
        this.channelId = channelId;
        this.title = title;
        this.path = path;
        this.requestCode = requestCode;
        this.notificationId = notificationId;
    }
}
