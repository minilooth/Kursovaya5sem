package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
public enum InteriorColor {
    LIGHT(0,"Светлый"),
    DARK(1,"Темный"),
    COMBINED(2,"Комбинированный");

    private final String colorName;
    private final Integer id;

    InteriorColor(Integer id, String colorName) {
        this.colorName = colorName;
        this.id = id;
    }

    public String getColorName() {
        return this.colorName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<InteriorColor> valueOf(int value) {
        return Arrays.stream(values())
            .filter(color -> color.id == value)
            .findFirst();
    }
}
