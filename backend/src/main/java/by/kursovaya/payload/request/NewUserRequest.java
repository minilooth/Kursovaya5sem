package by.kursovaya.payload.request;

import lombok.Data;

@Data
public class NewUserRequest {
    private String username;
    private String password;
    private String firstname;
    private String surname;
    private String email;
    private String mobilePhone;
    private Integer roleId;
}
