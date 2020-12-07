import axios from 'axios';
import authHeader from './auth-header';

class UserService {
  getAll(searchUsername) {
    return axios.get('http://localhost:8080/api/admin/users/getAllUsers', {headers: authHeader(), params: {searchUsername: searchUsername}});
  }

  getUsers() {
    return axios.get('http://localhost:8080/api/admin/users/getUsers', { headers: authHeader() });
  }

  get(id) {
    return axios.get('http://localhost:8080/api/admin/users/' + id, {headers: authHeader()});
  }

  getCurrentUser() {
    return axios.get("http://localhost:8080/api/users/currentUser", { headers: authHeader() });
  }

  edit(id, username, password, firstname, surname, email, mobilePhone, roleId) {
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

  editProfile(id, username, password, firstname, surname, email, mobilePhone) {
    return axios.patch('http://localhost:8080/api/users/editProfile', {
      id,
      username,
      password,
      firstname,
      surname,
      email,
      mobilePhone
    }, {headers: authHeader()});
  }

  delete(id) {
    return axios.delete('http://localhost:8080/api/admin/users/delete/' + id, {headers: authHeader()});
  }

  lock(id) {
    return axios.patch('http://localhost:8080/api/admin/users/lock/' + id, null, {headers: authHeader()});
  }

  add(username, password, firstname, surname, email, mobilePhone, roleId) {
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