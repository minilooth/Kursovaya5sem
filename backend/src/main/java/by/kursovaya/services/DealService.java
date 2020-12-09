package by.kursovaya.services;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import by.kursovaya.models.Car;
import by.kursovaya.models.Deal;
import by.kursovaya.models.User;
import by.kursovaya.models.enums.DealSortType;
import by.kursovaya.payload.response.DealResponse;
import by.kursovaya.repositories.DealRepository;

@Service
public class DealService {
    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private ResourceService resourceService;

    final static Integer CHECK_WIDTH = 64;

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

    public String generateCheck(Deal deal) {
        Car car = deal.getCar();
        User user = deal.getUser();

        String check = StringUtils.repeat('-', CHECK_WIDTH) + "\n" +
                       StringUtils.leftPad("ЧЕК ПРОДАЖИ\n", ((CHECK_WIDTH + 11) / 2), " ") + 
                       StringUtils.repeat('-', CHECK_WIDTH) + "\n" + 
                       StringUtils.leftPad(car.getAutodealer().getTitle(), (CHECK_WIDTH + car.getAutodealer().getTitle().length()) / 2, " ") + "\n" +
                       StringUtils.repeat('-', CHECK_WIDTH) + "\n" + 
                       "Марка: " + StringUtils.leftPad(car.getBrand(), CHECK_WIDTH - 7, " ") + "\n" +
                       "Модель: " + StringUtils.leftPad(car.getModel(), CHECK_WIDTH - 8, " ") + "\n" +
                       "Год выпуска: " + StringUtils.leftPad(car.getYearOfIssue().toString(), CHECK_WIDTH - 13, " ") + "\n" +
                       "Тип кузова: " + StringUtils.leftPad(car.getBodyType().getBodyName(), CHECK_WIDTH - 12, " ") + "\n" +
                       "Объем двигателя: " + StringUtils.leftPad(car.getEngineVolume().toString() + " л", CHECK_WIDTH - 17, " ") + "\n" +
                       "Тип двигателя: " + StringUtils.leftPad(car.getEngineType().getTypeName(), CHECK_WIDTH - 15, " ") + "\n" +
                       "Тип КПП: " + StringUtils.leftPad(car.getTransmissionType().getTypeName(), CHECK_WIDTH - 9, " ") + "\n" +
                       "Тип привода: " + StringUtils.leftPad(car.getWheelDriveType().getTypeName(), CHECK_WIDTH - 13, " ") + "\n" + 
                       "Пробег: " + StringUtils.leftPad(car.getMileage().toString() + " км", CHECK_WIDTH - 8, " ") + "\n" +
                       "Цвет кузова: " + StringUtils.leftPad(car.getBodyColor().getColorName(), CHECK_WIDTH - 13, " ") + "\n" +
                       "Материал салона: " + StringUtils.leftPad(car.getInteriorMaterial().getMaterialName(), CHECK_WIDTH - 17, " ") + "\n" + 
                       "Цвет салона: " + StringUtils.leftPad(car.getInteriorColor().getColorName(), CHECK_WIDTH - 13, " ") + "\n" +
                       StringUtils.repeat('-', CHECK_WIDTH) + "\n" +
                       "Пользователь: " + StringUtils.leftPad(user.getUsername(), CHECK_WIDTH - 14, " ") + "\n" +
                       StringUtils.repeat('-', CHECK_WIDTH) + "\n" +
                       "Цена: " + StringUtils.leftPad(car.getPrice().toString() + " р.", CHECK_WIDTH - 6, " ") + "\n" +
                       StringUtils.repeat('-', CHECK_WIDTH) + "\n" +
                       "Дата: " + StringUtils.leftPad(new SimpleDateFormat("dd/MM/yyyy").format(deal.getDate()).toString(), CHECK_WIDTH - 6, " ") + "\n" +
                       "Время: " + StringUtils.leftPad(new SimpleDateFormat("HH:mm:ss").format(deal.getDate()).toString(), CHECK_WIDTH - 7 , " ") + "\n" + 
                       StringUtils.repeat('-', CHECK_WIDTH);

        resourceService.saveCheckAsResource(check);

        return check;
    }

    public List<DealResponse> sort(List<DealResponse> dealResponses, DealSortType dealSortType) {
        if (dealSortType == null) {
            return dealResponses;
        }

        switch(dealSortType) {
            case OLD_DEALS: 
                return dealResponses;
            case NEW_DEALS:
                Collections.reverse(dealResponses);
                return dealResponses;
            case AMOUNT_ASC:
                return dealResponses.stream().sorted(Comparator.comparing(DealResponse::getAmount)).collect(Collectors.toList());
            case AMOUNT_DESC:
                List<DealResponse> amountDesc = dealResponses.stream().sorted(Comparator.comparing(DealResponse::getAmount)).collect(Collectors.toList());
                Collections.reverse(amountDesc);
                return amountDesc;
            default:
                return dealResponses;
        }
    }
}
