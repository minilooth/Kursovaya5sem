package by.kursovaya.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
import by.kursovaya.models.User;
import by.kursovaya.models.enums.UserCarsListSortType;
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

    @PostMapping("/cars/get")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getCars(@RequestParam(required = true, value="autodealerId") Integer autodealerId, @RequestBody SetCarFilterRequest setCarFilterRequest, Model model) {
        logger.info("Get not sold cars request.");

        Autodealer autodealer = autodealerService.get(autodealerId);

        if (autodealer == null) {
            logger.warn("Current autodealer not found.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        List<Car> cars = null;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            cars = carService.getCarsByAutodealerId(autodealer.getId());            
        }
        else {
            cars = carService.getCarsByAutodealerId(autodealer.getId()).stream().filter(c -> c.getIsSold() == false).collect(Collectors.toList());
        }

        Integer countOfCars = cars.size();
        Integer countOfTodayCars = cars.stream().filter(c -> c.getReceiptDate().isAfter(LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT))).collect(Collectors.toList()).size();

        if (setCarFilterRequest.getIsFilterModeEnabled()) {
            cars = carService.filterCars(cars, setCarFilterRequest);
        }

        cars = carService.sortCars(cars, setCarFilterRequest.getSortType());

        cars.forEach(c -> c.setImage(carService.getCarImage(c.getImageName())));

        logger.info("Responsed cars, count of cars and count of today added cars.");
        return ResponseEntity.status(HttpStatus.OK).body(new GetCarsResponse(cars, countOfCars, countOfTodayCars));
    }

    @GetMapping("/cars/get/notSoldCars")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getNotSoldCars(@RequestParam(value = "autodealerId", required = true) Integer autodealerId, Model model) {
        Autodealer autodealer = autodealerService.get(autodealerId);

        if (autodealer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }
        
        List<Car> cars = carService.getCarsByAutodealerId(autodealerId);

        cars = cars.stream().filter(c -> c.getIsSold() == false).collect(Collectors.toList());

        cars.forEach(c -> c.setImage(carService.getCarImage(c.getImageName())));

        return ResponseEntity.status(HttpStatus.OK).body(cars);
    }

    @GetMapping("/cars/get/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> getUsersCars(@RequestParam(required = true, value="searchBrand") String searchBrand, @RequestParam(required = true, value="userCarsListSortType") Integer userCarsListSortType, Model model) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = principal instanceof UserDetailsImpl ? userService.getUsers().stream().filter(u -> u.getUsername().equals(((UserDetailsImpl)principal).getUsername())).findFirst().orElse(null) : null;
        
        List<Car> cars = new ArrayList<>();
        List<Deal> deals = dealService.get().stream().filter(d -> d.getUser().getId() == user.getId() && d.getIsConfirmed()).collect(Collectors.toList());

        for (Deal deal : deals) {
            cars.add(deal.getCar());
        }

        cars.forEach(c -> c.setImage(carService.getCarImage(c.getImageName())));

        if (searchBrand != null && !searchBrand.isEmpty() && !searchBrand.isBlank()) {
            cars = cars.stream().filter(c -> c.getBrand().startsWith(searchBrand)).collect(Collectors.toList());
        }

        cars = carService.sortUserCars(cars, UserCarsListSortType.valueOf(userCarsListSortType).orElse(null));
        

        return ResponseEntity.status(HttpStatus.OK).body(cars);
    }

    @GetMapping("/cars/get/notSoldAndCurrentDealCar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getNotSoldCarsAndCurrentDealCar(@RequestParam(required = true, value="autodealerId") Integer autodealerId, @RequestParam(required = true, value = "carId") Integer carId, Model model) {
        logger.info("Get not sold cars and current deal car request.");

        Autodealer autodealer = autodealerService.get(autodealerId);

        if (autodealer == null) {
            logger.info("Current autodealer not found.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        List<Car> cars = carService.getCarsByAutodealerId(autodealer.getId()).stream().filter(c -> c.getIsSold() == false || c.getId() == carId).collect(Collectors.toList());

        cars.forEach(c -> c.setImage(carService.getCarImage(c.getImageName())));

        logger.info("Responsed not sold cars and current deal car.");
        return ResponseEntity.status(HttpStatus.OK).body(cars);
    }

    @GetMapping("/cars/get/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getCar(@PathVariable(value = "id") Integer id, @RequestParam(required = true, value="autodealerId") Integer autodealerId, Model model) {
        logger.info("Get car request with id: " + autodealerId);
        
        Autodealer autodealer = autodealerService.get(autodealerId);
        Car car = carService.getCarById(id);

        if (autodealer == null) {
            logger.warn("Current autodealer not found.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }
        if (car == null) {
            logger.warn("Car not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("USER"))) {
            if (car.getIsSold() == true) {
                logger.warn("This car is sold or at sale stage.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Этот автомобиль уже продан или находится на стадии продажи."));
            }
        }

        if (!car.getAutodealer().getId().equals(autodealer.getId())) {
            logger.warn("Car not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль не найден."));
        }

        car.setImage(carService.getCarImage(car.getImageName()));

        logger.info("Responsed car.");
        return ResponseEntity.status(HttpStatus.OK).body(car);
    }

    @DeleteMapping("/admin/cars/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCar(@PathVariable(value = "id", required = true) Integer id, Model model) {
        logger.info("Delete car request.");

        Car car = carService.getCarById(id);

        if (car == null) {
            logger.info("Car not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }

        carService.deleteCar(car);

        logger.info("Responsed successfully delete car message.");
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Автомобиль успешно удален."));
    }

    @PatchMapping("/admin/cars/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editCar(@PathVariable(value = "id", required = true) Integer id, @RequestBody EditCarRequest editCarRequest, Model model) {
        logger.info("Edit car request.");

        if (editCarRequest.getAutodealerId() == null) {
            logger.warn("Unable to get car data.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию об автосалоне."));
        }
        if (editCarRequest.getId() == null) {
            logger.warn("Unable to get car data.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию об автомобиле."));
        }

        Autodealer autodealer = autodealerService.get(editCarRequest.getAutodealerId());
        Car car = carService.getCarById(id);

        if (autodealer == null) {
            logger.warn("Autodealer not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Не удалось найти автосалон."));
        }
        if (car == null) {
            logger.warn("Car not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }
        if (car.getAutodealer().getId() != autodealer.getId()) {
            logger.warn("This autodealer haven't this car.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]В текущем автосалоне нет такого автомобиля."));
        }

        Validator validator = Validator.getInstance();
        ValidationResult validationResult = null;

        validationResult = validator.isBrandValid(editCarRequest.getBrand());
        if (!validationResult.getIsValid()) {
            logger.warn("Brand is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isModelValid(editCarRequest.getModel());
        if (!validationResult.getIsValid()) {
            logger.warn("Model is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isYearOfIssueValid(editCarRequest.getYearOfIssue());
        if (!validationResult.getIsValid()) {
            logger.warn("Year of issue is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isBodyTypeValid(editCarRequest.getBodyType());
        if (!validationResult.getIsValid()) {
            logger.warn("Body type is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isEngineVolumeValid(editCarRequest.getEngineVolume());
        if (!validationResult.getIsValid()) {
            logger.warn("Engine volume is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isEngineTypeValid(editCarRequest.getEngineType());
        if (!validationResult.getIsValid()) {
            logger.warn("Engine type is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isTransmissionTypeValid(editCarRequest.getTransmissionType());
        if (!validationResult.getIsValid()) {
            logger.warn("Transmission type is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isWheelDriveTypeValid(editCarRequest.getWheelDriveType());
        if (!validationResult.getIsValid()) {
            logger.warn("Wheel drive type is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isMileageValid(editCarRequest.getMileage());
        if (!validationResult.getIsValid()) {
            logger.warn("Mileage is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isBodyColorValid(editCarRequest.getBodyColor());
        if (!validationResult.getIsValid()) {
            logger.warn("Body color is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isInteriorMaterialValid(editCarRequest.getInteriorMaterial());
        if (!validationResult.getIsValid()) {
            logger.warn("Interior material is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isInteriorColorValid(editCarRequest.getInteriorColor());
        if (!validationResult.getIsValid()) {
            logger.warn("Interior color is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isPriceValid(editCarRequest.getPrice());
        if (!validationResult.getIsValid()) {
            logger.warn("Price is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        car.setBrand(editCarRequest.getBrand());
        car.setModel(editCarRequest.getModel());
        car.setYearOfIssue(editCarRequest.getYearOfIssue());
        car.setBodyType(editCarRequest.getBodyType());
        car.setEngineVolume(editCarRequest.getEngineVolume());
        car.setEngineType(editCarRequest.getEngineType());
        car.setTransmissionType(editCarRequest.getTransmissionType());
        car.setWheelDriveType(editCarRequest.getWheelDriveType());
        car.setMileage(editCarRequest.getMileage());
        car.setBodyColor(editCarRequest.getBodyColor());
        car.setInteriorColor(editCarRequest.getInteriorColor());
        car.setInteriorMaterial(editCarRequest.getInteriorMaterial());
        car.setPrice(editCarRequest.getPrice());
        car.setAutodealer(autodealer);

        if (editCarRequest.getImage() != null && !editCarRequest.getImage().isEmpty() && !editCarRequest.getImage().isBlank()){
            car.setImageName(carService.saveCarImage(editCarRequest.getImage()));
        }

        carService.update(car);

        logger.info("Responsed succesufully add car message.");
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Автомобиль успешно изменен."));
    }

    @PostMapping("/admin/cars/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addCar(@RequestBody NewCarRequest newCarRequest, Model model) {
        logger.info("Add car request.");

        Autodealer autodealer = autodealerService.get(newCarRequest.getAutodealerId());

        if (autodealer == null) {
            logger.warn("Autodealer not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        Validator validator = Validator.getInstance();
        ValidationResult validationResult = null;

        validationResult = validator.isBrandValid(newCarRequest.getBrand());
        if (!validationResult.getIsValid()) {
            logger.warn("Brand is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isModelValid(newCarRequest.getModel());
        if (!validationResult.getIsValid()) {
            logger.warn("Model is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isYearOfIssueValid(newCarRequest.getYearOfIssue());
        if (!validationResult.getIsValid()) {
            logger.warn("Year of issue is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isBodyTypeValid(newCarRequest.getBodyType());
        if (!validationResult.getIsValid()) {
            logger.warn("Body type is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isEngineVolumeValid(newCarRequest.getEngineVolume());
        if (!validationResult.getIsValid()) {
            logger.warn("Engine volume is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isEngineTypeValid(newCarRequest.getEngineType());
        if (!validationResult.getIsValid()) {
            logger.warn("Engine type is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isTransmissionTypeValid(newCarRequest.getTransmissionType());
        if (!validationResult.getIsValid()) {
            logger.warn("Transmission type is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isWheelDriveTypeValid(newCarRequest.getWheelDriveType());
        if (!validationResult.getIsValid()) {
            logger.warn("Wheel drive type is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isMileageValid(newCarRequest.getMileage());
        if (!validationResult.getIsValid()) {
            logger.warn("Mileage is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isBodyColorValid(newCarRequest.getBodyColor());
        if (!validationResult.getIsValid()) {
            logger.warn("Body color is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isInteriorMaterialValid(newCarRequest.getInteriorMaterial());
        if (!validationResult.getIsValid()) {
            logger.warn("Interior material is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isInteriorColorValid(newCarRequest.getInteriorColor());
        if (!validationResult.getIsValid()) {
            logger.warn("Interior color is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isPriceValid(newCarRequest.getPrice());
        if (!validationResult.getIsValid()) {
            logger.warn("Price is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        Car newCar = new Car();

        newCar.setBrand(newCarRequest.getBrand());
        newCar.setModel(newCarRequest.getModel());
        newCar.setYearOfIssue(newCarRequest.getYearOfIssue());
        newCar.setBodyType(newCarRequest.getBodyType());
        newCar.setEngineVolume(newCarRequest.getEngineVolume());
        newCar.setEngineType(newCarRequest.getEngineType());
        newCar.setTransmissionType(newCarRequest.getTransmissionType());
        newCar.setWheelDriveType(newCarRequest.getWheelDriveType());
        newCar.setMileage(newCarRequest.getMileage());
        newCar.setBodyColor(newCarRequest.getBodyColor());
        newCar.setInteriorColor(newCarRequest.getInteriorColor());
        newCar.setInteriorMaterial(newCarRequest.getInteriorMaterial());
        newCar.setPrice(newCarRequest.getPrice());
        newCar.setAutodealer(autodealer);
        newCar.setIsSold(false);
        newCar.setReceiptDate(LocalDateTime.now());
        newCar.setImageName(carService.saveCarImage(newCarRequest.getImage()));

        carService.add(newCar);

        logger.info("Responsed successfully add car message.");
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Автомобиль успешно добавлен."));
    }

    @PostMapping("/cars/order")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> orderCar(@RequestParam(value = "carId", required = true) Integer carId, Model model) {
        logger.info("Order car request.");

        Car car = carService.getCarById(carId);

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = principal instanceof UserDetailsImpl ? userService.getUsers().stream().filter(u -> u.getUsername().equals(((UserDetailsImpl)principal).getUsername())).findFirst().orElse(null) : null;
        
        if (car == null) {
            logger.warn("Car not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }
        if (user == null) {
            logger.warn("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
        }

        car.setIsSold(true);

        carService.update(car);

        Deal deal = new Deal();
        deal.setAmount(car.getPrice());
        deal.setDate(new Date());
        deal.setIsConfirmed(false);
        deal.setCar(car);
        deal.setUser(user);

        dealService.add(deal);

        logger.info("Responsed successfully order car message.");
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Заявка успешно оставлена."));
    }
}
