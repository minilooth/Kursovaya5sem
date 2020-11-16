package by.kursovaya.services;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import by.kursovaya.models.Car;
import by.kursovaya.models.enums.BodyColor;
import by.kursovaya.models.enums.BodyType;
import by.kursovaya.models.enums.EngineType;
import by.kursovaya.models.enums.InteriorColor;
import by.kursovaya.models.enums.InteriorMaterial;
import by.kursovaya.models.enums.TransmissionType;
import by.kursovaya.models.enums.WheelDriveType;
import by.kursovaya.payload.request.SetCarFilterRequest;
import by.kursovaya.repositories.CarRepository;
import by.kursovaya.utils.Utils;
import lombok.SneakyThrows;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    @Autowired
    private ResourceService resourceService;

    private String IMAGES_PATH = "/static/car-images/";
    private Integer IMAGE_NAME_HIGHER_BOUND = 999999;
    private Integer IMAGE_NAME_LOWER_BOUND = 100000;

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
        return carRepository.findAll().stream().filter(c -> c.getAutodealerId().equals(id)).collect(Collectors.toList());
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
    public String getCarImage(String imageName) {
        Resource resource = imageName != null ? resourceService.getImageAsResource(IMAGES_PATH + imageName) : null;

        if (resource == null || !resource.exists()) {
            return null;
        }

        return resource != null ? "data:;base64," + Base64Utils.encodeToString(resource.getInputStream().readAllBytes()) : null;
    }

    @SneakyThrows
    public String saveCarImage(String base64) {
        if (base64 == null || base64.isEmpty() || base64.isBlank()) {
            return null;
        }

        while(true) {
            String filename = Utils.generateFilename(IMAGE_NAME_LOWER_BOUND, IMAGE_NAME_HIGHER_BOUND);

            Car car = carRepository.findAll().stream().filter(c -> c.getImageName() != null && c.getImageName().startsWith(filename)).findFirst().orElse(null);

            if (car == null) {
                return resourceService.saveImageAsResource(base64, IMAGES_PATH, filename);
            }
        }

    }

    public List<Car> filterCars(List<Car> cars, SetCarFilterRequest setCarFilterRequest){
        String brandFilter = setCarFilterRequest.getBrandFilter();
        String modelFilter = setCarFilterRequest.getModelFilter();
        Integer yearOfIssueMinFilter = setCarFilterRequest.getYearOfIssueMinFilter() == null ? 1975 : setCarFilterRequest.getYearOfIssueMinFilter();
        Integer yearOfIssueMaxFilter = setCarFilterRequest.getYearOfIssueMaxFilter() == null ? 2020 : setCarFilterRequest.getYearOfIssueMaxFilter();
        BodyType bodyTypeFilter = setCarFilterRequest.getBodyTypeFilter() == null ? null : BodyType.valueOf(setCarFilterRequest.getBodyColorFilter()).orElse(null);
        Float engineVolumeMinFilter = setCarFilterRequest.getEngineVolumeMinFilter() == null ? 0.8f : setCarFilterRequest.getEngineVolumeMinFilter();
        Float engineVolumeMaxFilter = setCarFilterRequest.getEngineVolumeMaxFilter() == null ? 7.0f : setCarFilterRequest.getEngineVolumeMaxFilter();
        EngineType engineTypeFilter = setCarFilterRequest.getEngineTypeFilter() == null ? null : EngineType.valueOf(setCarFilterRequest.getEngineTypeFilter()).orElse(null);
        TransmissionType transmissionTypeFilter = setCarFilterRequest.getTransmissionTypeFilter() == null ? null : TransmissionType.valueOf(setCarFilterRequest.getTransmissionTypeFilter()).orElse(null);
        WheelDriveType wheelDriveTypeFilter = setCarFilterRequest.getWheelDriveTypeFilter() == null ? null : WheelDriveType.valueOf(setCarFilterRequest.getWheelDriveTypeFilter()).orElse(null);
        Float mileageMinFilter = setCarFilterRequest.getMileageMinFilter() == null ? 0f : setCarFilterRequest.getMileageMinFilter();
        Float mileageMaxFilter = setCarFilterRequest.getMileageMaxFilter() == null ? 1000000f : setCarFilterRequest.getMileageMaxFilter();
        BodyColor bodyColorFilter = setCarFilterRequest.getBodyColorFilter() == null ? null : BodyColor.valueOf(setCarFilterRequest.getBodyColorFilter()).orElse(null);
        InteriorMaterial interiorMaterialFilter = setCarFilterRequest.getInteriorMaterialFilter() == null ? null : InteriorMaterial.valueOf(setCarFilterRequest.getInteriorMaterialFilter()).orElse(null);
        InteriorColor interiorColorFilter = setCarFilterRequest.getInteriorColorFilter() == null ? null : InteriorColor.valueOf(setCarFilterRequest.getInteriorColorFilter()).orElse(null); 
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
}
