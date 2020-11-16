import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all', {headers: authHeader()});
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getAllUsers(searchUsername) {
    return axios.get('http://localhost:8080/api/admin/users/getAllUsers', {headers: authHeader(), params: {searchUsername: searchUsername}});
  }

  getUsers() {
    return axios.get('http://localhost:8080/api/admin/users/getUsers', { headers: authHeader() });
  }

  getUserById(id) {
    return axios.get('http://localhost:8080/api/admin/users/' + id, {headers: authHeader()});
  }

  editUser(id, username, password, firstname, surname, email, mobilePhone, roleId) {
    return axios.patch('http://localhost:8080/api/admin/users/edit/' + id, 
                       { id,
                         username,
                         password,
                         firstname,
                         surname,
                         email,
                         mobilePhone,
                         roleId}, {headers: authHeader()});
  }

  deleteUser(id) {
    return axios.delete('http://localhost:8080/api/admin/users/delete/' + id, {headers: authHeader()});
  }

  lockUser(id) {
    return axios.patch('http://localhost:8080/api/admin/users/lock/' + id, null, {headers: authHeader()});
  }

  addUser(username, password, firstname, surname, email, mobilePhone, roleId) {
    return axios.post('http://localhost:8080/api/admin/users/add', {
      username,
      password,
      firstname,
      surname,
      email,
      mobilePhone,
      roleId
    }, {headers: authHeader()});
  }
}

export default new UserService();