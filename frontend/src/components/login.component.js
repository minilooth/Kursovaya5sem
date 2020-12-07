import React, { Component } from "react";

import AuthService from "../services/auth.service";

import 'react-toastify/dist/ReactToastify.css';
import { Form, Card, Container, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";


const errorStyle = {
  color: 'red',
  fontSize: "14px"
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",

      prevProps: [],

      loading: false,
      message: "",

      toastMessage: this.props.location.state == null ? "" : this.props.location.state.toastMessage, 
      showToast: this.props.location.state == null ? false : this.props.location.state.showToast,

      isUsernameInvalid: false,
      isPasswordInvalid: false,

      usernameError: "",
      passwordError: "",
    };

    this.isFormInvalid = false;
  }

  setMessage(message) {
    this.setState({
      message: message
    })
  }

  onUsernameFocus() {
    this.setState({
      isUsernameInvalid: false,
    })
  }

  onPasswordFocus() {
    this.setState({
      isPasswordInvalid: false,
    })
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  validate = () => {
    this.isFormInvalid = false;

    if (this.state.username.length === 0) {
      this.setState({
        usernameError: "Это обязательное поле.",
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
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.validate();

    if (this.isFormInvalid === false) {
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          window.location.replace("/");
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      }).catch(
        error => {
            toast.error("Что-то пошло не так :(", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    );
    }
  }

  render() {
    if (this.state.showToast && this.state.toastMessage !== null) {
      toast.error(this.state.toastMessage, {position: toast.POSITION.BOTTOM_RIGHT});
      this.setState({
        showToast: false,
        toastMessage: null
      })
    }

    return (
      <Container style={{marginTop: "100px", width: "25%"}}>
        <Card>
          <Card.Body>
            <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card"/>
            <Form onSubmit={this.handleLogin} noValidate>
              <Form.Group id="usernameInput">
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
                {this.state.isUsernameInvalid ? <span style={errorStyle}>{this.state.usernameError}</span> : null}
              </Form.Group>
              <Form.Group id="passwordInput">
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
                {this.state.isPasswordInvalid ? <span style={errorStyle}>{this.state.passwordError}</span> : null}
              </Form.Group>

              <Form.Group>
                <Button variant="primary" type="submit" disabled={this.state.loading} style={{width: "100%", marginTop: "25px"}}>
                  {this.state.loading && (
                    <span className="spinner-border spinner-border-sm" style={{marginRight: "5px"}}></span>
                  )}
                  <span>Войти</span>
                </Button>
              </Form.Group>

              {this.state.message && (
                <Form.Group>
                  <div className="alert alert-danger" role="alert">
                    {this.state.message}
                  </div>
                </Form.Group>
              )}

            </Form>
          </Card.Body>
        </Card>
        <ToastContainer limit={3}/>
      </Container>
    )
  }
}