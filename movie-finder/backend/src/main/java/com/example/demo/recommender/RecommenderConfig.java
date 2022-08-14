package com.example.demo.recommender;

import com.example.demo.movie.Movie;
import com.example.demo.movie.MovieRepository;
import com.example.demo.movie.MovieService;
import com.example.demo.movie.ReviewService;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import com.example.demo.wishlist.WishlistService;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@Configuration
public class RecommenderConfig {

    private final MovieService movieService;
    private final MovieRepository movieRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ReviewService reviewService;
    private final WishlistService wishlistService;

    @Autowired
    public RecommenderConfig(MovieService movieService, MovieRepository movieRepository, UserService userService, UserRepository userRepository, ReviewService reviewService, WishlistService wishlistService) {
        this.movieService = movieService;
        this.movieRepository = movieRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.reviewService = reviewService;
        this.wishlistService = wishlistService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() throws IOException {
        HashMap<String, String> requestParams = new HashMap<>();
        requestParams.put("c", "Genre");
        requestParams.put("q", "Comedy");
        requestParams.put("p", "1");
        List<HashMap<String, Object>> res = movieService.searchMovie(requestParams);

        for (HashMap<String, Object> movie : res) {
            movieService.getDetails(movie.get("imdb_id").toString());
        }

        requestParams.put("c", "Genre");
        requestParams.put("q", "Action");
        requestParams.put("p", "1");
        res = movieService.searchMovie(requestParams);

        for (HashMap<String, Object> movie : res) {
            movieService.getDetails(movie.get("imdb_id").toString());
        }

        requestParams.put("c", "Genre");
        requestParams.put("q", "Drama");
        requestParams.put("p", "1");
        res = movieService.searchMovie(requestParams);

        for (HashMap<String, Object> movie : res) {
            movieService.getDetails(movie.get("imdb_id").toString());
        }

        Random rand = new Random(1);
        for (int i = 2; i <= 11; ++i) {
            String email = "email" + i + "@abc.com";
            User user = new User(
                    i,
                    "Bob",
                    "Smith",
                    email,
                    "user",
                    "123"
            );
            Optional<User> userByEmail = userRepository.findUserByEmail(user.getEmail());
            if (!userByEmail.isPresent()) {
                userRepository.save(user);
            }

            Optional<List<String>> movies = movieRepository.getMovieIds();
            if (movies.isPresent()) {
                for (String movie_id : movies.get()) {
                    if (rand.nextFloat() > 0.5) {
                        int rating = (int) Math.floor(1 + rand.nextInt(5));
                        reviewService.addReview(i, movie_id, "", (double) rating);
                    }
                }
            }
        }
    };
}
