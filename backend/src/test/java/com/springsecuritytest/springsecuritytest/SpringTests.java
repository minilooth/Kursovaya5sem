package com.springsecuritytest.springsecuritytest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import by.kursovaya.SpringsecuritytestApplication;
import by.kursovaya.payload.request.LoginRequest;
import by.kursovaya.payload.request.SignupRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest(classes = SpringsecuritytestApplication.class)
@AutoConfigureMockMvc
public class SpringTests {
    @Autowired
	private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // @Test
    // void shouldRegisterNewUser() throws JsonProcessingException, Exception {
    //     SignupRequest signupRequest = new SignupRequest("username", "password", "firstname", "surname", "example@gmail.com", "+375(11)111-11-11", null);

    //     this.mockMvc.perform(post("/api/auth/signup")
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .content(this.objectMapper.writeValueAsString(signupRequest)))
    //                 .andExpect(status().isCreated());
    // }

    // @Test
    // void shounldNotRegisterNewUser() throws JsonProcessingException, Exception {
    //     SignupRequest signupRequest = new SignupRequest("username", "password", "firstname", "surname", "example@gmail.com", "+375(11)111-11-11", null);

    //     this.mockMvc.perform(post("/api/auth/signup")
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .content(this.objectMapper.writeValueAsString(signupRequest)))
    //                 .andExpect(status().isBadRequest());           
    // }

    @Test
    void shouldAuthorizeUser() throws JsonProcessingException, Exception {
        LoginRequest loginRequest = new LoginRequest("username", "password");

        this.mockMvc.perform(post("/api/auth/signin")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(this.objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isOk());
    }

    @Test
    void shouldNotAuthorizeUser() throws JsonProcessingException, Exception {
        LoginRequest loginRequest = new LoginRequest("username", "123password321");

        this.mockMvc.perform(post("/api/auth/signin")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(this.objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized());
    }
}
