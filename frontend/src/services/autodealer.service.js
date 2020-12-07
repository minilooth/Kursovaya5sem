import axios from 'axios';
import authHeader from './auth-header';

class AutodealerService {
    getCurrentAutodealer() {
        let autodealer = JSON.parse(localStorage.getItem("autodealer"));

        if (autodealer !== null) {
            return autodealer.id;
        }
        return null;
    }

    removeAutodealerData() {
        if (localStorage.getItem('autodealer') !== null) {
            localStorage.removeItem("autodealer");
        }
    }

    getAll(searchTitle, sortType) {
        return axios.get("http://localhost:8080/api/autodealers/get", {headers: authHeader(), params: {searchTitle: searchTitle, sortType: sortType}});
    }

    select(id) {
        return axios.get("http://localhost:8080/api/autodealers/select", {headers: authHeader(), params: {id: id}});
    }

    get(id) {
        return axios.get("http://localhost:8080/api/autodealers/get/" + id, {headers: authHeader()});
    }

    delete(id, currentAutodealerId) {
        return axios.delete("http://localhost:8080/api/admin/autodealers/delete/" + id, {headers: authHeader(), params: {currentAutodealerId: currentAutodealerId}});
    }

    add(title, workingHoursStart, workingHoursEnd, city, address, description) {
        return axios.post("http://localhost:8080/api/admin/autodealers/add", {
            title,
            workingHoursStart,
            workingHoursEnd,
            city,
            address,
            description
        }, {headers: authHeader()});
    }

    edit(id, title, workingHoursStart, workingHoursEnd, city, address, description) {
        return axios.patch("http://localhost:8080/api/admin/autodealers/edit/" + id, {
            title,
            workingHoursStart,
            workingHoursEnd,
            city,
            address,
            description
        }, {headers: authHeader()});
    }
}

export default new AutodealerService();