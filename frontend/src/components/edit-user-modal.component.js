import React, {Component} from 'react';
import {Modal, Button, Form, Col, InputGroup} from 'react-bootstrap';
import MaskedFormControl from 'react-bootstrap-maskedinput';
import { faTimes, faSave, faEdit } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import UserService from '../services/user.service';
import AuthService from '../services/auth.service';

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

const infoStyle = {
  fontSize: "11px",
  margin: "0",
  padding: "0"
}

function formatMobilePhone(mobilePhone) {
  var mobilePhoneString = String(mobilePhone);

  var formattedMobilePhone = "(" + mobilePhoneString.substring(5,7) + ")" + mobilePhoneString.substring(8,11) + "-" + mobilePhoneString.substring(12,14) + "-" + mobilePhoneString.substring(15,17);

  return formattedMobilePhone;
}

export default class EditUserModal extends Component {
    constructor(props) {
        super(props);

        this.editUser = this.editUser.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeFirstname = this.onChangeFirstname.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
    
        this.state = {
            id: 0,
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
            roleError: "",

            isChangeButtonDisabled: false,
        };

        this.isFormInvalid = false;
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

    onRoleFocus = () => {
        this.setState({
            isRoleNotSelected: false
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

    onChangeRole(e) {
        this.setState({
            roleId: e.target.value
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
    
        if (this.state.password.length !== 0) {
          if (this.state.password.length < 6 || this.state.password.length > 20) {
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
          console.log(this.state.mobilePhone + " " + this.state.mobilePhone.length); 
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

      editUser(e) {
        e.preventDefault();

        this.validate();

        if (this.isFormInvalid === false) {
          this.setState({
            isChangeButtonDisabled: true
          })
          
          UserService.edit(
            this.state.id,
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
              this.props.onHide();

              this.setState({
                isChangeButtonDisabled: false
              });
            },
            error => {
              if (error.response.data.status === 401) {
                  this.setState({
                    isChangeButtonDisabled: false
                  });
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
                  this.setState({
                    isChangeButtonDisabled: false
                  });
                  toast.error((error.response && 
                              error.response.data &&
                              error.response.data.message) ||
                              error.message ||
                              error.toString(), {position: toast.POSITION.BOTTOM_RIGHT});
              }
            }
          ).catch(
            error => {
                toast.error("Что-то пошло не так :(", { position: toast.POSITION.BOTTOM_RIGHT });
            }
          )
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.prevData || props.resetData) {
          return {
                prevData: props.data,
                id: props.data.id,
                username: props.data.username,
                password: "",
                firstname: props.data.firstname,
                surname: props.data.surname,
                email: props.data.email,
                mobilePhone: formatMobilePhone(props.data.mobilePhone),
                roleId: props.data.role === "ADMIN" ? 2 : 1,
          };
        }
        return null;
    }

    render() {
        return (
            <>
            <Modal
              size="lg"
              show={this.props.show}
              onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title><FontAwesomeIcon icon={faEdit}/>&nbsp;Редактирование пользователя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={this.addUser} onReset={this.resetForm} noValidate>
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
                              placeholder="Введите имя пользователя"/>
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
                              placeholder="Введите пароль"/>
                            <div style={infoStyle}>Оставьте это поле пустым если не нужно изменять пароль.</div>
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
                              placeholder="Введите имя"/>
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
                              placeholder="Введите фамилию"/>
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
                              placeholder="Введите E-mail"/>
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
                              onFocus={this.onRoleFocus}>
                                    <option value="">Выберите...</option>
                                    <option value="1">Пользователь</option>
                                    <option value="2">Администратор</option>
                            </Form.Control>
                            {this.state.isRoleNotSelected ? <span style={errorStyle}>{this.state.roleError}</span> : null}
                        </Form.Group>
                      </div>
                    )}
                </Form>       
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.editUser.bind(this)} disabled={this.state.isChangeButtonDisabled}><FontAwesomeIcon icon={faSave}/>&nbsp;Изменить</Button>
                    <Button variant="danger" onClick={this.props.onCancel}><FontAwesomeIcon icon={faTimes}/>&nbsp;Отменить</Button>
                </Modal.Footer>
                <ToastContainer/>
            </Modal>
            </>
        )
    }
}