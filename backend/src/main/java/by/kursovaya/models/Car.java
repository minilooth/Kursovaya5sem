package by.kursovaya.models;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

import by.kursovaya.models.enums.BodyColor;
import by.kursovaya.models.enums.BodyType;
import by.kursovaya.models.enums.EngineType;
import by.kursovaya.models.enums.InteriorColor;
import by.kursovaya.models.enums.InteriorMaterial;
import by.kursovaya.models.enums.TransmissionType;
import by.kursovaya.models.enums.WheelDriveType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "by.kursovaya.kursovaya.models.Car")
@Table(name = "Car")
@NoArgsConstructor
@AllArgsConstructor
public class Car {
    @Id
    @Column(name = "Id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "Brand", nullable = false, length = 30)
    private String brand;

    @Column(name = "Model", nullable = false, length = 30)
    private String model;

    @Column(name = "YearOfIssue", nullable = false)
    private Integer yearOfIssue;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "BodyType", nullable = false)
    private BodyType bodyType;

    @Column(name = "EngineVolume", nullable = false)
    private Float engineVolume;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "EngineType", nullable = false)
    private EngineType engineType;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "TransmissionType", nullable = false)
    private TransmissionType transmissionType;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "WheelDriveType", nullable = false)
    private WheelDriveType wheelDriveType;

    @Column(name = "Mileage", nullable = false, columnDefinition = "decimal(10,0)")
    private Float mileage;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "BodyColor", nullable = false)
    private BodyColor bodyColor;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "InteriorMaterial", nullable = false)
    private InteriorMaterial interiorMaterial;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "InteriorColor", nullable = false)
    private InteriorColor interiorColor;

    @Column(name = "Price", columnDefinition = "decimal(10,0)" , nullable = false)
    private Float price;

    @Column(name = "ReceiptDate", nullable = false, columnDefinition="DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime receiptDate;

    @Column(name = "IsSold", nullable = false, columnDefinition="TINYINT DEFAULT 0")
    private Byte isSold;

    @Column(name = "AutodealerId", nullable = false)
    private Integer autodealerId;

    @JsonIgnore
    @Column(name = "ImageName", nullable = true)
    private String imageName;

    @Transient
    private String image;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "AutodealerId", referencedColumnName = "Id", insertable = false, updatable = false)
    private Autodealer autodealer;

    @JsonIgnore
    @OneToMany(targetEntity = Deal.class, mappedBy="id", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private Set<Deal> deals = new HashSet<>();
}
