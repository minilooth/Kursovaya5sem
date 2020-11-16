package by.kursovaya.payload.request;

import lombok.Data;

@Data
public class NewCarRequest {
    private String brand;
    private String model;
    private Integer yearOfIssue;
    private Integer bodyType;
    private Float engineVolume;
    private Integer engineType;
    private Integer transmissionType;
    private Integer wheelDriveType;
    private Float mileage;
    private Integer bodyColor;
    private Integer interiorMaterial;
    private Integer interiorColor;
    private Float price;
    private String image;
    private Integer autodealerId;
}