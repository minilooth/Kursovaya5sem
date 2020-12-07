import React, { Component } from 'react';
import {faSave, faPlusSquare, faUndo } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { Container, Card, Form, Col, Button, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import MaskedFormControl from 'react-bootstrap-maskedinput';

import 'react-toastify/dist/ReactToastify.css';

import UserService from "../services/user.service";


export default class AddUserBoard extends Component {
    constructor(props) {
        super(props);
        
        this.addUser = this.addUser.bind(this);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeFirstname = this.onChangeFirstname.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
    
        this.state = {
            username: "",
            password: "",
            firstname: "",
            surname: "",
            email: "",
            mobilePhone: "",
            roleId: "",

            isUsernameInvalid: false,
            isPasswordInvalid: false,
            isFirstnameInvalid: false,
            isSurnameInvalid: false,
            isEmailInvalid: false,
            isMobilePhoneInvalid: false,
            isRoleNotSelected: false,

            usernameError: "",
            passwordError: "",
            firstnameError: "",
            surnameError: "",
            emailError: "",
            mobilePhoneError: "",
            roleError: ""
        };

        this.isFormInvalid = false;
    }

    onUsernameFocus = () => {
        this.setState({ isUsernameInvalid: false })
    }

    onPasswordFocus = () => {
        this.setState({ isPasswordInvalid: false })
    }

    onFirstnameFocus = () => {
        this.setState({ isFirstnameInvalid: false })
    }

    onSurnameFocus = () => {
        this.setState({ isSurnameInvalid: false })
    }

    onEmailFocus = () => {
        this.setState({ isEmailInvalid: false })
    }

    onMobilePhoneFocus = () => {
        this.setState({ isMobilePhoneInvalid: false })
    }

    onRoleFocus = () => {
        this.setState({ isRoleNotSelected: false })
    }

    onChangeUsername(e) {
        this.setState({ username: e.target.value });
    }

    onChangeFirstname(e) {
        this.setState({ firstname: e.target.value });
    }

    onChangeSurname(e) {
        this.setState({ surname: e.target.value });
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value });
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value })
    }

    onChangePhoneNumber(e) {
        this.setState({ mobilePhone: e.target.value })
    }

    onChangeRole(e) {
        this.setState({ roleId: e.target.value })
    }

    resetForm = () => {
        this.setState({
            username: "",
            password: "",
            firstname: "",
            surname: "",
            email: "",
            mobilePhone: "",
            roleId: "",

            isUsernameInvalid: false,
            isPasswordInvalid: false,
            isFirstnameInvalid: false,
            isSurnameInvalid: false,
            isEmailInvalid: false,
            isMobilePhoneInvalid: false,
            isRoleNotSelected: false
        })
    }

    validate = () => {
        this.isFormInvalid = false;
    
        if (this.state.firstname.length === 0) {
          this.setState({
            firstnameError: "Это обязательное поле.",
            isFirstnameInvalid: true,
          })
          this.isFormInvalid = true;
        } 
        else if (this.state.firstname.length < 3 || this.state.firstname.length > 20) {
          this.setState({
            firstnameError: "Длина имени должна находится в диапазоне от 3 до 20 символов.",
            isFirstnameInvalid: true,
          })
          this.isFormInvalid = true;
        } 
        else if (!this.state.firstname.match(/^[A-Za-zА-Яа-я ]+$/)) {
          this.setState({
            firstnameError: "Имя должно состоять только из букв и символа пробела.",
            isFirstnameInvalid: true,
          })
          this.isFormInvalid = true;
        }
    
        if (this.state.surname.length === 0) {
          this.setState({
            surnameError: "Это обязательное поле.",
            isSurnameInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if (this.state.surname.length < 3 || this.state.surname.length > 20) {
          this.setState({
            surnameError: "Длина фамилии должна быть в диапазоне от 3 до 20 символов.",
            isSurnameInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if (!this.state.surname.match(/^[A-Za-zА-Яа-я ]+$/)) {
          this.setState({
            surnameError: "Фамилия должна состоять только из букв и символа пробела.",
            isSurnameInvalid: true,
          })
          this.isFormInvalid = true;
        }
    
        if (this.state.username.length === 0) {
          this.setState({
            usernameError: "Это обязательное поле.",
            isUsernameInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if (this.state.username.length < 5 || this.state.username.length > 20) {
          this.setState({
            usernameError: "Длина имени пользователя должна быть в диапазоне от 5 до 20 символов.",
            isUsernameInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if (!this.state.username.match(/^[A-Za-z0-9_]+$/)) {
          this.setState({
            usernameError: "Имя пользователя должно состоять только из букв латинского алфавита, цифр и символа \"_\". ",
            isUsernameInvalid: true,
          })
          this.isFormInvalid = true;
        }
    
        if (this.state.password.length === 0) {
          this.setState({
            passwordError: "Это обязательное поле.",
            isPasswordInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if (this.state.password.length < 6 || this.state.password.length > 20) {
          this.setState({
            passwordError: "Длина пароля должна быть в диапазоне от 6 до 20 символов.",
            isPasswordInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if (!this.state.password.match(/^[A-Za-z0-9!@#$%^&*]+$/)) {
          this.setState({
            passwordError: "Пароль может состоять только из букв латинского алфавита и символов !@#$%^&*.",
            isPasswordInvalid: true,
          })
          this.isFormInvalid = true;
        }
    
        if (this.state.email.length === 0) {
          this.setState({
            emailError: "Это обязательное поле.",
            isEmailInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if(this.state.email.length < 10 || this.state.email.length > 50) {
          this.setState({
            emailError: "Длина E-mail должна быть от 10 до 50 символов.",
            isEmailInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if (!this.state.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
          this.setState({
            emailError: "E-mail введен в некорректном формате.",
            isEmailInvalid: true,
          })
          this.isFormInvalid = true;
        }
    
        if (this.state.mobilePhone.length === 0) {
          this.setState({
            mobilePhoneError: "Это обязательное поле.",
            isMobilePhoneInvalid: true
          })
          this.isFormInvalid = true;
        }
        else if (this.state.mobilePhone.length !== 13) {
          this.setState({
            mobilePhoneError: "Мобильный телефон должен быть длиной в 17 символов.",
            isMobilePhoneInvalid: true,
          })
          this.isFormInvalid = true;
        }
        else if (!this.state.mobilePhone.match(/^[(]{1}[0-9]{2}[)]{1}[-\\s/0-9]{9}$/)) {
          this.setState({
            mobilePhoneError: "Мобильный телефон должен соответствовать шаблону +375(12)345-67-89.",
            isMobilePhoneInvalid: true,
          })
          this.isFormInvalid = true;
        }

        if (this.state.roleId.length === 0) {
            this.setState({
                roleError: "Это обязательное поле.",
                isRoleNotSelected: true,
            })
            this.isFormInvalid = true;
        }
    }

    addUser(e) {
        e.preventDefault();

        this.validate();

        if (this.isFormInvalid === false) {
            UserService.add(
                this.state.username,
                this.state.password,
                this.state.firstname,
                this.state.surname,
                this.state.email,
                "+375" + this.state.mobilePhone,
                this.state.roleId
            ).then(
              response => {
                  toast.success(response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});

                  this.resetForm();

                  setTimeout(() => this.props.history.push("/admin/userList"), 5000);
              },
              error => {
                  toast.error((error.response &&
                                  error.response.data &&
                                  error.response.data.message) ||
                                  error.message ||
                                  error.toString(), {position: toast.POSITION.BOTTOM_RIGHT});
              }
            ).catch(() => {
                toast.error("Что-то пошло не так :(", { position: toast.POSITION.BOTTOM_RIGHT });
            });
        }
    }

    render() {
        return (
            <Container style={{width: "50%", marginTop: "100px"}}>
              <Card className="border border-light bg-light text-black">
                <Form onSubmit={this.addUser} onReset={this.resetForm} noValidate>
                <Card.Header><FontAwesomeIcon icon={faPlusSquare}/>&nbsp;Добавление нового пользователя</Card.Header>
                  <Card.Body>
                    <Form.Row>
                      <Form.Group as={Col} id="usernameInput" className="left__form__group__style">
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control
                          name="username"
                          type="text"
                          autoComplete="off"
                          value={this.state.username}
                          isInvalid={this.state.isUsernameInvalid}
                          onFocus={this.onUsernameFocus.bind(this)}
                          onChange={this.onChangeUsername}
                          placeholder="Введите имя пользователя"/>
                        {this.state.isUsernameInvalid ? <span className="error">{this.state.usernameError}</span> : null}
                      </Form.Group>
                      <Form.Group as={Col} id="passwordInput" className="right__form__group__style">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                          name="password"
                          type="password"
                          autoComplete="off"
                          value={this.state.password}
                          isInvalid={this.state.isPasswordInvalid}
                          onFocus={this.onPasswordFocus.bind(this)}
                          onChange={this.onChangePassword}
                          placeholder="Введите пароль"/>
                        {this.state.isPasswordInvalid ? <span className="error">{this.state.passwordError}</span> : null}
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} id="firstnameInput" className="left__form__group__style">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                          name="firstname"
                          type="text"
                          autoComplete="off"
                          value={this.state.firstname}
                          isInvalid={this.state.isFirstnameInvalid}
                          onFocus={this.onFirstnameFocus.bind(this)}
                          onChange={this.onChangeFirstname}
                          placeholder="Введите имя"/>
                        {this.state.isFirstnameInvalid ? <span className="error">{this.state.firstnameError}</span> : null}
                      </Form.Group>
                      <Form.Group as={Col} id="surnameInput" className="right__form__group__style">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control
                          name="surname"
                          type="text"
                          autoComplete="off"
                          value={this.state.surname}
                          isInvalid={this.state.isSurnameInvalid}
                          onFocus={this.onSurnameFocus.bind(this)}
                          onChange={this.onChangeSurname}
                          placeholder="Введите фамилию"/>
                        {this.state.isSurnameInvalid ? <span className="error">{this.state.surnameError}</span> : null}
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} id="emailInput" className="left__form__group__style">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          name="email"
                          type="email"
                          autoComplete="off"
                          value={this.state.email}
                          isInvalid={this.state.isEmailInvalid}
                          onFocus={this.onEmailFocus.bind(this)}
                          onChange={this.onChangeEmail}
                          placeholder="Введите E-mail"/>
                        {this.state.isEmailInvalid ? <span className="error">{this.state.emailError}</span> : null}
                      </Form.Group>
                      <Form.Group as={Col} id="mobilePhoneInput" className="left__form__group__style">
                        <Form.Label>Мобильный телефон</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">+375</InputGroup.Text>
                            </InputGroup.Prepend>

                            <MaskedFormControl 
                            name="mobilePhone"
                            type="tel" 
                            autoComplete="off"
                            value={this.state.mobilePhone}
                            onChange={this.onChangePhoneNumber}
                            onFocus={this.onMobilePhoneFocus.bind(this)}
                            maxLength="9"
                            mask="(11)111-11-11"
                            isInvalid={this.state.isMobilePhoneInvalid}
                            placeholder="(__)___-__-__" />
                            {this.state.isMobilePhoneInvalid ? <span className="error">{this.state.mobilePhoneError}</span> : null}
                        </InputGroup>
                      </Form.Group>
                    </Form.Row>

                    <Form.Group id="roleSelect">
                        <Form.Label>Уровень доступа</Form.Label>
                        <Form.Control
                          as="select"
                          className="mr-sm-2"
                          custom
                          name="role"
                          value={this.state.roleId}
                          isInvalid={this.state.isRoleNotSelected}
                          onChange={this.onChangeRole}
                          onFocus={this.onRoleFocus.bind(this)}>
                                <option value="">Выберите...</option>
                                <option value="1">Пользователь</option>
                                <option value="2">Администратор</option>
                        </Form.Control>
                        {this.state.isRoleNotSelected ? <span className="error">{this.state.roleError}</span> : null}
                    </Form.Group>

                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: "40px"}}>
                        <Button variant="primary" type="submit" style={{width: "40%"}}><FontAwesomeIcon icon={faSave}/>&nbsp;Добавить</Button>
                        <Button variant="danger" type="reset" style={{width: "40%"}}><FontAwesomeIcon icon={faUndo}/>&nbsp;Очистить</Button>
                    </div>
                  </Card.Body>
                </Form>
              </Card>
              <ToastContainer limit={3}/>
            </Container>
          )
    }
}