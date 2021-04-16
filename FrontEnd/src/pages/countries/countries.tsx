import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createCountry, deleteCountry, getAllCountries} from '../../api/countries-api';
import {Country} from '../../api/response/country';
import "./countries.css"

interface Props {
}

interface State {
    countries: Country[];

    name: string;
}

export class Countries extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            countries: [],

            name: ''
        }
    }

    componentDidMount() {
        this.loadCountries();
    }

    render() {
        return (
            <div>
                <h3 className="countries-heading">Countries</h3>

                <div className="scrolltable">
                    {this.renderCountries()}
                </div>

                <br />
                <h3>Add new country</h3>
                {this.renderNewCountryForm()}

                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }

    private renderCountries = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(this.state.countries, this.renderCountry)}
                </tbody>
            </Table>
        )
    }

    private renderCountry = (country: Country) => {
        return (
            <tr>
                <td>{country.name}</td>
                <td>{<Button onClick={() => this.deleteSingleCountry(country.id!)}>Delete</Button>}</td>
            </tr>
        );
    }

    private renderNewCountryForm = () => {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.name ?? ''}
                        placeholder="Name"
                        onChange={event => this.setState({name: event.target.value})}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.createNewCountry}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private deleteSingleCountry = (id: number) => {
        deleteCountry(id).then(this.loadCountries);
    }

    private loadCountries = () => {
        getAllCountries().then(countries => {
            this.setState({countries});
        });
    }

    private createNewCountry = () => {
        const request = {
            name: this.state.name
        } as Country;

        createCountry(request).then(this.loadCountries);
    }
}
