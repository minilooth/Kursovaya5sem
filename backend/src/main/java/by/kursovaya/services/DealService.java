package by.kursovaya.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import by.kursovaya.models.Deal;
import by.kursovaya.repositories.DealRepository;

@Service
public class DealService {
    @Autowired
    private DealRepository dealRepository;
    
    @Transactional
    public void add(Deal deal) {
        dealRepository.save(deal);
    }

    @Transactional
    public void update(Deal deal) {
        dealRepository.save(deal);
    }

    @Transactional
    public void delete(Deal deal) {
        dealRepository.delete(deal);
    }

    @Transactional
    public List<Deal> get() {
        return dealRepository.findAll();
    }

    @Transactional
    public Deal get(Integer id) {
        return dealRepository.findAll().stream().filter(d -> d.getId() == id).findFirst().orElse(null);
    }
}
