package com.example.demo.movie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface CastRepository extends JpaRepository<Cast, Integer> {
}
