package com.example.demo.recommender;

import com.example.demo.movie.*;
import org.apache.mahout.cf.taste.common.NoSuchUserException;
import org.apache.mahout.cf.taste.impl.common.FastByIDMap;
import org.apache.mahout.cf.taste.impl.model.GenericDataModel;
import org.apache.mahout.cf.taste.impl.model.GenericPreference;
import org.apache.mahout.cf.taste.impl.model.GenericUserPreferenceArray;
import org.apache.mahout.cf.taste.model.Preference;
import org.apache.mahout.cf.taste.model.PreferenceArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

import org.apache.mahout.cf.taste.impl.neighborhood.ThresholdUserNeighborhood;
import org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;

import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.neighborhood.UserNeighborhood;

import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.recommender.UserBasedRecommender;

import org.apache.mahout.cf.taste.similarity.UserSimilarity;

@Service
public class RecommenderService {

    private final MovieService movieService;
    private final ReviewRepository reviewRepository;

    @Autowired
    public RecommenderService(MovieService movieService, ReviewRepository reviewRepository) {
        this.movieService = movieService;
        this.reviewRepository = reviewRepository;
    }

    public HashSet<HashMap<String, Object>> getRecommended(Integer id) throws IOException {
        try{
            List<Review> reviews = reviewRepository.findAll();
            FastByIDMap<PreferenceArray> preferences = new FastByIDMap<>();

            HashMap<Integer, List<Preference>> preferenceMap = new HashMap<>();

            for (int i = 0; i < reviews.size(); ++i) {
                Review review = reviews.get(i);
                Preference pref = new GenericPreference(review.getUser_id(), Long.parseLong(review.getMovie().getMovie_id().replace("tt", "")), review.getUserRating().floatValue());
                if (preferenceMap.containsKey(review.getUser_id())) {
                    preferenceMap.get(review.getUser_id()).add(pref);
                } else {
                    List<Preference> list = new ArrayList<>();
                    list.add(pref);
                    preferenceMap.put(review.getUser_id(), list);
                }
            }

            for (Integer key : preferenceMap.keySet()) {
                PreferenceArray preferenceArray = new GenericUserPreferenceArray(preferenceMap.get(key).size());
                for (int i = 0; i < preferenceMap.get(key).size(); ++i) {
                    preferenceArray.set(i, preferenceMap.get(key).get(i));
                }
                preferences.put(key, preferenceArray);
            }

            DataModel datamodel = new GenericDataModel(preferences);

            //Creating UserSimilarity object.
            UserSimilarity usersimilarity = new PearsonCorrelationSimilarity(datamodel);

            //Creating UserNeighbourHHood object.
            UserNeighborhood userneighborhood = new ThresholdUserNeighborhood(0.1, usersimilarity, datamodel);

            //Create UserRecommender
            UserBasedRecommender recommender = new GenericUserBasedRecommender(datamodel, userneighborhood, usersimilarity);

            List<RecommendedItem> recommendations = recommender.recommend(id, 20);

            if (recommendations.isEmpty()) {
                return movieService.getHighestRatings();
            }

            HashSet<HashMap<String, Object>> movieList = new HashSet<>();
            for (RecommendedItem recommendation : recommendations) {
                HashMap<String, Object> movieSet = new HashMap<>();
                String imdb_id = "tt" + recommendation.getItemID();
                String title;
                Movie movie = movieService.getDetails(imdb_id);
                title = movie.getTitle();
                movieSet.put("title", title);
                movieSet.put("imdb_id", imdb_id);
                movieList.add(movieSet);
            }

            return movieList;
        }
        catch (NoSuchUserException e) {
            return movieService.getHighestRatings();
        }
        catch(Exception e){
            System.out.println(e);
        }
        return new HashSet<>();
    }
}

