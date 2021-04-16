import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createAirport, deleteAirport, getAllAirports} from '../../api/airports-api';
import {getCity} from '../../api/cities-api';
import {Airport} from '../../api/response/airport';
import "./airports.css"

interface Props {
}

interface State {
    airports: Airport[];

    name: string;
    detailedName: string;
    iataCode: string;
    cityId: number;
}

export class Airports extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            airports: [],

            name: '',
            detailedName: '',
            iataCode: '',
            cityId: 0
        }
    }

    componentDidMount() {
        this.loadAirports();
    }

    render() {
        return (
            <div>
                <h3 className="airports-heading">Airports</h3>

                <div className="scrolltable">
                    {this.renderAirports()}
                </div>

                <br />
                <h3>Add new airport</h3>
                {this.renderNewAirportForm()}

                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }

    private renderAirports = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Detailed name</th>
                        <th>Iata code</th>
                        <th>City id</th>
                        <th>Actions</th>
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
                <td>{airport.cityId}</td>
                <td>{<Button onClick={() => this.deleteSingleAirport(airport.id!)}>Delete</Button>}</td>
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
                    <Form.Label>City id</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.cityId ?? ''}
                        placeholder="City id"
                        onChange={event => this.setState({cityId: Number(event.target.value)})}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.createNewAirport}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

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

        createAirport(request).then(this.loadAirports);
    }
}
