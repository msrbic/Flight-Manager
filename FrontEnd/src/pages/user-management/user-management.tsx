import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createAccount, deleteAccount, getAllAccounts, updateAccount} from '../../api/accounts-api';
import {CreateAccountRequest} from '../../api/request/create-account';
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

    showAddNewAccountForm: boolean;
    showEditAccountForm: boolean;
}

export class UserManagement extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
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
        confirmPassword: '',

        showAddNewAccountForm: false,
        showEditAccountForm: false
    })

    resetState = () => {
        this.setState(this.getInitialState());
    }

    componentDidMount() {
        this.loadAccounts();
    }

    render() {
        return (
            <div>
                <h3 className="user-management-heading">Accounts</h3>

                <Button onClick={() => this.setState({showAddNewAccountForm: true})}>Create new account</Button>
                <br /><br />
                <div className="scrolltable">
                    {this.renderAccounts()}
                </div>

                <br />
                {this.state.showAddNewAccountForm && <h3>Add new account</h3>}
                {this.state.showAddNewAccountForm && this.renderNewAccountForm()}
                {this.state.showEditAccountForm && <h3>Edit account</h3>}
                {this.state.showEditAccountForm && this.renderNewAccountForm()}

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
                        <th colSpan={2}>Actions</th>
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
                <td>{<Button onClick={() => this.editSingleAccount(account)}>Edit</Button>}</td>
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
                    <Form.Control as="select" defaultValue="User" onChange={event => this.setState({role: event.target.value})}>
                        <option>User</option>
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

                <Button variant="primary" onClick={this.createOrEditAccount}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private deleteSingleAccount = (id: number) => {
        deleteAccount(id).then(this.loadAccounts);
    }

    private createOrEditAccount = () => {
        if (this.state.showAddNewAccountForm) {
            this.createNewAccount();
        }
        if (this.state.showEditAccountForm) {
            this.editAccount();
        }
    }

    private editSingleAccount = (account: Account) => {
        this.setState({
            showEditAccountForm: true,
            showAddNewAccountForm: false,
            id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            role: account.role});
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

        this.resetState();

        createAccount(request).then(this.loadAccounts);
    }

    private editAccount = () => {
        const request = {
            id: this.state.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            role: this.state.role
        } as unknown as Account;

        this.resetState();

        updateAccount(request).then(this.loadAccounts);
    }
}
