import React, {Component} from 'react';
import {Container, Form, Card, Button, Col, InputGroup} from 'react-bootstrap';
import {faSave, faPlusSquare, faUndo } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';

import SelectAutodealer from './select-autodealer.component';

import CarService from '../services/car.service';
import AutodealerService from '../services/autodealer.service';
import Utils from '../utils/utils';

import 'react-toastify/dist/ReactToastify.css';
import '@brainhubeu/react-file-input/dist/react-file-input.css';


export default class AddCar extends Component {
    constructor(props) {
        super(props);

        this.addCar = this.addCar.bind(this);

        this.onChangeBrand = this.onChangeBrand.bind(this);
        this.onChangeModel = this.onChangeModel.bind(this);
        this.onChangeYearOfIssue = this.onChangeYearOfIssue.bind(this);
        this.onChangeBodyType = this.onChangeBodyType.bind(this);
        this.onChangeEngineVolume = this.onChangeEngineVolume.bind(this);
        this.onChangeEngineType = this.onChangeEngineType.bind(this);
        this.onChangeTransmissionType = this.onChangeTransmissionType.bind(this);
        this.onChangeWheelDriveType = this.onChangeWheelDriveType.bind(this);
        this.onChangeMileage = this.onChangeMileage.bind(this);
        this.onChangeBodyColor = this.onChangeBodyColor.bind(this);
        this.onChangeInteriorMaterial = this.onChangeInteriorMaterial.bind(this);
        this.onChangeInteriorColor = this.onChangeInteriorColor.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeFiles = this.onChangeFiles.bind(this);

        this.state = {
            showSelectAutodealerModal: AutodealerService.getCurrentAutodealer() === null ? true : false,

            brand: "",
            model: "",
            yearOfIssue: "",
            bodyType: "",
            engineVolume: "",
            engineType: "",
            transmissionType: "",
            wheelDriveType: "",
            mileage: "",
            bodyColor: "",
            interiorMaterial: "",
            interiorColor: "",
            price: "",
            fileBase64: "",

            file: null,
            fileInputLabel: "Выберите файл",

            isBrandInvalid: false,
            isModelInvalid: false,
            isYearOfIssueNotSelected: false,
            isBodyTypeNotSelected: false,
            isEngineVolumeNotSelected: false,
            isEngineTypeNotSelected: false,
            isTransmissionTypeNotSelected: false,
            isWheelDriveTypeNotSelected: false,
            isMileageInvalid: false,
            isBodyColorNotSelected: false,
            isInteriorMaterialNotSelected: false,
            isInteriorColorNotSelected: false,
            isPriceInvalid: false, 

            brandError: "",
            modelError: "",
            yearOfIssueError: "",
            bodyTypeError: "",
            engineVolumeError: "",
            engineTypeError: "",
            transmissionTypeError: "",
            wheelDriveTypeError: "",
            mileageError: "",
            bodyColorError: "",
            interiorMaterialError: "",
            interiorColorError: "",
            priceError: ""
        }

        this.isFormInvalid = false;
    }

    onBrandFocus = () => {
        this.setState({ isBrandInvalid: false })
    }

    onModelFocus = () => {
        this.setState({ isModelInvalid: false })
    }

    onYearOfIssueFocus = () => {
        this.setState({ isYearOfIssueNotSelected: false })
    }

    onBodyTypeFocus = () => {
        this.setState({ isBodyTypeNotSelected: false })
    }

    onEngineVolumeFocus = () => {
        this.setState({ isEngineVolumeNotSelected: false })
    }

    onEngineTypeFocus = () => {
        this.setState({ isEngineTypeNotSelected: false })
    }

    onTransmissionTypeFocus = () => {
        this.setState({ isTransmissionTypeNotSelected: false })
    }

    onWheelDriveTypeFocus = () => {
        this.setState({ isWheelDriveTypeNotSelected: false })
    }

    onMileageFocus = () => {
        this.setState({ isMileageInvalid: false })
    }

    onBodyColorFocus = () => {
        this.setState({ isBodyColorNotSelected: false })
    }

    onInteriorMaterialFocus = () => {
        this.setState({ isInteriorMaterialNotSelected: false })
    }

    onInteriorColorFocus = () => {
        this.setState({ isInteriorColorNotSelected: false })
    }

