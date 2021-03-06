package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
public enum EngineType {
    PETROL(0,"Бензиновый"),
    DIESEL(1,"Дизельный"),
    ELECTRIC(2,"Электро");

    private final String typeName;
    private final Integer id;

    EngineType(Integer id, String typeName) {
        this.typeName = typeName;
        this.id = id;
    }

    public String getTypeName() {
        return this.typeName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<EngineType> valueOf(int value) {
        return Arrays.stream(values())
            .filter(type -> type.id == value)
            .findFirst();
    }
}
