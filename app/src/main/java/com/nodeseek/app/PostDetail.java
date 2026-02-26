package com.nodeseek.app;

public class PostDetail {
    private final String title;
    private final String author;
    private final String updateTime;
    private final String content;

    public PostDetail(String title, String author, String updateTime, String content) {
        this.title = title == null ? "" : title;
        this.author = author == null ? "" : author;
        this.updateTime = updateTime == null ? "" : updateTime;
        this.content = content == null ? "" : content;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public String getContent() {
        return content;
    }
}
