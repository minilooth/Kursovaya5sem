package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
public enum BodyType {
    SUV_THREE_DOORS(0,"Внедорожник 3 дв."),
    SUV_FIVE_DOORS(1,"Внедорожник 5 дв."),
    CABRIOLET(2,"Кабриолет"),
    COUPE(3,"Купе"),
    PASSENGER_VAN(4,"Легковой фургон"),
    LIMOUSINE(5,"Лимузин"),
    LIFTBACK(6,"Лифтбек"),
    CARGO_MINIBUS(7,"Микроавтобус грузопассажирский"),
    PASSENGER_MINIBUS(8,"Микроавтобус пассажирский"),
    MINIVAN(9,"Минивэн"),
    PICKUP(10,"Пикап"),
    ROADSTER(11,"Родстер"),
    SEDAN(12,"Седан"),
    STATION_WAGON(13,"Универсал"),
    HATCHBACK_THREE_DOORS(14,"Хэтчбек 3. дв"),
    HATCHBACK_FIVE_DOORS(15,"Хэтчбек 5 дв."),
    OTHER(16,"Другой");

    private final String bodyName;
    private final Integer id;

    BodyType(Integer id, String bodyName) {
        this.bodyName = bodyName;
        this.id = id;
    }

    public String getBodyName() {
        return this.bodyName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<BodyType> valueOf(int value) {
        return Arrays.stream(values())
            .filter(type -> type.id == value)
            .findFirst();
    }
}
