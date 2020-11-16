package by.kursovaya.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import by.kursovaya.models.Role;
import by.kursovaya.repositories.RoleRepository;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Transactional
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }
}
