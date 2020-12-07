package by.kursovaya.payload.request;

import by.kursovaya.models.enums.BodyColor;
import by.kursovaya.models.enums.BodyType;
import by.kursovaya.models.enums.EngineType;
import by.kursovaya.models.enums.InteriorColor;
import by.kursovaya.models.enums.InteriorMaterial;
import by.kursovaya.models.enums.TransmissionType;
import by.kursovaya.models.enums.WheelDriveType;
import lombok.Data;

@Data
public class EditCarRequest {
    private Integer id;
    private String brand;
    private String model;
    private Integer yearOfIssue;
    private BodyType bodyType;
    private Float engineVolume;
    private EngineType engineType;
    private TransmissionType transmissionType;
    private WheelDriveType wheelDriveType;
    private Float mileage;
    private BodyColor bodyColor;
    private InteriorMaterial interiorMaterial;
    private InteriorColor interiorColor;
    private Float price;
    private String image;
    private Integer autodealerId;
}
