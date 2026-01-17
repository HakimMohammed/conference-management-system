package com.conference.conference.query.repository;

import com.conference.conference.query.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, String> {
}
