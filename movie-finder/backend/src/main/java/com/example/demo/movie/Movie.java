package com.example.demo.movie;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name="movies")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Movie {
    @Id
    @Column(name = "movie_id")
    private String movie_id;

    @Column(name = "banner")
    @JsonProperty("banner")
    private String banner;

    @Column(name = "title")
    @JsonProperty("title")
    private String title;

    @Lob
    @Type(type = "text")
    @Column(name = "description")
    @JsonProperty("description")
    private String description;

    @Column(name = "year")
    @JsonProperty("year")
    private Integer year;

    @Column(name = "genre")
    @ElementCollection
    @CollectionTable(name = "genres", joinColumns = @JoinColumn(name = "movie_id"))
    @JsonProperty("genre")
    private Set<String> genres;

    @Column(name = "rating")
    @JsonProperty("rating")
    private String rating;

    @Column(name = "length")
    @JsonProperty("length")
    private Integer length;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "movie_id")
    private Set<Review> reviews;

    @OneToMany
    @Column(name = "cast", columnDefinition = "text")
    @JoinColumn(name = "movie_id")
    private List<Cast> cast;

    public Movie() {
        this.reviews = new HashSet<>();
        this.cast = new ArrayList<>();
    }

    public Movie(String id, String banner, String title, String description, Integer year, HashSet<String> genres, String rating, Integer length) {
        this.movie_id = id;
        this.banner = banner;
        this.title = title;
        this.description = description;
        this.year = year;
        this.genres = genres;
        this.rating = rating;
        this.length = length;
        this.reviews = new HashSet<>();
        this.cast = new ArrayList<>();
    }

    public String getMovie_id() {
        return movie_id;
    }

    public void setMovie_id(String movie_id) {
        this.movie_id = movie_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Set<String> getGenre() {
        return genres;
    }

    public void setGenre(HashSet<String> genres) {
        this.genres = genres;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getImageUrl() {
        return banner;
    }

    public void setImageUrl(String imageUrl) {
        this.banner = imageUrl;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public List<Cast> getCast() {
        return cast;
    }

    public void setCast(List<Cast> cast) {
        this.cast = cast;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Set<Review> getReviews() {
        return reviews;
    }

    public void setReviews(Set<Review> reviews) {
        this.reviews = reviews;
    }

    public void removeFromReviews(Review review) {
        this.reviews.remove(review);
    }

    @Override
    public String toString() {
        return "Movie{" +
                "banner='" + banner + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", year=" + year +
//                ", genre=" + genre +
                ", rating='" + rating + '\'' +
                ", length=" + length +
                '}';
    }
}
