package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    // Custom query to find reviews matching either a specific Hotel or Flight ID reference
    List<Review> findByReviewTypeAndTargetId(String reviewType, String targetId);

    // Custom query for moderator panels to screen flagged feedback comments
    List<Review> findByFlaggedTrue();
}