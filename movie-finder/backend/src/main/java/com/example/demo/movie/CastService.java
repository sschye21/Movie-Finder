package com.example.demo.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CastService {

    private final CastRepository castRepository;


    @Autowired
    public CastService(CastRepository castRepository) {
        this.castRepository = castRepository;
    }

    public List<Cast> getCast(String id) throws IOException {
        Set<Cast> castList = new HashSet<>();

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url("https://moviesminidatabase.p.rapidapi.com/movie/id/" + id + "/cast/")
                .get()
                .addHeader("X-RapidAPI-Key", "436bb4bfb9msh2607647327157adp1d510fjsnf843f2392e72")
                .addHeader("X-RapidAPI-Host", "moviesminidatabase.p.rapidapi.com")
                .build();

        Response response = client.newCall(request).execute();
        String resData = response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readValue(resData, JsonNode.class);

        JsonNode resultNode = jsonNode.get("results");
        JsonNode rolesNode = resultNode.get("roles");
        ArrayNode rolesArrayNode = (ArrayNode) rolesNode;

        int numCast = 0;
        int numDirec = 0;
        int i = 0;
        while (!(numDirec >= 1 && numCast >= 3) && i < rolesArrayNode.size()) {
            JsonNode role = rolesArrayNode.get(i).get("role");
            String movie_role = role.asText();
            if (!movie_role.equals("Writer")) {
                JsonNode actor = rolesArrayNode.get(i).get("actor");
                JsonNode actor_id = actor.get("imdb_id");
                JsonNode actor_name = actor.get("name");

                if (!movie_role.equals("Director") && numCast < 3) {
                    Cast cast = new Cast(movie_role, actor_id.asText(), actor_name.asText(), id);
                    castRepository.save(cast);
                    castList.add(cast);
                    numCast++;
                } else if (movie_role.equals("Director") && numDirec < 1){
                    Cast cast = new Cast(movie_role, actor_id.asText(), actor_name.asText(), id);
                    castRepository.save(cast);
                    castList.add(cast);
                    numDirec++;
                }
            }
            i++;
        }
        List<Cast> castListRes = castList.stream()
                .sorted(Comparator.comparing(Cast::getId))
                .collect(Collectors.toList());
        return castListRes;
    }
}
