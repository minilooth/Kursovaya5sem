import axios from 'axios';
import authHeader from './auth-header';

class DealService {
    get(searchUsername) {
        return axios.get("http://localhost:8080/api/admin/deals/get", { headers: authHeader(), params: { searchUsername: searchUsername } });
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
}

export default new DealService();