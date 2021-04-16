import * as React from 'react';
import {Alert, Button, Form} from "react-bootstrap";
import "./login.css";
import {Redirect} from "react-router";
import {Link} from 'react-router-dom';

type Props = {
    handleLogin: (username: string, password: string) => Promise<boolean>;
};
type State = {
    email?: string;
    password?: string;
    success?: boolean;
};

export class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="login-wrapper">
                <Form>
                    <h2>Login</h2>
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

                    <Button variant="primary" type="submit" onClick={this.handleLogin}>
                        Submit
                    </Button>
                    <br />
                    <br />
                    <Link to="/register">New user? Register here.</Link>
                    <br/>
                    <br/>
                    <Link to="/forgot-password">Forgot your password? Reset it here.</Link>
                    <br/>
                    <br/>
                    {this.state.success === false && <Alert variant="warning">Wrong username or password</Alert>}
                    {localStorage.getItem('jwt') && <Redirect to="/"/>}
                </Form>
            </div>
        );
    };

    private handleLogin = async (event: any) => {
        event.preventDefault();
        const success = await this.props.handleLogin(this.state.email ?? '', this.state.password ?? '');
        this.setState({success})
    }
}