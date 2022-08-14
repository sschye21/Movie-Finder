package com.example.demo.wishlist;

import com.example.demo.movie.Movie;
import com.example.demo.movie.MovieController;
import com.example.demo.movie.MovieRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final MovieRepository movieRepository;

    @Autowired
    public WishlistService(UserRepository userRepository, UserService userService, MovieRepository movieRepository) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.movieRepository = movieRepository;
    }

    public void addToWishlist(Integer userId, String movieId) {
        Page<String> tuple = userRepository.findInWishlist(userId, movieId, Pageable.unpaged());
        if (!tuple.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Movie is already in wishlist");
        } else {
            User user = userService.getUser(userId);
            Optional<Movie> movieById = movieRepository.findMovieById(movieId);
            // Movie movie = movieService.getMovie(movieId);
            user.addToWishlist(movieById.get());
            userRepository.save(user);
        }
    }

    public void removeFromWishlist(Integer userId, String movieId) {
        Page<String> tuple = userRepository.findInWishlist(userId, movieId, Pageable.unpaged());
        if (!tuple.isEmpty()) {
            User user = userService.getUser(userId);
            Optional<Movie> movieById = movieRepository.findMovieById(movieId);
            // Movie movie = movieService.getMovie(movieId);
            user.removeFromWishlist(movieById.get());
            userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Movie is not in wishlist");
        }
    }
}
