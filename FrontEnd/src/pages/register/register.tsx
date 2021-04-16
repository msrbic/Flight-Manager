import * as React from 'react';
import {Alert, Button, Form} from "react-bootstrap";
import "./register.css";
import {Redirect} from "react-router";
import {AccountRequest} from "../../api/request/account-request";
import {register} from "../../api/accounts-api";
import _ from "lodash";

type State = {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
    success?: boolean;
};

export class Register extends React.Component<{}, State> {

    constructor() {
        super({});
        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            confirmPassword: null
        };
    }

    render() {
        return (
            <div className="register-wrapper">
                <Form>
                    <h2>Register</h2>

                    <Form.Group controlId="formBasicFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.firstName ?? ''}
                            placeholder="Enter first name"
                            onChange={event => this.setState({firstName: event.target.value})}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.lastName ?? ''}
                            placeholder="Enter last name"
                            onChange={event => this.setState({lastName: event.target.value})}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            value={this.state.email ?? ''}
                            placeholder="Enter email"
                            onChange={event => this.setState({email: event.target.value})}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={this.state.password ?? ''}
                            placeholder="Password"
                            onChange={event => this.setState({password: event.target.value})}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={this.state.confirmPassword ?? ''}
                            placeholder="Confirm passsword"
                            onChange={event => this.setState({confirmPassword: event.target.value})}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={this.handleRegister}>
                        Submit
                    </Button>
                    <br/>
                    <br/>
                    {localStorage.getItem('jwt') && <Redirect to="/"/>}
                    {this.state.success && <Alert variant="info">
                        Registration successful, please check your email for verification instructions.
                    </Alert>}
                    {!_.isUndefined(this.state.success) && !this.state.success && <Alert variant="danger">
                        Registration failed.
                    </Alert>}
                </Form>
            </div>
        );
    };

    private handleRegister = (event: any) => {
        if (this.state.password !== this.state.confirmPassword) {
            alert('The passwords do not match!');
            return;
        }
        if (_.some(_.omit(this.state, 'success'), _.isEmpty)) {
            alert('Some properties are empty');
            return;
        }

        event.preventDefault();
        register(_.omit(this.state, 'success') as AccountRequest)
            .then(response => {
                this.setState({success: response.ok});
            }).catch(err => this.setState({success: false}))
    }
}