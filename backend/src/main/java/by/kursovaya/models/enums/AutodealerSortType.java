package by.kursovaya.models.enums;

import java.util.Arrays;
import java.util.Optional;

public enum AutodealerSortType {
    WITHOUT_SORT(0, "Без сортировки"),
    ALPHABET(1, "По алфавиту"),
    ALPHABET_REVERSE(2, "По алфавиту в обратном порядке");

    private Integer id;
    private String sortName;

    AutodealerSortType(Integer id, String sortName) {
        this.sortName = sortName;
        this.id = id;
    }

    public String getSortName() {
        return this.sortName;
    }

    public Integer getId() {
        return this.id;
    }

    public static Optional<AutodealerSortType> valueOf(int value) {
        return Arrays.stream(values())
            .filter(type -> type.id == value)
            .findFirst();
    }
}
