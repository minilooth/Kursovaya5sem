package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
public enum BodyColor {
    WHITE(0,"Белый"),
    BURGUNDY(1,"Бордовый"),
    YELLOW(2,"Желтый"),
    GREEN(3,"Зеленый"),
    BROWN(4,"Коричневый"),
    RED(5,"Красный"),
    ORANGE(6,"Оранжевый"),
    SILVER(7,"Серебристый"),
    GRAY(8,"Серый"),
    BLUE(9,"Синий"),
    PURPLE(10,"Фиолетовый"),
    BLACK(11,"Черный"),
    OTHER(12,"Другой");

    private final Integer id;
    private final String colorName;

    BodyColor(Integer id, String colorName) {
        this.colorName = colorName;
        this.id = id;
    }

    public String getColorName() {
        return this.colorName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<BodyColor> valueOf(int value) {
        return Arrays.stream(values())
            .filter(color -> color.id == value)
            .findFirst();
    }
}
