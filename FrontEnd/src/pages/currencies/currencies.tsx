import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createCurrency, deleteCurrency, getAllCurrencies} from '../../api/currencies-api';
import {Currency} from '../../api/response/currency';
import "./currencies.css"

interface Props {
}

interface State {
    currencies: Currency[];

    isoCode: string;
    name: string;
    exchangeRate: number;
}

export class Currencies extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currencies: [],

            isoCode: '',
            name: '',
            exchangeRate: 1.0
        }
    }

    componentDidMount() {
        this.loadCurrencies();
    }

    render() {
        return (
            <div>
                <h3 className="currencies-heading">Currencies</h3>

                <div className="scrolltable">
                    {this.renderCurrencies()}
                </div>

                <br />
                <h3>Add new currency</h3>
                {this.renderNewCurrencyForm()}

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
                        <th>Actions</th>
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

                <Button variant="primary" onClick={this.createNewCurrency}>
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

        createCurrency(request).then(this.loadCurrencies);
    }
}
