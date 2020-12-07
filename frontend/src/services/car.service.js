import axios from 'axios';
import authHeader from './auth-header';

import AutodealerService from './autodealer.service';

class CarService {
    getCars(sortType) {
        let carFilter = JSON.parse(localStorage.getItem('carFilter'));

        let isFilterModeEnabled = carFilter != null ? carFilter.isFilterModeEnabled : false;

        let brandFilter = isFilterModeEnabled ? carFilter.brandFilter : null;
        let modelFilter = isFilterModeEnabled ? carFilter.modelFilter : null;
        let yearOfIssueMinFilter = isFilterModeEnabled ? carFilter.yearOfIssueMinFilter : null;
        let yearOfIssueMaxFilter = isFilterModeEnabled ? carFilter.yearOfIssueMaxFilter : null;
        let bodyTypeFilter = isFilterModeEnabled ? carFilter.bodyTypeFilter !== "" ? carFilter.bodyTypeFilter : null : null;
        let engineVolumeMinFilter = isFilterModeEnabled ? carFilter.engineVolumeMinFilter : null;
        let engineVolumeMaxFilter = isFilterModeEnabled ? carFilter.engineVolumeMaxFilter : null;
        let engineTypeFilter = isFilterModeEnabled ? carFilter.engineTypeFilter !== "" ? carFilter.engineTypeFilter : null : null;
        let transmissionTypeFilter = isFilterModeEnabled ? carFilter.transmissionTypeFilter !== "" ? carFilter.transmissionTypeFilter : null : null;
        let wheelDriveTypeFilter = isFilterModeEnabled ? carFilter.wheelDriveTypeFilter !== "" ? carFilter.wheelDriveTypeFilter : null : null;
        let mileageMinFilter = isFilterModeEnabled ? carFilter.mileageMinFilter : null;
        let mileageMaxFilter = isFilterModeEnabled ? carFilter.mileageMaxFilter : null;
        let bodyColorFilter = isFilterModeEnabled ? carFilter.bodyColorFilter !== "" ? carFilter.bodyColorFilter : null : null;
        let interiorColorFilter = isFilterModeEnabled ? carFilter.interiorColorFilter !== "" ? carFilter.interiorColorFilter : null : null;
        let interiorMaterialFilter = isFilterModeEnabled ? carFilter.interiorMaterialFilter !== "" ? carFilter.interiorMaterialFilter : null : null;
        let priceMinFilter = isFilterModeEnabled ? carFilter.priceMinFilter : null;
        let priceMaxFilter = isFilterModeEnabled ? carFilter.priceMinFilter : null;  

        return axios.post('http://localhost:8080/api/cars/get', {
            isFilterModeEnabled,
            brandFilter,
            modelFilter,
            yearOfIssueMinFilter,
            yearOfIssueMaxFilter,
            bodyTypeFilter,
            engineVolumeMinFilter,
            engineVolumeMaxFilter,
            engineTypeFilter,
            transmissionTypeFilter,
            wheelDriveTypeFilter,
            mileageMinFilter,
            mileageMaxFilter,
            bodyColorFilter,
            interiorColorFilter,
            interiorMaterialFilter,
            priceMinFilter,
            priceMaxFilter,
            sortType
        }, {headers: authHeader(), params: {autodealerId: AutodealerService.getCurrentAutodealer()}});
    }

    getUserCars(searchBrand, sortType) {
        return axios.get("http://localhost:8080/api/cars/get/users", {headers: authHeader(), params: { searchBrand: searchBrand, userCarsListSortType: sortType }});
    }

    getNotSoldCars() {
        return axios.get("http://localhost:8080/api/cars/get/notSoldCars", { headers: authHeader(), params: { autodealerId: AutodealerService.getCurrentAutodealer() }});
    }

    getNotSoldCarsAndCurrentDealCar(id) {
        return axios.get("http://localhost:8080/api/cars/get/notSoldAndCurrentDealCar", { headers: authHeader(), params: { carId: id, autodealerId: AutodealerService.getCurrentAutodealer() }});
    }

