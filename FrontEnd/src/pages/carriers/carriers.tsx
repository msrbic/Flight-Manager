import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createCarrier, deleteCarrier, getAllCarriers} from '../../api/carriers-api';
import {Carrier} from '../../api/response/carrier';
import "./carriers.css"

interface Props {
}

interface State {
    carriers: Carrier[];

    code: string;
    name: string;
}

export class Carriers extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            carriers: [],

            code: '',
            name: ''
        }
    }

    componentDidMount() {
        this.loadCarriers();
    }

    render() {
        return (
            <div>
                <h3 className="carriers-heading">Carriers</h3>

                <div className="scrolltable">
                    {this.renderCarriers()}
                </div>

                <br />
                <h3>Add new carrier</h3>
                {this.renderNewCarrierForm()}

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
                        <th>Actions</th>
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

                <Button variant="primary" onClick={this.createNewCarrier}>
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

        createCarrier(request).then(this.loadCarriers);
    }
}
