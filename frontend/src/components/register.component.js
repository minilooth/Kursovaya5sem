import React, { Component } from "react";

import AuthService from "../services/auth.service";
import {Container, Card, Form, Col, Button, InputGroup} from 'react-bootstrap';
import MaskedFormControl from 'react-bootstrap-maskedinput';


const leftFormGroupStyle = {
  marginRight: "15px"
}

const rightFormGroupStyle = {
  marginLeft: "15px"
}

const errorStyle = {
  color: 'red',
  fontSize: "14px"
}

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeFirstname = this.onChangeFirstname.bind(this);
    this.onChangeSurname = this.onChangeSurname.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);

    this.state = {
      username: "",
      password: "",
      firstname: "",
      surname: "",
      email: "",
      mobilePhone: "",

      successful: false,
      message: "",

      isUsernameInvalid: false,
      isPasswordInvalid: false,
      isFirstnameInvalid: false,
      isSurnameInvalid: false,
      isEmailInvalid: false,
      isMobilePhoneInvalid: false,

      usernameError: "",
      passwordError: "",
      firstnameError: "",
      surnameError: "",
      emailError: "",
      mobilePhoneError: ""
    };

    this.isFormInvalid = false;

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
        isMobilePhoneInvalid: true,
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
  }

  onUsernameFocus = () => {
    this.setState({
      isUsernameInvalid: false
    })
  }

  onPasswordFocus = () => {
    this.setState({
      isPasswordInvalid: false
    })
  }

  onFirstnameFocus = () => {
    this.setState({
      isFirstnameInvalid: false
    })
  }

  onSurnameFocus = () => {
    this.setState({
      isSurnameInvalid: false,
    })
  }

  onEmailFocus = () => {
    this.setState({
      isEmailInvalid: false,
    })
  }

  onMobilePhoneFocus = () => {
    this.setState({
      isMobilePhoneInvalid: false
    })
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangeFirstname(e) {
    this.setState({
      firstname: e.target.value
    });
  }

  onChangeSurname(e) {
    this.setState({
      surname: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  onChangePhoneNumber(e) {
    this.setState({
      mobilePhone: e.target.value
    })
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.validate()

    if (this.isFormInvalid === false) {
      AuthService.register(
        this.state.username,
        this.state.password,
        this.state.firstname,
        this.state.surname,
        this.state.email,
        "+375" + this.state.mobilePhone
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    return (
      <Container style={{width: "50%", marginTop: "100px"}}>
        <Card className="border border-light bg-light text-black">
          <Form onSubmit={this.handleRegister} noValidate>
            <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card"/>
            <Card.Body>
              {!this.state.successful && (
                <div>
                  <Form.Row>
                    <Form.Group as={Col} id="usernameInput" style={leftFormGroupStyle}>
                      <Form.Label>Имя пользователя</Form.Label>
                      <Form.Control
                        name="username"
                        type="text"
                        autoComplete="off"
                        value={this.state.username}
                        isInvalid={this.state.isUsernameInvalid}
                        onFocus={this.onUsernameFocus.bind(this)}
                        onChange={this.onChangeUsername}
                        placeHolder="Введите имя пользователя"/>
                      {this.state.isUsernameInvalid ? <span style={errorStyle}>{this.state.usernameError}</span> : null}
                    </Form.Group>
                    <Form.Group as={Col} id="passwordInput" style={rightFormGroupStyle}>
                    <Form.Label>Пароль</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        autoComplete="off"
                        value={this.state.password}
                        isInvalid={this.state.isPasswordInvalid}
                        onFocus={this.onPasswordFocus.bind(this)}
                        onChange={this.onChangePassword}
                        placeHolder="Введите пароль"/>
                      {this.state.isPasswordInvalid ? <span style={errorStyle}>{this.state.passwordError}</span> : null}
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} id="firstnameInput" style={leftFormGroupStyle}>
                      <Form.Label>Имя</Form.Label>
                      <Form.Control
                        name="firstname"
                        type="text"
                        autoComplete="off"
                        value={this.state.firstname}
                        isInvalid={this.state.isFirstnameInvalid}
                        onFocus={this.onFirstnameFocus.bind(this)}
                        onChange={this.onChangeFirstname}
                        placeHolder="Введите имя"/>
                      {this.state.isFirstnameInvalid ? <span style={errorStyle}>{this.state.firstnameError}</span> : null}
                    </Form.Group>
                    <Form.Group as={Col} id="surnameInput" style={rightFormGroupStyle}>
                    <Form.Label>Фамилия</Form.Label>
                      <Form.Control
                        name="surname"
                        type="text"
                        autoComplete="off"
                        value={this.state.surname}
                        isInvalid={this.state.isSurnameInvalid}
                        onFocus={this.onSurnameFocus.bind(this)}
                        onChange={this.onChangeSurname}
                        placeHolder="Введите фамилию"/>
                      {this.state.isSurnameInvalid ? <span style={errorStyle}>{this.state.surnameError}</span> : null}
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} id="emailInput" style={leftFormGroupStyle}>
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        autoComplete="off"
                        value={this.state.email}
                        isInvalid={this.state.isEmailInvalid}
                        onFocus={this.onEmailFocus.bind(this)}
                        onChange={this.onChangeEmail}
                        placeHolder="Введите E-mail"/>
                      {this.state.isEmailInvalid ? <span style={errorStyle}>{this.state.emailError}</span> : null}
                    </Form.Group>
                    <Form.Group as={Col} id="mobilePhoneInput" style={rightFormGroupStyle}>
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
                        {this.state.isMobilePhoneInvalid ? <span style={errorStyle}>{this.state.mobilePhoneError}</span> : null}
                      </InputGroup>
                    </Form.Group>
                  </Form.Row>

                  <Form.Group style={{display: 'flex', justifyContent: 'center', marginTop: "20px"}}>
                    <Button variant="primary" type="submit" style={{width: "50%"}}>Зарегистрироваться</Button>
                  </Form.Group>
                </div>
              )}

              {this.state.message && (
                <Form.Group className="text-center" style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
                  <div className={this.state.successful ? "alert alert-success" : "alert alert-danger"} role="alert" style={{width: "50%"}}>
                    {this.state.message}
                  </div>
                </Form.Group>
              )}
            </Card.Body>
          </Form>
        </Card>
      </Container>
    )
  }
}