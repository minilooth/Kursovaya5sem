import React, {Component} from 'react';

import {Container, Form, Button, Spinner} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCar} from '@fortawesome/free-solid-svg-icons';

import SelectAutodealer from './select-autodealer.component';

import AuthService from '../services/auth.service';
import CarService from '../services/car.service';
import CurrencyService from '../services/currency.service';

import Utils from '../utils/utils';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-toastify/dist/ReactToastify.css';


const rowStyle = {
    border: "0",
    margin: "0",
    padding: "0"
}

export default class CarsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: JSON.parse(localStorage.getItem('autodealer')) === null ? true : false,
            cars: [],
            countOfNotSoldCars: 0,
            countOfTodayReceiptCars: 0,
            isLoading: true,

            dollarRate: null,
            euroRate: null,

            columns: [{
                dataField: "id",
                formatter: this.itemFormatter,
                headerAttrs: {
                    hidden: true
                  },
                style: {
                    border: "0",
                    padding: "0",
                }
            }],
            options: {
                paginationSize: 15,
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
                  text: '15', value: 15
                }]
            },

            brandFilter: "",
            modelFilter: "",
            yearOfIssueMinFilter: "",
            yearOfIssueMaxFilter: "",
            bodyTypeFilter: "-1",
            engineVolumeMinFilter: "",
            engineVolumeMaxFilter: "",
            engineTypeFilter: "-1",
            transmissionTypeFilter: "-1",
            wheelDriveTypeFilter: "-1",
            mileageMinFilter: "",
            mileageMaxFilter: "",
            bodyColorFilter: "-1",
            interiorMaterialFilter: "-1",
            interiorColorFilter: "-1",
            priceMinFilter: "",
            priceMaxFilter: ""
        }

        this.applyFilter = this.applyFilter.bind(this);
        this.onChangeBrandFilter = this.onChangeBrandFilter.bind(this);
        this.onChangeModelFilter = this.onChangeModelFilter.bind(this);
        this.onChangeYearOfIssueMinFilter = this.onChangeYearOfIssueMinFilter.bind(this);
        this.onChangeYearOfIssueMaxFilter = this.onChangeYearOfIssueMaxFilter.bind(this);
        this.onChangeBodyTypeFilter = this.onChangeBodyTypeFilter.bind(this);
        this.onChangeEngineVolumeMinFilter = this.onChangeEngineVolumeMinFilter.bind(this);
        this.onChangeEngineVolumeMaxFilter = this.onChangeEngineVolumeMaxFilter.bind(this);
        this.onChangeEngineTypeFilter = this.onChangeEngineTypeFilter.bind(this);
        this.onChangeTransmissionTypeFilter = this.onChangeTransmissionTypeFilter.bind(this);
        this.onChangeWheelDriveTypeFilter = this.onChangeWheelDriveTypeFilter.bind(this);
        this.onChangeMileageMinFilter = this.onChangeMileageMinFilter.bind(this);
        this.onChangeMileageMaxFilter = this.onChangeMileageMaxFilter.bind(this);
        this.onChangeBodyColorFilter = this.onChangeBodyColorFilter.bind(this);
        this.onChangeInteriorMaterialFilter = this.onChangeInteriorMaterialFilter.bind(this);
        this.onChangeInteriorColorFilter = this.onChangeInteriorColorFilter.bind(this);
        this.onChangePriceMinFilter = this.onChangePriceMinFilter.bind(this);
        this.onChangePriceMaxFilter = this.onChangePriceMaxFilter.bind(this);

        this.years = Utils.generateYearArray(1975);
        this.engineVolumes = Utils.generateEngineVolumeArray(0.8, 7.0);
        this.isFilterModeEnabled = false;
        this.isFilterOptionAdded = false;
    }

    getCurrencies() {
        CurrencyService.getDollarRate().then(
            response => {
                console.log(response);
                this.setState({
                    dollarRate: response.data.Cur_OfficialRate,
                })
            },
            error => {
                toast.error((error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
            }
        )
        CurrencyService.getEuroRate().then(
            response => {
                this.setState({
                    euroRate: response.data.Cur_OfficialRate,
                })
            },
            error => {
                toast.error((error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
            }
        )
    }

    onChangeBrandFilter(e) {
        this.setState({
            brandFilter: e.target.value
        })
    }
    onChangeModelFilter(e) {
        this.setState({
            modelFilter: e.target.value
        })
    }
    onChangeYearOfIssueMinFilter(e) {
        this.setState({
            yearOfIssueMinFilter: e.target.value
        })
    }
    onChangeYearOfIssueMaxFilter(e) {
        this.setState({
            yearOfIssueMaxFilter: e.target.value
        })
    }
    onChangeBodyTypeFilter(e) {
        this.setState({
            bodyTypeFilter: e.target.value
        })
    }
    onChangeEngineVolumeMinFilter(e) {
        this.setState({
            engineVolumeMinFilter: e.target.value
        })
    }
    onChangeEngineVolumeMaxFilter(e) {
        this.setState({
            engineVolumeMaxFilter: e.target.value
        })
    }
    onChangeEngineTypeFilter(e) {
        this.setState({
            engineTypeFilter: e.target.value
        })
    }
    onChangeTransmissionTypeFilter(e) {
        this.setState({
            transmissionTypeFilter: e.target.value
        })
    }
    onChangeWheelDriveTypeFilter(e) {
        this.setState({
            wheelDriveTypeFilter: e.target.value
        })
    }
    onChangeMileageMinFilter(e) {
        this.setState({
            mileageMinFilter: e.target.value
        })
    }
    onChangeMileageMaxFilter(e) {
        this.setState({
            mileageMaxFilter: e.target.value
        })
    }
    onChangeBodyColorFilter(e) {
        this.setState({
            bodyColorFilter: e.target.value
        })
    }
    onChangeInteriorMaterialFilter(e) {
        this.setState({
            interiorMaterialFilter: e.target.value
        })
    }
    onChangeInteriorColorFilter(e) {
        this.setState({
            interiorColorFilter: e.target.value
        })
    }
    onChangePriceMinFilter(e) {
        this.setState({
            priceMinFilter: e.target.value
        })
    }
    onChangePriceMaxFilter(e) {
        this.setState({
            priceMaxFilter: e.target.value
        })
    }

    itemFormatter = (cell, row) => {
        return (
            <Link to={"/cars/" + row.id}s  class="car__item__link" >
                <div class="car__item" action style={this.state.cars.length <= 5 ? {borderTop: "1px solid lightgray", borderLeft: "0px solid lightgray"} : 
                                                                                  {borderTop: "1px solid lightgray", borderLeft: "1px solid lightgray"}} >
                    {row.image == null ? 
                    (
                        <div class="car__item__photo--empty">
                            <svg width="60%" viewBox="0 0 110 45" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentcolor"><path d="M8.353 35.068l-.033.083-.328-.132-.861-.348c-.89-.362-1.781-.729-2.614-1.078l-.3-.127a82.46 82.46 0 0 1-2.453-1.072 14.866 14.866 0 0 1-.851-.421 3.366 3.366 0 0 1-.339-.208 1.511 1.511 0 0 1-.229-.198 1.147 1.147 0 0 1-.344-.874c.014-.883.019-4.528.018-10.026l-.004-6.424-.003-2.765-.001-.785v-.28L.009 9.24l1.172-.024.387-.007a212.997 212.997 0 0 1 2.855-.037c.6-.004 1.139-.005 1.6-.001 3.553.03 6.236-.947 9.049-2.873.605-.414 2.432-1.777 2.683-1.953 1.046-.735 1.829-1.14 2.667-1.286C36.221.309 46.429.047 52.287 1.277c.733.154 1.333.322 1.811.494.287.104.493.195.627.266l.201.099.632.311a510.4 510.4 0 0 1 10.027 5.069c4.129 2.152 7.035 3.774 8.402 4.741 11.442.128 29.664 1.375 33.932 3.169l.355.231c1.721 1.616 1.473 5.37.043 10.307-1.219 4.208-2.825 7.782-4.104 8.225l-12 4.17a10.358 10.358 0 0 1-9.523 6.28c-5.719 0-10.355-4.636-10.355-10.354 0-5.719 4.636-10.355 10.355-10.355s10.355 4.636 10.355 10.355c0 .433-.026.861-.078 1.28l10.311-3.582a3.31 3.31 0 0 0 .186-.271c.224-.357.494-.879.783-1.519.621-1.374 1.266-3.141 1.773-4.894.252-.868.458-1.698.62-2.473l-6.987.022a1.196 1.196 0 0 1-.007-2.391l7.371-.023c.135-1.399.046-2.429-.266-2.898-4.359-1.587-22.424-2.794-33.174-2.892l-.406-.004-.319-.25c-1.014-.792-4.029-2.489-8.372-4.753l-.924-.48a505.428 505.428 0 0 0-9.055-4.565l-.628-.309-.221-.109a2.601 2.601 0 0 0-.366-.153 11.351 11.351 0 0 0-1.491-.404c-4.68-.983-12.519-.949-24.256.73l4.018 8.719 28.847.821.002-1.919a1.196 1.196 0 1 1 2.391.002l-.002 3.148a1.195 1.195 0 0 1-1.23 1.194l-37.752-1.074c.03.001-1.529-.018-2.323-.031-.651-.011-1.192-.022-1.598-.035a20.985 20.985 0 0 1-.568-.024 4.056 4.056 0 0 1-.217-.017c-.056-.006-.056-.006-.137-.02-.096-.009-.096-.009-.479-.196-.993-.682-2.246-2.476-2.661-4.262a6.171 6.171 0 0 1-.151-1.892c-2.938 1.863-5.902 2.833-9.676 2.801-.448-.003-.975-.003-1.564.001-.585.004-1.21.011-1.848.02-.187.817-.186 1.709-.185 2.657l.003 3.071 7.896-.01a1.196 1.196 0 0 1 .003 2.391l-7.898.011v.964c.001 4.594-.002 7.882-.012 9.381.109.053.234.112.373.177a79.795 79.795 0 0 0 2.672 1.163c.823.345 1.706.709 2.589 1.067l.424.172c.793-4.931 5.068-8.697 10.223-8.697 5.718 0 10.355 4.636 10.355 10.355 0 5.718-4.637 10.354-10.355 10.354-5.456 0-9.925-4.218-10.326-9.571zm66.374-.783a7.964 7.964 0 1 0 15.925-.003 7.964 7.964 0 0 0-15.925.003zm-64.012 0a7.963 7.963 0 1 0 15.927 0 7.963 7.963 0 0 0-15.927 0zm66.128.179a1.195 1.195 0 1 1 2.391 0c0 1.992 1.627 3.61 3.635 3.61 2.009 0 3.635-1.618 3.635-3.61 0-1.993-1.626-3.61-3.635-3.61a1.196 1.196 0 0 1 0-2.392c3.327 0 6.026 2.686 6.026 6.002 0 3.315-2.699 6.001-6.026 6.001-3.326 0-6.026-2.686-6.026-6.001zm-64.028 0a1.195 1.195 0 1 1 2.391 0c0 1.992 1.627 3.61 3.635 3.61 2.009 0 3.635-1.618 3.635-3.61 0-1.993-1.626-3.61-3.635-3.61a1.197 1.197 0 0 1 0-2.392c3.327 0 6.026 2.686 6.026 6.002 0 3.315-2.699 6.001-6.026 6.001-3.326 0-6.026-2.686-6.026-6.001zm19.818 2.698a2.73 2.73 0 1 0 5.458 0 2.73 2.73 0 0 0-5.458 0zm35.094 1.4H41.429a1.195 1.195 0 0 1 0-2.391h25.707c-.073-1.904.035-3.546.489-5.41.734-3.009 2.263-5.642 4.784-7.709a1.195 1.195 0 0 1 1.517 1.849c-3.702 3.035-4.64 6.886-4.374 11.731a1.828 1.828 0 0 1-1.825 1.93zm36.433-4.356l.053-.017c-.018.007-.036.012-.053.017zM25.076 4.715c-1.366.212-2.78.445-4.244.7a1.81 1.81 0 0 0-.171.04c-2.237 1.428-2.893 2.97-2.502 4.657.154.66.47 1.323.889 1.922.209.3.435.566.603.736l.316.012c.392.012.922.023 1.563.034.77.013 2.361.032 2.355.032l5.003.142-3.812-8.275z"></path></svg>
                        </div>
                    ) : (
                        <div class="car__item__photo">
                            <img src={row.image} style={{width: "100%", height: "100%"}} alt="Автомобиль"></img>
                        </div>
                    )}
                    <div class="car__item__data">
                        <div class="car__item__data-main">
                            <div class="car__item__data-title">{row.brand} {row.model}</div>
                            <div class="car__item__data-specs">
                                <div class="car__item__data-other-engine">{row.engineVolume} л / {Utils.getEngineTypes()[row.engineType]}</div>
                                <div class="car__item__data-other-transmission">{Utils.getTransmissionTypes()[row.transmissionType]}</div>
                                <div class="car__item__data-other-body">{Utils.getBodyTypes()[row.bodyType]}</div>
                                <div class="car__item__data-other-wheeldrive">{Utils.getWheelDriveTypes()[row.wheelDriveType]}</div>
                                <div class="car__item__data-other-more">Еще {Object.getOwnPropertyNames(row).length - 7 - 5} опций</div>
                            </div>
                        </div>
                        <div class="car__item__data-mileage-year">
                            <div>{row.mileage} км</div>
                            <div>{row.yearOfIssue} г. в.</div>
                        </div>
                        <div class="car__item__data-price">
                            <div class="car__item__data-price-national">
                                {row.price} р.
                            </div>
                            <div class="car__item__data-price-currency">
                                {this.state.dollarRate != null ? (
                                    <span>{(row.price / this.state.dollarRate).toFixed()} $</span>
                                ) : null}
                                {this.state.dollarRate != null && this.state.euroRate != null ? (
                                    <span> / </span>
                                ) : null}
                                {this.state.euroRate != null ? (
                                    <span>{(row.price / this.state.euroRate).toFixed()} €</span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    applyFilter = () => {
        if (this.state.brandFilter === "" && this.state.modelFilter === "" && this.state.yearOfIssueMinFilter === "" && this.state.yearOfIssueMaxFilter === "" &&
            this.state.bodyTypeFilter === "-1" && this.state.engineVolumeMinFilter === "" && this.state.engineVolumeMaxFilter === "" &&
            this.state.engineTypeFilter === "-1" && this.state.transmissionTypeFilter === "-1" && this.state.wheelDriveTypeFilter === "-1" &&
            this.state.mileageMaxFilter === "" && this.state.mileageMinFilter === "" && this.state.bodyColorFilter === "-1" && 
            this.state.interiorMaterialFilter === "-1" && this.state.interiorColorFilter === "-1" && this.state.priceMinFilter === "" &&
            this.state.priceMaxFilter === "") {
                toast.error("Ни один параметр фильтра не выбран.", { position: toast.POSITION.BOTTOM_RIGHT });
                return;
        }


        if (this.isFilterModeEnabled) {
            this.isFilterModeEnabled = false;

            this.setState({
                brandFilter: "",
                modelFilter: "",
                yearOfIssueMinFilter: "",
                yearOfIssueMaxFilter: "",
                bodyTypeFilter: "-1",
                engineVolumeMinFilter: "",
                engineVolumeMaxFilter: "",
                engineTypeFilter: "-1",
                transmissionTypeFilter: "-1",
                wheelDriveTypeFilter: "-1",
                mileageMinFilter: "",
                mileageMaxFilter: "",
                bodyColorFilter: "-1",
                interiorMaterialFilter: "-1",
                interiorColorFilter: "-1",
                priceMinFilter: "",
                priceMaxFilter: ""
            });
            
            localStorage.setItem('carFilter', JSON.stringify({
                isFilterModeEnabled: this.isFilterModeEnabled,
                brandFilter: "",
                modelFilter: "",
                yearOfIssueMinFilter: "",
                yearOfIssueMaxFilter: "",
                bodyTypeFilter: "-1",
                engineVolumeMinFilter: "",
                engineVolumeMaxFilter: "",
                engineTypeFilter: "-1",
                transmissionTypeFilter: "-1",
                wheelDriveTypeFilter: "-1",
                mileageMinFilter: "",
                mileageMaxFilter: "",
                bodyColorFilter: "-1",
                interiorMaterialFilter: "-1",
                interiorColorFilter: "-1",
                priceMinFilter: "",
                priceMaxFilter: ""
            }));
            this.refreshCarList();
        }
        else {
            this.isFilterModeEnabled = true;

            localStorage.setItem('carFilter', JSON.stringify({
                isFilterModeEnabled: this.isFilterModeEnabled,
                brandFilter: this.state.brandFilter,
                modelFilter: this.state.modelFilter,
                yearOfIssueMinFilter: this.state.yearOfIssueMinFilter,
                yearOfIssueMaxFilter: this.state.yearOfIssueMaxFilter,
                bodyTypeFilter: this.state.bodyTypeFilter,
                engineVolumeMinFilter: this.state.engineVolumeMinFilter,
                engineVolumeMaxFilter: this.state.engineVolumeMaxFilter,
                engineTypeFilter: this.state.engineTypeFilter,
                transmissionTypeFilter: this.state.transmissionTypeFilter,
                wheelDriveTypeFilter: this.state.wheelDriveTypeFilter,
                mileageMinFilter: this.state.mileageMinFilter,
                mileageMaxFilter: this.state.mileageMaxFilter,
                bodyColorFilter: this.state.bodyColorFilter,
                interiorMaterialFilter: this.state.interiorMaterialFilter,
                interiorColorFilter: this.state.interiorColorFilter,
                priceMinFilter: this.state.priceMinFilter,
                priceMaxFilter: this.state.priceMaxFilter
            }));
            this.refreshCarList();
        }
    }

    refreshCarList = () => {
        if (localStorage.getItem('autodealer') === null) {
            return;
        }

        CarService.getNotSoldCars().then(
            response => {
                console.log(response);
                this.setState({
                    cars: response.data.cars,
                    countOfNotSoldCars: response.data.countOfNotSoldCars,
                    countOfTodayReceiptCars: response.data.countOfTodayReceiptCars,
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
                    this.setState({
                        isLoading: false,
                    })
                    toast.error((error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }
        )
    }

    handleClose = () => {
        this.setState({
            show: false,
        })
        this.refreshCarList();
    }

    onCancel = () => {
        this.props.history.push("/profile");
        window.location.reload();
    }

    componentDidMount() {
        let carFilter = JSON.parse(localStorage.getItem('carFilter'));

        if (carFilter !== null) {
            this.isFilterModeEnabled = carFilter.isFilterModeEnabled;

            this.setState({
                brandFilter: carFilter.brandFilter,
                modelFilter: carFilter.modelFilter,
                yearOfIssueMinFilter: carFilter.yearOfIssueMinFilter,
                yearOfIssueMaxFilter: carFilter.yearOfIssueMaxFilter,
                bodyTypeFilter: carFilter.bodyTypeFilter,
                engineVolumeMinFilter: carFilter.engineVolumeMinFilter,
                engineVolumeMaxFilter: carFilter.engineVolumeMaxFilter,
                engineTypeFilter: carFilter.engineTypeFilter,
                transmissionTypeFilter: carFilter.transmissionTypeFilter,
                wheelDriveTypeFilter: carFilter.wheelDriveTypeFilter,
                mileageMinFilter: carFilter.mileageMinFilter,
                mileageMaxFilter: carFilter.mileageMaxFilter,
                bodyColorFilter: carFilter.bodyColorFilter,
                interiorColorFilter: carFilter.interiorColorFilter,
                interiorMaterialFilter: carFilter.interiorMaterialFilter,
                priceMinFilter: carFilter.priceMinFilter,
                priceMaxFilter: carFilter.priceMaxFilter
            })
        }

        this.getCurrencies();
        this.refreshCarList();
    }

    render() {
        let table = null;

        if (!this.state.isLoading) {
            table = 
                <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                    <BootstrapTable 
                        keyField='id' 
                        data={this.state.cars} 
                        columns={this.state.columns} 
                        bootstrap4 
                        rowStyle={rowStyle}
                        bordered={ false }
                        pagination={ paginationFactory(this.state.options) }
                        noDataIndication={this.isFilterModeEnabled ? "Не найдено ни одного автомобиля :(" : "Список автомобилей пока пуст :("}/>
                </div>
        }
        else {
            table = 
                <div style={{display: "flex", justifyContent: "center", width: "100%", paddingTop: "100px"}}> 
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Загрузка...</span>
                    </Spinner>
                    &nbsp;
                    <div>
                        <div style={{fontSize: "24px"}}>Загрузка...</div>
                    </div>
                </div>
        }

        return(
            <Container style={{marginTop: "100px", width: "90%", marginBottom: "100px"}} fluid>
                <div class="car__list__header">
                <div class="car__list__header-count">{this.state.countOfNotSoldCars} объявлений(-ия) {this.state.countOfTodayReceiptCars !== 0 ? <span style={{color: "#7dbf26"}}>+ {this.state.countOfTodayReceiptCars} за сегодня!</span> : null}</div>
                    <h2 class="car__list__header-title"><FontAwesomeIcon icon={faCar}/>&nbsp;Список автомобилей</h2>
                </div>
                    <div class="car__list__container">
                        <div>
                            <Form style={this.state.cars.length <= 5 ? {width: "300px", borderTop: "1px solid lightgray", borderRight: "1px solid lightgray"} :
                                                                      {width: "300px", borderTop: "1px solid lightgray", borderRight: "0px solid lightgray"}}>
                            <Form.Group controlId="price" style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Цена</Form.Label>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Form.Control style={{width: "49%", borderRadius: "5px 0px 0px 5px"}} placeholder="от" value={this.state.priceMinFilter} onChange={this.priceMinFilter}/>
                                        <Form.Control style={{width: "49%", borderRadius: "0px 5px 5px 0px"}} placeholder="до" value={this.state.priceMaxFilter} onChange={this.priceMaxFilter}/>
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="brandAndModel" style={{marginRight: "20px", marginBottom: "5px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Марка</Form.Label>
                                    <Form.Control type="text" placeholder="Введите марку" value={this.state.brandFilter} onChange={this.onChangeBrandFilter}/>
                                    <Form.Control type="text" placeholder="Введите модель" style={{marginTop: "5px"}} value={this.state.modelFilter} onChange={this.onChangeModelFilter}/>
                                </Form.Group>
                                <Form.Group controlId="yearOfIssue" style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Год выпуска</Form.Label>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Form.Control as="select" style={{width: "49%", borderRadius: "5px 0px 0px 5px"}} value={this.state.yearOfIssueMinFilter} onChange={this.onChangeYearOfIssueMinFilter}>
                                            <option value="" disabled selected hidden>с</option>
                                            {
                                                this.years.map((year, index) => {
                                                    return <option key={`year${index}`} value={year}>{year}</option>
                                                })
                                            }
                                        </Form.Control>
                                        <Form.Control as="select" style={{width: "49%", borderRadius: "0px 5px 5px 0px"}} value={this.state.yearOfIssueMaxFilter} onChange={this.onChangeYearOfIssueMaxFilter}>
                                            <option value="" disabled selected hidden>до</option>
                                            {
                                                this.years.map((year, index) => {
                                                    return <option key={index} value={year}>{year}</option>
                                                })
                                            }
                                        </Form.Control>
                                    </div>
                                </Form.Group>
                                <Form.Group style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Тип кузова</Form.Label>
                                    <Form.Control as="select" value={this.state.bodyTypeFilter} onChange={this.onChangeBodyTypeFilter}>
                                        <option value="-1" selected>Любой</option>
                                        {
                                            Utils.getBodyTypes().map((type, index) => {
                                                return <option key={index} value={index}>{type}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Тип двигателя</Form.Label>
                                    <Form.Control as="select" value={this.state.engineTypeFilter} onChange={this.onChangeEngineTypeFilter}>
                                        <option value="-1" selected>Любой</option>
                                        {
                                            Utils.getEngineTypes().map((type, index) => {
                                                return <option key={index} value={index}>{type}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Коробка передач</Form.Label>
                                    <Form.Control as="select" value={this.state.transmissionTypeFilter} onChange={this.onChangeTransmissionTypeFilter}>
                                        <option value="-1" selected>Любая</option>
                                        {
                                            Utils.getTransmissionTypes().map((type, index) => {
                                                return <option key={index} value={index}>{type}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="model" style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Объем двигателя</Form.Label>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Form.Control as="select" style={{width: "49%", borderRadius: "5px 0px 0px 5px"}} value={this.state.engineVolumeMinFilter} onChange={this.onChangeEngineVolumeMinFilter}>
                                            <option value="" disabled selected hidden>от</option>
                                            {
                                                this.engineVolumes.map((engineVolume, index) => {
                                                    return <option key={`year${index}`} value={engineVolume}>{engineVolume}</option>
                                                })
                                            }
                                        </Form.Control>
                                        <Form.Control as="select" style={{width: "49%", borderRadius: "0px 5px 5px 0px"}} value={this.state.engineVolumeMaxFilter} onChange={this.onChangeEngineVolumeMaxFilter}>
                                            <option value="" disabled selected hidden>до</option>
                                            {
                                                this.engineVolumes.map((engineVolume, index) => {
                                                    return <option key={`year${index}`} value={engineVolume}>{engineVolume}</option>
                                                })
                                            }
                                        </Form.Control>
                                    </div>
                                </Form.Group>
                                <Form.Group style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Привод</Form.Label>
                                    <Form.Control as="select" value={this.state.wheelDriveTypeFilter} onChange={this.onChangeWheelDriveTypeFilter}>
                                        <option value="-1" selected>Любая</option>
                                        {
                                            Utils.getWheelDriveTypes().map((type, index) => {
                                                return <option key={index} value={index}>{type}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="model" style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Пробег</Form.Label>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Form.Control style={{width: "49%", borderRadius: "5px 0px 0px 5px"}} placeholder="от" value={this.state.mileageMinFilter} onChange={this.onChangeMileageMinFilter}/>
                                        <Form.Control style={{width: "49%", borderRadius: "0px 5px 5px 0px"}} placeholder="до" value={this.state.mileageMaxFilter} onChange={this.onChangeMileageMaxFilter}/>
                                    </div>
                                </Form.Group>
                                <Form.Group style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Цвет кузова</Form.Label>
                                    <Form.Control as="select" value={this.state.bodyColorFilter} onChange={this.onChangeBodyColorFilter}>
                                        <option value="-1" selected>Любой</option>
                                        {
                                            Utils.getBodyColors().map((color, index) => {
                                                return <option key={index} value={index}>{color}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Цвет салона</Form.Label>
                                    <Form.Control as="select" value={this.state.interiorColorFilter} onChange={this.onChangeInteriorColorFilter}>
                                        <option value="-1" selected>Любой</option>
                                        {
                                            Utils.getInteriorColors().map((color, index) => {
                                                return <option key={index} value={index}>{color}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group style={{marginRight: "20px"}}>
                                    <Form.Label style={{fontWeight: "500"}}>Материал салона</Form.Label>
                                    <Form.Control as="select" value={this.state.interiorMaterialFilter} onChange={this.onChangeInteriorMaterialFilter}>
                                        <option value="-1" selected>Любой</option>
                                        {
                                            Utils.getInteriorMaterials().map((material, index) => {
                                                return <option key={index} value={index}>{material}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group style={{marginRight: "20px", textAlign: "center"}}>
                                    <Button variant={!this.isFilterModeEnabled ? "success" : "danger"} style={{width: "75%"}} onClick={this.applyFilter} disable={this.isFilterOptionAdded}>{!this.isFilterModeEnabled ? <span>Применить</span> : <span>Отменить</span> }</Button>
                                </Form.Group>

                            </Form>
                        </div>
                        {table}
                    </div>
                <SelectAutodealer 
                    prevProps={this.props}
                    show={this.state.show}
                    onHide={this.handleClose} 
                    onCancel={this.onCancel}/>
                <ToastContainer limit={3}/>
            </Container>
        )
    }
    
}