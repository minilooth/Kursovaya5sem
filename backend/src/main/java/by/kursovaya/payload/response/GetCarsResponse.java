package by.kursovaya.payload.response;

import java.util.List;

import by.kursovaya.models.Car;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetCarsResponse {
    List<Car> cars;
    Integer countOfNotSoldCars;
    Integer countOfTodayReceiptCars;
}
