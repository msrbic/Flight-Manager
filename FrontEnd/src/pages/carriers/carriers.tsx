import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createCarrier, deleteCarrier, getAllCarriers, updateCarrier} from '../../api/carriers-api';
import {Carrier} from '../../api/response/carrier';
import "./carriers.css"

interface Props {
}

interface State {
    carriers: Carrier[];

    id: number;
    code: string;
    name: string;

    showAddNewCarrierForm: boolean;
    showEditCarrierForm: boolean;
}

export class Carriers extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            carriers: [],

            id: 0,
            code: '',
            name: '',

            showAddNewCarrierForm: false,
            showEditCarrierForm: false
        }
    }

    resetState = () => {
        this.setState({id: 0, code: '', name: '', showAddNewCarrierForm: false, showEditCarrierForm: false});
    }

    componentDidMount() {
        this.loadCarriers();
    }

    render() {
        return (
            <div>
                <h3 className="carriers-heading">Carriers</h3>

                <Button onClick={this.addCarrier}>Add new carrier</Button>
                <br />
                <br />

                <div className="scrolltable">
                    {this.renderCarriers()}
                </div>

                <br />

                {this.state.showAddNewCarrierForm && <h3>Add new carrier</h3>}
                {this.state.showAddNewCarrierForm && this.renderNewCarrierForm()}
                {this.state.showEditCarrierForm && <h3>Edit carrier</h3>}
                {this.state.showEditCarrierForm && this.renderNewCarrierForm()}


                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }

    private renderCarriers = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(this.state.carriers, this.renderCarrier)}
                </tbody>
            </Table>
        )
    }

    private renderCarrier = (carrier: Carrier) => {
        return (
            <tr>
                <td>{carrier.code}</td>
                <td>{carrier.name}</td>
                <td>{<Button onClick={() => this.deleteSingleCarrier(carrier.id!)}>Delete</Button>}</td>
                <td>{<Button onClick={() => this.editSingleCarrier(carrier)}>Edit</Button>}</td>
            </tr>
        );
    }

    private renderNewCarrierForm = () => {
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
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={this.state.name ?? ''}
                        placeholder="Name"
                        onChange={event => this.setState({name: event.target.value})}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.addOrEditCarrier}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private deleteSingleCarrier = (id: number) => {
        deleteCarrier(id).then(this.loadCarriers);
    }

    private loadCarriers = () => {
        getAllCarriers().then(carriers => {
            this.setState({carriers});
        });
    }

    private createNewCarrier = () => {
        const request = {
            code: this.state.code,
            name: this.state.name,
        } as Carrier;

        this.resetState();

        createCarrier(request).then(this.loadCarriers);
    }

    private editCarrier = () => {
        const request = {
            code: this.state.code,
            name: this.state.name,
            id: this.state.id
        } as Carrier;

        this.resetState()

        updateCarrier(request).then(this.loadCarriers);
    }

    private addCarrier = () => {
        this.resetState();
        this.setState({showAddNewCarrierForm: true});
    }

    private editSingleCarrier = (carrier: Carrier) => {
        this.resetState();
        this.setState({id: carrier.id ?? 0, code: carrier.code, name: carrier.name, showEditCarrierForm: true})
    }

    private addOrEditCarrier = () => {
        if (this.state.showAddNewCarrierForm) {
            this.createNewCarrier();
        }
        if (this.state.showEditCarrierForm) {
            this.editCarrier();
        }
    }
}
