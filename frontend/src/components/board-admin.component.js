import React, { Component } from "react";
import {Container} from "react-bootstrap";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      error: ""
    };
  }

  componentDidMount() {
    UserService.getUsers().then(
      response => {
        this.setState({
          users: response.data
        })
      },
      error => {
        this.setState({
          error:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
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
    )
  }

  render() {
    if (this.state.users != null) {
      return (
            <Container style={{marginTop: "70px"}}>
                {this.state.users.length === 0 ? 
                    <div>No customers</div> : this.state.users.map((u) => (
                    <div>Username: {u.username}, Firstname: {u.firstname}</div>
                    ))}
            </Container>
        );
    }
    else {
      return (
            <Container style={{width: "80%"}}>
                    <header className="jumbotron">
                      <h3>{this.state.error}</h3>
                    </header>
            </Container>
      )
    }
  }
}