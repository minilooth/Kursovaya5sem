import React, {Component} from 'react';
import { Jumbotron, Container } from 'react-bootstrap';

export default class AccessDenied extends Component {
    render() {
        return(
            <Container style={{width: "75%", marginTop: "100px"}} fluid>
                <Jumbotron style={{textAlign: "center", verticalAlign: "middle"}}>
                    <h1 style={{fontSize: "44px"}}>Досуп запрещен :(</h1>
                </Jumbotron>
            </Container>
        )
    }
}