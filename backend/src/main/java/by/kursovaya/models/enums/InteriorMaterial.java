package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
public enum InteriorMaterial {
    GENUINE_LEATHER(0,"Натуральная кожа"),
    FAUX_LEATHER(1,"Искусственная кожа"),
    CLOTH(2,"Ткань"),
    VELOURS(3,"Велюр"),
    ALCANTARA(4,"Алькантара"),
    COMBINED(5,"Комбинированный");

    private final String materialName;
    private final Integer id;

    InteriorMaterial(Integer id, String materialName) {
        this.materialName = materialName;
        this.id = id;
    }

    public String getMaterialName() {
        return this.materialName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<InteriorMaterial> valueOf(int value) {
        return Arrays.stream(values())
            .filter(material -> material.id == value)
            .findFirst();
    }
}