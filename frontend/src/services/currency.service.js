import axios from 'axios';

class CurrencyService {
    getDollarRate() {
        return axios.get('https://www.nbrb.by/api/exrates/rates/145');
    }

    getEuroRate() {
        return axios.get("https://www.nbrb.by/api/exrates/rates/292");
    }
} 

export default new CurrencyService();