import axios from 'axios';
import authHeader from './auth-header';

class CarService {
    getNotSoldCars() {
        let carFilter = JSON.parse(localStorage.getItem('carFilter'));

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

        return axios.post('http://localhost:8080/api/cars/getNotSoldCars', {
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
            priceMaxFilter
        }, {headers: authHeader(), params: {autodealerId: JSON.parse(localStorage.getItem('autodealer')).id}});
    }

    getAllCars() {
        let carFilter = JSON.parse(localStorage.getItem('carFilter'));

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

        return axios.post('http://localhost:8080/api/cars/getAllCars', {
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
            priceMaxFilter
        }, {headers: authHeader(), params: {autodealerId: JSON.parse(localStorage.getItem('autodealer')).id}});
    }

    addCar(brand, model, yearOfIssue, bodyType, engineVolume, engineType, transmissionType, wheelDriveType, mileage, bodyColor, interiorMaterial, interiorColor, price, image) {
        let autodealerId = JSON.parse(localStorage.getItem('autodealer')).id;
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

    editCar(id, brand, model, yearOfIssue, bodyType, engineVolume, engineType, transmissionType, wheelDriveType, mileage, bodyColor, interiorMaterial, interiorColor, price, image) {
        let autodealerId = JSON.parse(localStorage.getItem('autodealer')).id;
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

    getCar(id) {
        return axios.get("http://localhost:8080/api/cars/" + id , {headers: authHeader(), params: {autodealerId: JSON.parse(localStorage.getItem('autodealer')).id}});
    }

    delete(id) {
        return axios.delete("http://localhost:8080/api/admin/cars/delete/" + id, {headers: authHeader()});
    }

    order(carId, userId) {
        return axios.post("http://localhost:8080/api/cars/order", {
            carId,
            userId
        }, { headers: authHeader() });
    }
}

export default new CarService();