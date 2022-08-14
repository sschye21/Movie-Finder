package com.example.demo.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUser(Integer id) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id: " + id + " could not be found.");
        }
        return user.get();
    }

    public User addNewUser(User user) {
//        boolean existsId = userRepository.existsById(user.getId());
        Optional<User> userByEmail = userRepository.findUserByEmail(user.getEmail());
//        if (existsId) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with id: " + user.getId() + " already exists.");
//        }
        if (userByEmail.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email: " + user.getEmail() + " already exists.");
        }
        userRepository.save(user);
        userByEmail = userRepository.findUserByEmail(user.getEmail());
        return userByEmail.get();
    }

    public User loginUser(LoginDTO loginDTO) {
        Optional<User> userByEmail = userRepository.findUserByEmail(loginDTO.getEmail());
        if (!userByEmail.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with email: " + loginDTO.getEmail() + " could not be found.");
        }
        String password = userRepository.findPasswordByEmail(loginDTO.getEmail());
        if (!password.equals(loginDTO.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password does not match given email.");
        }
        return userByEmail.get();
    }

    public User updateUser(Integer id, User user) {
        Optional<User> userById = userRepository.findById(id);
        if (!userById.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id: " + id + " could not be found.");
        }
        userById.get().updateUser(user);
        userRepository.save(userById.get());
        return userById.get();
    }

    public int deleteUser(Integer id) {
//        userRepository.findById(id);
        boolean exists = userRepository.existsById(id);
        if (!exists) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id: " + id + " could not be found.");
        }
        userRepository.deleteById(id);
        return 0;
    }

    public Set<Map<String, String>> getBlockedUsers(Integer id) {
        Optional<User> userById = userRepository.findById(id);
        if (!userById.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id: " + id + " could not be found.");
        }
        Set<Map<String, String>> users = new HashSet<>();
        for (Integer user_id : userById.get().getBlocked_users()) {
            Optional<User> optionalUser = userRepository.findById(user_id);
            if (!optionalUser.isPresent()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id: " + user_id + " could not be found.");
            }
            User user = optionalUser.get();
            Map<String, String> map = new HashMap<>();
            map.put("user_id", user.getId().toString());
            map.put("username", user.getUserName());
            users.add(map);
        }
        return users;
    }

    public Integer addBlockedUser(Integer id, Integer block_id) {
        Optional<User> userById = userRepository.findById(id);
        if (!userById.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id: " + id + " could not be found.");
        }
        userById.get().addToBlocked_users(block_id);
        userRepository.save(userById.get());
        return block_id;
    }

    public Integer removeBlockedUser(Integer id, Integer block_id) {
        Optional<User> userById = userRepository.findById(id);
        if (!userById.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id: " + id + " could not be found.");
        }
        userById.get().removeFromBlocked_users(block_id);
        userRepository.save(userById.get());
        return block_id;
    }
}
