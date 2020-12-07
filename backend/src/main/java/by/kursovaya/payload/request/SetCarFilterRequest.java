package by.kursovaya.payload.request;

import by.kursovaya.models.enums.BodyColor;
import by.kursovaya.models.enums.BodyType;
import by.kursovaya.models.enums.CarSortType;
import by.kursovaya.models.enums.EngineType;
import by.kursovaya.models.enums.InteriorColor;
import by.kursovaya.models.enums.InteriorMaterial;
import by.kursovaya.models.enums.TransmissionType;
import by.kursovaya.models.enums.WheelDriveType;
import lombok.Data;

@Data
public class SetCarFilterRequest {
    private Boolean isFilterModeEnabled;

    private String brandFilter;
    private String modelFilter;
    private Integer yearOfIssueMinFilter;
    private Integer yearOfIssueMaxFilter;
    private BodyType bodyTypeFilter;
    private Float engineVolumeMinFilter;
    private Float engineVolumeMaxFilter;
    private EngineType engineTypeFilter;
    private TransmissionType transmissionTypeFilter;
    private WheelDriveType wheelDriveTypeFilter;
    private Float mileageMinFilter;
    private Float mileageMaxFilter;
    private BodyColor bodyColorFilter;
    private InteriorMaterial interiorMaterialFilter;
    private InteriorColor interiorColorFilter;
    private Float priceMinFilter;
    private Float priceMaxFilter;
    private CarSortType sortType;
}
