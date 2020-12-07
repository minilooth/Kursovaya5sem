import React, { Component } from "react";
import {Container, Card, Jumbotron, Spinner} from 'react-bootstrap';

import AuthService from "../services/auth.service";
import AutodealerService from "../services/autodealer.service";

import SelectAutodealer from './select-autodealer.component';

export default class Home extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            autodealerData: [],
            isLoading: true,

            show: AutodealerService.getCurrentAutodealer() === null ? true : false,
        };

    }

    getAutodealer() {
        AutodealerService.get(AutodealerService.getCurrentAutodealer()).then(
            response => {
                this.setState({
                    autodealerData: response.data,
                    isLoading: false,
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
                    this.props.toast.error((error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString(), { position: this.props.toast.POSITION.BOTTOM_RIGHT });
                }
            }
        ).catch(() => {
            this.props.toast.error("Что-то пошло не так :(", { position: this.props.toast.POSITION.BOTTOM_RIGHT });
        })
    }

    handleClose = () => {
        this.setState({ show: false })

        if (AutodealerService.getCurrentAutodealer() !== null) {
            this.getAutodealer();
        }
    }

    onCancel = () => {
        this.props.history.push("/profile");
        window.location.reload();
    }

    componentDidMount() {
        if (AutodealerService.getCurrentAutodealer() !== null) {
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
            </Container>
      );
    }
}