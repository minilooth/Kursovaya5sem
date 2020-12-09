package by.kursovaya.models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import by.kursovaya.models.enums.RoleEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity(name = "by.kursovaya.kursovaya.models.Role")
@Table(name = "role")
@ToString(exclude = {"users"})
@EqualsAndHashCode(exclude = {"users"})
public class Role {
    @Id
    @Column(name = "Id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "Name", nullable = false, length = 50)
    private RoleEnum name;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable( name = "user_role",
                joinColumns = {@JoinColumn(name = "RoleId", referencedColumnName = "Id")},
                inverseJoinColumns = {@JoinColumn(name="UserId", referencedColumnName = "Id")})
    private Set<User> users = new HashSet<>();
}
