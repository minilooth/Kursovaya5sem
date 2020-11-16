package by.kursovaya.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import by.kursovaya.models.Autodealer;
import by.kursovaya.models.Car;
import by.kursovaya.models.Deal;
import by.kursovaya.models.Role;
import by.kursovaya.models.User;
import by.kursovaya.models.enums.BodyColor;
import by.kursovaya.models.enums.BodyType;
import by.kursovaya.models.enums.EngineType;
import by.kursovaya.models.enums.InteriorColor;
import by.kursovaya.models.enums.InteriorMaterial;
import by.kursovaya.models.enums.RoleEnum;
import by.kursovaya.models.enums.TransmissionType;
import by.kursovaya.models.enums.WheelDriveType;
import by.kursovaya.payload.request.CarOrderRequest;
import by.kursovaya.payload.request.EditCarRequest;
import by.kursovaya.payload.request.NewCarRequest;
import by.kursovaya.payload.request.SetCarFilterRequest;
import by.kursovaya.payload.response.GetCarsResponse;
import by.kursovaya.payload.response.MessageResponse;
import by.kursovaya.security.services.UserDetailsImpl;
import by.kursovaya.services.AutodealerService;
import by.kursovaya.services.CarService;
import by.kursovaya.services.DealService;
import by.kursovaya.services.UserService;
import by.kursovaya.validators.ValidationResult;
import by.kursovaya.validators.Validator;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class CarController {
    private static final Logger logger = LoggerFactory.getLogger(CarController.class);

    @Autowired
    private CarService carService;

    @Autowired
    private AutodealerService autodealerService;

    @Autowired
    private UserService userService;

    @Autowired
    private DealService dealService;

    @PostMapping("/cars/getNotSoldCars")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getNotSoldCars(@RequestParam(required = true, value="autodealerId") Integer autodealerId, @RequestBody SetCarFilterRequest setCarFilterRequest, Model model) {
        logger.info("Get not sold cars request.");

        Autodealer autodealer = autodealerService.getAutodealer(autodealerId);

        if (autodealer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        List<Car> cars = carService.getCarsByAutodealerId(autodealer.getId()).stream().filter(c -> c.getIsSold().equals(Byte.parseByte("0"))).collect(Collectors.toList());
        Integer countOfCars = cars.size();
        Integer countOfTodayCars = cars.stream().filter(c -> c.getReceiptDate().isAfter(LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT))).collect(Collectors.toList()).size();

        if (setCarFilterRequest.getIsFilterModeEnabled()) {
            cars = carService.filterCars(cars, setCarFilterRequest);
        }

        cars.forEach(c -> c.setImage(carService.getCarImage(c.getImageName())));

        return ResponseEntity.status(HttpStatus.OK).body(new GetCarsResponse(cars, countOfCars, countOfTodayCars));
    }

    @GetMapping("/cars/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getCar(@PathVariable(value = "id") Integer id, @RequestParam(required = true, value="autodealerId") Integer autodealerId, Model model) {
        Autodealer autodealer = autodealerService.getAutodealer(autodealerId);

        if (autodealer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Автосалон не найден."));
        }
        
        Car car = carService.getCarById(id);

        if (car == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Role role = null;

        if (principal instanceof UserDetailsImpl) {
            String username = ((UserDetailsImpl)principal).getUsername();

            User user = userService.getUsers().stream().filter(u -> u.getUsername().equals(username)).findFirst().orElse(null);

            if (user != null) {
                role = user.getRoles().stream().filter(r -> r.getName() == RoleEnum.ADMIN).findFirst().orElse(null);
            }
        }

        if (role == null || role.getName() == RoleEnum.USER) {
            if (car.getIsSold() == 1) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Этот автомобиль уже продан или находится на стадии продажи."));
            }
        }

        car.setImage(carService.getCarImage(car.getImageName()));

        if (!car.getAutodealerId().equals(autodealer.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль не найден."));
        }

        return ResponseEntity.status(HttpStatus.OK).body(car);
    }

    @DeleteMapping("/admin/cars/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCar(@PathVariable(value = "id") Integer id, Model model) {
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию об автомобиле."));
        }

        Car car = carService.getCarById(id);

        if (car == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }

        carService.deleteCar(car);

        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Автомобиль успешно удален."));
    }

    @PatchMapping("/admin/cars/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editCar(@PathVariable(value = "id") Integer id, @RequestBody EditCarRequest editCarRequest, Model model) {
        if (editCarRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию об автомобиле."));
        }

        Autodealer autodealer = autodealerService.getAutodealer(editCarRequest.getAutodealerId());

        if (autodealer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Не удалось найти автосалон."));
        }

        Car car = carService.getCarById(id);

        if (car == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }
        if (car.getAutodealerId() != autodealer.getId()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]В текущем автосалоне нет такого автомобиля."));
        }

        ValidationResult validationResult = null;

        validationResult = Validator.isBrandValid(editCarRequest.getBrand());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isModelValid(editCarRequest.getModel());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isYearOfIssueValid(editCarRequest.getYearOfIssue());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isBodyTypeValid(editCarRequest.getBodyType());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isEngineVolumeValid(editCarRequest.getEngineVolume());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isEngineTypeValid(editCarRequest.getEngineType());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isTransmissionTypeValid(editCarRequest.getTransmissionType());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isWheelDriveTypeValid(editCarRequest.getWheelDriveType());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isMileageValid(editCarRequest.getMileage());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isBodyColorValid(editCarRequest.getBodyColor());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isInteriorMaterialValid(editCarRequest.getInteriorMaterial());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isInteriorColorValid(editCarRequest.getInteriorColor());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isPriceValid(editCarRequest.getPrice());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        try {
            car.setBrand(editCarRequest.getBrand());
            car.setModel(editCarRequest.getModel());
            car.setYearOfIssue(editCarRequest.getYearOfIssue());
            car.setBodyType(BodyType.valueOf(editCarRequest.getBodyType()).orElseThrow(() -> new IllegalArgumentException()));
            car.setEngineVolume(editCarRequest.getEngineVolume());
            car.setEngineType(EngineType.valueOf(editCarRequest.getEngineType()).orElseThrow(() -> new IllegalArgumentException()));
            car.setTransmissionType(TransmissionType.valueOf(editCarRequest.getTransmissionType()).orElseThrow(() -> new IllegalArgumentException()));
            car.setWheelDriveType(WheelDriveType.valueOf(editCarRequest.getWheelDriveType()).orElseThrow(() -> new IllegalArgumentException()));
            car.setMileage(editCarRequest.getMileage());
            car.setBodyColor(BodyColor.valueOf(editCarRequest.getBodyColor()).orElseThrow(() -> new IllegalArgumentException()));
            car.setInteriorColor(InteriorColor.valueOf(editCarRequest.getInteriorColor()).orElseThrow(() -> new IllegalArgumentException()));
            car.setInteriorMaterial(InteriorMaterial.valueOf(editCarRequest.getInteriorMaterial()).orElseThrow(() -> new IllegalArgumentException()));
            car.setPrice(editCarRequest.getPrice());
            car.setAutodealerId(autodealer.getId());

            if (editCarRequest.getImage() != null && !editCarRequest.getImage().isEmpty() && !editCarRequest.getImage().isBlank()){
                car.setImageName(carService.saveCarImage(editCarRequest.getImage()));
            }

            carService.update(car);

            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Автомобиль успешно изменен."));
        }
        catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(new MessageResponse("Что-то пошло не так :("));
        }
    }

    @PostMapping("/admin/cars/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addCar(@RequestBody NewCarRequest newCarRequest, Model model) {
        if (newCarRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию об автомобиле."));
        }

        Autodealer autodealer = autodealerService.getAutodealer(newCarRequest.getAutodealerId());

        if (autodealer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        ValidationResult validationResult = null;

        validationResult = Validator.isBrandValid(newCarRequest.getBrand());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isModelValid(newCarRequest.getModel());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isYearOfIssueValid(newCarRequest.getYearOfIssue());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isBodyTypeValid(newCarRequest.getBodyType());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isEngineVolumeValid(newCarRequest.getEngineVolume());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isEngineTypeValid(newCarRequest.getEngineType());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isTransmissionTypeValid(newCarRequest.getTransmissionType());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isWheelDriveTypeValid(newCarRequest.getWheelDriveType());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isMileageValid(newCarRequest.getMileage());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isBodyColorValid(newCarRequest.getBodyColor());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isInteriorMaterialValid(newCarRequest.getInteriorMaterial());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isInteriorColorValid(newCarRequest.getInteriorColor());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isPriceValid(newCarRequest.getPrice());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        try {
            Car newCar = new Car();

            newCar.setBrand(newCarRequest.getBrand());
            newCar.setModel(newCarRequest.getModel());
            newCar.setYearOfIssue(newCarRequest.getYearOfIssue());
            newCar.setBodyType(BodyType.valueOf(newCarRequest.getBodyType()).orElseThrow(() -> new IllegalArgumentException()));
            newCar.setEngineVolume(newCarRequest.getEngineVolume());
            newCar.setEngineType(EngineType.valueOf(newCarRequest.getEngineType()).orElseThrow(() -> new IllegalArgumentException()));
            newCar.setTransmissionType(TransmissionType.valueOf(newCarRequest.getTransmissionType()).orElseThrow(() -> new IllegalArgumentException()));
            newCar.setWheelDriveType(WheelDriveType.valueOf(newCarRequest.getWheelDriveType()).orElseThrow(() -> new IllegalArgumentException()));
            newCar.setMileage(newCarRequest.getMileage());
            newCar.setBodyColor(BodyColor.valueOf(newCarRequest.getBodyColor()).orElseThrow(() -> new IllegalArgumentException()));
            newCar.setInteriorColor(InteriorColor.valueOf(newCarRequest.getInteriorColor()).orElseThrow(() -> new IllegalArgumentException()));
            newCar.setInteriorMaterial(InteriorMaterial.valueOf(newCarRequest.getInteriorMaterial()).orElseThrow(() -> new IllegalArgumentException()));
            newCar.setPrice(newCarRequest.getPrice());
            newCar.setAutodealerId(autodealer.getId());
            newCar.setIsSold(Byte.parseByte("0"));
            newCar.setReceiptDate(LocalDateTime.now());
            newCar.setImageName(carService.saveCarImage(newCarRequest.getImage()));

            carService.add(newCar);

            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Автомобиль успешно добавлен."));
        }
        catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(new MessageResponse("Что-то пошло не так :("));
        }
    }

    @PostMapping("/cars/order")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> orderCar(@RequestBody CarOrderRequest carOrderRequest, Model model) {
        System.out.println(carOrderRequest);

        if (carOrderRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию об автомобиле или о пользователе."));
        }

        Car car = carService.getCarById(carOrderRequest.getCarId());

        if (car == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }

        User user = userService.findById(carOrderRequest.getUserId());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
        }

        car.setIsSold(Byte.parseByte("1"));

        carService.update(car);

        Deal deal = new Deal();
        deal.setAmount(car.getPrice());
        deal.setDate(new Date());
        deal.setIsConfirmed(Byte.parseByte("0"));
        deal.setCarId(car.getId());
        deal.setCar(car);
        deal.setUserId(user.getId());
        deal.setUser(user);

        dealService.add(deal);

        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Заявка успешно оставлена."));
    }
}
