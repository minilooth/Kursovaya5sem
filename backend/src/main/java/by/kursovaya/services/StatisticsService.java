package by.kursovaya.services;

import java.time.LocalDate;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import by.kursovaya.models.Autodealer;
import by.kursovaya.models.Car;
import by.kursovaya.models.Statistics;
import by.kursovaya.repositories.StatisticsRepository;

@Service
public class StatisticsService {
    @Autowired
    private StatisticsRepository statisticsRepository;

    @Autowired
    private AutodealerService autodealerService;

    @Transactional
    public List<Statistics> get() {
        return statisticsRepository.findAll();
    }

    @Transactional
    public void add(Statistics statistics) {
        statisticsRepository.save(statistics);
    }

    @Transactional
    public void update(Statistics statistics) {
        statisticsRepository.save(statistics);
    }

    @Transactional
    public void delete(Statistics statistics) {
        statisticsRepository.delete(statistics);
    }

    public void checkAndCreateNewStatistics() {
        List<Autodealer> autodealers = autodealerService.get();
        List<Statistics> statistics = this.get();

        for(Autodealer autodealer : autodealers) {
            Statistics autodealerStatistics = statistics.stream().filter(s -> s.getMonth() == LocalDate.now().getMonthValue() && s.getYear() == LocalDate.now().getYear() && s.getAutodealerId() == autodealer.getId()).findFirst().orElse(null);

            if (autodealerStatistics == null) {

                Statistics newStatistics = new Statistics();
                newStatistics.setAutodealerId(autodealer.getId());
                newStatistics.setAutodealer(autodealer);
                newStatistics.setMonth(LocalDate.now().getMonthValue());
                newStatistics.setYear(LocalDate.now().getYear());
                newStatistics.setCountOfCarsSold(0);
                newStatistics.setCountOfClients(0);
                newStatistics.setTotalSales(0f);

                this.add(newStatistics);
            }
        }
    }

    public void addVisitToAutodealer(Autodealer autodealer) {
        checkAndCreateNewStatistics();

        Statistics autodealerCurrentMonthStatistics = this.get().stream().filter(s -> s.getMonth() == LocalDate.now().getMonthValue() && s.getYear() == LocalDate.now().getYear() && s.getAutodealerId() == autodealer.getId()).findFirst().orElse(null);

        if (autodealerCurrentMonthStatistics != null) {
            autodealerCurrentMonthStatistics.setCountOfClients(autodealerCurrentMonthStatistics.getCountOfClients() + 1);
            this.update(autodealerCurrentMonthStatistics);
        }
    }

    public void addSaleToStatistics(Car car, Autodealer autodealer) {
        checkAndCreateNewStatistics();

        Statistics autodealerCurrentMonthStatistics = this.get().stream().filter(s -> s.getMonth() == LocalDate.now().getMonthValue() && s.getYear() == LocalDate.now().getYear() && s.getAutodealerId() == autodealer.getId()).findFirst().orElse(null);

        if (autodealerCurrentMonthStatistics != null) {
            autodealerCurrentMonthStatistics.setCountOfCarsSold(autodealerCurrentMonthStatistics.getCountOfCarsSold() + 1);
            autodealerCurrentMonthStatistics.setTotalSales(autodealerCurrentMonthStatistics.getTotalSales() + car.getPrice());
            this.update(autodealerCurrentMonthStatistics);
        }
    }
    

}
