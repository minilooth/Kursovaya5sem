package by.kursovaya.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import by.kursovaya.models.Car;
import by.kursovaya.models.Deal;
import by.kursovaya.models.User;
import by.kursovaya.models.enums.DealSortType;
import by.kursovaya.payload.request.EditDealRequest;
import by.kursovaya.payload.request.NewDealRequest;
import by.kursovaya.payload.response.ConfirmDealResponse;
import by.kursovaya.payload.response.DealResponse;
import by.kursovaya.payload.response.MessageResponse;
import by.kursovaya.services.CarService;
import by.kursovaya.services.DealService;
import by.kursovaya.services.StatisticsService;
import by.kursovaya.services.UserService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin/deals")
public class DealController {
    @Autowired
    private DealService dealService;

    @Autowired
    private CarService carService;

    @Autowired
    private UserService userService;

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/get")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDeals(@RequestParam(value = "searchUsername", required = false) String searchUsername, @RequestParam(value="sortType") Integer dealSortType, Model model) {
        List<Deal> deals = dealService.get();

        if (searchUsername != null && !searchUsername.isEmpty() && !searchUsername.isBlank()) {
            deals = deals.stream().filter(d -> d.getUser().getUsername().startsWith(searchUsername)).collect(Collectors.toList());
        }

        List<DealResponse> dealResponses = new ArrayList<>();

        for(Deal deal : deals) {
            DealResponse dealResponse = new DealResponse();

            dealResponse.setId(deal.getId());
            dealResponse.setImage(carService.getCarImage(deal.getCar().getImageName()));
            dealResponse.setAmount(deal.getAmount());
            dealResponse.setDate(deal.getDate());
            dealResponse.setIsConfirmed(deal.getIsConfirmed());
            dealResponse.setUsername(deal.getUser().getUsername());
            dealResponse.setUserId(deal.getUser().getId());
            dealResponse.setBrand(deal.getCar().getBrand());
            dealResponse.setModel(deal.getCar().getModel());
            dealResponse.setCarId(deal.getCar().getId());
            dealResponse.setYearOfIssue(deal.getCar().getYearOfIssue());
            dealResponse.setEngineVolume(deal.getCar().getEngineVolume());
            dealResponse.setEngineType(deal.getCar().getEngineType());
            dealResponse.setTransmissionType(deal.getCar().getTransmissionType());
            dealResponse.setBodyType(deal.getCar().getBodyType());
            dealResponse.setWheelDriveType(deal.getCar().getWheelDriveType());

            dealResponses.add(dealResponse);
        }

        dealResponses = dealService.sort(dealResponses, DealSortType.valueOf(dealSortType).orElse(null));

        return ResponseEntity.status(HttpStatus.OK).body(dealResponses);
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> get(@PathVariable(value = "id") Integer id, Model model) {
        Deal deal = dealService.get(id);

        if (deal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Сделка с таким id не найдена."));
        }

        DealResponse dealResponse = new DealResponse();

        dealResponse.setId(deal.getId());
        dealResponse.setImage(carService.getCarImage(deal.getCar().getImageName()));
        dealResponse.setAmount(deal.getAmount());
        dealResponse.setDate(deal.getDate());
        dealResponse.setIsConfirmed(deal.getIsConfirmed());
        dealResponse.setUsername(deal.getUser().getUsername());
        dealResponse.setUserId(deal.getUser().getId());
        dealResponse.setBrand(deal.getCar().getBrand());
        dealResponse.setModel(deal.getCar().getModel());
        dealResponse.setCarId(deal.getCar().getId());
        dealResponse.setYearOfIssue(deal.getCar().getYearOfIssue());
        dealResponse.setEngineVolume(deal.getCar().getEngineVolume());
        dealResponse.setEngineType(deal.getCar().getEngineType());
        dealResponse.setTransmissionType(deal.getCar().getTransmissionType());
        dealResponse.setBodyType(deal.getCar().getBodyType());
        dealResponse.setWheelDriveType(deal.getCar().getWheelDriveType());

        return ResponseEntity.status(HttpStatus.OK).body(dealResponse);
    }

    @PatchMapping("/confirm/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> confirmDeal(@PathVariable(value = "id") Integer id, Model model) {
        Deal deal = dealService.get(id);

        if (deal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Сделка с таким id не найдена."));
        }

        if (deal.getIsConfirmed() == true) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Сделка уже подтверждена."));
        }

        deal.setIsConfirmed(true);

        dealService.update(deal);

        statisticsService.addSaleToStatistics(deal.getCar(), deal.getCar().getAutodealer());

        ConfirmDealResponse confirmDealResponse = new ConfirmDealResponse();

        confirmDealResponse.setMessage("Сделка успешно подтверждена.");
        confirmDealResponse.setCheck(dealService.generateCheck(deal));

        return ResponseEntity.status(HttpStatus.OK).body(confirmDealResponse);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDeal(@PathVariable(value = "id") Integer id, Model model) {
        Deal deal = dealService.get(id);

        if (deal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Сделка с таким id не найдена."));
        }

        if (deal.getIsConfirmed() == true) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Невозможно удалить подтвержденную сделку."));
        }

        Car car = deal.getCar();

        car.setIsSold(false);

        carService.update(car);

        dealService.delete(deal);

        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Сделка успешно удалена."));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addDeal(@RequestBody NewDealRequest newDealRequest, Model model) {
        if (newDealRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить данные сделки."));
        }

        User user = userService.getUsers().stream().filter(u -> u.getId() == newDealRequest.getUserId()).findFirst().orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
        }

        Car car = carService.getCarById(newDealRequest.getCarId());

        if (car == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }

        Deal deal = dealService.get().stream().filter(d -> d.getCar().getId() == newDealRequest.getCarId()).findFirst().orElse(null);

        if (deal != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Сделка с этим автомобилем уже создана."));
        }

        car.setIsSold(true);

        carService.update(car);

        Deal newDeal = new Deal();

        newDeal.setUser(user);
        newDeal.setCar(car);
        newDeal.setAmount(car.getPrice());
        newDeal.setIsConfirmed(false);
        newDeal.setDate(new Date());

        dealService.add(newDeal);

        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Сделка успешно добавлена."));
    }

    @PostMapping("/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editDeal(@PathVariable(value = "id") Integer id, @RequestBody EditDealRequest editDealRequest, Model model) {
        if (editDealRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию о сделке."));
        }

        Deal deal = dealService.get(id);

        if (deal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Сделка с таким id не найдена."));
        }

        Car car = carService.getCarById(editDealRequest.getCarId());

        if (car == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автомобиль с таким id не найден."));
        }

        User user = userService.findById(editDealRequest.getUserId());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
        }

        Car oldCar = deal.getCar();

        oldCar.setIsSold(false);
        car.setIsSold(true);

        carService.update(oldCar);
        carService.update(car);

        deal.setCar(car);
        deal.setUser(user);
        deal.setAmount(car.getPrice());
        
        dealService.update(deal);

        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Сделка успешно изменена."));
    }
}
