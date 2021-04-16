import * as React from 'react';
import {Alert, Button, Form} from "react-bootstrap";
import "./reset-password.css";
import {resetPassword} from "../../api/accounts-api";
import _ from "lodash";

interface Props {
}

interface State {
    password?: string;
    confirmPassword?: string;
    success?: boolean;
}

export class ResetPassword extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="reset-password-wrapper">
                <Form>
                    <h2>Set a new password</h2>
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

                    <Button variant="primary" type="submit" onClick={this.handleLogin}>
                        Submit
                    </Button>
                    <br/>
                    <br/>
                    {this.state.success &&
                    <Alert variant="info">Password reset successful. You can log in now.</Alert>}
                    {!_.isUndefined(this.state.success) && !this.state.success &&
                    <Alert variant="danger">Failed to reset password</Alert>}
                </Form>
            </div>
        );
    };

    private getToken = () => {
        const query = new URLSearchParams(window.location.search);
        return query.get('token');
    }

    private handleLogin = async (event: any) => {
        event.preventDefault();
        if (!this.state.password || !this.state.confirmPassword) {
            return;
        }

        resetPassword(this.getToken() ?? '', this.state.password, this.state.confirmPassword)
            .then(response => {
                this.setState({success: response.ok});
            })
            .catch(err => this.setState({success: false}))
    }
}