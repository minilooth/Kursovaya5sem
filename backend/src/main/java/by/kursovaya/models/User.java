package by.kursovaya.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity(name ="by.kursovaya.kursovaya.models.User")
@Table(name = "User")
@NoArgsConstructor
@Getter @Setter
@ToString(exclude = {"autodealer", "deals", "roles"})
@EqualsAndHashCode(exclude = {"autodealer", "deals", "roles"})
public class User {
    
    @Id
    @Column(name = "Id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "Username", nullable = false, length = 20)
    private String username;

    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @Column(name = "Firstname", nullable = false, length = 20)
    private String firstname;

    @Column(name = "Surname", nullable = false, length = 20)
    private String surname;

    @Column(name = "Email", nullable = false, length = 50)
    private String email;

    @Column(name = "MobilePhone", nullable = false, length = 20)
    private String mobilePhone;

    @Column(name = "DateOfRegistration")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateOfRegistration;

    @Column(name = "IsAccountNonLocked", columnDefinition = "TINYINT(1)")
    private Boolean isAccountNonLocked;

    @ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(	name = "user_role", 
				joinColumns = @JoinColumn(name = "UserId"), 
				inverseJoinColumns = @JoinColumn(name = "RoleId"))
    private Set<Role> roles = new HashSet<>();

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable( name = "user_autodealer",
                joinColumns = {@JoinColumn(name = "UserId", referencedColumnName = "Id")},
                inverseJoinColumns = {@JoinColumn(name = "AutodealerId", referencedColumnName = "Id")})
    private Autodealer autodealer;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private Set<Deal> deals = new HashSet<>();
    
    public User(String username, String password, String firstname, String surname, String email, String mobilePhone, Date dateOfRegistration, Boolean isAccountNonLocked) {
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.surname = surname;
        this.email = email;
        this.dateOfRegistration = dateOfRegistration;
        this.mobilePhone = mobilePhone;
        this.isAccountNonLocked = isAccountNonLocked;
    }

    public User(String username, String password, String firstname, String surname, String email, String mobilePhone) {
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.surname = surname;
        this.email = email;
        this.mobilePhone = mobilePhone;
        this.dateOfRegistration = new Date();
        this.isAccountNonLocked = true;
    }
}
