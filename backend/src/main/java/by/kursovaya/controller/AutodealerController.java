package by.kursovaya.controller;

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

import by.kursovaya.models.Autodealer;
import by.kursovaya.payload.request.EditAutodealerRequest;
import by.kursovaya.payload.request.NewAutodealerRequest;
import by.kursovaya.payload.response.MessageResponse;
import by.kursovaya.payload.response.SelectAutodealerResponse;
import by.kursovaya.services.AutodealerService;
import by.kursovaya.validators.ValidationResult;
import by.kursovaya.validators.Validator;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class AutodealerController {
    @Autowired
    private AutodealerService autodealerService;

    @GetMapping("/autodealers/list")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<Autodealer> getAutodealers(@RequestParam(required = false, value = "searchTitle") String searchTitle, Model model) {
        if (searchTitle != null && !searchTitle.isEmpty() && !searchTitle.isBlank()) {
            return autodealerService.getAutodealers().stream().filter(a -> a.getTitle().startsWith(searchTitle)).collect(Collectors.toList());
        }
        return autodealerService.getAutodealers();
    }

    @GetMapping("/autodealers/select")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> selectAutodealer(@RequestParam(required = true, value = "id") Integer id, Model model) {
        Autodealer autodealer = autodealerService.getAutodealer(id);

        if (autodealer == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }
        return ResponseEntity.ok(new SelectAutodealerResponse(autodealer.getId()));
    }

    @GetMapping("/autodealers/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getAutodealer(@PathVariable(value = "id") Integer id, Model model) {
        Autodealer autodealer = autodealerService.getAutodealer(id);

        if (autodealer == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }
        return ResponseEntity.ok().body(autodealer);
    }

    @DeleteMapping("/admin/autodealers/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAutodealer(@PathVariable(value = "id") Integer id, @RequestParam(value = "currentAutodealerId", required = false) Integer currentAutodealerId) {
        Autodealer deleteAutodealer = autodealerService.getAutodealer(id);

        if (deleteAutodealer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        if (currentAutodealerId != null) {
            Autodealer currentAutodealer = autodealerService.getAutodealer(currentAutodealerId);

            if (currentAutodealer == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Текущий автосалон не найден."));
            }

            if (currentAutodealer.getId() == deleteAutodealer.getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Невозможно удалить текущий автосалон."));
            }
        }

        autodealerService.delete(deleteAutodealer);

        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Автосалон успешно удален."));
    }

    @PatchMapping("/admin/autodealers/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editAutodealer(@PathVariable(value = "id") Integer id, @RequestBody EditAutodealerRequest editAutodealerRequest, Model model) {
        if (editAutodealerRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию об автосалоне."));
        }

        Autodealer autodealer = autodealerService.getAutodealer(id);

        if (autodealer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        ValidationResult validationResult = null;

        validationResult = Validator.isTitleValid(editAutodealerRequest.getTitle());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isWorkingHoursValid(editAutodealerRequest.getWorkingHoursStart(), editAutodealerRequest.getWorkingHoursEnd());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isCityValid(editAutodealerRequest.getCity());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isAddressValid(editAutodealerRequest.getAddress());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isDescriptionValid(editAutodealerRequest.getDescription());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        autodealer.setTitle(editAutodealerRequest.getTitle());
        autodealer.setWorkingHours(editAutodealerRequest.getWorkingHoursStart() + "-" + editAutodealerRequest.getWorkingHoursEnd());
        autodealer.setCity(editAutodealerRequest.getCity());
        autodealer.setAddress(editAutodealerRequest.getAddress());
        autodealer.setDescription(editAutodealerRequest.getDescription());

        autodealerService.update(autodealer);

        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Автосалон успешно изменен."));
    }

    @PostMapping("/admin/autodealers/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addAutodealer(@RequestBody NewAutodealerRequest newAutodealerRequest, Model model) {
        if (newAutodealerRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить информацию об автосалоне."));
        }

        ValidationResult validationResult = null;

        validationResult = Validator.isTitleValid(newAutodealerRequest.getTitle());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isWorkingHoursValid(newAutodealerRequest.getWorkingHoursStart(), newAutodealerRequest.getWorkingHoursEnd());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isCityValid(newAutodealerRequest.getCity());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isAddressValid(newAutodealerRequest.getAddress());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = Validator.isDescriptionValid(newAutodealerRequest.getDescription());
        if (!validationResult.getIsValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        Autodealer autodealer = new Autodealer();

        autodealer.setTitle(newAutodealerRequest.getTitle());
        autodealer.setWorkingHours(newAutodealerRequest.getWorkingHoursStart() + "-" + newAutodealerRequest.getWorkingHoursEnd());
        autodealer.setCity(newAutodealerRequest.getCity());
        autodealer.setAddress(newAutodealerRequest.getAddress());
        autodealer.setDescription(newAutodealerRequest.getDescription());

        autodealerService.add(autodealer);

        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Автосалон успешно добавлен."));
    }
}
