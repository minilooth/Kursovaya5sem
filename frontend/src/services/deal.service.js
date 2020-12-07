import axios from 'axios';
import authHeader from './auth-header';

class DealService {
    getAll(searchUsername, sortType) {
        return axios.get("http://localhost:8080/api/admin/deals/get", { headers: authHeader(), params: { searchUsername: searchUsername, sortType: sortType } });
    }

    get(id) {
        return axios.get("http://localhost:8080/api/admin/deals/get/" + id, { headers: authHeader() });
    }

    confirm(id) {
        return axios.patch("http://localhost:8080/api/admin/deals/confirm/" + id, null, { headers: authHeader() });
    }

    delete(id) {
        return axios.delete("http://localhost:8080/api/admin/deals/delete/" + id, { headers: authHeader() });
    }

    add(userId, carId) {
        return axios.post("http://localhost:8080/api/admin/deals/add", {
            userId,
            carId
        }, { headers: authHeader() });
    }

    edit(id, userId, carId) {
        return axios.post("http://localhost:8080/api/admin/deals/edit/" + id, {
            userId,
            carId
        }, { headers: authHeader() });
    }
}

export default new DealService();