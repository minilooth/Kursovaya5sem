package by.kursovaya.validators;

import by.kursovaya.models.enums.BodyColor;
import by.kursovaya.models.enums.BodyType;
import by.kursovaya.models.enums.EngineType;
import by.kursovaya.models.enums.InteriorColor;
import by.kursovaya.models.enums.InteriorMaterial;
import by.kursovaya.models.enums.TransmissionType;
import by.kursovaya.models.enums.WheelDriveType;
import by.kursovaya.utils.Utils;

public class Validator {
    public static ValidationResult isUsernameValid(String username) {
        if (username == null || username.isEmpty() || username.isBlank()) {
            return new ValidationResult(false, "Имя пользователя не может быть пустым.");
        }
        if (!username.matches("^[A-Za-z0-9_]+$")) {
            return new ValidationResult(false, "Имя пользователя должно состоять только из букв латинского алфавита, цифр и символа \"_\"."); 
        }
        if (username.length() < 5 || username.length() > 20) {
            return new ValidationResult(false, "Длина имени пользователя должна быть в диапазоне от 5 до 20 символов.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isPasswordValid(String password) {
        if (password == null || password.isEmpty() || password.isBlank()) {
            return new ValidationResult(false, "Пароль не может быть пустым.");
        }
        if (!password.matches("^[A-Za-z0-9!@#$%^&*]+$")) {
            return new ValidationResult(false, "Пароль может состоять только из букв латинского алфавита и символов !@#$%^&*."); 
        }
        if (password.length() < 6 || password.length() > 20) {
            return new ValidationResult(false, "Длина пароля должна быть в диапазоне от 6 до 20 символов.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isFirstnameValid(String firstname) {
        if (firstname == null || firstname.isEmpty() || firstname.isBlank()) {
            return new ValidationResult(false, "Имя не может быть пустым.");
        }
        if (!firstname.matches("^[A-Za-zА-Яа-я ]+$")) {
            return new ValidationResult(false, "Имя должно состоять только из букв и символа пробела.");
        }
        if (firstname.length() < 3 || firstname.length() > 20) {
            return new ValidationResult(false, "Длина имени должна находится в диапазоне от 3 до 20 символов.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isSurnameValid(String surname) {
        if (surname == null || surname.isEmpty() || surname.isBlank()) {
            return new ValidationResult(false, "Фамилия не может быть пустой.");
        }
        if (!surname.matches("^[A-Za-zА-Яа-я ]+$")) {
            return new ValidationResult(false, "Фамилия должна состоять только из букв и символа пробела.");
        }
        if (surname.length() < 3 || surname.length() > 20) {
            return new ValidationResult(false, "Длина фамилии должна быть в диапазоне от 3 до 20 символов.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isEmailValid(String email) {
        if (email == null || email.isEmpty() || email.isBlank()) {
            return new ValidationResult(false, "E-mail не может быть пустым.");
        }
        if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return new ValidationResult(false, "E-mail введен в некорректном формате."); 
        }
        if (email.length() < 10 || email.length() > 50) {
            return new ValidationResult(false, "Длина E-mail должна быть от 10 до 50 символов."); 
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isPhoneNumberValid(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty() || phoneNumber.isBlank()) {
            return new ValidationResult(false, "Мобильный телефон не может быть пустым.");
        }
        if (!phoneNumber.matches("^[+]{1}[3]{1}[7]{1}[5]{1}[(]{1}[0-9]{2}[)]{1}[-\\s/0-9]{9}$")) {
            return new ValidationResult(false, "Мобильный телефон должен соответствовать шаблону +375(12)345-67-89.");
        }
        if (phoneNumber.length() != 17) {
            return new ValidationResult(false, "Мобильный телефон должен быть длиной в 17 символов.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isBrandValid(String brand) {
        if (brand == null || brand.isEmpty() || brand.isBlank()) {
            return new ValidationResult(false, "Марка не может быть пуста.");
        }
        if (brand.length() < 2 || brand.length() > 25) {
            return new ValidationResult(false, "Длина марки должна быть между 2 и 25 символами.");
        }
        if (!brand.matches("^[A-Za-zА-Яа-я ]+$")) {
            return new ValidationResult(false, "Марка должна состоять только из букв и символа пробела.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isModelValid(String model) {
        if (model == null || model.isEmpty() || model.isBlank()) {
            return new ValidationResult(false, "Модель не может быть пуста.");
        }
        if (model.length() < 2|| model.length() > 25 ) {
            return new ValidationResult(false, "Длина модели должна быть между 2 и 25 символами.");
        }
        if (!model.matches("^[A-Za-zА-Яа-я0-9 -]+$")) {
            return new ValidationResult(false, "Марка должна состоять только из букв, цифр и символов ' -'");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isYearOfIssueValid(Integer yearOfIssue) {
        if (yearOfIssue == null) {
            return new ValidationResult(false, "Год выпуска не может быть пустым.");
        }
        if (yearOfIssue < 1975 || yearOfIssue > 2020) {
            return new ValidationResult(false, "Год выпуска должен быть между 1975 и 2020.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isBodyTypeValid(Integer bodyType) {
        if (bodyType == null) {
            return new ValidationResult(false, "Тип кузова не может быть пустым.");
        }
        if (bodyType < 0 || bodyType > BodyType.values().length) {
            return new ValidationResult(false, "Тип кузова не найден.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isEngineVolumeValid(Float engineVolume) {
        if (engineVolume == null) {
            return new ValidationResult(false, "Объем двигателя не может быть пустым.");
        }
        if (engineVolume < 0.8 || engineVolume > 7.0) {
            return new ValidationResult(false, "Объем двигателя должен быть между 0.8 л и 7.0 л.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isEngineTypeValid(Integer engineType) {
        if (engineType == null) {
            return new ValidationResult(false, "Тип кузова не может быть пустым.");
        }
        if (engineType < 0 || engineType > EngineType.values().length) {
            return new ValidationResult(false, "Тип двиигателя не найден.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isTransmissionTypeValid(Integer transmissionType) {
        if (transmissionType == null) {
            return new ValidationResult(false, "Коробка передач не может быть пуста.");
        }
        if (transmissionType < 0 || transmissionType > TransmissionType.values().length) {
            return new ValidationResult(false, "Коробка передач не найдена.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isWheelDriveTypeValid(Integer wheelDriveType) {
        if (wheelDriveType == null) {
            return new ValidationResult(false, "Привод не может быть пустым.");
        }
        if (wheelDriveType < 0 || wheelDriveType > WheelDriveType.values().length) {
            return new ValidationResult(false, "Привод не найден.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isMileageValid(Float mileage) {
        if (mileage == null) {
            return new ValidationResult(false, "Пробег не может быть пустым.");
        }
        if (mileage < 0f || mileage > 1000000f) {
            return new ValidationResult(false, "Пробег должен быть между 0 км и 1000000 км.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isBodyColorValid(Integer bodyColor) {
        if (bodyColor == null) {
            return new ValidationResult(false, "Цвет не может быть пустым.");
        }
        if (bodyColor < 0 || bodyColor > BodyColor.values().length) {
            return new ValidationResult(false, "Цвет не найден.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isInteriorMaterialValid(Integer interiorMaterial) {
        if (interiorMaterial == null) {
            return new ValidationResult(false, "Материал салона не может быть пустым.");
        }
        if (interiorMaterial < 0 || interiorMaterial > InteriorMaterial.values().length) {
            return new ValidationResult(false, "Материал салона не найден.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isInteriorColorValid(Integer interiorColor) {
        if (interiorColor == null) {
            return new ValidationResult(false, "Цвет салона не может быть пустым.");
        }
        if (interiorColor < 0 || interiorColor > InteriorColor.values().length) {
            return new ValidationResult(false, "Цвет салона не найден.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isPriceValid(Float price) {
        if (price == null) {
            return new ValidationResult(false, "Цена не может быть пуста.");
        }
        if (price < 1f || price > 1000000f) {
            return new ValidationResult(false, "Цена должна быть между 1 р. и 1000000 р.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isTitleValid(String title) {
        if (title == null || title.isEmpty() || title.isBlank()) {
            return new ValidationResult(false, "Название не может быть пусто.");
        }
        if (title.length() < 3 || title.length() > 100) {
            return new ValidationResult(false, "Длина названия должна быть в промежутке от 3 до 100 символов.");
        }
        if (!title.matches("^[A-Za-zА-Яа-я0-9 -,.()]+$")) {
            return new ValidationResult(false, "Название должно состоять только из букв, цифр и символов ' -,.()'.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isWorkingHoursValid(String workingHoursStart, String workingHoursEnd) {
        if (workingHoursStart == null || workingHoursStart.isEmpty() || workingHoursStart.isBlank()) {
            return new ValidationResult(false, "Начало работы некорректно.");
        }
        if (workingHoursEnd == null || workingHoursEnd.isEmpty() || workingHoursEnd.isBlank()) {
            return new ValidationResult(false, "Конец работы некорректно.");
        }
        if (Utils.compareTime(workingHoursStart, workingHoursEnd) != 1) {
            return new ValidationResult(false, "Время работы некорректно.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isCityValid(String city) {
        if (city == null || city.isEmpty() || city.isBlank()) {
            return new ValidationResult(false, "Город не может быть пустым.");
        }
        if (city.length() < 2 || city.length() > 50) {
            return new ValidationResult(false, "Длина города должна быть в промежутке от 2 до 50 символов.");
        }
        if (!city.matches("^[A-Za-zА-Яа-я- ]+$")) {
            return new ValidationResult(false, "Город должен состоять из букв и символов ' -'.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isAddressValid(String address) {
        if (address == null || address.isEmpty() || address.isBlank()) {
            return new ValidationResult(false, "Адрес не можеть пустым.");
        }
        if (address.length() < 4 || address.length() > 50) {
            return new ValidationResult(false, "Длина адреса должны быть в диапазоне от 4 до 50 символов.");
        }
        if (!address.matches("^[A-Za-zА-Яа-я0-9 .-]+$")) {
            return new ValidationResult(false, "Адрес должен состоять только из букв, цифр и символов ' .-'.");
        }
        return new ValidationResult(true, null);
    }

    public static ValidationResult isDescriptionValid(String description) {
        if (description == null || description.isEmpty() || description.isBlank()) {
            return new ValidationResult(false, "Описание не может быть пустым.");
        }
        return new ValidationResult(true, null);
    }

}
