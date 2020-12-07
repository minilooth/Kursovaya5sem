package by.kursovaya.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import by.kursovaya.models.Role;
import by.kursovaya.models.User;
import by.kursovaya.models.enums.RoleEnum;
import by.kursovaya.payload.request.EditProfileRequest;
import by.kursovaya.payload.request.EditUserRequest;
import by.kursovaya.payload.request.NewUserRequest;
import by.kursovaya.payload.response.MessageResponse;
import by.kursovaya.security.services.UserDetailsImpl;
import by.kursovaya.services.RoleService;
import by.kursovaya.services.UserService;
import by.kursovaya.validators.ValidationResult;
import by.kursovaya.validators.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/admin/users/getAllUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false, value = "searchUsername") String searchUsername, Model model) {
        logger.info("Get all users request.");

        if (searchUsername != null && !searchUsername.isEmpty() && !searchUsername.isBlank()) {
            logger.info("Responsed filtered users.");
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUsers().stream().filter(u -> u.getUsername().startsWith(searchUsername)).collect(Collectors.toList()));
        }

        logger.info("Responsed all users.");
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUsers());
    }

    @GetMapping("/admin/users/getUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsers(Model model) {
        logger.info("Get users request.");

        logger.info("Responsed users.");
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUsers().stream().filter(u -> List.copyOf(u.getRoles()).stream().filter(r -> r.getName() == RoleEnum.USER).findFirst().orElse(null) != null).collect(Collectors.toList()));
    }

    @GetMapping("/users/currentUser")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> getCurrentUser(Model model) {
        logger.info("Get current user request.");

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = principal instanceof UserDetailsImpl ? userService.getUsers().stream().filter(u -> u.getUsername().equals(((UserDetailsImpl)principal).getUsername())).findFirst().orElse(null) : null;
        
        logger.info("Responsed current user.");
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUser(@PathVariable(value = "id") Integer id, Model model) {
        logger.info("Get user request");

        User user = userService.findById(id);

        if (user == null) {
            logger.warn("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
        }

        logger.info("Reponsed user.");
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @DeleteMapping("/admin/users/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable(value = "id") Integer id, Model model) {
        logger.info("Delete user request.");

        User user = userService.findById(id);

        if (user == null) {
            logger.warn("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
        }

        logger.info("Responsed successfully deleted message.");

        userService.deleteUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Пользователь успешно удален."));
    }

    @PatchMapping("/admin/users/lock/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> lockUser(@PathVariable(value = "id") Integer id, Model model) {
        logger.info("Lock user request.");

        User user = userService.findById(id);

        if (user == null) {
            logger.warn("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]: Пользователь с таким id не найден!"));
        }

        logger.info("Responsed succesfully user lock message.");
        
        user.setIsAccountNonLocked(!user.getIsAccountNonLocked());
        userService.update(user);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse(user.getIsAccountNonLocked() == false ? "Пользователь успешно заблокирован." : "Пользователь успешно разблокирован."));
    }

    @PostMapping("/admin/users/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUser(@RequestBody NewUserRequest newUserRequest, Model model) {
        logger.info("Add user request.");

        if (userService.existsByUsername(newUserRequest.getUsername())) {
            logger.warn("User not found.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("[Ошибка]Пользователь с таким именем пользователя уже существует."));
        }

        Validator validator = Validator.getInstance();
        ValidationResult validationResult = null;

        validationResult = validator.isUsernameValid(newUserRequest.getUsername());
        if (!validationResult.getIsValid()) {
            logger.warn("Username not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isPasswordValid(newUserRequest.getPassword());
        if (!validationResult.getIsValid()) {
            logger.warn("Password not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isFirstnameValid(newUserRequest.getFirstname());
        if (!validationResult.getIsValid()) {
            logger.warn("Firstname not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isSurnameValid(newUserRequest.getSurname());
        if (!validationResult.getIsValid()) {
            logger.warn("Surname not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isEmailValid(newUserRequest.getEmail());
        if (!validationResult.getIsValid()) {
            logger.warn("Email not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isPhoneNumberValid(newUserRequest.getMobilePhone());
        if (!validationResult.getIsValid()) {
            logger.warn("Phone number not valid.");
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

        logger.info("Responsed succesfully user add message.");                
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Пользователь успешно добавлен."));
    }

    @PatchMapping("/admin/users/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editUser(@PathVariable(value = "id") Integer id, @RequestBody EditUserRequest editUserRequest, Model model) {
        logger.info("Edit user request.");
        
        User user = userService.findById(id);

        if (user == null) {
            logger.warn("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
        }

        if (!user.getUsername().equals(editUserRequest.getUsername())) {
            if (userService.existsByUsername(editUserRequest.getUsername())) {
                logger.warn("User already exists.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("[Ошибка]Пользователь с таким именем пользователя уже существует."));
            }
        }

        Validator validator = Validator.getInstance();
        ValidationResult validationResult = null;

        validationResult = validator.isUsernameValid(editUserRequest.getUsername());
        if (!validationResult.getIsValid()) {
            logger.warn("Username is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        if (editUserRequest.getPassword().equals(null) && !editUserRequest.getPassword().isEmpty() && !editUserRequest.getPassword().isBlank()) {
            validationResult = validator.isPasswordValid(editUserRequest.getPassword());
            if (!validationResult.getIsValid()) {
                logger.warn("Password is not valid.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
            }
        }
        validationResult = validator.isFirstnameValid(editUserRequest.getFirstname());
        if (!validationResult.getIsValid()) {
            logger.warn("Firstname is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isSurnameValid(editUserRequest.getSurname());
        if (!validationResult.getIsValid()) {
            logger.warn("Surname is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isEmailValid(editUserRequest.getEmail());
        if (!validationResult.getIsValid()) {
            logger.warn("Email is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isPhoneNumberValid(editUserRequest.getMobilePhone());
        if (!validationResult.getIsValid()) {
            logger.warn("Phone number is not valid.");
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

        logger.info("Responsed successfully user edit message.");
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Пользователь успешно изменен."));
    }

    @PatchMapping("users/editProfile")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> editProfile(@RequestBody EditProfileRequest editProfileRequest, Model model) {
        logger.info("Edit profile request.");
        
        User user = userService.findById(editProfileRequest.getId());

        if (user == null) {
            logger.warn("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("[Ошибка]Пользователь с таким id не найден."));
        }

        if (!user.getUsername().equals(editProfileRequest.getUsername())) {
            if (userService.existsByUsername(editProfileRequest.getUsername())) {
                logger.warn("User already exists.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("[Ошибка]Пользователь с таким именем пользователя уже существует."));
            }
        }

        Validator validator = Validator.getInstance();
        ValidationResult validationResult = null;

        validationResult = validator.isUsernameValid(editProfileRequest.getUsername());
        if (!validationResult.getIsValid()) {
            logger.warn("Username is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        if (editProfileRequest.getPassword().equals(null) && !editProfileRequest.getPassword().isEmpty() && !editProfileRequest.getPassword().isBlank()) {
            validationResult = validator.isPasswordValid(editProfileRequest.getPassword());
            if (!validationResult.getIsValid()) {
                logger.warn("Password is not valid.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
            }
        }
        validationResult = validator.isFirstnameValid(editProfileRequest.getFirstname());
        if (!validationResult.getIsValid()) {
            logger.warn("Firstname is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isSurnameValid(editProfileRequest.getSurname());
        if (!validationResult.getIsValid()) {
            logger.warn("Surname is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isEmailValid(editProfileRequest.getEmail());
        if (!validationResult.getIsValid()) {
            logger.warn("Email is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isPhoneNumberValid(editProfileRequest.getMobilePhone());
        if (!validationResult.getIsValid()) {
            logger.warn("Phone number is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        user.setUsername(editProfileRequest.getUsername());
        if (!editProfileRequest.getPassword().equals(null) && !editProfileRequest.getPassword().isEmpty() && !editProfileRequest.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(editProfileRequest.getPassword()));
        }
        user.setFirstname(editProfileRequest.getFirstname());
        user.setSurname(editProfileRequest.getSurname());
        user.setEmail(editProfileRequest.getEmail());
        user.setMobilePhone(editProfileRequest.getMobilePhone());

        userService.update(user);

        logger.info("Responsed successfully edit profile message.");
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Профиль успешно изменен."));
    } 
}
