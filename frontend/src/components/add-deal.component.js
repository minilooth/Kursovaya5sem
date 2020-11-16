import React, { Component } from 'react';
import { Card, Container, Form, Button, Col } from 'react-bootstrap';
import {faSave, faPlusSquare, faUndo } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import CarService from '../services/car.service';
import DealService from '../services/deal.service';

const errorStyle = {
    color: 'red',
    fontSize: "14px"
}

export default class AddDeal extends Component {
    constructor(props) {
        super(props);

        this.onReset = this.onReset.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.onCarIdChange = this.onCarIdChange.bind(this);
        this.onUserIdChange = this.onUserIdChange.bind(this);

        this.onCarIdFocus = this.onCarIdFocus.bind(this);
        this.onUserIdFocus = this.onUserIdFocus.bind(this);

        this.state = {
            users: [],
            cars: [],

            carId: "",
            userId: "",

            isCarIdInvalid: false,
            isUserIdInvalid: false,

            carIdError: "",
            userIdError: "",

            image: null
        }

        this.isFormInvalid = false;
    }

    onCarIdFocus = () => {
        this.setState({
            isCarIdInvalid: false,
        })
    }

    onUserIdFocus = () => {
        this.setState({
            isUserIdInvalid: false,
        })
    }

    onCarIdChange = (e) => {
        this.setState({
            carId: e.target.value,
        })

        if (e.target.value !== "") {
            this.setState({
                image: this.state.cars.find(c => c.id == e.target.value).image
            })
        }
        else {
            this.setState({
                image: null
            })
        }
    }

    onUserIdChange = (e) => {
        this.setState({
            userId: e.target.value
        })
    }

    validate = () => {
        this.isFormInvalid = false;

        if (this.state.carId === "") {
            this.setState({
                isCarIdInvalid: true,
                carIdError: "Это обязательное поле."
            })
            this.isFormInvalid = true;
        }

        if (this.state.userId === "") {
            this.setState({
                isUserIdInvalid: true,
                userIdError: "Это обязательное поле."
            })
            this.isFormInvalid = true;
        }
    }

    onReset = () => {
        console.log(this.state);
        this.setState({
            carId: "",
            userId: "",

            isCarIdInvalid: false,
            isUserIdInvalid: false,

            image: null
        });
        console.log(this.state);
    }