    onPriceFocus = () => {
        this.setState({ isPriceInvalid: false })
    }

    onChangeBrand(e) {
        this.setState({ brand: e.target.value });
    }

    onChangeModel(e) {
        this.setState({ model: e.target.value })
    }

    onChangeYearOfIssue(e) {
        this.setState({ yearOfIssue: e.target.value })
    }

    onChangeBodyType(e) {
        this.setState({ bodyType: e.target.value })
    }

    onChangeEngineVolume(e) {
        this.setState({ engineVolume: e.target.value })
    }

    onChangeEngineType(e) {
        this.setState({ engineType: e.target.value })
    }

    onChangeTransmissionType(e) {
        this.setState({ transmissionType: e.target.value })
    }

    onChangeWheelDriveType(e) {
        this.setState({ wheelDriveType: e.target.value })
    }

    onChangeMileage(e) {
        this.setState({ mileage: e.target.value })
    }

    onChangeBodyColor(e) {
        this.setState({ bodyColor: e.target.value })
    }

    onChangeInteriorMaterial(e) {
        this.setState({ interiorMaterial: e.target.value })
    }

    onChangeInteriorColor(e) {
        this.setState({ interiorColor: e.target.value })
    }

    onChangePrice(e) {
        this.setState({ price: e.target.value })
    }

    onChangeFiles(e) {
        this.setState({
            fileInputLabel: e.target.files[0].name,
            file: e.target.files[0],
        })

        if (e.target.files !== null) {
            Utils.getBase64(e.target.files[0]).then(
                base64 => {
                    this.setState({
                        fileBase64: base64
                    })
                }
            )
        }
    }

    resetForm = () => {
        this.setState({
            brand: "",
            model: "",
            yearOfIssue: "",
            bodyType: "",
            engineVolume: "",
            engineType: "",
            transmissionType: "",
            wheelDriveType: "",
            mileage: "",
            bodyColor: "",
            interiorMaterial: "",
            interiorColor: "",
            price: "",
            fileBase64: "",

            file: null,
            fileInputLabel: "Выберите файл",

            isBrandInvalid: false,
            isModelInvalid: false,
            isYearOfIssueNotSelected: false,
            isBodyTypeNotSelected: false,
            isEngineVolumeNotSelected: false,
            isEngineTypeNotSelected: false,
            isTransmissionTypeNotSelected: false,
            isWheelDriveTypeNotSelected: false,
            isMileageInvalid: false,
            isBodyColorNotSelected: false,
            isInteriorMaterialNotSelected: false,
            isInteriorColorNotSelected: false,
            isPriceInvalid: false, 
        })
    }

