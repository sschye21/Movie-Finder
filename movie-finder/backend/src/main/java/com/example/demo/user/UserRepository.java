package com.example.demo.user;

import com.example.demo.movie.Movie;
import com.example.demo.movie.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT user from User user WHERE user.email = ?1")
    Optional<User> findUserByEmail(String email);

//    @Query("SELECT user FROM User user WHERE user.username = ?1")
//    Optional<User> findUserByUsername(String username);

    // Every email should be associated with a password, 1 to 1 relationship
    @Query("SELECT user.password FROM User user WHERE user.email = ?1")
    String findPasswordByEmail(String email);

//    @Query("SELECT user.password FROM User user WHERE user.username = ?1")
//    String findPasswordByUsername(String username);@=

    @Query(value = "SELECT w.movie_id FROM wishlist w WHERE w.user_id = ?1 AND w.movie_id = ?2", nativeQuery = true)
    Page<String> findInWishlist(Integer userId, String movieId, Pageable pageable);

    @Query(value = "SELECT u.blocked_users from user_blocked_users u WHERE u.user_id = ?1", nativeQuery = true)
    List<Integer> findBlockedUsers(Integer userId);

}
