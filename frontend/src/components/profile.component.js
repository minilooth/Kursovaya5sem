import React, { Component } from "react";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="container" style={{marginTop: "100px"}}>
        <header className="jumbotron">
          <h3>
            Профиль <strong>{currentUser.username}</strong> 
          </h3>
        </header>
        <p>
          <strong>Имя:</strong>{" "}
          {currentUser.firstname}
        </p>
        <p>
          <strong>Фамилия:</strong>{" "}
          {currentUser.surname}
        </p>
        <p>
          <strong>E-mail:</strong>{" "}
          {currentUser.email}
        </p>
        <p>
          <strong>Мобильный телефон:</strong>{" "}
          {currentUser.mobilePhone}
        </p>
        <p>
          <strong>Дата регистрации:</strong>{" "}
          {currentUser.dateOfRegistration}
        </p>
        <strong>Уровень доступа:</strong>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <span key={index}> {role === "ADMIN" ? "Администратор" : "Пользователь"}</span>)}
      </div>
    );
  }
}