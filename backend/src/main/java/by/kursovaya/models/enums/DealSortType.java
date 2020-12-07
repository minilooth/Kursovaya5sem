package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

public enum DealSortType {
    NEW_DEALS(0, "Новые сделки"),
    OLD_DEALS(1, "Старые сделки"),
    AMOUNT_DESC(2, "По сумме по убыванию"),
    AMOUNT_ASC(3, "По сумме по возрастанию");

    private Integer id;
    private String sortName;

    DealSortType(Integer id, String sortName) {
        this.sortName = sortName;
        this.id = id;
    }

    public String getSortName() {
        return this.sortName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<DealSortType> valueOf(int value) {
        return Arrays.stream(values())
            .filter(type -> type.id == value)
            .findFirst();
    }
}
