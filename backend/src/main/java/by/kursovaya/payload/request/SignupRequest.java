package by.kursovaya.payload.request;

import java.util.Set;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String password;
    private String firstname;
    private String surname;
    private String email;
    private String mobilePhone;
    private Set<String> role;
}
