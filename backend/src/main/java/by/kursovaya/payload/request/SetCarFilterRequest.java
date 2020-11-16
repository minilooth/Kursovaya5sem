package by.kursovaya.payload.request;

import lombok.Data;

@Data
public class SetCarFilterRequest {
    private Boolean isFilterModeEnabled;

    private String brandFilter;
    private String modelFilter;
    private Integer yearOfIssueMinFilter;
    private Integer yearOfIssueMaxFilter;
    private Integer bodyTypeFilter;
    private Float engineVolumeMinFilter;
    private Float engineVolumeMaxFilter;
    private Integer engineTypeFilter;
    private Integer transmissionTypeFilter;
    private Integer wheelDriveTypeFilter;
    private Float mileageMinFilter;
    private Float mileageMaxFilter;
    private Integer bodyColorFilter;
    private Integer interiorMaterialFilter;
    private Integer interiorColorFilter;
    private Float priceMinFilter;
    private Float priceMaxFilter;
}
