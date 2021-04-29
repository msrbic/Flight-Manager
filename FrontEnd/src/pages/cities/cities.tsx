import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createCity, deleteCity, getAllCities, updateCity} from '../../api/cities-api';
import {City} from '../../api/response/city';
import "./cities.css"

interface Props {
}

interface State {
    cities: City[];

    id: number;
    name: string;
    detailedName: string;
    iataCode: string;
    countryId: number;

    showAddNewCityForm: boolean;
    showEditCityForm: boolean;
}

export class Cities extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            cities: [],

            id: 0,
            name: '',
            detailedName: '',
            iataCode: '',
            countryId: 0,

            showAddNewCityForm: false,
            showEditCityForm: false
        }
    }

    resetState = () => {
        this.setState({id: 0, name: '', detailedName: '', iataCode: '', countryId: 0, showAddNewCityForm: false, showEditCityForm: false});
    }

    componentDidMount() {
        this.loadCities();
    }

    render() {
        return (
            <div>
                <h3 className="cities-heading">Cities</h3>
                <Button onClick={this.addCity}>Add new city</Button>
                <br />
                <br />

                <div className="scrolltable">
                    {this.renderCities()}
                </div>

                <br />
                {this.state.showAddNewCityForm && <h3>Add new city</h3>}
                {this.state.showAddNewCityForm && this.renderNewCityForm()}
                {this.state.showEditCityForm && <h3>Edit city</h3>}
                {this.state.showEditCityForm && this.renderNewCityForm()}


                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }

    private renderCities = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Detailed name</th>
                        <th>Iata code</th>
                        <th>Country id</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(this.state.cities, this.renderCity)}
                </tbody>
            </Table>
        )
    }

    private renderCity = (city: City) => {
        return (
            <tr>
                <td>{city.name}</td>
                <td>{city.detailedName}</td>
                <td>{city.iataCode}</td>
                <td>{String(city.countryId)}</td>
                <td>{<Button onClick={() => this.deleteSingleCity(city.id!)}>Delete</Button>}</td>
                <td>{<Button onClick={() => this.editSingleCity(city)}>Edit</Button>}</td>
            </tr>
        );
    }

    private renderNewCityForm = () => {
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
                    <Form.Label>Country id</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.countryId ?? ''}
                        placeholder="Country id"
                        onChange={event => this.setState({countryId: Number(event.target.value)})}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.addOrEditCity}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private deleteSingleCity = (id: number) => {
        deleteCity(id).then(this.loadCities);
    }

    private loadCities = () => {
        getAllCities().then(cities => {
            this.setState({cities});
        });
    }

    private createNewCity = () => {
        const request = {
            name: this.state.name,
            detailedName: this.state.detailedName,
            iataCode: this.state.iataCode,
            countryId: this.state.countryId,
        } as City;

        this.resetState();

        createCity(request).then(this.loadCities);
    }

    private editCity = () => {
        const request = {
            name: this.state.name,
            detailedName: this.state.detailedName,
            iataCode: this.state.iataCode,
            countryId: this.state.countryId,
            id: this.state.id
        } as City;

        this.resetState()

        updateCity(request).then(this.loadCities);
    }

    private addCity = () => {
        this.resetState();
        this.setState({showAddNewCityForm: true});
    }

    private editSingleCity = (city: City) => {
        this.resetState();
        this.setState({id: city.id ?? 0, name: city.name, detailedName: city.detailedName, iataCode: city.iataCode, countryId: city.countryId, showEditCityForm: true});
    }

    private addOrEditCity = () => {
        if (this.state.showAddNewCityForm) {
            this.createNewCity();
        }
        if (this.state.showEditCityForm) {
            this.editCity();
        }
    }
}
