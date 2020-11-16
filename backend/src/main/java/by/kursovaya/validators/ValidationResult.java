package by.kursovaya.validators;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidationResult {
    private Boolean isValid;
    private String message;
}
