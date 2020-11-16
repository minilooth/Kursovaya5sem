import React, { Component } from "react";

import {Container, Card, Jumbotron, Spinner} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

import AuthService from "../services/auth.service";
import AutodealerService from "../services/autodealer.service";

import SelectAutodealer from './select-autodealer.component';

import 'react-toastify/dist/ReactToastify.css';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            autodealerData: null,
            isLoading: true,
            show: JSON.parse(localStorage.getItem('autodealer')) === null ? true : false,
        };
    }

    getAutodealer() {
        AutodealerService.getAutodealer(JSON.parse(localStorage.getItem('autodealer')).id).then(
            response => {
                this.setState({
                    autodealerData: response.data,
                    isLoading: false,
                })
            },
            error => {
                this.setState({
                    isLoading: false,
                });
                toast.error((error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
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
            }
        )
    }

    handleClose = () => {
        this.setState({
            show: false,
        })

        if (localStorage.getItem('autodealer') !== null) {
            this.getAutodealer();
        }
    }

    onCancel = () => {
        this.props.history.push("/profile");
        window.location.reload();
    }

    componentDidMount() {
        if (localStorage.getItem('autodealer') !== null) {
          this.getAutodealer();
        }
    }

    render() {
        let info = null;
        let height = window.innerHeight - 100;

        if (this.state.isLoading) {
            info = 
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: height}}> 
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Загрузка...</span>
                    </Spinner>
                    &nbsp;
                    <div>
                        <div style={{fontSize: "24px"}}>Загрузка...</div>
                    </div>
                </div>
        }
        else {
            info = 
                <Jumbotron>
                    <div>
                        <h1 style={{textAlign: "center", marginBottom: "45px"}}>Добро пожаловать в {this.state.autodealerData.title}</h1>
                            <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between">
                                <span>{this.state.autodealerData.city + ", " + this.state.autodealerData.address}</span>
                                <span>Время работы: {this.state.autodealerData.workingHours}</span>
                            </Card.Subtitle>
                            <Card.Text className="card-text" style={{marginTop: "35px", textAlign: "justify", textIndent: "20px"}}>{this.state.autodealerData.description}</Card.Text>
                    </div>
                </Jumbotron>
        }

        return (
            <Container style={{marginTop: "100px"}}>
                {info}
                <SelectAutodealer 
                  prevProps={this.props}
                  show={this.state.show}
                  onHide={this.handleClose} 
                  data={this.state.modalData}
                  onCancel={this.onCancel}/>
            <ToastContainer limit={3}/>
            </Container>
      );
    }
}