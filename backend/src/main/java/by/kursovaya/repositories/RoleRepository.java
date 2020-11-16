package by.kursovaya.repositories;

import java.util.Optional;

import by.kursovaya.models.Role;
import by.kursovaya.models.enums.RoleEnum;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(RoleEnum name);
}
