package by.kursovaya.models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "by.kursovaya.kursovaya.models.Autodealer")
@Table(name = "autodealer")
@NoArgsConstructor
@AllArgsConstructor
public class Autodealer {
    @Id
    @Column(name = "Id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "Title", nullable = false, length = 100)
    private String title;

    @Column(name = "WorkingHours", nullable = false, length = 20)
    private String workingHours;

    @Column(name = "City", nullable = false, length = 50)
    private String city;

    @Column(name = "Address", nullable = false, length = 50)
    private String address;

    @Column(name = "Description", nullable = false, columnDefinition = "longtext")
    private String description;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable( name = "user_autodealer",
                joinColumns = {@JoinColumn(name = "AutodealerId", referencedColumnName = "Id")},
                inverseJoinColumns = {@JoinColumn(name = "UserId", referencedColumnName = "Id")})
    private User user;

    @JsonIgnore
    @OneToMany(targetEntity = Car.class, mappedBy = "id", fetch = FetchType.LAZY)
    private Set<Car> cars = new HashSet<>();

    @JsonIgnore
    @OneToMany(targetEntity = Statistics.class, mappedBy = "id", fetch = FetchType.LAZY)
    private Set<Statistics> statistics = new HashSet<>();
}
