package by.kursovaya.payload.request;

import lombok.Data;

@Data
public class NewDealRequest {
    private Integer userId;
    private Integer carId;
}
