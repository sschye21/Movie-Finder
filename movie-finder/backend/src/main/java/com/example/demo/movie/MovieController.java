package com.example.demo.movie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@RestController
@ResponseBody
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "api/v1/movie")
public class MovieController {

    private final MovieService movieService;

    private final MovieRepository movieRepository;

    @Autowired
    public MovieController(MovieService movieService, MovieRepository movieRepository) {
        this.movieService = movieService;
        this.movieRepository = movieRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<HashMap<String, Object>>> getSearchResults(@RequestParam Map<String, String> requestParams) throws IOException {
        return new ResponseEntity<List<HashMap<String, Object>>>(movieService.searchMovie(requestParams), HttpStatus.OK);
    }

    @GetMapping("/search/filter")
    public ResponseEntity<List<HashMap<String, Object>>> getSearchResultsFilter(@RequestParam Map<String, String> requestParams, @RequestParam("g") List<String> requestGenres, @RequestParam("d") List<String> requestDirectors, @RequestParam("year") List<String> requestYears, @RequestParam("sortBy") String sortBy) throws IOException {
        return new ResponseEntity<List<HashMap<String, Object>>>(movieService.searchMovieFilter(requestParams, requestGenres, requestDirectors, requestYears, sortBy), HttpStatus.OK);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<Movie> getDetails(@PathVariable String id) throws IOException {
        return new ResponseEntity<Movie>(movieService.getDetails(id), HttpStatus.OK);
    }

    @GetMapping("/popular")
    public ResponseEntity<HashSet<HashMap<String, Object>>> getPopular () throws IOException {
        return new ResponseEntity<HashSet<HashMap<String, Object>>>(movieService.getPopular(), HttpStatus.OK);
    }

    @GetMapping("/details/{id}/similar")
    public ResponseEntity<HashSet<HashMap<String, Object>>> getSimilar(@PathVariable String id) throws IOException {
        return new ResponseEntity<HashSet<HashMap<String, Object>>>(movieService.getSimilar(id), HttpStatus.OK);
    }
}
