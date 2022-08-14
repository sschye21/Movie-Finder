package com.example.demo.movie;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Casts")
public class Cast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "role")
    private String role;

    @Column(name = "actor_id")
    private String actor_id;

    @Column(name = "name")
    private String name;

    @Column(name = "movie_id")
    private String movie_id;

    public Cast() {}

    public Cast(String role, String actor_id, String name, String movie_id) {
        this.role = role;
        this.actor_id = actor_id;
        this.name = name;
        this.movie_id = movie_id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getActor_id() {
        return actor_id;
    }

    public void setActor_id(String actor_id) {
        this.actor_id = actor_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMovie_id() {
        return movie_id;
    }

    public void setMovie_id(String movie_id) {
        this.movie_id = movie_id;
    }

    @Override
    public String toString() {
        return "Cast{" +
                "id=" + id +
                ", role='" + role + '\'' +
                ", actor_id='" + actor_id + '\'' +
                ", name='" + name + '\'' +
                ", movie_id='" + movie_id + '\'' +
                '}';
    }
}
