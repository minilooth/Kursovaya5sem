import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faWarehouse, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { Card, Button, ListGroup, InputGroup, FormControl, Modal, Spinner } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import AutodealerService from "../services/autodealer.service";
import AuthService from "../services/auth.service";

const rowStyle = {
    border: "0",
    margin: "0",
    padding: "0"
}

export default class SelectAutodealer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            autodealers: [],
            sort: false,
            columns: [{
                dataField: "id",
                formatter: this.itemFormatter,
                headerAttrs: {
                    hidden: true
                  },
                style: {
                    border: "0",
                    padding: "0",
                },
            }],
            options: {
                paginationSize: 3,
                pageStartIndex: 1,
                hideSizePerPage: true,
                hidePageListOnlyOnePage: true,
                firstPageText: 'Начало',
                prePageText: '<',
                nextPageText: '>',
                lastPageText: 'Последняя',
                showTotal: true,
                paginationTotalRenderer: () => {return null;},
                disablePageTitle: true,
                sizePerPageList: [{
                  text: '3', value: 3
                }]
            },
            selectedAutodealerId: null
        }

        this.searchTitle = "";

        this.titleOnChange = this.titleOnChange.bind(this);
    }

    titleOnChange = event => {
        this.searchTitle = event.target.value;
        this.refreshAutodealerList();
    }

    itemFormatter = (cell, row) => {
        return(
            <ListGroup.Item style={{width: "100%" }} action onClick={this.itemClick.bind(this, row.id)}>
                <Card.Title>{row.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between">
                    <span>{row.city + ", " + row.address}</span>
                    <span>Время работы: {row.workingHours}</span>
                </Card.Subtitle>
                <Card.Text className="card-text">{row.description}</Card.Text>
            </ListGroup.Item>
        )
    }

    refreshAutodealerList = () => {
        AutodealerService.getAutodealers(this.searchTitle).then(
            response => {
                this.setState({
                    autodealers: response.data,
                    isLoading: false
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

    selectAutodealer = () => {
        AutodealerService.selectAutodealer(this.state.selectedAutodealerId).then(
            response => {
                localStorage.setItem("autodealer", JSON.stringify(response.data));
                this.props.onHide();

                if (typeof this.props.onSelect === "function") {
                    this.props.onSelect();
                }
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

    componentDidMount() {
        this.refreshAutodealerList();
    }

    itemClick = (id) => {
        this.setState({
            selectedAutodealerId: id
        })
    }

    render() {
        let table = null;

        if (!this.state.isLoading) {
            table = 
                    <BootstrapTable 
                        keyField='id' 
                        data={this.state.autodealers} 
                        columns={this.state.columns} 
                        bootstrap4 
                        rowStyle={rowStyle}
                        bordered={ false }
                        pagination={ paginationFactory(this.state.options) }
                        noDataIndication={this.searchTitle === "" ? "Список автосалонов пока пуст :(" : "Не найдено ни одного автосалона :("}  />
        }
        else {
            table = 
                <div style={{display: "flex", justifyContent: "center"}}> 
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
            <div>
                <Modal
                 show={this.props.show}
                 onHide={this.props.onCancel}
                 size="lg"
                 backdrop="static"
                 keyboard={false}>
                        <Modal.Header closeButton className={"d-flex justify-content-between"} style={{alignItems: "center"}}>
                            <Modal.Title><FontAwesomeIcon icon={faWarehouse}/>&nbsp;Выбор автосалона</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{display: "flex", flexDirection: "column"}}>
                            <InputGroup style={{ marginBottom: "17px", alignSelf: "flex-end"}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faSearch}/></InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    value={this.state.searchTitle}
                                    ref={input => { this.inputElement = input }}
                                    onChange={this.titleOnChange}
                                    placeholder="Название"
                                    aria-label="Title"
                                    aria-describedby="basic-addon1"/>
                            </InputGroup>
                            {table}
                        </Modal.Body>
                        <Modal.Footer style={{marginTop: "-15px"}}>
                            <Button variant="primary" onClick={this.selectAutodealer}><FontAwesomeIcon icon={faCheck}/>&nbsp;Выбрать</Button>
                            <Button variant="danger" onClick={this.props.onCancel}><FontAwesomeIcon icon={faTimes}/>&nbsp;Отменить</Button>
                        </Modal.Footer>
                </Modal>
                <ToastContainer/>
            </div>
        )
    }
}