    getSoldCars(sortType) {
        let carFilter = JSON.parse(localStorage.getItem('soldCarFilter'));

        let isFilterModeEnabled = carFilter != null ? carFilter.isFilterModeEnabled : false;

        let brandFilter = isFilterModeEnabled ? carFilter.brandFilter : null;
        let modelFilter = isFilterModeEnabled ? carFilter.modelFilter : null;
        let yearOfIssueMinFilter = isFilterModeEnabled ? carFilter.yearOfIssueMinFilter : null;
        let yearOfIssueMaxFilter = isFilterModeEnabled ? carFilter.yearOfIssueMaxFilter : null;
        let bodyTypeFilter = isFilterModeEnabled ? carFilter.bodyTypeFilter : null;
        let engineVolumeMinFilter = isFilterModeEnabled ? carFilter.engineVolumeMinFilter : null;
        let engineVolumeMaxFilter = isFilterModeEnabled ? carFilter.engineVolumeMaxFilter : null;
        let engineTypeFilter = isFilterModeEnabled ? carFilter.engineTypeFilter : null;
        let transmissionTypeFilter = isFilterModeEnabled ? carFilter.transmissionTypeFilter : null;
        let wheelDriveTypeFilter = isFilterModeEnabled ? carFilter.wheelDriveTypeFilter : null;
        let mileageMinFilter = isFilterModeEnabled ? carFilter.mileageMinFilter : null;
        let mileageMaxFilter = isFilterModeEnabled ? carFilter.mileageMaxFilter : null;
        let bodyColorFilter = isFilterModeEnabled ? carFilter.bodyColorFilter : null;
        let interiorColorFilter = isFilterModeEnabled ? carFilter.interiorColorFilter : null;
        let interiorMaterialFilter = isFilterModeEnabled ? carFilter.interiorMaterialFilter : null;
        let priceMinFilter = isFilterModeEnabled ? carFilter.priceMinFilter : null;
        let priceMaxFilter = isFilterModeEnabled ? carFilter.priceMinFilter : null;  

        return axios.post('http://localhost:8080/api/cars/get/sold', {
            isFilterModeEnabled,
            brandFilter,
            modelFilter,
            yearOfIssueMinFilter,
            yearOfIssueMaxFilter,
            bodyTypeFilter,
            engineVolumeMinFilter,
            engineVolumeMaxFilter,
            engineTypeFilter,
            transmissionTypeFilter,
            wheelDriveTypeFilter,
            mileageMinFilter,
            mileageMaxFilter,
            bodyColorFilter,
            interiorColorFilter,
            interiorMaterialFilter,
            priceMinFilter,
            priceMaxFilter,
            sortType
        }, {headers: authHeader(), params: {autodealerId: AutodealerService.getCurrentAutodealer()}});
    }

    add(brand, model, yearOfIssue, bodyType, engineVolume, engineType, transmissionType, wheelDriveType, mileage, bodyColor, interiorMaterial, interiorColor, price, image) {
        let autodealerId = AutodealerService.getCurrentAutodealer();
        return axios.post('http://localhost:8080/api/admin/cars/add',{ 
            brand,
            model, 
            yearOfIssue, 
            bodyType,
            engineVolume, 
            engineType, 
            transmissionType, 
            wheelDriveType, 
            mileage, 
            bodyColor, 
            interiorMaterial, 
            interiorColor, 
            price,
            image,
            autodealerId,
        }, {headers: authHeader()});
    }

    edit(id, brand, model, yearOfIssue, bodyType, engineVolume, engineType, transmissionType, wheelDriveType, mileage, bodyColor, interiorMaterial, interiorColor, price, image) {
        let autodealerId = AutodealerService.getCurrentAutodealer();
        return axios.patch('http://localhost:8080/api/admin/cars/edit/' + id, {
            id,
            brand,
            model,
            yearOfIssue,
            bodyType,
            engineVolume,
            engineType,
            transmissionType,
            wheelDriveType,
            mileage,
            bodyColor,
            interiorMaterial,
            interiorColor,
            price,
            image,
            autodealerId,
        }, {headers: authHeader()});
    }

    get(id) {
        return axios.get("http://localhost:8080/api/cars/get/" + id , {headers: authHeader(), params: {autodealerId: AutodealerService.getCurrentAutodealer()}});
    }

    delete(id) {
        return axios.delete("http://localhost:8080/api/admin/cars/delete/" + id, {headers: authHeader()});
    }

    order(carId) {
        return axios.post("http://localhost:8080/api/cars/order", null, { headers: authHeader(), params: { carId: carId } });
    }
}

export default new CarService();