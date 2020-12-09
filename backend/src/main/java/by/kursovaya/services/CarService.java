package by.kursovaya.services;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import by.kursovaya.models.Car;
import by.kursovaya.models.enums.BodyColor;
import by.kursovaya.models.enums.BodyType;
import by.kursovaya.models.enums.CarSortType;
import by.kursovaya.models.enums.EngineType;
import by.kursovaya.models.enums.InteriorColor;
import by.kursovaya.models.enums.InteriorMaterial;
import by.kursovaya.models.enums.TransmissionType;
import by.kursovaya.models.enums.UserCarsListSortType;
import by.kursovaya.models.enums.WheelDriveType;
import by.kursovaya.payload.request.SetCarFilterRequest;
import by.kursovaya.repositories.CarRepository;
import lombok.SneakyThrows;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    @Autowired
    private ResourceService resourceService;

    @Transactional
    public void add(Car car){
        carRepository.save(car);
    }

    @Transactional
    public void update(Car car) {
        carRepository.save(car);
    }

    @Transactional
    public List<Car> getCarsByAutodealerId(Integer id) {
        return carRepository.findAll().stream().filter(c -> c.getAutodealer().getId().equals(id)).collect(Collectors.toList());
    }

    @Transactional
    public Car getCarById(Integer id) {
        return carRepository.findById(id).orElse(null);
    }

    @Transactional
    public void deleteCar(Car car) {
        carRepository.delete(car);
    }

    @SneakyThrows
    public String getCarImage(String filename) {
        FileSystemResource fileSystemResource = filename != null ? resourceService.getImageAsResource(filename) : null;

        if (fileSystemResource == null || !fileSystemResource.exists()) {
            return null;
        }

        return fileSystemResource != null ? "data:;base64," + Base64Utils.encodeToString(fileSystemResource.getInputStream().readAllBytes()) : null;
    }

    @SneakyThrows
    public String saveCarImage(String base64) {
        if (base64 == null || base64.isEmpty() || base64.isBlank()) {
            return null;
        }

        return resourceService.saveImageAsResource(base64);
    }

    public List<Car> filterCars(List<Car> cars, SetCarFilterRequest setCarFilterRequest){
        String brandFilter = setCarFilterRequest.getBrandFilter();
        String modelFilter = setCarFilterRequest.getModelFilter();
        Integer yearOfIssueMinFilter = setCarFilterRequest.getYearOfIssueMinFilter() == null ? 1975 : setCarFilterRequest.getYearOfIssueMinFilter();
        Integer yearOfIssueMaxFilter = setCarFilterRequest.getYearOfIssueMaxFilter() == null ? 2020 : setCarFilterRequest.getYearOfIssueMaxFilter();
        BodyType bodyTypeFilter = setCarFilterRequest.getBodyTypeFilter() == null ? null : setCarFilterRequest.getBodyTypeFilter();
        Float engineVolumeMinFilter = setCarFilterRequest.getEngineVolumeMinFilter() == null ? 0.8f : setCarFilterRequest.getEngineVolumeMinFilter();
        Float engineVolumeMaxFilter = setCarFilterRequest.getEngineVolumeMaxFilter() == null ? 7.0f : setCarFilterRequest.getEngineVolumeMaxFilter();
        EngineType engineTypeFilter = setCarFilterRequest.getEngineTypeFilter() == null ? null : setCarFilterRequest.getEngineTypeFilter();
        TransmissionType transmissionTypeFilter = setCarFilterRequest.getTransmissionTypeFilter() == null ? null : setCarFilterRequest.getTransmissionTypeFilter();
        WheelDriveType wheelDriveTypeFilter = setCarFilterRequest.getWheelDriveTypeFilter() == null ? null : setCarFilterRequest.getWheelDriveTypeFilter();
        Float mileageMinFilter = setCarFilterRequest.getMileageMinFilter() == null ? 0f : setCarFilterRequest.getMileageMinFilter();
        Float mileageMaxFilter = setCarFilterRequest.getMileageMaxFilter() == null ? 1000000f : setCarFilterRequest.getMileageMaxFilter();
        BodyColor bodyColorFilter = setCarFilterRequest.getBodyColorFilter() == null ? null : setCarFilterRequest.getBodyColorFilter();
        InteriorMaterial interiorMaterialFilter = setCarFilterRequest.getInteriorMaterialFilter() == null ? null : setCarFilterRequest.getInteriorMaterialFilter();
        InteriorColor interiorColorFilter = setCarFilterRequest.getInteriorColorFilter() == null ? null : setCarFilterRequest.getInteriorColorFilter(); 
        Float priceMinFilter = setCarFilterRequest.getPriceMinFilter() == null ? 0f : setCarFilterRequest.getPriceMinFilter();
        Float priceMaxFilter = setCarFilterRequest.getPriceMaxFilter() == null ? 1000000f : setCarFilterRequest.getPriceMaxFilter();

        if (brandFilter != null && !brandFilter.isEmpty()) {
            cars = cars.stream().filter(c -> c.getBrand().startsWith(brandFilter)).collect(Collectors.toList());
        }
        if (modelFilter != null && !modelFilter.isEmpty()) {
            cars = cars.stream().filter(c -> c.getModel().startsWith(modelFilter)).collect(Collectors.toList());
        }
        if (yearOfIssueMinFilter != 1975) {
            cars = cars.stream().filter(c -> c.getYearOfIssue() >= yearOfIssueMinFilter).collect(Collectors.toList());
        }
        if (yearOfIssueMaxFilter != 2020) {
            cars = cars.stream().filter(c -> c.getYearOfIssue() <= yearOfIssueMaxFilter).collect(Collectors.toList());
        }
        if (bodyTypeFilter != null) {
            cars = cars.stream().filter(c -> c.getBodyType() == bodyTypeFilter).collect(Collectors.toList());
        }
        if (engineVolumeMinFilter != 0.8f) {
            cars = cars.stream().filter(c -> c.getEngineVolume() >= engineVolumeMinFilter).collect(Collectors.toList());
        }
        if (engineVolumeMaxFilter != 10.0f) {
            cars = cars.stream().filter(c -> c.getEngineVolume() <= engineVolumeMaxFilter).collect(Collectors.toList());
        }
        if (engineTypeFilter != null) {
            cars = cars.stream().filter(c -> c.getEngineType() == engineTypeFilter).collect(Collectors.toList());
        }
        if (transmissionTypeFilter != null) {
            cars = cars.stream().filter(c -> c.getTransmissionType() == transmissionTypeFilter).collect(Collectors.toList());
        }
        if (wheelDriveTypeFilter != null) {
            cars = cars.stream().filter(c -> c.getWheelDriveType() == wheelDriveTypeFilter).collect(Collectors.toList());
        }
        if (mileageMinFilter != 0) {
            cars = cars.stream().filter(c -> c.getMileage() >= mileageMinFilter).collect(Collectors.toList());
        }
        if (mileageMaxFilter != 1000000) {
            cars = cars.stream().filter(c -> c.getMileage() <= mileageMaxFilter).collect(Collectors.toList());
        }
        if (bodyColorFilter != null) {
            cars = cars.stream().filter(c -> c.getBodyColor() == bodyColorFilter).collect(Collectors.toList());
        }
        if (interiorColorFilter != null) {
            cars = cars.stream().filter(c -> c.getInteriorColor() == interiorColorFilter).collect(Collectors.toList());
        }
        if (interiorMaterialFilter != null) {
            cars = cars.stream().filter(c -> c.getInteriorMaterial() == interiorMaterialFilter).collect(Collectors.toList());
        }
        if (priceMinFilter != 0) {
            cars = cars.stream().filter(c -> c.getPrice() >= priceMinFilter).collect(Collectors.toList());
        }
        if (priceMaxFilter != 1000000) {
            cars = cars.stream().filter(c -> c.getPrice() <= priceMaxFilter).collect(Collectors.toList());
        }
        return cars;
    }

    public List<Car> sortCars(List<Car> cars, CarSortType carSortType) {
        if (carSortType == null) {
            return cars;
        }

        switch(carSortType) {
            case NEW_ADS:
                Collections.reverse(cars);
                return cars;
            case CHEAP_CARS:
                return cars.stream().sorted(Comparator.comparing(Car::getPrice)).collect(Collectors.toList());
            case EXPENSIVE_CARS:
                List<Car> expensiveCars = cars.stream().sorted(Comparator.comparing(Car::getPrice)).collect(Collectors.toList());
                Collections.reverse(expensiveCars);
                return expensiveCars;
            case NEW_CARS:
                List<Car> oldCars = cars.stream().sorted(Comparator.comparing(Car::getYearOfIssue)).collect(Collectors.toList());
                Collections.reverse(oldCars);
                return oldCars;
            case OLD_CARS:
                return cars.stream().sorted(Comparator.comparing(Car::getYearOfIssue)).collect(Collectors.toList());
            case LEAST_MILEAGE:
                return cars.stream().sorted(Comparator.comparing(Car::getMileage)).collect(Collectors.toList());
            default:
                return cars;
        }
    }

    public List<Car> sortUserCars(List<Car> cars, UserCarsListSortType userCarsListSortType) {
        if (userCarsListSortType == null) {
            return cars;
        }

        switch(userCarsListSortType) {
            case WITHOUT_SORT:
                return cars;
                case CHEAP_CARS:
                return cars.stream().sorted(Comparator.comparing(Car::getPrice)).collect(Collectors.toList());
            case EXPENSIVE_CARS:
                List<Car> expensiveCars = cars.stream().sorted(Comparator.comparing(Car::getPrice)).collect(Collectors.toList());
                Collections.reverse(expensiveCars);
                return expensiveCars;
            case NEW_CARS:
                List<Car> oldCars = cars.stream().sorted(Comparator.comparing(Car::getYearOfIssue)).collect(Collectors.toList());
                Collections.reverse(oldCars);
                return oldCars;
            case OLD_CARS:
                return cars.stream().sorted(Comparator.comparing(Car::getYearOfIssue)).collect(Collectors.toList());
            case LEAST_MILEAGE:
                return cars.stream().sorted(Comparator.comparing(Car::getMileage)).collect(Collectors.toList());
            default:
                return cars;
        }
    }
}
