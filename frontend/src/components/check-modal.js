import React, { Component } from 'react';
import { Modal, Button, Spinner, Form, Col, Card } from 'react-bootstrap';
import { faTimes, faSave, faEdit, faShoppingCart, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';

import UserService from '../services/user.service';
import CarService from '../services/car.service';
import AuthService from '../services/auth.service';
import DealService from '../services/deal.service';

import 'react-toastify/dist/ReactToastify.css';


export default class CheckModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevData: [],
            check: "",
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.prevData || props.resetData) {
            return {
                prevData: props.data,
                check: props.data.check,
            }
        }

        return null;
    }

    render() {
        return(
            <Modal
            // style={{width: "500px"}}
            show={this.props.show}
            onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title><FontAwesomeIcon icon={faShoppingCart}/>&nbsp;Чек продажи</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control 
                    as="textarea" style={{fontFamily: "Consolas", fontWeight: "lighter", fontSize: "12px", height: "450px"}} readOnly={true}>
                        {this.state.check}
                    </Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.props.onHide}><FontAwesomeIcon icon={faCheck}/>&nbsp;Закрыть</Button>
                </Modal.Footer>
                <ToastContainer/>
            </Modal>
        )
    }
}