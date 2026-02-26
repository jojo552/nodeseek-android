package com.nodeseek.app;

public class PostSummary {
    private final String title;
    private final String url;
    private final String author;
    private final String category;
    private final String lastReplyTime;

    public PostSummary(String title, String url, String author, String category, String lastReplyTime) {
        this.title = title == null ? "" : title;
        this.url = url == null ? "" : url;
        this.author = author == null ? "" : author;
        this.category = category == null ? "" : category;
        this.lastReplyTime = lastReplyTime == null ? "" : lastReplyTime;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public String getAuthor() {
        return author;
    }

    public String getCategory() {
        return category;
    }

    public String getLastReplyTime() {
        return lastReplyTime;
    }
}
