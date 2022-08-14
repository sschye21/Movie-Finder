package com.example.demo.movie;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.apache.hadoop.yarn.webapp.hamlet.Hamlet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ReviewService {

    private final MovieRepository movieRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(MovieRepository movieRepository, UserRepository userRepository, ReviewRepository reviewRepository, UserService userService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
    }

    public void addReview(Integer userId, String movieId, String content, Double rating) {
        Optional<List<Review>> optionalReviews = reviewRepository.getReview(userId, movieId);
        if (optionalReviews.isPresent()) {
            List<Review> reviews = optionalReviews.get();
            if (reviews.size() != 0) {
                return;
            }
        }
        Optional<Movie> movieOptional = movieRepository.findMovieById(movieId);
        if (movieOptional.isPresent()) {
            Movie movie = movieOptional.get();
            Set<Review> reviews = movie.getReviews();
            User user = userService.getUser(userId);
            Review review = new Review(content, user.getUserName(), rating, movie.getMovie_id(), movie.getTitle(), user.getId(), movie.getBanner());
            reviews.add(review);
            movieRepository.save(movie);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie could not be found.");
        }
    }

    public void removeReview(Integer review_id) {
        Optional<Review> optionalReview = reviewRepository.findById(review_id);
        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            Movie movie = review.getMovie();
            movie.removeFromReviews(review);
            movieRepository.save(movie);
            reviewRepository.delete(review);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review with id: " + review_id + " could not be found.");
        }
    }

    public List<Review> getReviewsForUser(Integer user_id) {
        Optional<List<Review>> optionalListReview = reviewRepository.findReviewBasedOnUserId(user_id);
        if (optionalListReview.isPresent()) {
            List<Review> listReview = optionalListReview.get();
            return listReview;
        } else {
            return new ArrayList<>();
        }
    }

    public List<Review> getMovieReviews(String movie_id, Integer user_id) {
        List<Review> reviewList = reviewRepository.findReviewBasedOnMovieId(movie_id);
        List<Integer> blockedUsers = userRepository.findBlockedUsers(user_id);
        List<Review> blockedReviews = new ArrayList<>();

        for (Integer blockedUser : blockedUsers) {
            blockedReviews.addAll(getReviewsForUser(blockedUser));
        }

        reviewList.removeAll(blockedReviews);

        return reviewList;
    }
}
