package com.nodeseek.app;

import android.net.Uri;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;

public class NodeSeekRepository {
    private static final String RSS_URL = "https://rss.nodeseek.com/";
    private static final int TIMEOUT_MS = 12000;
    private static final Pattern POST_ID_PATTERN = Pattern.compile("post-(\\d+)-");

    public List<PostSummary> fetchPostList(String url) throws IOException {
        Document document = loadRss();
        Elements items = document.select("rss > channel > item");
        String categoryFilter = resolveCategoryFilter(url);
        String keywordFilter = resolveKeywordFilter(url);

        List<PostSummary> results = new ArrayList<>();
        for (Element item : items) {
            String title = clean(textOf(item, "title"));
            String link = clean(textOf(item, "link"));
            String category = clean(textOf(item, "category"));
            String author = clean(textOf(item, "dc|creator"));
            if (author.isEmpty()) {
                author = clean(textOf(item, "dc\\:creator"));
            }
            String pubDate = clean(textOf(item, "pubDate"));
            String description = cleanHtml(textOf(item, "description"));

            if (!categoryFilter.isEmpty() && !categoryFilter.equalsIgnoreCase(category)) {
                continue;
            }
            if (!keywordFilter.isEmpty()) {
                String merged = (title + " " + description).toLowerCase(Locale.ROOT);
                if (!merged.contains(keywordFilter.toLowerCase(Locale.ROOT))) {
                    continue;
                }
            }
            if (title.isEmpty() || link.isEmpty()) {
                continue;
            }
            results.add(new PostSummary(title, link, author, category, pubDate));
        }
        return results;
    }

    public PostDetail fetchPostDetail(String postUrl) throws IOException {
        String postId = extractPostId(postUrl);
        Document document = loadRss();
        Elements items = document.select("rss > channel > item");
        for (Element item : items) {
            String link = clean(textOf(item, "link"));
            String currentId = extractPostId(link);
            if (postId.isEmpty() || !postId.equals(currentId)) {
                continue;
            }
            String title = clean(textOf(item, "title"));
            String author = clean(textOf(item, "dc|creator"));
            if (author.isEmpty()) {
                author = clean(textOf(item, "dc\\:creator"));
            }
            String time = clean(textOf(item, "pubDate"));
            String description = cleanHtml(textOf(item, "description"));
            return new PostDetail(title, author, time, description);
        }
        return new PostDetail("", "", "", "");
    }

    private Document loadRss() throws IOException {
        return Jsoup.connect(RSS_URL)
            .timeout(TIMEOUT_MS)
            .ignoreContentType(true)
            .parser(Parser.xmlParser())
            .get();
    }

    private String textOf(Element item, String selector) {
        Element element = item.selectFirst(selector);
        return element == null ? "" : element.text();
    }

    private String resolveCategoryFilter(String url) {
        if (url == null) {
            return "";
        }
        String lower = url.toLowerCase(Locale.ROOT);
        if (lower.contains("/categories/daily")) {
            return "daily";
        }
        if (lower.contains("/categories/tech")) {
            return "tech";
        }
        if (lower.contains("/categories/info")) {
            return "info";
        }
        if (lower.contains("/categories/review")) {
            return "review";
        }
        if (lower.contains("/categories/trade")) {
            return "trade";
        }
        return "";
    }

    private String resolveKeywordFilter(String url) {
        if (url == null) {
            return "";
        }
        Uri uri = Uri.parse(url);
        String query = uri.getQueryParameter("q");
        return query == null ? "" : query.trim();
    }

    private String extractPostId(String url) {
        if (url == null) {
            return "";
        }
        Matcher matcher = POST_ID_PATTERN.matcher(url);
        return matcher.find() ? matcher.group(1) : "";
    }

    private String clean(String text) {
        if (text == null) {
            return "";
        }
        return text.replace('\u00a0', ' ').replaceAll("\\s+", " ").trim();
    }

    private String cleanHtml(String html) {
        if (html == null) {
            return "";
        }
        return clean(Jsoup.parse(html).text());
    }
}
