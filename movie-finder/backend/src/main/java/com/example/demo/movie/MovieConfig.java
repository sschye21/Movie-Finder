package com.example.demo.movie;

import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.HashSet;

@Configuration
public class MovieConfig {

    private final MovieService movieService;

    @Autowired
    public MovieConfig(MovieService movieService) {
        this.movieService = movieService;
    }

    @Bean
    CommandLineRunner commandLineRunnerMovie(MovieRepository movieRepository) {
        return args -> {
//            Movie movie = new Movie(
//                "1",
//                "hello",
//                "hello",
//                "hello",
//                1888,
//                new HashSet<>(Arrays.asList("Hello")),
//                "good",
//                1888
//            );
//
//            movieService.addNewMovie(movie);
        };
    }
}