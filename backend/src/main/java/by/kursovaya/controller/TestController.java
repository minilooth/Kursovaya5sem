package by.kursovaya.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String allAccess(Model model) {
        return "Public Content.";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String userAccess(Model model) {
        return "User Content.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess(Model model) {
        return "Admin access.";
    }
    
}
