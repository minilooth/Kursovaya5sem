package by.kursovaya.payload.request;

import lombok.Data;

@Data
public class NewAutodealerRequest {
    private String title;
    private String workingHoursStart;
    private String workingHoursEnd;
    private String city;
    private String address;
    private String description;
}
