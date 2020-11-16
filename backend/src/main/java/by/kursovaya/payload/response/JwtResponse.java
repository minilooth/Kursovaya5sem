package by.kursovaya.payload.response;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class JwtResponse {
    
    @Getter @Setter
    private String accessToken;
    
    @Getter @Setter
    private String type = "Bearer";
    
    @Getter @Setter
    private Integer id;
    
    @Getter @Setter
    private String username;
    
    @Getter @Setter
    private String firstname;
    
    @Getter @Setter
    private String surname;

    @Getter @Setter
    private String email;

    @Getter @Setter
    private String mobilePhone;

    @Getter @Setter
    private String dateOfRegistration;
    
    @Getter @Setter
    private List<String> roles;

    public JwtResponse(String accesToken, Integer id, String username, String firstname, String surname, String email, String mobilePhone, Date dateOfRegistration, List<String> roles) {
        this.accessToken = accesToken;
        this.id = id;
        this.username = username;
        this.firstname = firstname;
        this.surname = surname;
        this.email = email;
        this.mobilePhone = mobilePhone;
        this.dateOfRegistration = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(dateOfRegistration);
        this.roles = roles;
    }


}
