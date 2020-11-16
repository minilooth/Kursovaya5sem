import axios from 'axios';
import authHeader from './auth-header';

class AutodealerService {
    removeAutodealerData() {
        if (localStorage.getItem('autodealer') !== null) {
            localStorage.removeItem("autodealer");
        }
    }

    getAutodealers(searchTitle) {
        return axios.get("http://localhost:8080/api/autodealers/list", {headers: authHeader(), params: {searchTitle: searchTitle}});
    }

    selectAutodealer(id) {
        return axios.get("http://localhost:8080/api/autodealers/select", {headers: authHeader(), params: {id: id}});
    }

    getAutodealer(id) {
        return axios.get("http://localhost:8080/api/autodealers/" + id, {headers: authHeader()});
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