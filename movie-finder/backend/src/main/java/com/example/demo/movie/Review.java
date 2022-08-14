package com.example.demo.movie;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "content")
    private String content;

    @Column(name = "user_name")
    private String user_name;

    @Column(name = "user_rating")
    private Double userRating;

    @Column(name = "movie_id")
    private String movieId;

    @Column(name = "movie_title")
    private String movie_title;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;
    
    @Column(name = "time")
    private LocalDateTime time;

    @Column(name = "userId")
    private Integer user_id;

    @Column(name = "banner")
    private String banner;

    public Review() {}

    public Review(String content, String user_name, Double userRating, String movieId, String movie_title, Integer user_id, String banner) {
        this.content = content;
        this.user_name = user_name;
        this.userRating = userRating;
        this.movieId = movieId;
        this.movie_title = movie_title;
        this.time = LocalDateTime.now();
        this.user_id = user_id;
        this.banner = banner;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public Double getUserRating() {
        return userRating;
    }

    public void setUserRating(Double userRating) {
        this.userRating = userRating;
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public String getMovie_title() {
        return movie_title;
    }

    public void setMovie_title(String movie_title) {
        this.movie_title = movie_title;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", content='" + content + '\'' +
                ", user_name='" + user_name + '\'' +
                ", userRating=" + userRating +
                ", movieId='" + movieId + '\'' +
                ", movie_title='" + movie_title + '\'' +
                ", movie=" + movie +
                ", time=" + time +
                ", user_id=" + user_id +
                '}';
    }
}
