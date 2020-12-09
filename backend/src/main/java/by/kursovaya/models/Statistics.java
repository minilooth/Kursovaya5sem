package by.kursovaya.models;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity(name = "by.kursovaya.kursovaya.models.Statistics")
@Table(name = "statistics")
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"autodealer"})
@EqualsAndHashCode(exclude = {"autodealer"})
public class Statistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Integer id;

    @Column(name = "Month", nullable = false)
    private Integer month;

    @Column(name = "Year", nullable = false)
    private Integer year;

    @Column(name = "CountOfClients", nullable = false)
    private Integer countOfClients;

    @Column(name = "CountOfCarsSold", nullable = false)
    private Integer countOfCarsSold;

    @Column(name = "TotalSales", nullable = false, columnDefinition = "decimal(10,0)")
    private Float totalSales;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "AutodealerId", nullable = false) 
    private Autodealer autodealer;
}
