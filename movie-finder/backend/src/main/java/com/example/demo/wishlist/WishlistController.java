package com.example.demo.wishlist;

import com.example.demo.user.ApiResponse;
import com.example.demo.user.User;
import com.example.demo.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@ResponseBody
@RequestMapping(path = "api/v1/user/{id}/wishlist")
public class WishlistController {
    private final WishlistService wishlistService;

    @Autowired
    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping
    public ApiResponse addToWishlist (@PathVariable("id") Integer userId, @RequestBody WishlistDTO wishlistDTO) {
        wishlistService.addToWishlist(userId, wishlistDTO.getMovieId());
        return new ApiResponse(HttpStatus.OK, "success");
    }

    @DeleteMapping
    public ApiResponse removeFromWishlist (@PathVariable("id") Integer userId, @RequestBody WishlistDTO wishlistDTO) {
        wishlistService.removeFromWishlist(userId, wishlistDTO.getMovieId());
        return new ApiResponse(HttpStatus.OK, "success");
    }
}
