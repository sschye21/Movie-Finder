package com.example.demo.recommender;

import com.example.demo.user.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@ResponseBody
@RequestMapping(path = "api/v1/user")
public class RecommenderController {

    private final RecommenderService recommenderService;

    @Autowired
    public RecommenderController(RecommenderService recommenderService) {
        this.recommenderService = recommenderService;
    }

    @GetMapping("/{id}/recommend")
    public ResponseEntity<HashSet<HashMap<String, Object>>> recommendUser(@PathVariable Integer id) throws IOException {
        return new ResponseEntity<HashSet<HashMap<String, Object>>>(recommenderService.getRecommended(id), HttpStatus.OK);
    }
}

