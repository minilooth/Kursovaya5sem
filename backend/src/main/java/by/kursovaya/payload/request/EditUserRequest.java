package by.kursovaya.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EditUserRequest {
    private Integer id;
    private String username;
    private String password;
    private String firstname;
    private String surname;
    private String email;
    private String mobilePhone;
    private Integer roleId;
}
