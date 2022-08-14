package com.example.demo.movie;

import com.example.demo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface MovieRepository extends JpaRepository<Movie, Integer> {

    @Query("SELECT movie from Movie movie WHERE movie.movie_id = ?1")
//    @Query("SELECT m.movie_id, m.banner, g.genre FROM Movie m JOIN Genres g ON m.movie_id = g.movie_id WHERE m.movie_id = ?1")
    Optional<Movie> findMovieById(String id);

    @Query("SELECT user from User user WHERE user.email = ?1")
    Optional<User> findUserByEmail(String email);

    @Query(value = "SELECT m.movie_id FROM movies m", nativeQuery = true)
    Optional<List<String>> getMovieIds();

    @Query(value = "SELECT m.title FROM movies m WHERE m.movie_id = ?1", nativeQuery = true)
    Optional<Object> getMovieTitleFromId(String id);

    @Query(value = "SELECT g.movie_id FROM genres g LEFT JOIN movies m ON m.movie_id = g.movie_id WHERE g.genre = ?1", nativeQuery = true)
    Optional<List<Object>> findMovieIdsByGenre(String genre);

    @Query(value = "SELECT m.movie_id FROM movies m WHERE m.year = year", nativeQuery = true)
    Optional<List<Object>> findMovieIdsByYear(Integer year);

    @Query(value = "SELECT r.user_rating FROM review r WHERE r.movie_id = ?1", nativeQuery = true)
    Optional<Double> findUserRating(String id);

    @Query(value = "SELECT g.movie_id FROM genres g WHERE g.movie_id = ?1 AND g.genre = ?2", nativeQuery = true)
    Optional<String> findMovieByGenre(String id, String genre);

    @Query(value = "SELECT c.movie_id FROM casts c WHERE c.movie_id = ?1 AND c.name LIKE CONCAT('%', ?2, '%')", nativeQuery = true)
    Optional<String> findMovieByDirector(String id, String director);

    @Query(value = "SELECT m.movie_id FROM movies m WHERE m.movie_id = ?1 AND m.year BETWEEN ?2 AND ?3", nativeQuery = true)
    Optional<String> findMovieByYearRange(String id, Integer yearBegin, Integer yearEnd);

    @Query(value = "SELECT * FROM review r WHERE r.user_id = ?1 AND r.movie_id = ?2", nativeQuery = true)
    Optional<List<Review>> getReview(Integer id, String movie_id);
}
