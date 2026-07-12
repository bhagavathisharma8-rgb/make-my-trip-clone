package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    // 📥 GET ACTIVE REVIEWS WITH SORTING GATEWAYS
    @GetMapping("/{type}/{targetId}")
    public ResponseEntity<List<Review>> getTargetReviews(@PathVariable String type, @PathVariable String targetId) {
        return ResponseEntity.ok(reviewRepository.findByReviewTypeAndTargetId(type.toUpperCase(), targetId));
    }

    // ✍️ POST NEW USER GENERATED FEEDBACK RECORD
    @PostMapping("/add")
    public ResponseEntity<?> addNewReview(@RequestBody Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.badRequest().body("Validation Failure: Ratings must stay between a 1-5 scale.");
        }
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    // 💬 REPLIES ENGINE ROUTE
    @PostMapping("/{id}/reply")
    public ResponseEntity<?> appendReviewReply(@PathVariable String id, @RequestBody Map<String, String> body) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review target missing."));
        Review.Reply reply = new Review.Reply();
        reply.setUser(body.getOrDefault("user", "Anonymous User"));
        reply.setText(body.getOrDefault("text", ""));

        review.getReplies().add(reply);
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    // 👍 HELPFUL UPVOTE TRACKER
    @PostMapping("/{id}/helpful")
    public ResponseEntity<?> upvoteHelpfulCounter(@PathVariable String id) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Target element missing."));
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    // 🚩 SAFETY GATEWAY: FLAG APPROPRIATENESS STATUS
    @PostMapping("/{id}/flag")
    public ResponseEntity<?> flagInappropriateContent(@PathVariable String id) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Target content not found."));
        review.setFlagged(true);
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}