package by.kursovaya.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import by.kursovaya.models.Autodealer;
import by.kursovaya.repositories.AutodealerRepository;

@Service
public class AutodealerService {
    @Autowired
    private AutodealerRepository autodealerRepository;

    @Transactional
    public void add(Autodealer autodealer) {
        autodealerRepository.save(autodealer);
    }

    @Transactional
    public void update(Autodealer autodealer) {
        autodealerRepository.save(autodealer);
    }

    public void delete(Autodealer autodealer) {
        autodealerRepository.delete(autodealer);
    }

    @Transactional
    public List<Autodealer> getAutodealers() {
        return autodealerRepository.findAll();
    }

    @Transactional
    public Autodealer getAutodealer(Integer id) {
        return autodealerRepository.findById(id).orElse(null);
    }
}
