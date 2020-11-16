import axios from "axios";

import AutodealerService from '../services/autodealer.service';

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    
    AutodealerService.removeAutodealerData();
  }

  register(username, password, firstname, surname, email, mobilePhone) {
    return axios.post(API_URL + "signup", {
      username,
      password,
      firstname,
      surname,
      email,
      mobilePhone
    });
  }

  getCurrentUser() {
    let user = localStorage.getItem('user');

    if (user === null) {
      console.log('asdasd');
      return null;
    }
    else {
      return JSON.parse(user);
    }
  }
}

export default new AuthService();