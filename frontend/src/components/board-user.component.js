import React, { Component } from "react";
import {Container} from "react-bootstrap";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString(),
        });

        if (error.response.data.status === 401) {
          AuthService.logout();
          this.props.history.push({
            pathname: "/login",
            state: {message: "Session expired! Relogin please"}
          });
          window.location.reload();
        }
      }
    );
  }

  render() {
    return (
      <Container style={{marginTop: "70px", width: "80%"}}>
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
      </Container>
    );
  }
}