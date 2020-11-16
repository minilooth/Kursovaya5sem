import React, {Component} from 'react';

import { ButtonGroup, Card, Button, Container, InputGroup, FormControl } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faEdit, faTrash, faLock, faLockOpen, faSearch} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-toastify/dist/ReactToastify.css';

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import EditUserModal from './edit-user-modal.component';

export default class UserList extends Component {

    constructor(props) {
        super(props);
        console.log(props);

        this.state = {
            users: [],
            searchUsername: this.props.value,
            columns: [{
                dataField: 'id',
                text: 'Ид',
                sort: true,
                headerAlign: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '5%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'username',
                text: 'Имя пользователя',
                sort: true,
                headerAlign: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '10%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'password',
                text: 'Пароль',
                formatter: this.passwordFormatter,
                headerAlign: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '7%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'firstname',
                text: 'Имя',
                sort: true,
                headerAlign: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '10%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'surname',
                text: 'Фамилия',
                sort: true,
                headerAlign: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '10%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'email',
                text: 'E-mail',
                sort: true,
                headerAlign: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '10%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'mobilePhone',
                text: 'Мобильный телефон',
                sort: true,
                headerAlign: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '10%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'dateOfRegistration',
                text: 'Дата регистрации',
                sort: true,
                formatter: this.dateOfRegistrationFormatter,
                headerAlign: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '10%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'roles',
                text: 'Уровень доступа',
                sort: true,
                formatter: this.rolesFormatter,
                headerAlign: 'center',
                align: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '10%',
                    verticalAlign: 'middle'
                }
            }, {
                dataField: 'isAccountNonLocked',
                text: 'Заблокирован',
                sort: true,
                formatter: this.isAccountNonLockedFormatter,
                headerAlign: 'center',
                align: 'center',
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                headerStyle: {
                    width: '10%',
                    verticalAlign: 'middle'
                }
            }, {
                text: 'Действия',
                formatter: this.actionsFormatter,
                headerAlign: 'center',
                align: 'center',
                headerStyle: {
                    width: '9%',
                    verticalAlign: 'middle'
                }
            }],
            error: "",
            show: false,
            resetData: true,
            modalData: [],
        }

        this.searchUsername = "";

        this.searchOnChange = this.searchOnChange.bind(this);
    }

    editOnClick = (id) =>{
        UserService.getUserById(id).then(
            response => {
                this.setState({
                    show: !this.state.show,
                    resetData: false,
                    modalData: {
                        id: response.data.id,
                        username: response.data.username,
                        firstname: response.data.firstname,
                        surname: response.data.surname,
                        email: response.data.email,
                        mobilePhone: response.data.mobilePhone,
                        role: response.data.roles[0].name
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
                                error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }
        )
    }

    actionsFormatter = (cell, row) => {
        return(
            <ButtonGroup>
                <div className="btn btn-sm btn-outline-primary" onClick={this.editOnClick.bind(this, row.id)}><FontAwesomeIcon icon={faEdit}/></div>
                &nbsp;
                <Button size="sm" variant="outline-danger" onClick={this.deleteUser.bind(this, row.id)}><FontAwesomeIcon icon={faTrash}/></Button>
                &nbsp;
                <Button size="sm" variant="outline-success" onClick={this.lockUser.bind(this, row.id)}><FontAwesomeIcon icon={row.isAccountNonLocked === 1 ? faLock : faLockOpen}/></Button>
            </ButtonGroup>
        );
    }

    isAccountNonLockedFormatter = (isAccountNonLocked) => {
        return isAccountNonLocked === 1 ? "Нет" : "Да";
    }
    
    dateOfRegistrationFormatter = (dateOfRegistration) => {
        return new Date(dateOfRegistration).toLocaleString();
    }
    
    passwordFormatter = () => {
        return "Зашифрован";
    }
    
    rolesFormatter = (roles) => {
        return roles[0].name === "ADMIN" ? "Администратор" : "Пользователь";
    }

    noDataIndication = () => {
        return this.options.noDataText;
    }

    refreshUserList() {
        UserService.getAllUsers(this.searchUsername).then(
            response => {
                this.setState({
                    users: response.data
                });
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
                        error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }
        )
    }

    deleteUser = (id) => {
        UserService.deleteUser(id).then(
            response => {
                this.refreshUserList();
                toast.success(response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});
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
                        error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }
        )
    }

    lockUser = (id) => {
        UserService.lockUser(id).then(
            response => {
                this.refreshUserList();
                toast.success(response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});
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
                        error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });    
                }
            }
        )
    }

    searchOnChange = event => {
        this.searchUsername = event.target.value;
        this.refreshUserList();
    }

    componentDidMount() {
        this.refreshUserList();
    }

    handleClose = () => {
        this.setState({
            show: false,
            resetData: true
        })
        this.refreshUserList();
    }

    render() {
        return(
            <div>
                <Container style={{marginBottom: "50px", width: "95%"}} fluid>
                    <Card className={"border border-light bg-light text-black"} style={{marginTop: "100px"}}>
                        <Card.Header className={"d-flex justify-content-between"} >
                            <div style={{display: 'flex', alignItems: 'center', fontSize: '18px'}}><FontAwesomeIcon icon={faList}/>&nbsp;Список пользователей</div>
                            <div>
                                <InputGroup style={{width: "250px"}}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faSearch}/></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.searchUsername}
                                        ref={input => { this.inputElement = input }}
                                        onChange={this.searchOnChange}
                                        placeholder="Имя пользователя"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                    />
                                </InputGroup>
                            </div>    
                        </Card.Header>
                        <Card.Body style={{fontSize: "12px"}}>
                            <BootstrapTable 
                                keyField='id' 
                                data={this.state.users} 
                                columns={this.state.columns} 
                                hover 
                                condensed 
                                bordered 
                                bootstrap4 
                                pagination={ paginationFactory() } 
                                noDataIndication={this.searchUsername === "" ? "Список пользователей пока пуст :(" : "Не найдено ни одного пользователя :("} />
                        </Card.Body>
                    </Card>
                </Container>
                <EditUserModal 
                    show={this.state.show}
                    resetData={this.state.resetData} 
                    onHide={this.handleClose} 
                    data={this.state.modalData}
                    onCancel={this.handleClose}/>
                <ToastContainer limit={3}/>
            </div>
        )
    }
}