package by.kursovaya.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import by.kursovaya.models.Car;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer>  {
    
}
