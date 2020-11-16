import React, {Component} from 'react';
import { Jumbotron, Container } from 'react-bootstrap';

export default class PageNotFound extends Component {
    render() {
        return(
            <Container style={{width: "75%", marginTop: "100px"}} fluid>
                <Jumbotron style={{textAlign: "center", verticalAlign: "middle"}}>
                    <h1 style={{fontSize: "44px"}}>Данная страница не найдена :(</h1>
                </Jumbotron>
            </Container>
        )
    }
}