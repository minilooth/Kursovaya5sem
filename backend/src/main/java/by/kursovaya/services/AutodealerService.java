package by.kursovaya.services;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import by.kursovaya.models.Autodealer;
import by.kursovaya.models.enums.AutodealerSortType;
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
    public List<Autodealer> get() {
        return autodealerRepository.findAll();
    }

    @Transactional
    public Autodealer get(Integer id) {
        return autodealerRepository.findById(id).orElse(null);
    }

    public List<Autodealer> sort(List<Autodealer> autodealers, AutodealerSortType autodealerSortType) {
        if (autodealerSortType == null) {
            return autodealers;
        }

        switch(autodealerSortType) {
            case WITHOUT_SORT:
                return autodealers;
            case ALPHABET: 
                return autodealers.stream().sorted(Comparator.comparing(Autodealer::getTitle)).collect(Collectors.toList());
            case ALPHABET_REVERSE:
                List<Autodealer> alphabetReverse = autodealers.stream().sorted(Comparator.comparing(Autodealer::getTitle)).collect(Collectors.toList());
                Collections.reverse(alphabetReverse);
                return alphabetReverse;
            default:
                return autodealers;
        }
    }

    public List<Autodealer> search(List<Autodealer> autodealers, String searchTitle) {
        if (searchTitle != null && !searchTitle.isEmpty() && !searchTitle.isBlank()) {
            return autodealers.stream().filter(a -> a.getTitle().startsWith(searchTitle)).collect(Collectors.toList());
        }

        return autodealers;
    }
}
