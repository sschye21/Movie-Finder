package com.example.demo.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.squareup.okhttp.Call;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import org.apache.hadoop.io.Text;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    private final CastService castService;

    @Autowired
    public MovieService(MovieRepository movieRepository, CastService castService) {
        this.movieRepository = movieRepository;
        this.castService = castService;
    }

    public int addNewMovie(Movie movie) {
//        Optional<Movie> movieById = movieRepository.findMovieById(movie.getId());
//        if (movieById.isPresent()) {
//            return 2;
//        }
        movieRepository.save(movie);
        return 0;
    }

    public List<HashMap<String, Object>> searchMovie(Map<String, String> requestParams) throws IOException {
        String category = requestParams.get("c");
        String query = requestParams.get("q");
        String page = requestParams.get("p");

        OkHttpClient client = new OkHttpClient();
        Request request = null;

        if (category.equals("Cast")) {
            request = new Request.Builder()
                    .url("https://moviesminidatabase.p.rapidapi.com/actor/imdb_id_byName/" + query + "/")
                    .get()
                    .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                    .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                    .build();
        } else if (category.equals("Name")) {
            request = new Request.Builder()
                    .url("https://moviesminidatabase.p.rapidapi.com/movie/imdb_id/byTitle/" + query + "/")
                    .get()
                    .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                    .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                    .build();
        } else if (category.equals("Genre")) {
            String newQuery = query.substring(0, 1).toUpperCase() + query.substring(1);
            request = new Request.Builder()
                    .url("https://moviesminidatabase.p.rapidapi.com/movie/byGen/" + newQuery + "/?page_size=20&page=" + page)
                    .get()
                    .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                    .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                    .build();
        } else if (category.equals("Year")) {
            request = new Request.Builder()
                    .url("https://moviesminidatabase.p.rapidapi.com/movie/byYear/" + query + "/?page_size=20&page=" + page)
                    .get()
                    .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                    .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                    .build();
        }

        Response response = client.newCall(request).execute();
        String resData = response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readValue(resData, JsonNode.class);

        JsonNode resultNode = jsonNode.get("results");
        ArrayNode resultArrayNode = (ArrayNode) resultNode;

        List<HashMap<String, Object>> movieList = new ArrayList<>();

        int sizeLimit = Math.min(resultArrayNode.size(), 40);

        if (category.equals("Cast")) {
            int castSizeLimit = Math.min(resultArrayNode.size(), 15);
            for (int i = 0; i < castSizeLimit ; i++) {
                String name = resultArrayNode.get(i).get("name").asText();
                String actor_id = resultArrayNode.get(i).get("imdb_id").asText();

                client = new OkHttpClient();

                request = new Request.Builder()
                        .url("https://moviesminidatabase.p.rapidapi.com/actor/id/" + actor_id + "/movies_knownFor/")
                        .get()
                        .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                        .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                        .build();

                response = client.newCall(request).execute();
                resData = response.body().string();

                objectMapper = new ObjectMapper();
                jsonNode = objectMapper.readValue(resData, JsonNode.class);

                resultNode = jsonNode.get("results");
                ArrayNode resultActorArrayNode = (ArrayNode) resultNode;

                int sizeLimitActor = Math.min(resultActorArrayNode.size(), 30);

                for (int j = 0; j < sizeLimitActor; j++) {
                    HashMap<String, Object> movieSet = new HashMap<>();
                    movieSet.put("name", name);
                    movieSet.put("actor_id", actor_id);
                    JsonNode title = resultActorArrayNode.get(j).get(0).get("title");
                    movieSet.put("title", title.asText());
                    JsonNode imdb_id = resultActorArrayNode.get(j).get(0).get("imdb_id");
                    movieSet.put("imdb_id", imdb_id.asText());

                    movieList.add(movieSet);
                }
            }
        } else {
            for (int i = 0; i < sizeLimit; i++) {
                HashMap<String, Object> movieSet = new HashMap<>();
                JsonNode title = resultArrayNode.get(i).get("title");
                movieSet.put("title", title.asText());
                JsonNode imdb_id = resultArrayNode.get(i).get("imdb_id");
                movieSet.put("imdb_id", imdb_id.asText());
                movieList.add(movieSet);
            }
        }

        return movieList;
    }

    public List<HashMap<String, Object>> searchMovieWithoutPages(Map<String, String> requestParams) throws IOException {
        String category = requestParams.get("c");
        String query = requestParams.get("q");

        List<HashMap<String, Object>> movieList = new ArrayList<>();

        if (category.equals("Name")) {
            movieList = searchMovie(requestParams);
        } else if (category.equals("Year")) {
            Optional<List<Object>> movieYear = movieRepository.findMovieIdsByYear(Integer.valueOf(query));
            if (movieYear.isPresent()) {
                movieList = movieYear.get().stream()
                        .map(element -> {
                            HashMap<String, Object> maps = new HashMap<>();
                            maps.put("imdb_id", element.toString());
                            maps.put("title", movieRepository.getMovieTitleFromId(element.toString()).get().toString());
                            return maps;
                        })
                        .collect(Collectors.toList());
            }
        } else if (category.equals("Genre")) {
            Optional<List<Object>> movieGenres = movieRepository.findMovieIdsByGenre(query);
            if (movieGenres.isPresent()) {
                movieList = movieGenres.get().stream()
                        .map(element -> {
                            HashMap<String, Object> maps = new HashMap<>();
                            maps.put("imdb_id", element.toString());
                            maps.put("title", movieRepository.getMovieTitleFromId(element.toString()).get().toString());
                            return maps;
                        })
                        .collect(Collectors.toList());
            }
        } else if (category.equals("Cast")) {
            movieList = searchMovie(requestParams);
        }

        return movieList;
    }

    public List<HashMap<String, Object>> searchMovieFilter(Map<String, String> requestParams, List<String> requestGenres, List<String> requestDirectors, List<String> requestYears, String sortBy) throws IOException {
        List<HashMap<String, Object>> movieList = searchMovieWithoutPages(requestParams);
        List<HashMap<String, Object>> movieGenreList = new ArrayList<>();
        List<HashMap<String, Object>> movieDirectorList = new ArrayList<>();
        List<HashMap<String, Object>> movieYearList = new ArrayList<>();

        for (int i = 0; i < movieList.size(); i++) {
            for (int j = 0; j < requestGenres.size(); j++) {
                HashMap<String, Object> id = movieList.get(i);
                String genre_id = requestGenres.get(j);
                Optional<String> movie_id = movieRepository.findMovieByGenre(id.get("imdb_id").toString(), genre_id);
                if (movie_id.isPresent()) {
                    movieGenreList.add(movieList.get(i));
                }
            }

            for (int j = 0; j < requestDirectors.size(); j++) {
                String id = movieList.get(i).get("imdb_id").toString();
                String director_id = requestDirectors.get(j);
                Optional<String> movie_id = movieRepository.findMovieByDirector(id, director_id);
                if (movie_id.isPresent()) {
                    movieDirectorList.add(movieList.get(i));
                }
            }

            for (int j = 0; j < requestYears.size(); j++) {
                int yearBegin = Integer.valueOf(requestYears.get(j).substring(0, 4));
                int yearEnd = Integer.valueOf(requestYears.get(j).substring(5));
                String id = movieList.get(i).get("imdb_id").toString();
                Optional<String> movie_id = movieRepository.findMovieByYearRange(id, yearBegin, yearEnd);
                if (movie_id.isPresent()) {
                    movieYearList.add(movieList.get(i));
                }
            }
        }

        Set<HashMap<String, Object>> genreSet = movieGenreList.stream()
                .collect(Collectors.toSet());

        Set<HashMap<String, Object>> directorSet = movieDirectorList.stream()
                .collect(Collectors.toSet());

        Set<HashMap<String, Object>> yearSet = movieYearList.stream()
                .collect(Collectors.toSet());

        Set<HashMap<String, Object>> resSet = new HashSet<>();

        if (!genreSet.isEmpty() && !directorSet.isEmpty() && !yearSet.isEmpty()) {
            genreSet.retainAll(directorSet);
            genreSet.retainAll(yearSet);
            resSet = genreSet;
        } else if (!genreSet.isEmpty() && !directorSet.isEmpty()) {
            genreSet.retainAll(directorSet);
            resSet = genreSet;
        } else if (!genreSet.isEmpty() && !yearSet.isEmpty()) {
            genreSet.retainAll(yearSet);
            resSet = genreSet;
        } else if (!yearSet.isEmpty() && !directorSet.isEmpty()) {
            yearSet.retainAll(directorSet);
            resSet = yearSet;
        } else if (!genreSet.isEmpty()) {
            resSet = genreSet;
        } else if (!yearSet.isEmpty()) {
            resSet = yearSet;
        } else if (!directorSet.isEmpty()) {
            resSet = directorSet;
        } else {
            resSet = movieList.stream()
                    .collect(Collectors.toSet());
        }

        List<HashMap<String, Object>> resList = new ArrayList<>();
        if (sortBy.equals("alphabetUp")) {
            resList = resSet.stream()
                    .collect(Collectors.toList());

            resList.sort(Comparator.comparing(
                    m -> m.get("title").toString(),
                    Comparator.nullsLast(Comparator.naturalOrder())
            ));

        } else if (sortBy.equals("alphabetDown")) {
            resList = resSet.stream()
                    .collect(Collectors.toList());

            resList.sort(Comparator.comparing(
                    m -> m.get("title").toString(),
                    Comparator.nullsLast(Comparator.reverseOrder())
            ));

        } else if (sortBy.equals("rating")) {
            resList = resSet.stream()
                    .collect(Collectors.toList());

            resList.sort(Comparator.comparing(
                    m -> movieRepository.findUserRating(m.get("imdb_id").toString()).orElse(0.0),
                    Comparator.nullsLast(Comparator.naturalOrder())
            ));

        } else {
            resList = resSet.stream()
                    .collect(Collectors.toList());
        }
        return resList;
    }

    public Movie getDetails(String id) throws IOException {
        Optional<Movie> movieById = movieRepository.findMovieById(id);
        if (!movieById.isPresent()) {
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .url("https://moviesminidatabase.p.rapidapi.com/movie/id/" + id + "/")
                    .get()
                    .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                    .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                    .build();

            Call call = client.newCall(request);
            Response response = call.execute();
            String resData = response.body().string();

            ObjectMapper objectMapper = new ObjectMapper();
            Movie movie =  new Movie();
            JsonNode jsonNode = objectMapper.readValue(resData, JsonNode.class);

            JsonNode resultNode = jsonNode.get("results");

            if (resultNode.size() == 0) {
                if (id.length() < 9) {
                    return getDetails(id.substring(0, 2) + "0" +  id.substring(2));
                }
//                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie with id: " + id + " could not be found.");
                return null;
            }

            JsonNode title = resultNode.get("title");
            JsonNode description = resultNode.get("description");
            JsonNode year = resultNode.get("year");
            JsonNode banner = resultNode.get("banner");
            JsonNode rating = resultNode.get("content_rating");
            JsonNode length = resultNode.get("movie_length");
            JsonNode imdbId = resultNode.get("imdb_id");

            JsonNode genNode = resultNode.get("gen");
            ArrayNode genArrayNode = (ArrayNode) genNode;

            HashSet<String> genreSet = new HashSet<>();

            for (int i = 0; i < genArrayNode.size(); i++) {
                JsonNode genre = genArrayNode.get(i).get("genre");
                genreSet.add(genre.asText());
            }

            movie.setMovie_id(imdbId.asText());
            movie.setGenre(genreSet);
            movie.setTitle(title.asText());
            movie.setDescription(description.asText());
            movie.setYear(year.asInt());
            movie.setImageUrl(banner.asText());
            movie.setRating(rating.asText());
            movie.setLength(length.asInt());

            movieRepository.save(movie);

            movie.setCast(castService.getCast(id));
            return movie;
        } else {
            return movieById.get();
        }
    }

    public HashSet<HashMap<String, Object>> getPopular() throws IOException {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://moviesminidatabase.p.rapidapi.com/movie/order/byPopularity/?page_size=20&page=1")
                .get()
                .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                .build();

        Response response = client.newCall(request).execute();
        String resData = response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readValue(resData, JsonNode.class);

        JsonNode resultNode = jsonNode.get("results");
        ArrayNode resultArrayNode = (ArrayNode) resultNode;

        HashSet<HashMap<String, Object>> movieList = new HashSet<>();

        for (int i = 0; i < resultArrayNode.size(); i++) {
            HashMap<String, Object> movieSet = new HashMap<>();
            JsonNode title = resultArrayNode.get(i).get("title");
            movieSet.put("title", title.asText());
            JsonNode imdb_id = resultArrayNode.get(i).get("imdb_id");
            movieSet.put("imdb_id", imdb_id.asText());
            movieList.add(movieSet);
        }

        return movieList;
    }

    public HashSet<HashMap<String, Object>> getSimilar(String id) throws IOException {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://moviesminidatabase.p.rapidapi.com/movie/id/" + id + "/keywords/")
                .get()
                .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                .build();

        Response response = client.newCall(request).execute();
        String resData = response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readValue(resData, JsonNode.class);

        JsonNode resultNode = jsonNode.get("results");
        ArrayNode resultArrayNode = (ArrayNode) resultNode;

        HashSet<HashMap<String, Object>> movieList = new HashSet<>();

        for (int i = 0; i < resultArrayNode.size(); i++) {
            HashSet<HashMap<String, Object>> movies = searchMovieByKeyword(resultArrayNode.get(i).get("keyword").asText());
            for (HashMap<String, Object> movie : movies) {
                if (!id.equals(movie.get("imdb_id"))) {
                    movieList.add(movie);
                }
                if (movieList.size() >= 20) {
                    return movieList;
                }
            }
        }

        return movieList;
    }

    public HashSet<HashMap<String, Object>> searchMovieByKeyword(String keyword) throws IOException {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://moviesminidatabase.p.rapidapi.com/movie/byKeywords/"+ keyword.replace(" ", "%20") +"/?page_size=10&page=1")
                .get()
                .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                .build();

        Response response = client.newCall(request).execute();
        String resData = response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readValue(resData, JsonNode.class);

        JsonNode resultNode = jsonNode.get("results");
        ArrayNode resultArrayNode = (ArrayNode) resultNode;

        HashSet<HashMap<String, Object>> movieList = new HashSet<>();

        for (int i = 0; i < resultArrayNode.size(); i++) {
            HashMap<String, Object> movieSet = new HashMap<>();
            JsonNode title = resultArrayNode.get(i).get("title");
            movieSet.put("title", title.asText());
            JsonNode imdb_id = resultArrayNode.get(i).get("imdb_id");
            movieSet.put("imdb_id", imdb_id.asText());
            movieList.add(movieSet);
        }

        return movieList;
    }

    public HashSet<HashMap<String, Object>> getHighestRatings() throws IOException {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://moviesminidatabase.p.rapidapi.com/movie/order/byRating/?page_size=20&page=1")
                .get()
                .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                .build();

        Response response = client.newCall(request).execute();
        String resData = response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readValue(resData, JsonNode.class);

        JsonNode resultNode = jsonNode.get("results");
        ArrayNode resultArrayNode = (ArrayNode) resultNode;

        HashSet<HashMap<String, Object>> movieList = new HashSet<>();

        for (int i = 0; i < resultArrayNode.size(); i++) {
            HashMap<String, Object> movieSet = new HashMap<>();
            JsonNode title = resultArrayNode.get(i).get("title");
            movieSet.put("title", title.asText());
            JsonNode imdb_id = resultArrayNode.get(i).get("imdb_id");
            movieSet.put("imdb_id", imdb_id.asText());
            movieList.add(movieSet);
        }

        return movieList;
    }
}
