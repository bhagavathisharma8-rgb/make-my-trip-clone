package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String targetId;      // Flight ID or Hotel ID document reference string
    private String reviewType;    // "FLIGHT" or "HOTEL"
    private String userEmail;
    private String userName;
    private int rating;           // 1 to 5 Star Scale Limit Check
    private String comment;
    private List<String> photos = new ArrayList<>();
    private int helpfulCount = 0;
    private boolean flagged = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private List<Reply> replies = new ArrayList<>();

    // Core Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public String getReviewType() { return reviewType; }
    public void setReviewType(String reviewType) { this.reviewType = reviewType; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public List<String> getPhotos() { return photos; }
    public void setPhotos(List<String> photos) { this.photos = photos; }

    public int getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }

    public boolean isFlagged() { return flagged; }
    public void setFlagged(boolean flagged) { this.flagged = flagged; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Reply> getReplies() { return replies; }
    public void setReplies(List<Reply> replies) { this.replies = replies; }

    // Nested Static Inner Class for Conversational Threads
    public static class Reply {
        private String user;
        private String text;
        private LocalDateTime timestamp = LocalDateTime.now();

        public String getUser() { return user; }
        public void setUser(String user) { this.user = user; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}