import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createAirport, deleteAirport, getAllAirports, updateAirport} from '../../api/airports-api';
import {getAllCities, getCity} from '../../api/cities-api';
import {Airport} from '../../api/response/airport';
import {City} from '../../api/response/city';
import "./airports.css";
import Select from "react-select";

interface Props {
}

interface State {
    airports: Airport[];

    id: number;
    name: string;
    detailedName: string;
    iataCode: string;
    cityId: number;

    showAddNewAirportForm: boolean;
    showEditAirportForm: boolean;

    cityNames: Map<number, string>;

    cities: City[];
}

export class Airports extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            airports: [],

            id: 0,
            name: '',
            detailedName: '',
            iataCode: '',
            cityId: 0,

            showAddNewAirportForm: false,
            showEditAirportForm: false,

            cityNames: new Map(),
            cities: []
        }
    }

    resetState = () => {
        this.setState({id: 0, name: '', detailedName: '', iataCode: '', cityId: 0, showAddNewAirportForm: false, showEditAirportForm: false});
    }

    componentDidMount() {
        this.loadAirports();
        this.getCities();
    }

    render() {
        return (
            <div>
                <h3 className="airports-heading">Airports</h3>
                <Button onClick={this.addAirport}>Add new airport</Button>
                <br />
                <br />

                <div className="scrolltable">
                    {this.renderAirports()}
                </div>

                <br />
                {this.state.showAddNewAirportForm && <h3>Add new airport</h3>}
                {this.state.showAddNewAirportForm && this.renderNewAirportForm()}
                {this.state.showEditAirportForm && <h3>Edit airport</h3>}
                {this.state.showEditAirportForm && this.renderNewAirportForm()}

                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }

    private getCities = () => {
        getAllCities()
            .then(cities => {this.setState({cities: cities, cityNames: this.mapCityNames(cities)} as State)});
    }

    private mapCityNames = (cities: City[]) => {
        var map = new Map();
        cities.forEach(city => map.set(city.id, city.name));
        return map;
    }

    private renderAirports = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Detailed name</th>
                        <th>Iata code</th>
                        <th>City</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(this.state.airports, this.renderAirport)}
                </tbody>
            </Table>
        )
    }

    private renderAirport = (airport: Airport) => {
        return (
            <tr>
                <td>{airport.name}</td>
                <td>{airport.detailedName}</td>
                <td>{airport.iataCode}</td>
                <td>{this.state.cityNames.get(airport.cityId)}</td>
                <td>{<Button onClick={() => this.deleteSingleAirport(airport.id!)}>Delete</Button>}</td>
                <td>{<Button onClick={() => this.editSingleAirport(airport)}>Edit</Button>}</td>
            </tr>
        );
    }

    private renderNewAirportForm = () => {
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
                    <Form.Label>Detailed name</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.detailedName ?? ''}
                        placeholder="Detailed name"
                        onChange={event => this.setState({detailedName: event.target.value})}
                    />
                    <Form.Label>Iata code</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.iataCode ?? ''}
                        placeholder="Iata code"
                        onChange={event => this.setState({iataCode: event.target.value})}
                    />
                    <Form.Label>City</Form.Label>
                    <Select
                        placeholder="City"
                        options={this.mapCitiesToValues(this.state.cities)}
                        onChange={(item: any) => this.setState({cityId: item.value})}
                        onMenuOpen={_.noop}
                        value={this.mapCitiesToValues(this.state.cities).find(o => o.value == this.state.cityId)}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.addOrEditAirport}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private mapCitiesToValues = (options: City[]) => {
        return options.map(option => ({
            value: option.id,
            label: option.name
        }));
    };

    private deleteSingleAirport = (id: number) => {
        deleteAirport(id).then(this.loadAirports);
    }

    private loadAirports = () => {
        getAllAirports().then(airports => {
            this.setState({airports});
        });
    }

    private createNewAirport = () => {
        const request = {
            name: this.state.name,
            detailedName: this.state.detailedName,
            iataCode: this.state.iataCode,
            cityId: this.state.cityId,
        } as Airport;

        this.resetState();

        createAirport(request).then(this.loadAirports);
    }

    private editAirport = () => {
        const request = {
            name: this.state.name,
            detailedName: this.state.detailedName,
            iataCode: this.state.iataCode,
            cityId: this.state.cityId,
            id: this.state.id
        } as Airport;

        this.resetState()

        updateAirport(request).then(this.loadAirports);
    }

    private addAirport = () => {
        this.resetState();
        this.setState({showAddNewAirportForm: true});
    }

    private editSingleAirport = (airport: Airport) => {
        this.resetState();
        this.setState({
            id: airport.id ?? 0,
            name: airport.name,
            detailedName: airport.detailedName,
            iataCode: airport.iataCode,
            cityId: airport.cityId,
            showEditAirportForm: true
        })
    }

    private addOrEditAirport = () => {
        if (this.state.showAddNewAirportForm) {
            this.createNewAirport();
        }
        if (this.state.showEditAirportForm) {
            this.editAirport();
        }
    }
}
