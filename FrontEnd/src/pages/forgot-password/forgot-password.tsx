import * as React from 'react';
import {Alert, Button, Form} from "react-bootstrap";
import "./forgot-password.css";
import {forgotPassword} from "../../api/accounts-api";
import _ from "lodash";

interface Props {

}

interface State {
    email: string | null;
    success?: boolean;
}

export class ForgotPassword extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            email: null
        };
    }

    render() {
        return (
            <div className="reset-password-wrapper">
                <Form>
                    <h2>Reset password</h2>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            value={this.state.email ?? ''}
                            placeholder="Enter email"
                            onChange={event => this.setState({email: event.target.value})}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.handleResetPassword}>
                        Send me password reset mail
                    </Button>
                    <br/>
                    <br/>
                    {this.state.success && <Alert variant="info">
                        Please check your email for password reset instructions.
                    </Alert>}
                    {!_.isUndefined(this.state.success) && !this.state.success && <Alert variant="danger">
                        Password reset failed.
                    </Alert>}
                </Form>
            </div>
        );
    };

    private handleResetPassword = (event: any) => {
        if (!this.state.email) {
            alert('Email not set');
            return;
        }

        event.preventDefault();
        forgotPassword(this.state.email)
            .then(response => {
                this.setState({success: response.ok});
            }).catch(err => this.setState({success: false}))
    }
}