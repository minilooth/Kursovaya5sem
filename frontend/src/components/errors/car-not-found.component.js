import React, {Component} from 'react';
import { Jumbotron } from 'react-bootstrap';

export default class CarNotFound extends Component {
    render() {
        return(
            <Jumbotron style={{textAlign: "center", verticalAlign: "middle"}}>
                <h1 style={{fontSize: "44px"}}>Автомобиль не найден :(</h1>
            </Jumbotron>
        )
    }
}