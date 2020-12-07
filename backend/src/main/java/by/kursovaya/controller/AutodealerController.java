package by.kursovaya.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import by.kursovaya.models.Autodealer;
import by.kursovaya.models.enums.AutodealerSortType;
import by.kursovaya.payload.request.EditAutodealerRequest;
import by.kursovaya.payload.request.NewAutodealerRequest;
import by.kursovaya.payload.response.MessageResponse;
import by.kursovaya.payload.response.SelectAutodealerResponse;
import by.kursovaya.services.AutodealerService;
import by.kursovaya.services.StatisticsService;
import by.kursovaya.validators.ValidationResult;
import by.kursovaya.validators.Validator;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class AutodealerController {
    private static final Logger logger = LoggerFactory.getLogger(AutodealerController.class);

    @Autowired
    private AutodealerService autodealerService;

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/autodealers/get")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getAll(@RequestParam(required = false, value = "searchTitle") String searchTitle, @RequestParam(required = false, value="sortType") Integer autodealerSortType, Model model) {
        logger.info("Get all autodealers request.");

        List<Autodealer> autodealers = autodealerService.get(); 
        
        autodealers = autodealerService.search(autodealers, searchTitle);
        autodealers = autodealerService.sort(autodealers, AutodealerSortType.valueOf(autodealerSortType).orElse(null));

        logger.info("Response all autodealers.");
        return ResponseEntity.status(HttpStatus.OK).body(autodealers);
    }

    @GetMapping("/autodealers/select")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> selectAutodealer(@RequestParam(required = true, value = "id") Integer id, Model model) {
        logger.info("Select autodealer request.");

        Autodealer autodealer = autodealerService.get(id);

        if (autodealer == null) {
            logger.warn("Autodealer not found.");
            return ResponseEntity.badRequest().body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        statisticsService.addVisitToAutodealer(autodealer);

        logger.info("Responsed select autodealer id.");
        return ResponseEntity.ok(new SelectAutodealerResponse(autodealer.getId()));
    }

    @GetMapping("/autodealers/get/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getAutodealer(@PathVariable(value = "id") Integer id, Model model) {
        logger.info("Get autodealer request.");

        Autodealer autodealer = autodealerService.get(id);

        if (autodealer == null) {
            logger.warn("Autodealer not found.");
            return ResponseEntity.badRequest().body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        logger.info("Responsed autodealer.");
        return ResponseEntity.ok().body(autodealer);
    }

    @DeleteMapping("/admin/autodealers/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAutodealer(@PathVariable(value = "id") Integer id, @RequestParam(value = "currentAutodealerId", required = false) Integer currentAutodealerId) {
        logger.info("Delete autodealer request.");

        Autodealer deleteAutodealer = autodealerService.get(id);

        if (deleteAutodealer == null) {
            logger.warn("Autodealer not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        if (currentAutodealerId != null) {
            Autodealer currentAutodealer = autodealerService.get(currentAutodealerId);

            if (currentAutodealer == null) {
                logger.warn("Current autodealer not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Текущий автосалон не найден."));
            }

            if (currentAutodealer.getId() == deleteAutodealer.getId()) {
                logger.warn("Unable delete current autodealer.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Невозможно удалить текущий автосалон."));
            }
        }

        if (deleteAutodealer.getCars().size() != 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Невозможно удалить данный автосалон пока в нем есть автомобили."));
        }

        autodealerService.delete(deleteAutodealer);

        logger.info("Responsed successfully delete autodealer message.");
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Автосалон успешно удален."));
    }

    @PatchMapping("/admin/autodealers/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editAutodealer(@PathVariable(value = "id") Integer id, @RequestBody EditAutodealerRequest editAutodealerRequest, Model model) {
        logger.info("Edit autodealer request.");

        Autodealer autodealer = autodealerService.get(id);

        if (autodealer == null) {
            logger.warn("Autodealer not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        Validator validator = Validator.getInstance();
        ValidationResult validationResult = null;

        validationResult = validator.isTitleValid(editAutodealerRequest.getTitle());
        if (!validationResult.getIsValid()) {
            logger.warn("Title is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isWorkingHoursValid(editAutodealerRequest.getWorkingHoursStart(), editAutodealerRequest.getWorkingHoursEnd());
        if (!validationResult.getIsValid()) {
            logger.warn("Working hours is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isCityValid(editAutodealerRequest.getCity());
        if (!validationResult.getIsValid()) {
            logger.warn("City is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isAddressValid(editAutodealerRequest.getAddress());
        if (!validationResult.getIsValid()) {
            logger.warn("Address is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isDescriptionValid(editAutodealerRequest.getDescription());
        if (!validationResult.getIsValid()) {
            logger.warn("Description is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        autodealer.setTitle(editAutodealerRequest.getTitle());
        autodealer.setWorkingHours(editAutodealerRequest.getWorkingHoursStart() + "-" + editAutodealerRequest.getWorkingHoursEnd());
        autodealer.setCity(editAutodealerRequest.getCity());
        autodealer.setAddress(editAutodealerRequest.getAddress());
        autodealer.setDescription(editAutodealerRequest.getDescription());

        autodealerService.update(autodealer);

        logger.info("Responsed successfully edit autodealer message.");
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Автосалон успешно изменен."));
    }

    @PostMapping("/admin/autodealers/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addAutodealer(@RequestBody NewAutodealerRequest newAutodealerRequest, Model model) {
        logger.info("Add autodealer request.");

        Validator validator = Validator.getInstance();
        ValidationResult validationResult = null;

        validationResult = validator.isTitleValid(newAutodealerRequest.getTitle());
        if (!validationResult.getIsValid()) {
            logger.warn("Title is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isWorkingHoursValid(newAutodealerRequest.getWorkingHoursStart(), newAutodealerRequest.getWorkingHoursEnd());
        if (!validationResult.getIsValid()) {
            logger.warn("Working hours is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isCityValid(newAutodealerRequest.getCity());
        if (!validationResult.getIsValid()) {
            logger.warn("City is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isAddressValid(newAutodealerRequest.getAddress());
        if (!validationResult.getIsValid()) {
            logger.warn("Address is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isDescriptionValid(newAutodealerRequest.getDescription());
        if (!validationResult.getIsValid()) {
            logger.warn("Description is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        Autodealer autodealer = new Autodealer();

        autodealer.setTitle(newAutodealerRequest.getTitle());
        autodealer.setWorkingHours(newAutodealerRequest.getWorkingHoursStart() + "-" + newAutodealerRequest.getWorkingHoursEnd());
        autodealer.setCity(newAutodealerRequest.getCity());
        autodealer.setAddress(newAutodealerRequest.getAddress());
        autodealer.setDescription(newAutodealerRequest.getDescription());

        autodealerService.add(autodealer);

        logger.info("Reponsed successfully add autodealer message.");
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Автосалон успешно добавлен."));
    }
}
