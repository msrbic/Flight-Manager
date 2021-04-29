import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createCurrency, deleteCurrency, getAllCurrencies, updateCurrency} from '../../api/currencies-api';
import {Currency} from '../../api/response/currency';
import "./currencies.css"

interface Props {
}

interface State {
    currencies: Currency[];

    id: number;
    isoCode: string;
    name: string;
    exchangeRate: number;

    showAddNewCurrencyForm: boolean;
    showEditCurrencyForm: boolean;
}

export class Currencies extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currencies: [],

            id: 0,
            isoCode: '',
            name: '',
            exchangeRate: 1.0,

            showAddNewCurrencyForm: false,
            showEditCurrencyForm: false
        }
    }

    resetState = () => {
        this.setState({id: 0, isoCode: '', name: '', exchangeRate: 1.0, showEditCurrencyForm: false, showAddNewCurrencyForm: false});
    }

    componentDidMount() {
        this.loadCurrencies();
    }

    render() {
        return (
            <div>
                <h3 className="currencies-heading">Currencies</h3>
                <Button onClick={this.addCurrency}>Add new currency</Button>
                <br />
                <br />

                <div className="scrolltable">
                    {this.renderCurrencies()}
                </div>

                <br />
                {this.state.showAddNewCurrencyForm && <h3>Add new currency</h3>}
                {this.state.showAddNewCurrencyForm && this.renderNewCurrencyForm()}
                {this.state.showEditCurrencyForm && <h3>Edit currency</h3>}
                {this.state.showEditCurrencyForm && this.renderNewCurrencyForm()}


                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }

    private renderCurrencies = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ISO Code</th>
                        <th>Name</th>
                        <th>Exchange Rate</th>
                        <th>Is Default</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(this.state.currencies, this.renderCurrency)}
                </tbody>
            </Table>
        )
    }

    private renderCurrency = (currency: Currency) => {
        return (
            <tr>
                <td>{currency.isoCode}</td>
                <td>{currency.name}</td>
                <td>{currency.exchangeRate}</td>
                <td>{String(currency.isDefault)}</td>
                <td>{<Button onClick={() => this.deleteSingleCurrency(currency.id!)}>Delete</Button>}</td>
                <td>{<Button onClick={() => this.editSingleCurrency(currency)}>Edit</Button>}</td>
            </tr>
        );
    }

    private renderNewCurrencyForm = () => {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>ISO code</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.isoCode ?? ''}
                        placeholder="ISO code"
                        onChange={event => this.setState({isoCode: event.target.value})}
                        maxLength={3}
                    />
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.name ?? ''}
                        placeholder="Name"
                        onChange={event => this.setState({name: event.target.value})}
                    />
                    <Form.Label>Exchange rate</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.exchangeRate ?? ''}
                        placeholder="Name"
                        onChange={event => this.setState({exchangeRate: Number(event.target.value)})}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.addOrEditCurrency}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private deleteSingleCurrency = (id: number) => {
        deleteCurrency(id).then(this.loadCurrencies);
    }

    private loadCurrencies = () => {
        getAllCurrencies().then(currencies => {
            this.setState({currencies});
        });
    }

    private createNewCurrency = () => {
        const request = {
            isoCode: this.state.isoCode,
            name: this.state.name,
            exchangeRate: String(this.state.exchangeRate),
            isDefault: false
        } as Currency;

        this.resetState();

        createCurrency(request).then(this.loadCurrencies);
    }

    private editCurrency = () => {
        const request = {
            isoCode: this.state.isoCode,
            name: this.state.name,
            exchangeRate: String(this.state.exchangeRate),
            isDefault: false,
            id: this.state.id
        } as Currency;

        this.resetState()

        updateCurrency(request).then(this.loadCurrencies);
    }

    private addCurrency = () => {
        this.resetState();
        this.setState({showAddNewCurrencyForm: true});
    }

    private editSingleCurrency = (currency: Currency) => {
        this.resetState();
        this.setState({id: currency.id ?? 0, isoCode: currency.isoCode, name: currency.name, exchangeRate: Number(currency.exchangeRate), showEditCurrencyForm: true})
    }

    private addOrEditCurrency = () => {
        if (this.state.showAddNewCurrencyForm) {
            this.createNewCurrency();
        }
        if (this.state.showEditCurrencyForm) {
            this.editCurrency();
        }
    }
}
