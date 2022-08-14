package com.example.demo.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Configuration
public class UserConfig {

    private final UserRepository userRepository;

    @Autowired
    public UserConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    CommandLineRunner commandLineRunner(UserRepository repository) {
        return args -> {
            User user = new User(
                    1,
                    "Bob",
                    "Smith",
                    "email@abc.com",
                    "user",
                    "123"
            );

            Optional<User> userByEmail = userRepository.findUserByEmail(user.getEmail());
            if (!userByEmail.isPresent()) {
                userRepository.save(user);
            }
        };
    }
}