    onSubmit = (e) => {
        e.preventDefault();

        this.validate();

        if (!this.isFormInvalid) {
            DealService.add(this.state.userId, this.state.carId).then(
                response => {
                    toast.success(response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});

                    this.onReset();

                    setTimeout(() => this.props.history.push({
                        pathname: "/admin/dealsList"
                    }), 5000);
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
    }

    componentDidMount() {
        UserService.getUsers().then(
            response => {
                this.setState({
                    users: response.data
                })
            },
            error => {
                if (error.response.data.status === 401) {
                    AuthService.logout();
                    this.props.prevProps.history.push({
                        pathname: "/login",
                        state: {
                            showToast: true,
                            toastMessage: "Сессия истекла, пожалуйста войдите в учетную запись."
                        }
                    });
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

        CarService.getNotSoldCars().then(
            response => {
                this.setState({
                    cars: response.data.cars
                })
            },
            error => {
                if (error.response.data.status === 401) {
                    AuthService.logout();
                    this.props.prevProps.history.push({
                        pathname: "/login",
                        state: {
                            showToast: true,
                            toastMessage: "Сессия истекла, пожалуйста войдите в учетную запись."
                        }
                    });
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

    render() {
        return(
            <Container style={{marginTop: "100px", marginBottom: "100px", width: "60%"}} fluid>
                <Card>
                    <Form noValidate onReset={this.onReset} onSubmit={this.onSubmit}>
                        <Card.Header style={{fontSize: "20px"}}><FontAwesomeIcon icon={faPlusSquare}/>&nbsp;Добавление сделки</Card.Header>
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} id="username">
                                    <Form.Label>Пользователь</Form.Label>
                                    <Form.Control
                                        name="username"
                                        as="select"
                                        autoComplete="off"
                                        value={this.state.userId}
                                        isInvalid={this.state.isUserIdInvalid}
                                        onFocus={this.onUserIdFocus}
                                        onChange={this.onUserIdChange}>
                                        <option value="" hidden>Выберите...</option>
                                        {
                                            this.state.users.map((user) => {
                                                return <option key={user.id} value={user.id}>{user.username}</option>
                                            })
                                        }
                                    </Form.Control>
                                    {this.state.isUserIdInvalid ? <span style={errorStyle}>{this.state.userIdError}</span> : null}
                                </Form.Group>
                            </Form.Row>
                            <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
                                        <div style={{width: "50%", display: "flex", alignItems: "center"}}>
                                            <Form.Group id="photo" style={{paddingRight: "20px", width: "100%"}}>
                                                <Form.Label>Автомобиль</Form.Label>
                                                <Form.Control
                                                name="car"
                                                as="select"
                                                autoComplete="off"
                                                value={this.state.carId}
                                                isInvalid={ this.state.isCarIdInvalid }
                                                onFocus= { this.onCarIdFocus }
                                                onChange={this.onCarIdChange}>
                                                    <option value="" hidden>Выберите...</option>
                                                    {
                                                        this.state.cars.map((car) => {
                                                            return <option key={car.id} value={car.id}>{car.brand} {car.model}, {car.yearOfIssue} г. в., {car.mileage} км</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                {this.state.isCarIdInvalid ? <span style={errorStyle}>{this.state.carIdError}</span> : null}
                                            </Form.Group>
                                        </div>
                                        <div style={{width: "50%", paddingLeft: "20px"}}>
                                            {this.state.image === null ? 
                                            (
                                                <div className="add__car__photo-empty">
                                                    <svg width="60%" viewBox="0 0 110 45" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentcolor"><path d="M8.353 35.068l-.033.083-.328-.132-.861-.348c-.89-.362-1.781-.729-2.614-1.078l-.3-.127a82.46 82.46 0 0 1-2.453-1.072 14.866 14.866 0 0 1-.851-.421 3.366 3.366 0 0 1-.339-.208 1.511 1.511 0 0 1-.229-.198 1.147 1.147 0 0 1-.344-.874c.014-.883.019-4.528.018-10.026l-.004-6.424-.003-2.765-.001-.785v-.28L.009 9.24l1.172-.024.387-.007a212.997 212.997 0 0 1 2.855-.037c.6-.004 1.139-.005 1.6-.001 3.553.03 6.236-.947 9.049-2.873.605-.414 2.432-1.777 2.683-1.953 1.046-.735 1.829-1.14 2.667-1.286C36.221.309 46.429.047 52.287 1.277c.733.154 1.333.322 1.811.494.287.104.493.195.627.266l.201.099.632.311a510.4 510.4 0 0 1 10.027 5.069c4.129 2.152 7.035 3.774 8.402 4.741 11.442.128 29.664 1.375 33.932 3.169l.355.231c1.721 1.616 1.473 5.37.043 10.307-1.219 4.208-2.825 7.782-4.104 8.225l-12 4.17a10.358 10.358 0 0 1-9.523 6.28c-5.719 0-10.355-4.636-10.355-10.354 0-5.719 4.636-10.355 10.355-10.355s10.355 4.636 10.355 10.355c0 .433-.026.861-.078 1.28l10.311-3.582a3.31 3.31 0 0 0 .186-.271c.224-.357.494-.879.783-1.519.621-1.374 1.266-3.141 1.773-4.894.252-.868.458-1.698.62-2.473l-6.987.022a1.196 1.196 0 0 1-.007-2.391l7.371-.023c.135-1.399.046-2.429-.266-2.898-4.359-1.587-22.424-2.794-33.174-2.892l-.406-.004-.319-.25c-1.014-.792-4.029-2.489-8.372-4.753l-.924-.48a505.428 505.428 0 0 0-9.055-4.565l-.628-.309-.221-.109a2.601 2.601 0 0 0-.366-.153 11.351 11.351 0 0 0-1.491-.404c-4.68-.983-12.519-.949-24.256.73l4.018 8.719 28.847.821.002-1.919a1.196 1.196 0 1 1 2.391.002l-.002 3.148a1.195 1.195 0 0 1-1.23 1.194l-37.752-1.074c.03.001-1.529-.018-2.323-.031-.651-.011-1.192-.022-1.598-.035a20.985 20.985 0 0 1-.568-.024 4.056 4.056 0 0 1-.217-.017c-.056-.006-.056-.006-.137-.02-.096-.009-.096-.009-.479-.196-.993-.682-2.246-2.476-2.661-4.262a6.171 6.171 0 0 1-.151-1.892c-2.938 1.863-5.902 2.833-9.676 2.801-.448-.003-.975-.003-1.564.001-.585.004-1.21.011-1.848.02-.187.817-.186 1.709-.185 2.657l.003 3.071 7.896-.01a1.196 1.196 0 0 1 .003 2.391l-7.898.011v.964c.001 4.594-.002 7.882-.012 9.381.109.053.234.112.373.177a79.795 79.795 0 0 0 2.672 1.163c.823.345 1.706.709 2.589 1.067l.424.172c.793-4.931 5.068-8.697 10.223-8.697 5.718 0 10.355 4.636 10.355 10.355 0 5.718-4.637 10.354-10.355 10.354-5.456 0-9.925-4.218-10.326-9.571zm66.374-.783a7.964 7.964 0 1 0 15.925-.003 7.964 7.964 0 0 0-15.925.003zm-64.012 0a7.963 7.963 0 1 0 15.927 0 7.963 7.963 0 0 0-15.927 0zm66.128.179a1.195 1.195 0 1 1 2.391 0c0 1.992 1.627 3.61 3.635 3.61 2.009 0 3.635-1.618 3.635-3.61 0-1.993-1.626-3.61-3.635-3.61a1.196 1.196 0 0 1 0-2.392c3.327 0 6.026 2.686 6.026 6.002 0 3.315-2.699 6.001-6.026 6.001-3.326 0-6.026-2.686-6.026-6.001zm-64.028 0a1.195 1.195 0 1 1 2.391 0c0 1.992 1.627 3.61 3.635 3.61 2.009 0 3.635-1.618 3.635-3.61 0-1.993-1.626-3.61-3.635-3.61a1.197 1.197 0 0 1 0-2.392c3.327 0 6.026 2.686 6.026 6.002 0 3.315-2.699 6.001-6.026 6.001-3.326 0-6.026-2.686-6.026-6.001zm19.818 2.698a2.73 2.73 0 1 0 5.458 0 2.73 2.73 0 0 0-5.458 0zm35.094 1.4H41.429a1.195 1.195 0 0 1 0-2.391h25.707c-.073-1.904.035-3.546.489-5.41.734-3.009 2.263-5.642 4.784-7.709a1.195 1.195 0 0 1 1.517 1.849c-3.702 3.035-4.64 6.886-4.374 11.731a1.828 1.828 0 0 1-1.825 1.93zm36.433-4.356l.053-.017c-.018.007-.036.012-.053.017zM25.076 4.715c-1.366.212-2.78.445-4.244.7a1.81 1.81 0 0 0-.171.04c-2.237 1.428-2.893 2.97-2.502 4.657.154.66.47 1.323.889 1.922.209.3.435.566.603.736l.316.012c.392.012.922.023 1.563.034.77.013 2.361.032 2.355.032l5.003.142-3.812-8.275z"></path></svg>
                                                </div>
                                            ) : (
                                                <div className="add__car__photo">
                                                    <img src={this.state.image} style={{width: "100%", height: "100%"}} alt="Автомобиль"></img>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: "40px"}}>
                                <Button variant="primary" type="submit" style={{width: "40%"}}><FontAwesomeIcon icon={faSave}/>&nbsp;Добавить</Button>
                                <Button variant="danger" type="reset" style={{width: "40%"}}><FontAwesomeIcon icon={faUndo}/>&nbsp;Очистить</Button>
                            </div>
                        </Card.Body>
                    </Form>
                </Card>
                <ToastContainer limit={ 3 }/>
            </Container>
        )
    }
}