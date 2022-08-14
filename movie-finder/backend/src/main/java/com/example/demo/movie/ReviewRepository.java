package com.example.demo.movie;

import com.example.demo.recommender.RatingsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query(value = "SELECT * FROM review r WHERE r.user_id = ?1 AND r.movie_id = ?2", nativeQuery = true)
    Optional<List<Review>> getReview(Integer id, String movie_id);

    @Query(value = "SELECT * from review r WHERE r.user_id = ?1", nativeQuery = true)
    Optional<List<Review>> findReviewBasedOnUserId(Integer id);

    @Query(value = "SELECT * from review r WHERE r.movie_id = ?1", nativeQuery = true)
    List<Review> findReviewBasedOnMovieId(String movie_id);
}
