package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
public enum WheelDriveType {
    FRONT(0,"Передний"),
    REAR(1,"Задний"),
    PLUGGABLE_FULL(2,"Подключаемый полный"),
    PERMANENT_FULL(3,"Постоянный полный");

    private final String typeName;
    private final Integer id;

    WheelDriveType(Integer id, String typeName) {
        this.typeName = typeName;
        this.id = id;
    }

    public String getTypeName() {
        return this.typeName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<WheelDriveType> valueOf(int value) {
        return Arrays.stream(values())
            .filter(type -> type.id == value)
            .findFirst();
    }
}
