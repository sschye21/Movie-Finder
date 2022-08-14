package com.example.demo.recommender;

public class RatingsDTO {
    Integer user_id;
    String movie_id;
    Double user_rating;

    public RatingsDTO(Integer user_id, String movie_id, Double user_rating) {
        this.user_id = user_id;
        this.movie_id = movie_id;
        this.user_rating = user_rating;
    }
}
