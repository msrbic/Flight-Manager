import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createAircraft, deleteAircraft, getAllAircrafts, updateAircraft} from '../../api/aircrafts-api';
import {Aircraft} from '../../api/response/aircraft';
import "./aircrafts.css"

interface Props {
}

interface State {
    aircrafts: Aircraft[];

    id: number;
    code: string;
    model: string;

    showAddNewAircraftForm: boolean;
    showEditAircraftForm: boolean;
}

export class Aircrafts extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            aircrafts: [],

            id: 0,
            code: '',
            model: '',

            showAddNewAircraftForm: false,
            showEditAircraftForm: false
        }
    }

    resetState = () => {
        this.setState({id: 0, code: '', model: '', showAddNewAircraftForm: false, showEditAircraftForm: false})
    }

    componentDidMount() {
        this.loadAircrafts();
    }

    render() {
        return (
            <div>
                <h3 className="aircrafts-heading">Aircrafts</h3>

                <Button onClick={this.addAircraft}>Add new aircraft</Button>
                <br />
                <br />

                <div className="scrolltable">
                    {this.renderAircrafts()}
                </div>
                <br />

                {this.state.showAddNewAircraftForm && <h3>Add new aircraft</h3>}
                {this.state.showAddNewAircraftForm && this.renderNewAircraftForm()}
                {this.state.showEditAircraftForm && <h3>Edit aircraft</h3>}
                {this.state.showEditAircraftForm && this.renderNewAircraftForm()}

                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }

    private renderAircrafts = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Model</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody className="scrollTable">
                    {_.map(this.state.aircrafts, this.renderAircraft)}
                </tbody>
            </Table>
        )
    }

    private renderAircraft = (aircraft: Aircraft) => {
        return (
            <tr>
                <td>{aircraft.code}</td>
                <td>{aircraft.model}</td>
                <td>{<Button onClick={() => this.deleteSingleAircraft(aircraft.id!)}>Delete</Button>}</td>
                <td>{<Button onClick={() => this.editSingleAircraft(aircraft)}>Edit</Button>}</td>
            </tr>
        );
    }

    private renderNewAircraftForm = () => {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.code ?? ''}
                        placeholder="Code"
                        onChange={event => this.setState({code: event.target.value})}
                        maxLength={5}
                    />
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.model ?? ''}
                        placeholder="Model"
                        onChange={event => this.setState({model: event.target.value})}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.addOrEditAircraft}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private deleteSingleAircraft = (id: number) => {
        deleteAircraft(id).then(this.loadAircrafts);
    }

    private loadAircrafts = () => {
        getAllAircrafts().then(aircrafts => {
            this.setState({aircrafts});
        });
    }

    private createNewAircraft = () => {
        const request = {
            code: this.state.code,
            model: this.state.model,
        } as Aircraft;

        this.resetState();

        createAircraft(request).then(this.loadAircrafts);
    }

    private editAircraft = () => {
        const request = {
            code: this.state.code,
            model: this.state.model,
            id: this.state.id
        } as Aircraft;

        this.resetState()

        updateAircraft(request).then(this.loadAircrafts);
    }

    private addAircraft = () => {
        this.resetState();
        this.setState({showAddNewAircraftForm: true});
    }

    private editSingleAircraft = (aircraft: Aircraft) => {
        this.resetState();
        this.setState({id: aircraft.id ?? 0, code: aircraft.code, model: aircraft.model, showEditAircraftForm: true})
    }

    private addOrEditAircraft = () => {
        if (this.state.showAddNewAircraftForm) {
            this.createNewAircraft();
        }
        if (this.state.showEditAircraftForm) {
            this.editAircraft();
        }
    }
}
