package by.kursovaya.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import by.kursovaya.models.Autodealer;

@Repository
public interface AutodealerRepository extends JpaRepository<Autodealer, Integer> {
    
}
