package by.kursovaya.payload.request;

import lombok.Data;

@Data
public class CarOrderRequest {
    private Integer carId;
    private Integer userId;
}
