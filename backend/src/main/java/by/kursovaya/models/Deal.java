package by.kursovaya.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity(name = "by.kursovaya.kursovaya.models.Deal")
@Table(name = "deal")
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"car", "user"})
@EqualsAndHashCode(exclude = {"car", "user"})
public class Deal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Integer id;

    @Column(name = "Amount", nullable = false, columnDefinition = "decimal(10,0)")
    private Float amount;

    @Column(name = "Date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @Column(name = "IsConfirmed", nullable = false, columnDefinition="TINYINT(1)")
    private Boolean isConfirmed;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "CarId", nullable = false)
    private Car car;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User user;
}

