import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createCountry, deleteCountry, getAllCountries, updateCountry} from '../../api/countries-api';
import {Country} from '../../api/response/country';
import "./countries.css"

interface Props {
}

interface State {
    countries: Country[];

    id: number;
    name: string;

    showAddNewCountryForm: boolean;
    showEditCountryForm: boolean;
}

export class Countries extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            countries: [],

            id: 0,
            name: '',

            showAddNewCountryForm: false,
            showEditCountryForm: false
        }
    }

    resetState = () => {
        this.setState({id: 0, name: '', showAddNewCountryForm: false, showEditCountryForm: false});
    }

    componentDidMount() {
        this.loadCountries();
    }

    render() {
        return (
            <div>
                <h3 className="countries-heading">Countries</h3>
                <Button onClick={this.addCountry}>Add new country</Button>
                <br />
                <br />

                <div className="scrolltable">
                    {this.renderCountries()}
                </div>

                <br />
                {this.state.showAddNewCountryForm && <h3>Add new country</h3>}
                {this.state.showAddNewCountryForm && this.renderNewCountryForm()}
                {this.state.showEditCountryForm && <h3>Edit country</h3>}
                {this.state.showEditCountryForm && this.renderNewCountryForm()}

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
                        <th colSpan={2}>Actions</th>
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
                <td>{<Button onClick={() => this.editSingleCountry(country)}>Edit</Button>}</td>
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

                <Button variant="primary" onClick={this.addOrEditCountry}>
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

        this.resetState();

        createCountry(request).then(this.loadCountries);
    }

    private editCountry = () => {
        const request = {
            name: this.state.name,
            id: this.state.id
        } as Country;

        this.resetState()

        updateCountry(request).then(this.loadCountries);
    }

    private addCountry = () => {
        this.resetState();
        this.setState({showAddNewCountryForm: true});
    }

    private editSingleCountry = (country: Country) => {
        this.resetState();
        this.setState({id: country.id ?? 0, name: country.name, showEditCountryForm: true})
    }

    private addOrEditCountry = () => {
        if (this.state.showAddNewCountryForm) {
            this.createNewCountry();
        }
        if (this.state.showEditCountryForm) {
            this.editCountry();
        }
    }
}
