package by.kursovaya.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import by.kursovaya.models.Role;
import by.kursovaya.models.enums.RoleEnum;
import by.kursovaya.models.User;
import by.kursovaya.payload.request.LoginRequest;
import by.kursovaya.payload.request.SignupRequest;
import by.kursovaya.payload.response.JwtResponse;
import by.kursovaya.payload.response.MessageResponse;
import by.kursovaya.repositories.RoleRepository;
import by.kursovaya.services.UserService;
import by.kursovaya.validators.ValidationResult;
import by.kursovaya.validators.Validator;
import by.kursovaya.security.jwt.JwtUtils;
import by.kursovaya.security.services.UserDetailsImpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authUser(@RequestBody LoginRequest loginRequest) {
        logger.info("Auth user request.");

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String javaWebToken = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetailsImpl
                                .getAuthorities().stream()
                                .map(item -> item.getAuthority())
                                .collect(Collectors.toList());


        logger.info("Responsed user data with auth token.");
        return ResponseEntity.status(HttpStatus.OK).body(new JwtResponse(javaWebToken, 
                                                 userDetailsImpl.getId(), 
                                                 userDetailsImpl.getUsername(), 
                                                 userDetailsImpl.getFirstname(), 
                                                 userDetailsImpl.getSurname(),
                                                 userDetailsImpl.getEmail(),
                                                 userDetailsImpl.getMobilePhone(),
                                                 userDetailsImpl.getDateOfRegistration(),
                                                 roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        logger.info("Register user request.");

        Validator validator = Validator.getInstance();
        ValidationResult validationResult = null;

        if (userService.existsByUsername(signupRequest.getUsername())) {
            logger.warn("User already exists.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Ошибка: Имя пользователя уже занято!"));
        }

        validationResult = validator.isUsernameValid(signupRequest.getUsername());
        if (!validationResult.getIsValid()) {
            logger.warn("Username is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isPasswordValid(signupRequest.getPassword());
        if (!validationResult.getIsValid()) {
            logger.warn("Password is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isFirstnameValid(signupRequest.getFirstname());
        if (!validationResult.getIsValid()) {
            logger.warn("Firstname is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isSurnameValid(signupRequest.getSurname());
        if (!validationResult.getIsValid()) {
            logger.warn("Surname is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isEmailValid(signupRequest.getEmail());
        if (!validationResult.getIsValid()) {
            logger.warn("Email is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }
        validationResult = validator.isPhoneNumberValid(signupRequest.getMobilePhone());
        if (!validationResult.getIsValid()) {
            logger.warn("Phone number is not valid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(validationResult.getMessage()));
        }

        User user = new User(signupRequest.getUsername(),
                             passwordEncoder.encode(signupRequest.getPassword()),
                             signupRequest.getFirstname(),
                             signupRequest.getSurname(),
                             signupRequest.getEmail(),
                             signupRequest.getMobilePhone());

        Set<String> stringRoles = signupRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if(stringRoles == null) {
            Role userRole = roleRepository.findByName(RoleEnum.USER)
                                        .orElseThrow(() -> new RuntimeException("Ошибка: Роль не найдена!"));
            roles.add(userRole);
        }
        else {
            stringRoles.forEach(role -> {
                switch (RoleEnum.valueOf(role)) {
                    case ADMIN: 
                        Role adminRole = roleRepository.findByName(RoleEnum.ADMIN)
                                                    .orElseThrow(() -> new RuntimeException("Ошибка: Роль не найдена!"));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(RoleEnum.USER)
                                                    .orElseThrow(() -> new RuntimeException("Ошибка: Роль не найдена!"));
                        roles.add(userRole);
                        break;
                }
            });
        }

        user.setRoles(roles);
        userService.add(user);

        logger.info("User successfully registered.");
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Пользователь успешно зарегистрирован!"));
    }
}
