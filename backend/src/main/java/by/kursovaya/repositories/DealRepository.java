package by.kursovaya.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import by.kursovaya.models.Deal;

@Repository
public interface DealRepository extends JpaRepository<Deal, Integer> {
    
}
