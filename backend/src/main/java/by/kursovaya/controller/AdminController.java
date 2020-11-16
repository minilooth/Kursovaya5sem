package by.kursovaya.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import by.kursovaya.models.Role;
import by.kursovaya.models.User;
import by.kursovaya.models.enums.RoleEnum;
import by.kursovaya.payload.request.EditUserRequest;
import by.kursovaya.payload.request.NewUserRequest;
import by.kursovaya.payload.response.MessageResponse;
import by.kursovaya.services.RoleService;
import by.kursovaya.services.UserService;
import by.kursovaya.validators.ValidationResult;
import by.kursovaya.validators.Validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/admin/users/getAllUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false, value = "searchUsername") String searchUsername, Model model) {
        if (searchUsername != null && !searchUsername.isEmpty() && !searchUsername.isBlank()) {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUsers().stream().filter(u -> u.getUsername().startsWith(searchUsername)).collect(Collectors.toList()));
        }
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUsers());
    }

    @GetMapping("/admin/users/getUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsers(Model model) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUsers().stream().filter(u -> List.copyOf(u.getRoles()).stream().filter(r -> r.getName() == RoleEnum.USER).findFirst().orElse(null) != null).collect(Collectors.toList()));
    }

    @GetMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUser(@PathVariable(value = "id") Integer id, Model model) {
        User user = userService.findById(id);

        if (user != null) {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
    }

    @DeleteMapping("/admin/users/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable(value = "id") Integer id, Model model) {
        User user = userService.findById(id);

        if (user != null) {
            userService.deleteUser(user);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Пользователь успешно удален."));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
    }

    @PatchMapping("/admin/users/lock/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> lockUser(@PathVariable(value = "id") Integer id, Model model) {
        User user = userService.findById(id);

        if (user != null) {
            user.setIsAccountNonLocked(user.getIsAccountNonLocked().equals(Byte.parseByte("1")) ? Byte.parseByte("0") : Byte.parseByte("1"));
            userService.update(user);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse(user.getIsAccountNonLocked().equals(Byte.parseByte("0")) ? "Пользователь успешно заблокирован." : "Пользователь успешно разблокирован."));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]: Пользователь с таким id не найден!"));
    }

    @PostMapping("/admin/users/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUser(@RequestBody NewUserRequest newUserRequest, Model model) {
        if (newUserRequest != null) {
            if (!userService.existsByUsername(newUserRequest.getUsername())) {
                ValidationResult validationResult = null;

                validationResult = Validator.isUsernameValid(newUserRequest.getUsername());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                validationResult = Validator.isPasswordValid(newUserRequest.getPassword());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                validationResult = Validator.isFirstnameValid(newUserRequest.getFirstname());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                validationResult = Validator.isSurnameValid(newUserRequest.getSurname());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                validationResult = Validator.isEmailValid(newUserRequest.getEmail());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                validationResult = Validator.isPhoneNumberValid(newUserRequest.getMobilePhone());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }

                Set<Role> roles = roleService.getRoles().stream().filter(r -> r.getId().equals(newUserRequest.getRoleId())).collect(Collectors.toSet());

                User newUser = new User(newUserRequest.getUsername(),
                                        passwordEncoder.encode(newUserRequest.getPassword()),
                                        newUserRequest.getFirstname(),
                                        newUserRequest.getSurname(),
                                        newUserRequest.getEmail(),
                                        newUserRequest.getMobilePhone());

                newUser.setRoles(roles);
                
                userService.add(newUser);
                
                return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Пользователь успешно добавлен."));
            }
            else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("[Ошибка]Пользователь с таким именем пользователя уже существует."));
            }
        }
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить данные."));
        }
    }

    @PatchMapping("/admin/users/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editUser(@PathVariable(value = "id") Integer id, @RequestBody EditUserRequest editUserRequest, Model model) {
        if (editUserRequest != null){
            User user = userService.findById(id);

            if (user != null) {
                if (!user.getUsername().equals(editUserRequest.getUsername())) {
                    if (userService.existsByUsername(editUserRequest.getUsername())) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("[Ошибка]Пользователь с таким именем пользователя уже существует."));
                    }
                }

                ValidationResult validationResult = null;

                validationResult = Validator.isUsernameValid(editUserRequest.getUsername());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                if (editUserRequest.getPassword().equals(null) && !editUserRequest.getPassword().isEmpty() && !editUserRequest.getPassword().isBlank()) {
                    validationResult = Validator.isPasswordValid(editUserRequest.getPassword());
                    if (!validationResult.getIsValid()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                    }
                }
                validationResult = Validator.isFirstnameValid(editUserRequest.getFirstname());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                validationResult = Validator.isSurnameValid(editUserRequest.getSurname());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                validationResult = Validator.isEmailValid(editUserRequest.getEmail());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }
                validationResult = Validator.isPhoneNumberValid(editUserRequest.getMobilePhone());
                if (!validationResult.getIsValid()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
                }

                Set<Role> roles = roleService.getRoles().stream().filter(r -> r.getId().equals(editUserRequest.getRoleId())).collect(Collectors.toSet());

                user.setUsername(editUserRequest.getUsername());
                if (!editUserRequest.getPassword().equals(null) && !editUserRequest.getPassword().isEmpty() && !editUserRequest.getPassword().isBlank()) {
                    user.setPassword(passwordEncoder.encode(editUserRequest.getPassword()));
                }
                user.setFirstname(editUserRequest.getFirstname());
                user.setSurname(editUserRequest.getSurname());
                user.setEmail(editUserRequest.getEmail());
                user.setMobilePhone(editUserRequest.getMobilePhone());
                user.setRoles(roles);

                userService.update(user);

                return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Пользователь успешно изменен."));
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
            }
        }
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Не удалось получить данные."));
        }
    }
}
