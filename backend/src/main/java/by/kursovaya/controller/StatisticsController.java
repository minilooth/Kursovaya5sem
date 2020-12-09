package by.kursovaya.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import by.kursovaya.models.Autodealer;
import by.kursovaya.models.Statistics;
import by.kursovaya.payload.response.MessageResponse;
import by.kursovaya.services.AutodealerService;
import by.kursovaya.services.StatisticsService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/statistics")
public class StatisticsController {
    private static final Logger logger = LoggerFactory.getLogger(StatisticsController.class);

    @Autowired
    private AutodealerService autodealerService;

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/get")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> get(@RequestParam(value = "autodealerId", required = true) Integer autodealerId, Model model) {
        logger.info("Get statistics request.");

        Autodealer autodealer = autodealerService.get(autodealerId);
        
        if (autodealer == null) {
            logger.warn("Autodealer not found.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("[Ошибка]Автосалон с таким id не найден."));
        }

        List<Statistics> statistics = statisticsService.get().stream().filter(s -> s.getAutodealer().getId() == autodealer.getId()).collect(Collectors.toList());
        Integer currentMonth = LocalDate.now().getMonthValue();
        Integer currentYear = LocalDate.now().getYear();
        List<Statistics> sendStatistics = new ArrayList<>();

        while(sendStatistics.size() != 6 && sendStatistics.size() != statistics.size() - 1) {
            final Integer finalCurrentMonth;
            final Integer finalCurrentYear;

            if (currentMonth != 1) {
                finalCurrentMonth = currentMonth - 1;
                finalCurrentYear = currentYear;
                currentMonth--;
            }
            else {
                finalCurrentMonth = 12;
                finalCurrentYear = currentYear - 1;
                currentYear--;
                currentMonth = 12;
            }

            Statistics statisticsItem = statistics.stream().filter(s -> s.getMonth().equals(finalCurrentMonth) && s.getYear().equals(finalCurrentYear)).findFirst().orElse(null);

            if (statisticsItem != null) {
                System.out.println(statisticsItem);
                sendStatistics.add(statisticsItem);
            }
        }

        Collections.reverse(sendStatistics);

        logger.info("Responsed statistics.");
        return ResponseEntity.status(HttpStatus.OK).body(sendStatistics);
    }
}
