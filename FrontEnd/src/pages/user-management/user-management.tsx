import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createAccount, deleteAccount, getAllAccounts} from '../../api/accounts-api';
import {AccountRequest} from '../../api/request/account-request';
import { CreateAccountRequest } from '../../api/request/create-account';
import {Account} from '../../api/response/account';
import "./user-management.css"

interface Props {
}

interface State {
    accounts: Account[];

    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    created: number;
    updated: number;
    isVerified: boolean;
    password: string;
    confirmPassword: string;
}

export class UserManagement extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            accounts: [],

            id: 0,
            firstName: '',
            lastName: '',
            email: '',
            role: 'User',
            created: 0,
            updated: 0,
            isVerified: false,
            password: '',
            confirmPassword: ''
        }
    }

    componentDidMount() {
        this.loadAccounts();
    }

    render() {
        return (
            <div>
                <h3 className="user-management-heading">Accounts</h3>

                <div className="scrolltable">
                    {this.renderAccounts()}
                </div>

                <br />
                <h3>Add new account</h3>
                {this.renderNewAccountForm()}

                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }

    private renderAccounts = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Role</th>
                        <th>Is Verified</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(this.state.accounts, this.renderAccount)}
                </tbody>
            </Table>
        )
    }

    private renderAccount = (account: Account) => {
        return (
            <tr>
                <td>{account.email}</td>
                <td>{account.firstName}</td>
                <td>{account.lastName}</td>
                <td>{account.role}</td>
                <td>{String(account.isVerified)}</td>
                <td>{<Button onClick={() => this.deleteSingleAccount(account.id!)}>Delete</Button>}</td>
            </tr>
        );
    }

    private renderNewAccountForm = () => {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.email ?? ''}
                        placeholder="Email"
                        onChange={event => this.setState({email: event.target.value})}
                    />
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.firstName ?? ''}
                        placeholder="First name"
                        onChange={event => this.setState({firstName: event.target.value})}
                    />
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.lastName ?? ''}
                        placeholder="Last name"
                        onChange={event => this.setState({lastName: event.target.value})}
                    />
                    <Form.Label>Role</Form.Label>
                    {/*<Form.Control*/}
                    {/*    type="text"*/}
                    {/*    value={this.state.role ?? ''}*/}
                    {/*    placeholder="Role"*/}
                    {/*    onChange={event => this.setState({role: event.target.value})}*/}
                    {/*/>*/}
                    <Form.Control as="select" onChange={event => this.setState({role: event.target.value})}>
                        <option selected={true}>User</option>
                        <option>Admin</option>
                    </Form.Control>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.password ?? ''}
                        placeholder="Password"
                        onChange={event => this.setState({password: event.target.value})}
                    />
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.confirmPassword ?? ''}
                        placeholder="Confirm password"
                        onChange={event => this.setState({confirmPassword: event.target.value})}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.createNewAccount}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private deleteSingleAccount = (id: number) => {
        deleteAccount(id).then(this.loadAccounts);
    }

    private loadAccounts = () => {
        getAllAccounts().then(accounts => {
            this.setState({accounts});
        });
    }

    private createNewAccount = () => {
        const request = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            role: this.state.role
        } as CreateAccountRequest;

        createAccount(request).then(this.loadAccounts);
    }
}
