import React, { Component } from "react";
import {NavDropdown, Nav, Navbar, Button } from "react-bootstrap";
import { Switch, Route, withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import UserList from "./components/user-list.component";
import AddUserBoard from "./components/add-user-board";
import CarsList from "./components/cars-list.component";
import AddCar from "./components/add-car.component";
import CarInfo from "./components/car-info.component";
import PageNotFound from './components/errors/page-not-found.component';
import AccessDenied from "./components/errors/access-denied-component";
import SelectAutodealer from './components/select-autodealer.component';
import AutodealersList from './components/autodealers-list.component';
import AddAutodealer from './components/add-autodealer.component';
import DealsList from './components/deals-list.component';
import AddDeal from './components/add-deal.component';
import UserCarsList from './components/user-cars-list.component';
import StatisticsPage from './components/statistics-page.component';

class App extends Component {
  constructor(props) {
    super(props);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.onSelectAutodealerClick = this.onSelectAutodealerClick.bind(this);

    this.state = {
      showUserBoard: false,
      showAdminBoard: false,
      showSelectAutodealerModal: false,
      currentUser: null
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        isAdmin: user.roles.includes("ADMIN"),
      });
    }
  }

  onLogoutClick() {
    AuthService.logout();
  }

  handleSelectAutodealerModalClose = () => {
    this.setState({
        showSelectAutodealerModal: false,
    })
  }

  onSelectAutodealerModalSelect = () => {
    window.location.reload();
  }

  onSelectAutodealerClick() {
    this.setState({
      showSelectAutodealerModal: true,
    })
  }

  render() {
    let selectAutodealerModal = null;

    if (AuthService.getCurrentUser() !== null) {
      selectAutodealerModal = 
        <SelectAutodealer 
        prevProps={ this.props }
        show={ this.state.showSelectAutodealerModal }
        onHide={ this.handleSelectAutodealerModalClose } 
        onSelect={ this.onSelectAutodealerModalSelect }
        onCancel={ this.handleSelectAutodealerModalClose }/>
    }

    return (
      <div>
        <Navbar className="navbar navbar-expand navbar-light bg-light justify-content-between" fixed="top">
          <Navbar.Brand href="/">Автосалоны</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            { this.state.isAdmin ? (
              <Nav className="mr-auto">
                <NavDropdown title="Пользователи" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/admin/addUser">Добавить пользователя</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/userList">Список пользователей</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Автомобили" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/admin/addCar">Добавить автомобиль</NavDropdown.Item>
                  <NavDropdown.Item href="/carsList">Список автомобилей</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Автосалоны" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/admin/addAutodealer">Добавить автосалон</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/autodealersList">Список автосалонов</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Сделки" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/admin/addDeal">Добавить сделку</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/dealsList">Список сделок</NavDropdown.Item>
                </NavDropdown>

                <Nav.Link href="/admin/statistics">Статистика</Nav.Link>
              </Nav>
            ) : (
              null
            ) }

            { this.state.currentUser != null && !this.state.isAdmin ? (
              <Nav>
                <Nav.Link href="/carsList">Список автомобилей</Nav.Link>
                <Nav.Link href="/myCars">Мои автомобили</Nav.Link>
              </Nav>
            ) : (
              null
            ) }

            { this.state.currentUser ? (
              <Nav className="ml-auto">
                <Nav.Item>
                  <Button variant="outline-dark" style={{ marginRight: "25px" }} onClick={ this.onSelectAutodealerClick }>Изменить автосалон</Button>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/profile">{ this.state.currentUser.username }</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/login" onClick={ this.onLogoutClick }>Выйти</Nav.Link>
                </Nav.Item>
              </Nav>
            ) : (
              <Nav className="ml-auto">
                <Nav.Item>
                  <Nav.Link href="/login">Войти</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/register">Зарегистрироваться</Nav.Link>
                </Nav.Item>
              </Nav>
            ) }
          </Navbar.Collapse>
        </Navbar>

        <Switch>
            <Route exact path={["/", "/home"]} component={ Home } />
            <Route exact path="/login" component={ Login }/>
            <Route exact path="/register" component={ Register } />
            <Route exact path="/profile" component={ Profile } />
            <Route exact path="/admin/userList" component={ this.state.isAdmin ? UserList : AccessDenied }/>
            <Route exact path="/admin/addUser" component={ this.state.isAdmin ? AddUserBoard : AccessDenied }/>
            <Route exact path="/admin/editUser/:id" component={ this.state.isAdmin ? AddUserBoard : AccessDenied }/>
            <Route exact path="/carsList" component={ CarsList } />
            <Route exact path="/cars/:id" component={ CarInfo }/>
            <Route exact path="/admin/addCar" render={(props) => { return this.state.isAdmin ? (<AddCar {...props} toast={toast}/>) : (<AccessDenied {...props} toast={toast}/>) }}/>
            <Route exact path="/admin/autodealersList" component={ this.state.isAdmin ? AutodealersList : AccessDenied }/>
            <Route exact path="/admin/addAutodealer" component={ this.state.isAdmin ? AddAutodealer : AccessDenied }/>
            <Route exact path="/admin/dealsList" component={ this.state.isAdmin ? DealsList : AccessDenied }/>
            <Route exact path="/admin/addDeal" component={ this.state.isAdmin ? AddDeal : AccessDenied }/>
            <Route exact path="/admin/statistics" component={this.state.isAdmin ? StatisticsPage : AccessDenied}/>
            <Route exact path="/myCars" component={UserCarsList}/>
            <Route component={ PageNotFound }/>
        </Switch>
        {selectAutodealerModal}
        <ToastContainer limit={ 3 }/>
      </div>
    );
  }
}

export default withRouter(App);