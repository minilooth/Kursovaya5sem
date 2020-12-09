import React, { Component } from "react";
import { Container, Button, Spinner } from 'react-bootstrap';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import AuthService from "../services/auth.service";
import UserService from '../services/user.service';

import EditProfileModal from './edit-profile-modal.component';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.showEditProfileModal = this.showEditProfileModal.bind(this);

    this.state = {
      currentUser: [],

      resetEditProfileModalData: true,
      showEditProfileModal: false,
      editProfileModalData: [],

      isLoading: true,
    };
  }

  handleEditProfileModalClose = () => {
    this.setState({
        showEditProfileModal: false,
        resetEditProfileModalData: true
    })
    this.refreshUserData();
  }

  showEditProfileModal = () => {
    this.setState({
        showEditProfileModal: true
    })
  }

  refreshUserData() {
    UserService.getCurrentUser().then(
      response => {
          this.setState({
              resetEditProfileModalData: false,
              currentUser: response.data,
              isLoading: false,
              editProfileModalData: {
                  id: response.data.id,
                  username: response.data.username,
                  firstname: response.data.firstname,
                  surname: response.data.surname,
                  email: response.data.email,
                  mobilePhone: response.data.mobilePhone,
              }
          })
      },
      error => {
        if (error.response.data.status === 401) {
            AuthService.logout();
            this.props.history.push({
                pathname: "/login",
                state: {
                  showToast: true,
                  toastMessage: "Сессия истекла, пожалуйста войдите в учетную запись."
                }
            });
            window.location.reload();
        }
        else {
            toast.error((error.response && 
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString(), {position: toast.POSITION.BOTTOM_RIGHT});
        }
      }
    ).catch(() => {
        toast.error("Что-то пошло не так :(", { position: toast.POSITION.BOTTOM_RIGHT });
    })
  }

  componentDidMount() {
      this.refreshUserData();
  }

  render() {
    let imageBlock = null;
    let dataBlock = null;

    if (!this.state.isLoading) {
        imageBlock = 
            <>
                <div className="profile__image-image">
                    <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" style={{width: "150px", height: "150px"}}/>
                </div>
                <div className="profile__image-username">
                    {this.state.currentUser.username}
                </div>
                <div className="profile__image-mobilephone">
                    {this.state.currentUser.mobilePhone}
                </div>
                <div className="profile__image-email">
                    {this.state.currentUser.email}
                </div>
                <div className="profile__image-btn">
                    <Button variant="outline-primary" onClick={this.showEditProfileModal}>Редактировать</Button>
                </div>
            </>;
        dataBlock = 
            <>
                <div className="profile__data-label-container">
                        <div className="profile__data-label-item">Имя пользователя</div>
                        <div className="profile__data-label-item">Пароль</div>
                        <div className="profile__data-label-item">Имя</div>
                        <div className="profile__data-label-item">Фамилия</div>
                        <div className="profile__data-label-item">Мобильный телефон</div>
                        <div className="profile__data-label-item">Email</div>
                        <div className="profile__data-label-item">Дата регистрации</div>
                        <div className="profile__data-label-item">Уровень доступа</div>
                    </div>
                    <div className="profile__data-container">
                        <div className="profile__data-item">{this.state.currentUser.username}</div>
                        <div className="profile__data-item">Зашифрован</div>
                        <div className="profile__data-item">{this.state.currentUser.firstname}</div>
                        <div className="profile__data-item">{this.state.currentUser.surname}</div>
                        <div className="profile__data-item">{this.state.currentUser.mobilePhone}</div>
                        <div className="profile__data-item">{this.state.currentUser.email}</div>
                        <div className="profile__data-item">{new Date(this.state.currentUser.dateOfRegistration).toLocaleString()}</div>
                        <div className="profile__data-item">{this.state.currentUser.roles &&
            this.state.currentUser.roles.map((role, index) => (<span key={index}> {role.name === "ADMIN" ? "Администратор" : "Пользователь"}</span>))}</div>
                    </div>
            </>
    }
    else {
        imageBlock = dataBlock = 
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}> 
                <Spinner animation="border" role="status">
                    <span className="sr-only">Загрузка...</span>
                </Spinner>
                &nbsp;
                <div>
                    <div style={{fontSize: "24px"}}>Загрузка...</div>
                </div>
            </div>
    }

    return (
        <Container style={{margin: "100px auto", width: "75%"}} fluid>
            <div className="profile-label"><FontAwesomeIcon icon={faUser}/>&nbsp;Ваш профиль</div>
            <div className="profile__container">
                <div className="profile__image">
                    {imageBlock}
                </div>
                <div className="profile__data">
                    {dataBlock}
                </div>
            </div>
            <EditProfileModal
                show={this.state.showEditProfileModal}
                resetData={this.state.resetEditProfileModalData} 
                onHide={this.handleEditProfileModalClose} 
                data={this.state.editProfileModalData}
                onCancel={this.handleEditProfileModalClose}/>
        </Container>
    );
  }
}