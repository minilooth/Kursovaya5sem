import axios from 'axios';
import authHeader from './auth-header';

import AutodealerService from './autodealer.service';

class StatisticsService {
    get() {
        return axios.get("http://localhost:8080/api/admin/statistics/get", { headers: authHeader(), params: { autodealerId: AutodealerService.getCurrentAutodealer() } });
    }
}

export default new StatisticsService();