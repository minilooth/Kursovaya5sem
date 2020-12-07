package by.kursovaya.payload.response;

import java.util.Date;

import by.kursovaya.models.enums.BodyType;
import by.kursovaya.models.enums.EngineType;
import by.kursovaya.models.enums.TransmissionType;
import by.kursovaya.models.enums.WheelDriveType;
import lombok.Data;

@Data
public class DealResponse {
    private Integer id;
    private String image;
    private Float amount;
    private Date date;
    private Boolean isConfirmed;
    private String username;
    private Integer userId;
    private String brand;
    private String model;
    private Integer yearOfIssue;
    private Integer carId;
    private Float engineVolume;
    private EngineType engineType;
    private TransmissionType transmissionType;
    private BodyType bodyType;
    private WheelDriveType wheelDriveType;
}
