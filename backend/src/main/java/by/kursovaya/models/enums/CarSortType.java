package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
public enum CarSortType {
    NEW_ADS(0, "Новые объявления"),
    CHEAP_CARS(1, "Дешевые авто"),
    EXPENSIVE_CARS(2, "Дорогие авто"),
    NEW_CARS(3, "Новые авто"),
    OLD_CARS(4, "Старые авто"),
    LEAST_MILEAGE(5, "Меньший пробег");

    private Integer id;
    private String sortName;

    CarSortType(Integer id, String sortName) {
        this.sortName = sortName;
        this.id = id;
    }

    public String getSortName() {
        return this.sortName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<CarSortType> valueOf(int value) {
        return Arrays.stream(values())
            .filter(type -> type.id == value)
            .findFirst();
    }
}
