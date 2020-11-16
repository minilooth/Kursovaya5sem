import React, { Component } from 'react';
import { Card, Container, FormControl, InputGroup, ListGroup, Spinner, Button } from 'react-bootstrap';
import { faWarehouse, faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import AuthService from '../services/auth.service';
import AutodealerService from '../services/autodealer.service';

import EditAutodealerModal from './edit-autodealer-modal.component';

import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const rowStyle = {
    border: "0",
    margin: "0",
    padding: "0"
}

export default class AutodealersList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            autodealers: null,

            editModalData: [],
            showEditModal: false,
            isLoading: true,
            resetEditModalData: true,

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
                paginationSize: 5,
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
                  text: '5', value: 5
                }]
            },
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
            <ListGroup.Item style={{width: "100%", height: "175px" }}>
                <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                    <div style={{width: "85%", borderRight: "1px solid lightgray", paddingRight: "18px", height: "100%", display: "flex", alignItems: "center"}}>
                        <div style={{width: "100%"}}>
                            <Card.Title>{row.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between">
                                <span>{row.city + ", " + row.address}</span>
                                <span>Время работы: {row.workingHours}</span>
                            </Card.Subtitle>
                            <Card.Text className="card-text">{row.description}</Card.Text>
                        </div>
                    </div>
                    <div style={{width: "15%", paddingLeft: "18px"}}>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", height: "100%"}}>
                            <div style={{marginBottom: "10px"}}>
                                <Button variant={"success"} style={{width: "100%"}} onClick={this.edit.bind(this, row.id)}><FontAwesomeIcon icon={faEdit}/>&nbsp;Изменить</Button>
                            </div>
                            <div>
                                <Button variant={"danger"} style={{width: "100%"}} onClick={this.delete.bind(this, row.id)}><FontAwesomeIcon icon={faTrash}/>&nbsp;Удалить</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ListGroup.Item>
        )
    }

    delete = (id) => {
        let currentAutodealerId = JSON.parse(localStorage.getItem('autodealer')) != null ? JSON.parse(localStorage.getItem('autodealer')).id : null;
        
        AutodealerService.delete(id, currentAutodealerId).then(
            response => {
                toast.success(response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});
                this.refreshAutodealerList();
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

    componentDidMount() {
        this.refreshAutodealerList();
    }

    handleEditModalClose = () => {
        this.setState({
            showEditModal: false,
            resetEditModalData: true
        })
        this.refreshAutodealerList();
    }

    edit = (id) => {
        AutodealerService.getAutodealer(id).then(
            response => {
                this.setState({
                    showEditModal: !this.state.showEditModal,
                    resetEditModalData: false,
                    editModalData: {
                        id: response.data.id,
                        title: response.data.title,
                        workingHours: response.data.workingHours,
                        city: response.data.city,
                        address: response.data.address,
                        description: response.data.description
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

    render() {
        let table = null;

        if (!this.state.isLoading) {
            table = 
                    <BootstrapTable 
                        keyField='id' 
                        data={ this.state.autodealers } 
                        columns={ this.state.columns } 
                        bootstrap4 
                        rowStyle={ rowStyle }
                        bordered={ false }
                        pagination={ paginationFactory(this.state.options) }
                        noDataIndication={this.searchTitle === "" ? "Список автосалонов пока пуст :(" : "Не найдено ни одного автосалона :("}  />
        }
        else {
            table = 
                <div style={{ display: "flex", justifyContent: "center" }}> 
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Загрузка...</span>
                    </Spinner>
                    &nbsp;
                    <div>
                        <div style={{ fontSize: "24px" }}>Загрузка...</div>
                    </div>
                </div>
        }

        return(
            <Container style={{ marginTop: "100px", marginBottom: "50px", width: "85%" }} fluid>
                <Card>
                    <Card.Header className={ "d-flex justify-content-between" }>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px' }}><FontAwesomeIcon icon={ faWarehouse }/>&nbsp;Автосалоны</div>
                        <div>
                            <InputGroup style={{ width: "250px" }}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text><FontAwesomeIcon icon={ faSearch }/></InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    value={ this.state.searchTitle }
                                    ref={ input => { this.inputElement = input } }
                                    onChange={ this.titleOnChange }
                                    placeholder="Название"
                                />
                            </InputGroup>
                        </div> 
                    </Card.Header>
                    <Card.Body style={{ margin: "0px", paddingLeft: "0px", paddingRight: "0px" }}>
                        { table } 
                    </Card.Body>
                </Card>
                <EditAutodealerModal
                show={ this.state.showEditModal }
                onHide={ this.handleEditModalClose } 
                data={ this.state.editModalData }
                resetData={ this.state.resetEditModalData }
                onCancel={ this.handleEditModalClose }/>
                <ToastContainer limit={ 3 }/>
            </Container>
        )
    }
}