    validate = () => {
        this.isFormInvalid = false;
    
        if (this.state.brand.length === 0) {
          this.setState({
            brandError: "Это обязательное поле.",
            isBrandInvalid: true,
          })
          this.isFormInvalid = true;
        } 
        else if (this.state.brand.length < 2 || this.state.brand.length > 25) {
          this.setState({
            brandError: "Длина марки должна находится в диапазоне от 2 до 25 символов.",
            isBrandInvalid: true,
          })
          this.isFormInvalid = true;
        } 
        else if (!this.state.brand.match(/^[A-Za-zА-Яа-я ]+$/)) {
          this.setState({
            brandError: "Марка должна состоять только из букв и символа пробела.",
            isBrandInvalid: true,
          })
          this.isFormInvalid = true;
        }

        if (this.state.model.length === 0) {
            this.setState({
              modelError: "Это обязательное поле.",
              isModelInvalid: true,
            })
            this.isFormInvalid = true;
        } 
        else if (this.state.model.length < 2 || this.state.model.length > 25) {
        this.setState({
            modelError: "Длина модели должна находится в диапазоне от 2 до 25 символов.",
            isModelInvalid: true,
        })
        this.isFormInvalid = true;
        } 
        else if (!this.state.model.match(/^[A-Za-zА-Яа-я0-9 -]+$/)) {
        this.setState({
            modelError: "Модель должна состоять только из букв и символа пробела.",
            isModelInvalid: true,
        })
        this.isFormInvalid = true;
        }

        if (this.state.yearOfIssue.length === 0) {
            this.setState({
                yearOfIssueError: "Это обязательное поле.",
                isYearOfIssueNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.bodyType.length === 0) {
            this.setState({
                bodyTypeError: "Это обязательное поле.",
                isBodyTypeNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.engineVolume.length === 0) {
            this.setState({
                engineVolumeError: "Это обязательное поле.",
                isEngineVolumeNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.engineType.length === 0) {
            this.setState({
                engineTypeError: "Это обязательное поле.",
                isEngineTypeNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.transmissionType.length === 0) {
            this.setState({
                transmissionTypeError: "Это обязательное поле.",
                isTransmissionTypeNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.wheelDriveType.length === 0) {
            this.setState({
                wheelDriveTypeError: "Это обязательное поле.",
                isWheelDriveTypeNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.mileage.length === 0) {
            this.setState({
                mileageError: "Это обязательное поле.",
                isMileageInvalid: true,
            })
            this.isFormInvalid = true;
        }
        if (!this.state.mileage.match(/^[0-9]+$/)) {
            this.setState({
                mileageError: "Пробег должен состоять только из цифр.",
                isMileageInvalid: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.bodyColor.length === 0) {
            this.setState({
                bodyColorError: "Это обязательное поле.",
                isBodyColorNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.interiorMaterial.length === 0) {
            this.setState({
                interiorMaterialError: "Это обязательное поле.",
                isInteriorMaterialNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.interiorColor.length === 0) {
            this.setState({
                interiorColorError: "Это обязательное поле.",
                isInteriorColorNotSelected: true,
            })
            this.isFormInvalid = true;
        }

        if (this.state.price.length === 0) {
            this.setState({
                priceError: "Это обязательное поле.",
                isPriceInvalid: true,
            })
            this.isFormInvalid = true;
        }
        if (!this.state.price.match(/^[0-9]+$/)) {
            this.setState({
                priceError: "Цена должна состоять только из цифр.",
                isPriceInvalid: true,
            })
            this.isFormInvalid = true;
        }
    }

    addCar = (e) => {
        e.preventDefault();

        this.validate();

        if (this.state.file !== null) {
            Utils.getBase64(this.state.file).then(
                base64 => {
                    this.setState({
                        fileBase64: base64 
                    })
                }
            )
        }

        if (this.isFormInvalid === false) {
            CarService.add(
                this.state.brand,
                this.state.model,
                this.state.yearOfIssue,
                this.state.bodyType,
                this.state.engineVolume,
                this.state.engineType,
                this.state.transmissionType,
                this.state.wheelDriveType,
                this.state.mileage,
                this.state.bodyColor,
                this.state.interiorMaterial,
                this.state.interiorColor,
                this.state.price,
                this.state.fileBase64
            ).then(
                response => {
                    toast.success(response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});

                    this.resetForm();

                    this.props.history.replace("/carsList")
                },
                error => {
                    toast.error((error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                    error.message ||
                                    error.toString(),
                                {position: toast.POSITION.BOTTOM_RIGHT});
                }
            ).catch(() => {
                toast.error("Что-то пошло не так :(", { position: toast.POSITION.BOTTOM_RIGHT });
            });
        }
    }

    handleSelectAutodealerModalClose = () => {
        this.setState({ showSelectAutodealerModal: false })
    }
    
    onSelectAutodealerModalCancel = () => {
        this.props.history.push("/profile");
        window.location.reload();
    }

    render() {
        return(
            <Container style={{marginTop: "100px", marginBottom: "100px", width: "60%"}}>
                {AutodealerService.getCurrentAutodealer() !== null ? (
                    <div>
                        <Card className="border border-light bg-light text-black">
                            <Form onSubmit={this.addCar} onReset={this.resetForm} noValidate>
                                <Card.Header><FontAwesomeIcon icon={faPlusSquare}/>&nbsp;Добавление нового автомобиля</Card.Header> 
                                <Card.Body>
                                    <div>
                                        <Form.Row>
                                            <Form.Group as={Col} id="brandInput" className="left__form__group__style">
                                                <Form.Label>Марка</Form.Label>
                                                <Form.Control
                                                name="brand"
                                                type="text"
                                                autoComplete="off"
                                                value={this.state.brand}
                                                isInvalid={this.state.isBrandInvalid}
                                                onFocus={this.onBrandFocus.bind(this)}
                                                onChange={this.onChangeBrand}
                                                placeholder="Введите марку"/>
                                                {this.state.isBrandInvalid ? <span className="error">{this.state.brandError}</span> : null}
                                            </Form.Group>
                                            <Form.Group as={Col} id="modelInput" className="right__form__group__style">
                                                <Form.Label>Модель</Form.Label>
                                                <Form.Control
                                                name="model"
                                                type="text"
                                                autoComplete="off"
                                                value={this.state.model}
                                                isInvalid={this.state.isModelInvalid}
                                                onFocus={this.onModelFocus.bind(this)}
                                                onChange={this.onChangeModel}
                                                placeholder="Введите модель"/>
                                                {this.state.isModelInvalid ? <span className="error">{this.state.modelError}</span> : null}
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} id="yearOfIssueSelect" className="left__form__group__style">
                                                <Form.Label>Год выпуска</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                    as="select"
                                                    name="yearOfIssue"
                                                    autoComplete="off"
                                                    value={this.state.yearOfIssue}
                                                    isInvalid={this.state.isYearOfIssueNotSelected}
                                                    onFocus={this.onYearOfIssueFocus.bind(this)}
                                                    onChange={this.onChangeYearOfIssue}> 
                                                        <option value="">Выберите...</option>
                                                        {
                                                            Utils.generateYearArray(1975).map((year, index) => {
                                                                return <option key={index} value={year}>{year}</option>
                                                            })
                                                        }
                                                    </Form.Control>
                                                    <InputGroup.Append>
                                                        <InputGroup.Text>г. в.</InputGroup.Text>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                                {this.state.isYearOfIssueNotSelected ? <span className="error">{this.state.yearOfIssueError}</span> : null}
                                            </Form.Group>
                                            <Form.Group as={Col} id="bodyTypeSelect" className="right__form__group__style">
                                                <Form.Label>Тип кузова</Form.Label>
                                                <Form.Control
                                                as="select"
                                                name="bodyType"
                                                autoComplete="off"
                                                value={this.state.bodyType}
                                                isInvalid={this.state.isBodyTypeNotSelected}
                                                onFocus={this.onBodyTypeFocus.bind(this)}
                                                onChange={this.onChangeBodyType}>
                                                    <option value="">Выберите...</option>
                                                    {
                                                        Utils.getBodyTypes().map((type, index) => {
                                                            return <option key={index} value={index}>{type}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                {this.state.isBodyTypeNotSelected ? <span className="error">{this.state.bodyTypeError}</span> : null}
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} id="engineVolumeSelect" className="left__form__group__style">
                                                <Form.Label>Объем двигателя</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                    as="select"
                                                    name="engineVolume"
                                                    autoComplete="off"
                                                    value={this.state.engineVolume}
                                                    isInvalid={this.state.isEngineVolumeNotSelected}
                                                    onFocus={this.onEngineVolumeFocus.bind(this)}
                                                    onChange={this.onChangeEngineVolume}> 
                                                        <option value="">Выберите...</option>
                                                        {
                                                            Utils.generateEngineVolumeArray(0.8, 7.0).map((engineVolume, index) => {
                                                                return <option key={`year${index}`} value={engineVolume}>{engineVolume}</option>
                                                            })
                                                        }
                                                    </Form.Control>
                                                    <InputGroup.Append>
                                                        <InputGroup.Text>л.</InputGroup.Text>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                                {this.state.isEngineVolumeNotSelected ? <span className="error">{this.state.engineVolumeError}</span> : null}
                                            </Form.Group>
                                            <Form.Group as={Col} id="engineTypeSelect" className="right__form__group__style">
                                                <Form.Label>Тип двигателя</Form.Label>
                                                <Form.Control
                                                as="select"
                                                name="engineType"
                                                autoComplete="off"
                                                value={this.state.engineType}
                                                isInvalid={this.state.isEngineTypeNotSelected}
                                                onFocus={this.onEngineTypeFocus.bind(this)}
                                                onChange={this.onChangeEngineType}>
                                                    <option value="">Выберите...</option>
                                                    {
                                                        Utils.getEngineTypes().map((type, index) => {
                                                            return <option key={index} value={index}>{type}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                {this.state.isEngineTypeNotSelected ? <span className="error">{this.state.engineTypeError}</span> : null}
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} id="transmissionTypeSelect" className="left__form__group__style">
                                                <Form.Label>Коробка передач</Form.Label>
                                                <Form.Control
                                                as="select"
                                                name="transmissionType"
                                                autoComplete="off"
                                                value={this.state.transmissionType}
                                                isInvalid={this.state.isTransmissionTypeNotSelected}
                                                onFocus={this.onTransmissionTypeFocus.bind(this)}
                                                onChange={this.onChangeTransmissionType}> 
                                                    <option value="">Выберите...</option>
                                                    {
                                                        Utils.getTransmissionTypes().map((type, index) => {
                                                            return <option key={index} value={index}>{type}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                {this.state.isTransmissionTypeNotSelected ? <span className="error">{this.state.transmissionTypeError}</span> : null}
                                            </Form.Group>
                                            <Form.Group as={Col} id="wheelDriveTypeSelect" className="right__form__group__style">
                                                <Form.Label>Привод</Form.Label>
                                                <Form.Control
                                                as="select"
                                                name="wheelDriveType"
                                                autoComplete="off"
                                                value={this.state.wheelDriveType}
                                                isInvalid={this.state.isWheelDriveTypeNotSelected}
                                                onFocus={this.onWheelDriveTypeFocus.bind(this)}
                                                onChange={this.onChangeWheelDriveType}>
                                                    <option value="">Выберите...</option>
                                                    {
                                                        Utils.getWheelDriveTypes().map((type, index) => {
                                                            return <option key={index} value={index}>{type}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                {this.state.isWheelDriveTypeNotSelected ? <span className="error">{this.state.wheelDriveTypeError}</span> : null}
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} id="mileageInput" className="left__form__group__style">
                                                <Form.Label>Пробег</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                    name="mileage"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={this.state.mileage}
                                                    isInvalid={this.state.isMileageInvalid}
                                                    onFocus={this.onMileageFocus.bind(this)}
                                                    onChange={this.onChangeMileage}
                                                    placeholder="Введите пробег"/>
                                                    <InputGroup.Append>
                                                        <InputGroup.Text>км</InputGroup.Text>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                                {this.state.isMileageInvalid ? <span className="error">{this.state.mileageError}</span> : null}
                                            </Form.Group>
                                            <Form.Group as={Col} id="bodyColorSelect" className="right__form__group__style">
                                                <Form.Label>Цвет кузова</Form.Label>
                                                <Form.Control
                                                as="select"
                                                name="bodyColor"
                                                autoComplete="off"
                                                value={this.state.bodyColor}
                                                isInvalid={this.state.isBodyColorNotSelected}
                                                onFocus={this.onBodyColorFocus.bind(this)}
                                                onChange={this.onChangeBodyColor}>
                                                    <option value="">Выберите...</option>
                                                    {
                                                        Utils.getBodyColors().map((color, index) => {
                                                            return <option key={index} value={index}>{color}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                {this.state.isBodyColorNotSelected ? <span className="error">{this.state.bodyColorError}</span> : null}
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} id="interiorMaterialSelect" className="left__form__group__style">
                                                <Form.Label>Материал салона</Form.Label>
                                                <Form.Control
                                                as="select"
                                                name="interiorMaterial"
                                                autoComplete="off"
                                                value={this.state.interiorMaterial}
                                                isInvalid={this.state.isInteriorMaterialNotSelected}
                                                onFocus={this.onInteriorMaterialFocus.bind(this)}
                                                onChange={this.onChangeInteriorMaterial}> 
                                                    <option value="">Выберите...</option>
                                                    {
                                                        Utils.getInteriorMaterials().map((material, index) => {
                                                            return <option key={index} value={index}>{material}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                {this.state.isInteriorMaterialNotSelected ? <span className="error">{this.state.interiorMaterialError}</span> : null}
                                            </Form.Group>
                                            <Form.Group as={Col} id="interiorColorSelect" className="right__form__group__style">
                                                <Form.Label>Цвет салона</Form.Label>
                                                <Form.Control
                                                as="select"
                                                name="interiorColor"
                                                autoComplete="off"
                                                value={this.state.interiorColor}
                                                isInvalid={this.state.isInteriorColorNotSelected}
                                                onFocus={this.onInteriorColorFocus.bind(this)}
                                                onChange={this.onChangeInteriorColor}>
                                                    <option value="">Выберите...</option>
                                                    {
                                                        Utils.getInteriorColors().map((color, index) => {
                                                            return <option key={index} value={index}>{color}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                {this.state.isInteriorColorNotSelected ? <span className="error">{this.state.interiorColorError}</span> : null}
                                            </Form.Group>
                                        </Form.Row>
                                            <Form.Group id="priceInput">
                                                <Form.Label>Цена</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                    name="price"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={this.state.price}
                                                    isInvalid={this.state.isPriceInvalid}
                                                    onFocus={this.onPriceFocus.bind(this)}
                                                    onChange={this.onChangePrice}
                                                    placeholder="Введите цену"/>
                                                    <InputGroup.Append>
                                                        <InputGroup.Text>руб.</InputGroup.Text>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                                {this.state.isPriceInvalid ? <span className="error">{this.state.priceError}</span> : null}
                                            </Form.Group>
                                        <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
                                            <div style={{width: "50%", display: "flex", alignItems: "center"}}>
                                                <Form.Group id="photo" style={{paddingRight: "20px", width: "100%"}}>
                                                    <Form.Label style={{marginBottom: "-2px"}}>Фотография</Form.Label>
                                                    <Form.File id="formcheck-api-custom" custom >
                                                        <Form.File.Input style={{cursor: "pointer"}} onChange={this.onChangeFiles}/>
                                                        <Form.File.Label data-browse="Обзор" style={{cursor: "pointer"}}>{this.state.fileInputLabel}</Form.File.Label>
                                                    </Form.File>
                                                </Form.Group>
                                            </div>
                                            <div style={{width: "50%", paddingLeft: "20px"}}>
                                                {this.state.fileBase64 === "" ? 
                                                (
                                                    <div className="add__car__photo-empty">
                                                        <svg width="60%" viewBox="0 0 110 45" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentcolor"><path d="M8.353 35.068l-.033.083-.328-.132-.861-.348c-.89-.362-1.781-.729-2.614-1.078l-.3-.127a82.46 82.46 0 0 1-2.453-1.072 14.866 14.866 0 0 1-.851-.421 3.366 3.366 0 0 1-.339-.208 1.511 1.511 0 0 1-.229-.198 1.147 1.147 0 0 1-.344-.874c.014-.883.019-4.528.018-10.026l-.004-6.424-.003-2.765-.001-.785v-.28L.009 9.24l1.172-.024.387-.007a212.997 212.997 0 0 1 2.855-.037c.6-.004 1.139-.005 1.6-.001 3.553.03 6.236-.947 9.049-2.873.605-.414 2.432-1.777 2.683-1.953 1.046-.735 1.829-1.14 2.667-1.286C36.221.309 46.429.047 52.287 1.277c.733.154 1.333.322 1.811.494.287.104.493.195.627.266l.201.099.632.311a510.4 510.4 0 0 1 10.027 5.069c4.129 2.152 7.035 3.774 8.402 4.741 11.442.128 29.664 1.375 33.932 3.169l.355.231c1.721 1.616 1.473 5.37.043 10.307-1.219 4.208-2.825 7.782-4.104 8.225l-12 4.17a10.358 10.358 0 0 1-9.523 6.28c-5.719 0-10.355-4.636-10.355-10.354 0-5.719 4.636-10.355 10.355-10.355s10.355 4.636 10.355 10.355c0 .433-.026.861-.078 1.28l10.311-3.582a3.31 3.31 0 0 0 .186-.271c.224-.357.494-.879.783-1.519.621-1.374 1.266-3.141 1.773-4.894.252-.868.458-1.698.62-2.473l-6.987.022a1.196 1.196 0 0 1-.007-2.391l7.371-.023c.135-1.399.046-2.429-.266-2.898-4.359-1.587-22.424-2.794-33.174-2.892l-.406-.004-.319-.25c-1.014-.792-4.029-2.489-8.372-4.753l-.924-.48a505.428 505.428 0 0 0-9.055-4.565l-.628-.309-.221-.109a2.601 2.601 0 0 0-.366-.153 11.351 11.351 0 0 0-1.491-.404c-4.68-.983-12.519-.949-24.256.73l4.018 8.719 28.847.821.002-1.919a1.196 1.196 0 1 1 2.391.002l-.002 3.148a1.195 1.195 0 0 1-1.23 1.194l-37.752-1.074c.03.001-1.529-.018-2.323-.031-.651-.011-1.192-.022-1.598-.035a20.985 20.985 0 0 1-.568-.024 4.056 4.056 0 0 1-.217-.017c-.056-.006-.056-.006-.137-.02-.096-.009-.096-.009-.479-.196-.993-.682-2.246-2.476-2.661-4.262a6.171 6.171 0 0 1-.151-1.892c-2.938 1.863-5.902 2.833-9.676 2.801-.448-.003-.975-.003-1.564.001-.585.004-1.21.011-1.848.02-.187.817-.186 1.709-.185 2.657l.003 3.071 7.896-.01a1.196 1.196 0 0 1 .003 2.391l-7.898.011v.964c.001 4.594-.002 7.882-.012 9.381.109.053.234.112.373.177a79.795 79.795 0 0 0 2.672 1.163c.823.345 1.706.709 2.589 1.067l.424.172c.793-4.931 5.068-8.697 10.223-8.697 5.718 0 10.355 4.636 10.355 10.355 0 5.718-4.637 10.354-10.355 10.354-5.456 0-9.925-4.218-10.326-9.571zm66.374-.783a7.964 7.964 0 1 0 15.925-.003 7.964 7.964 0 0 0-15.925.003zm-64.012 0a7.963 7.963 0 1 0 15.927 0 7.963 7.963 0 0 0-15.927 0zm66.128.179a1.195 1.195 0 1 1 2.391 0c0 1.992 1.627 3.61 3.635 3.61 2.009 0 3.635-1.618 3.635-3.61 0-1.993-1.626-3.61-3.635-3.61a1.196 1.196 0 0 1 0-2.392c3.327 0 6.026 2.686 6.026 6.002 0 3.315-2.699 6.001-6.026 6.001-3.326 0-6.026-2.686-6.026-6.001zm-64.028 0a1.195 1.195 0 1 1 2.391 0c0 1.992 1.627 3.61 3.635 3.61 2.009 0 3.635-1.618 3.635-3.61 0-1.993-1.626-3.61-3.635-3.61a1.197 1.197 0 0 1 0-2.392c3.327 0 6.026 2.686 6.026 6.002 0 3.315-2.699 6.001-6.026 6.001-3.326 0-6.026-2.686-6.026-6.001zm19.818 2.698a2.73 2.73 0 1 0 5.458 0 2.73 2.73 0 0 0-5.458 0zm35.094 1.4H41.429a1.195 1.195 0 0 1 0-2.391h25.707c-.073-1.904.035-3.546.489-5.41.734-3.009 2.263-5.642 4.784-7.709a1.195 1.195 0 0 1 1.517 1.849c-3.702 3.035-4.64 6.886-4.374 11.731a1.828 1.828 0 0 1-1.825 1.93zm36.433-4.356l.053-.017c-.018.007-.036.012-.053.017zM25.076 4.715c-1.366.212-2.78.445-4.244.7a1.81 1.81 0 0 0-.171.04c-2.237 1.428-2.893 2.97-2.502 4.657.154.66.47 1.323.889 1.922.209.3.435.566.603.736l.316.012c.392.012.922.023 1.563.034.77.013 2.361.032 2.355.032l5.003.142-3.812-8.275z"></path></svg>
                                                    </div>
                                                ) : (
                                                    <div className="add__car__photo">
                                                        <img src={this.state.fileBase64} style={{width: "100%", height: "100%"}} alt="Автомобиль"></img>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: "40px"}}>
                                            <Button variant="primary" type="submit" style={{width: "40%"}}><FontAwesomeIcon icon={faSave}/>&nbsp;Добавить</Button>
                                            <Button variant="danger" type="reset" style={{width: "40%"}}><FontAwesomeIcon icon={faUndo}/>&nbsp;Очистить</Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Form>
                        </Card>
                    </div>
                ) : (
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        Упс... ничего не найдено, наверное вы не выбрали автосалон :(
                    </div>
                )}
                <SelectAutodealer 
                    prevProps={this.props}
                    show={this.state.showSelectAutodealerModal}
                    onHide={this.handleSelectAutodealerModalClose} 
                    onCancel={this.onSelectAutodealerModalCancel}/>
                <ToastContainer limit={3}/>
            </Container>
        )
    }
}