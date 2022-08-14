package com.example.demo.user;

import org.springframework.http.HttpStatus;

import java.util.Arrays;
import java.util.List;

public class ApiResponse {
    private HttpStatus status;
    private String message;
    private Object body;

    public ApiResponse(HttpStatus status, String message, Object body) {
        this.status = status;
        this.message = message;
        this.body = body;
    }

    public ApiResponse(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getBody() {
        return body;
    }

    public void setBody(Object body) {
        this.body = body;
    }
}
