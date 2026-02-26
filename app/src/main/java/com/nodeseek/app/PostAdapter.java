package com.nodeseek.app;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class PostAdapter extends RecyclerView.Adapter<PostAdapter.PostViewHolder> {
    public interface OnPostClickListener {
        void onPostClick(PostSummary post);
    }

    private final List<PostSummary> items = new ArrayList<>();
    private final OnPostClickListener onPostClickListener;

    public PostAdapter(OnPostClickListener onPostClickListener) {
        this.onPostClickListener = onPostClickListener;
    }

    public void submit(List<PostSummary> newItems) {
        items.clear();
        if (newItems != null) {
            items.addAll(newItems);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public PostViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_post, parent, false);
        return new PostViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull PostViewHolder holder, int position) {
        PostSummary item = items.get(position);
        holder.titleView.setText(item.getTitle());
        holder.metaView.setText(buildMeta(item));
        holder.itemView.setOnClickListener(v -> onPostClickListener.onPostClick(item));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    private String buildMeta(PostSummary item) {
        StringBuilder text = new StringBuilder();
        if (!item.getAuthor().isEmpty()) {
            text.append(item.getAuthor());
        }
        if (!item.getCategory().isEmpty()) {
            if (text.length() > 0) {
                text.append(" · ");
            }
            text.append(item.getCategory());
        }
        if (!item.getLastReplyTime().isEmpty()) {
            if (text.length() > 0) {
                text.append(" · ");
            }
            text.append(item.getLastReplyTime());
        }
        return text.toString();
    }

    static class PostViewHolder extends RecyclerView.ViewHolder {
        private final TextView titleView;
        private final TextView metaView;

        PostViewHolder(@NonNull View itemView) {
            super(itemView);
            titleView = itemView.findViewById(R.id.text_post_title);
            metaView = itemView.findViewById(R.id.text_post_meta);
        }
    }
}
