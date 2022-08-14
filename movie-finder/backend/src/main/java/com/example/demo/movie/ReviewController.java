package com.example.demo.movie;

import com.example.demo.user.ApiResponse;
import com.example.demo.user.BlockUserDTO;
import com.example.demo.user.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@ResponseBody
@RequestMapping(path = "api/v1/movie/{id}/review")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/get")
    public ApiResponse getReviews(@PathVariable("id") String userId, @RequestBody MovieIDDTO movieIDDTO) {
        return new ApiResponse(HttpStatus.OK, userId, reviewService.getMovieReviews(movieIDDTO.getMovieId(), Integer.valueOf(userId)));
    }

    @PostMapping("/add")
    public ResponseEntity<String> addReview (@PathVariable("id") String userId, @RequestBody ReviewDTO reviewDTO) {
        reviewService.addReview(Integer.valueOf(userId), reviewDTO.getMovieId(), reviewDTO.getContent(), Double.valueOf(reviewDTO.getRating()));
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @DeleteMapping("/remove/{review_id}")
    public ResponseEntity<String> removeReview (@PathVariable("review_id") String review_id) {
        reviewService.removeReview(Integer.valueOf(review_id));
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }
}