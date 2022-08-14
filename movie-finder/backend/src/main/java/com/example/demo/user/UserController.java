package com.example.demo.user;

import com.example.demo.movie.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@ResponseBody
@RequestMapping(path = "api/v1/user")
public class UserController {

    private final UserService userService;

    private final ReviewService reviewService;

    @Autowired
    public UserController(UserService userService,
                          ReviewService reviewService) {
        this.userService = userService;
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public ApiResponse getUser(@PathVariable Integer id) {
        return new ApiResponse(HttpStatus.OK, id.toString(), userService.getUser(id));
    }

    @PostMapping("/register")
    public ApiResponse registerNewUser(@RequestBody User user) {
        User newUser = userService.addNewUser(user);
        return new ApiResponse(HttpStatus.OK, newUser.getId().toString());
    }

    @PostMapping("/login")
    public ApiResponse loginUser(@RequestBody LoginDTO loginDTO) {
        User user = userService.loginUser(loginDTO);
        return new ApiResponse(HttpStatus.OK, user.getId().toString());
    }

    @PutMapping("/{id}")
    public ApiResponse updateUser(@PathVariable Integer id, @RequestBody User user) {
        userService.updateUser(id, user);
        return new ApiResponse(HttpStatus.OK, id.toString());
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return new ApiResponse(HttpStatus.OK, id.toString());
    }

    @GetMapping("/reviews/{id}")
    public ApiResponse getReviewsFromUser(@PathVariable Integer id) {
        return new ApiResponse(HttpStatus.OK, id.toString(), reviewService.getReviewsForUser(id));
    }

    @GetMapping("/{id}/block")
    public ApiResponse getBlockedUsers(@PathVariable Integer id) {
        return new ApiResponse(HttpStatus.OK, id.toString(), userService.getBlockedUsers(id));
    }

    @PostMapping("/{id}/block")
    public ApiResponse blockUser(@PathVariable Integer id, @RequestBody BlockUserDTO blockUserDTO) {
        Integer errNo = userService.addBlockedUser(id, blockUserDTO.getBlock_id());
        return new ApiResponse(HttpStatus.OK, errNo.toString());
    }

    @DeleteMapping("/{id}/unblock")
    public ApiResponse unblockUser(@PathVariable Integer id, @RequestBody BlockUserDTO blockUserDTO) {
        Integer errNo = userService.removeBlockedUser(id, blockUserDTO.getBlock_id());
        return new ApiResponse(HttpStatus.OK, errNo.toString());
    }
}
