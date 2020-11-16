package by.kursovaya.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import by.kursovaya.models.Statistics;

@Repository
public interface StatisticsRepository extends JpaRepository<Statistics, Integer> {
    
}
