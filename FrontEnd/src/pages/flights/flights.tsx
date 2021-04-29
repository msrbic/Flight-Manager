import _ from 'lodash';
import React from 'react'
import {Button, Form, Table} from 'react-bootstrap';
import {Redirect} from 'react-router';
import {createFlight, deleteFlight, getAllFlights, updateFlight} from '../../api/flights-api';
import {AdministratorFlight, Price} from '../../api/response/administrator-flight';
import "./flights.css"
import Select from "react-select";
import {Currency} from '../../api/response/currency';
import {getAllCurrencies} from '../../api/currencies-api';
import AsyncSelect from 'react-select/async';
import {getIataCodes, getFlight} from "../../api/flights-api";
import {Location} from "../../api/response/location";
import moment from 'moment';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import {Carrier} from '../../api/response/carrier';
import {Aircraft} from '../../api/response/aircraft';
import {getAllCarriers} from '../../api/carriers-api';
import {getAllAircrafts} from '../../api/aircrafts-api';
import {isNullOrUndefined} from 'util';
import {getAirport, getAllAirports} from '../../api/airports-api';
import {Airport} from '../../api/response/airport';


interface Props {
}

interface State {
    flights: AdministratorFlight[];

    id: number,
    originAirportId: number;
    destinationAirportId: number;
    departureDateTime: moment.Moment;
    arrivalDateTime: moment.Moment;
    carrierId: number;
    aircraftId: number;
    currencyId: number;
    prices: Map<number, Map<number, number>>;

    showAddNewFlightForm: boolean;
    showEditFlightForm: boolean;

    currencies: Currency[];
    carriers: Carrier[];
    aircrafts: Aircraft[];

    airportNames: Map<number, Airport>;
}

const TRAVELCLASS: Record<string, number> = {
    "Economy": 0,
    "PremiumEconomy": 1,
    "Business": 2,
    "First": 3
};

const TRAVELERTYPE = {
    "Child": 0,
    "Infant": 2,
    "Adult": 4
}

var REVERSETRAVELCLASS: Record<number, string> = {
    0: "Economy",
    1: "PremiumEconomy",
    2: "Business",
    3: "First"
}

var REVERSETRAVELERTYPE: Record<number, string> = {
    0: "Child",
    2: "Infant",
    4: "Adult"
}

export class Flights extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        flights: [],

        id: 0,
        originAirportId: 0,
        destinationAirportId: 0,
        departureDateTime: moment(),
        arrivalDateTime: moment(),
        carrierId: 0,
        aircraftId: 0,
        currencyId: 0,
        prices: new Map(),

        showAddNewFlightForm: false,
        showEditFlightForm: false,

        currencies: [],
        carriers: [],
        aircrafts: [],

        airportNames: new Map()
    })

    resetState = () => {
        this.setState({id: 0});
        this.setState({originAirportId: 0});
        this.setState({destinationAirportId: 0});
        this.setState({departureDateTime: moment()});
        this.setState({arrivalDateTime: moment()});
        this.setState({carrierId: 0});
        this.setState({aircraftId: 0});
        this.setState({prices: new Map()});
        this.setState({showAddNewFlightForm: false});
        this.setState({showEditFlightForm: false});
    }

    componentDidMount() {
        this.loadFlights();
        this.getCurrencies();
        this.getCarriers();
        this.getAircrafts();
        this.getAirportNames();
    }

    render() {
        return (
            <div>
                <h3 className="flights-heading">Flights</h3>

                <Button onClick={this.createSingleFlight}>Create new flight</Button>
                <Select
                    placeholder="Currency"
                    options={this.mapCurrenciesToValues(this.state.currencies)}
                    onChange={(item: any) => this.changeCurrency(item.value)}
                    onMenuOpen={_.noop}
                    value={this.mapCurrenciesToValues(this.state.currencies).find(o => o.value == this.state.currencyId)}
                />
                <br /><br />
                <div className="scrolltable">
                    {this.renderFlights()}
                </div>

                <br />
                {this.state.showAddNewFlightForm && <h3>Add new flight</h3>}
                {this.state.showAddNewFlightForm && this.renderNewFlightForm()}
                {this.state.showEditFlightForm && <h3>Edit flight</h3>}
                {this.state.showEditFlightForm && this.renderNewFlightForm()}

                {
                    (!localStorage.getItem('jwt') || !(localStorage.getItem('role') === 'Admin')) && <Redirect to='/login' />
                }
            </div>
        );
    }
    changeCurrency(value: any): void {
        this.setState({currencyId: value}, this.loadFlights);
    }

    private getCurrencies = () => {
        getAllCurrencies()
            .then(currencies => this.setState({currencies: currencies} as State, () => this.setState({currencyId: this.state.currencies.find(c => c.isDefault)?.id ?? 0})));
    }

    private mapCurrenciesToValues = (currencies: Currency[]) => {
        return currencies.map(currency => ({
            label: currency.name,
            value: currency.id
        }));
    }

    private getCarriers = () => {
        getAllCarriers()
            .then(carriers => this.setState({carriers: carriers} as State));
    }

    private mapCarriersToValues = (carriers: Carrier[]) => {
        return carriers.map(carrier => ({
            label: carrier.name,
            value: carrier.id
        }));
    }

    private getAircrafts = () => {
        getAllAircrafts()
            .then(aircrafts => this.setState({aircrafts: aircrafts} as State));
    }

    private mapAircraftsToValues = (aircrafts: Aircraft[]) => {
        return aircrafts.map(aircraft => ({
            label: aircraft.model,
            value: aircraft.id
        }));
    }

    private getAirportNames = () => {
        getAllAirports()
            .then(airports => this.setState({airportNames: this.mapAirportNames(airports)} as State));
    }

    private mapAirportNames = (airports: Airport[]) => {
        var map = new Map();
        airports.forEach(airport => map.set(airport.id, airport.name));
        return map;
    }

    private renderFlights = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Origin airport</th>
                        <th>Destination airport</th>
                        <th>Departure time</th>
                        <th>Arrival time</th>
                        <th>Carrier</th>
                        <th>Aircraft</th>
                        <th>Prices</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(this.state.flights, this.renderFlight)}
                </tbody>
            </Table>
        )
    }

    private renderFlight = (flight: AdministratorFlight) => {
        return (
            <tr>
                <td>{this.state.airportNames.get(flight.originAirportId)}</td>
                <td>{this.state.airportNames.get(flight.destinationAirportId)}</td>
                <td>{flight.departureDateTime}</td>
                <td>{flight.arrivalDateTime}</td>
                <td>{this.state.carriers.find(c => flight.carrierId == c.id)?.name}</td>
                <td>{this.state.aircrafts.find(a => flight.aircraftId == a.id)?.model}</td>
                <td>{this.getPricesString(flight)}</td>
                <td>{<Button onClick={() => this.deleteSingleFlight(flight.id!)}>Delete</Button>}</td>
                <td>{<Button onClick={() => this.editSingleFlight(flight)}>Edit</Button>}</td>
            </tr>
        );
    }

    private renderNewFlightForm = () => {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Origin airport</Form.Label>
                    <div className="asyncselect-wrapper">
                        <AsyncSelect
                            placeholder={this.state.airportNames.get(this.state.originAirportId) ?? 'Origin airport'}
                            loadOptions={this.searchIataCodes}
                            onChange={this.handleSelectOrigin}
                        />
                    </div>
                    <Form.Label>Destination airport</Form.Label>
                    <div className="asyncselect-wrapper">
                        <AsyncSelect
                            placeholder={this.state.airportNames.get(this.state.destinationAirportId) ?? "Destination airport"}
                            loadOptions={this.searchIataCodes}
                            onChange={this.handleSelectDestination}
                        />
                    </div>
                    <Form.Label>Departure date and time</Form.Label>
                    <div>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DateTimePicker
                                value={this.state.departureDateTime}
                                onChange={(value) => this.setState({departureDateTime: value ?? moment()})}
                                autoOk
                                ampm={false}
                                inputVariant="outlined"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <Form.Label>Arrival date and time</Form.Label>
                    <div>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DateTimePicker
                                value={this.state.arrivalDateTime}
                                onChange={(value) => this.setState({arrivalDateTime: value ?? moment()})}
                                autoOk
                                ampm={false}
                                inputVariant="outlined"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <Form.Label>Carrier</Form.Label>
                    <Select
                        placeholder="Carrier"
                        options={this.mapCarriersToValues(this.state.carriers)}
                        onChange={(item: any) => this.setState({carrierId: item.value})}
                        onMenuOpen={_.noop}
                        value={this.mapCarriersToValues(this.state.carriers).find(o => o.value == this.state.carrierId)}
                    />
                    <Form.Label>Aircraft</Form.Label>
                    <Select
                        placeholder="Aircraft"
                        options={this.mapAircraftsToValues(this.state.aircrafts)}
                        onChange={(item: any) => this.setState({aircraftId: item.value})}
                        onMenuOpen={_.noop}
                        value={this.mapAircraftsToValues(this.state.aircrafts).find(o => o.value == this.state.aircraftId)}
                    />
                    <Form.Label>Economy adult price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.Economy)?.get(TRAVELERTYPE.Adult) ?? 0}
                        placeholder="Economy adult price"
                        onChange={event => this.setPrice(TRAVELCLASS.Economy, TRAVELERTYPE.Adult, Number(event.target.value))}
                    />
                    <Form.Label>Economy child price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.Economy)?.get(TRAVELERTYPE.Child) ?? 0}
                        placeholder="Economy child price"
                        onChange={event => this.setPrice(TRAVELCLASS.Economy, TRAVELERTYPE.Child, Number(event.target.value))}
                    />
                    <Form.Label>Economy infant price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.Economy)?.get(TRAVELERTYPE.Infant) ?? 0}
                        placeholder="Economy infant price"
                        onChange={event => this.setPrice(TRAVELCLASS.Economy, TRAVELERTYPE.Infant, Number(event.target.value))}
                    />
                    <Form.Label>Premium economy adult price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.PremiumEconomy)?.get(TRAVELERTYPE.Adult) ?? 0}
                        placeholder="Premium economy adult price"
                        onChange={event => this.setPrice(TRAVELCLASS.PremiumEconomy, TRAVELERTYPE.Adult, Number(event.target.value))}
                    />
                    <Form.Label>Premium economy child price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.PremiumEconomy)?.get(TRAVELERTYPE.Child) ?? 0}
                        placeholder="Economy child price"
                        onChange={event => this.setPrice(TRAVELCLASS.PremiumEconomy, TRAVELERTYPE.Child, Number(event.target.value))}
                    />
                    <Form.Label>Premium economy infant price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.PremiumEconomy)?.get(TRAVELERTYPE.Infant) ?? 0}
                        placeholder="Economy infant price"
                        onChange={event => this.setPrice(TRAVELCLASS.PremiumEconomy, TRAVELERTYPE.Infant, Number(event.target.value))}
                    />
                    <Form.Label>Business adult price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.Business)?.get(TRAVELERTYPE.Adult) ?? 0}
                        placeholder="Business adult price"
                        onChange={event => this.setPrice(TRAVELCLASS.Business, TRAVELERTYPE.Adult, Number(event.target.value))}
                    />
                    <Form.Label>Business child price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.Business)?.get(TRAVELERTYPE.Child) ?? 0}
                        placeholder="Business child price"
                        onChange={event => this.setPrice(TRAVELCLASS.Business, TRAVELERTYPE.Child, Number(event.target.value))}
                    />
                    <Form.Label>Business infant price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.Business)?.get(TRAVELERTYPE.Infant) ?? 0}
                        placeholder="Business infant price"
                        onChange={event => this.setPrice(TRAVELCLASS.Business, TRAVELERTYPE.Infant, Number(event.target.value))}
                    />
                    <Form.Label>First adult price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.First)?.get(TRAVELERTYPE.Adult) ?? 0}
                        placeholder="First adult price"
                        onChange={event => this.setPrice(TRAVELCLASS.First, TRAVELERTYPE.Adult, Number(event.target.value))}
                    />
                    <Form.Label>First child price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.First)?.get(TRAVELERTYPE.Child) ?? 0}
                        placeholder="First child price"
                        onChange={event => this.setPrice(TRAVELCLASS.First, TRAVELERTYPE.Child, Number(event.target.value))}
                    />
                    <Form.Label>First infant price</Form.Label>
                    <Form.Control
                        type="number"
                        value={this.state.prices?.get(TRAVELCLASS.First)?.get(TRAVELERTYPE.Infant) ?? 0}
                        placeholder="First infant price"
                        onChange={event => this.setPrice(TRAVELCLASS.First, TRAVELERTYPE.Infant, Number(event.target.value))}
                    />
                </Form.Group>

                <Button variant="primary" onClick={this.createOrEditFlight}>
                    Submit
                </Button>
                <br />
            </Form>
        )
    }

    private deleteSingleFlight = (id: number) => {
        deleteFlight(id).then(this.loadFlights);
    }

    private createOrEditFlight = () => {
        if (this.state.showAddNewFlightForm) {
            this.createNewFlight();
        }
        if (this.state.showEditFlightForm) {
            this.editFlight();
        }
    }

    private editSingleFlight = (flight: AdministratorFlight) => {
        this.setPrices(flight);
        this.setState({
            showEditFlightForm: true,
            showAddNewFlightForm: false,
            id: flight.id,
            originAirportId: flight.originAirportId,
            destinationAirportId: flight.destinationAirportId,
            departureDateTime: moment(flight.departureDateTime, "YYYY-MM-DD HH:mm:ss"),
            arrivalDateTime: moment(flight.arrivalDateTime, "YYYY-MM-DD HH:mm:ss"),
            carrierId: flight.carrierId,
            aircraftId: flight.aircraftId
        });
    }

    private createSingleFlight = () => {
        this.resetState();
        this.setState({showAddNewFlightForm: true});
    }

    private loadFlights = () => {
        getAllFlights(this.state.currencyId).then(flights => {
            this.setState({flights});
        });
    }

    private createNewFlight = () => {
        const request = {
            originAirportId: this.state.originAirportId,
            destinationAirportId: this.state.destinationAirportId,
            departureDateTime: this.state.departureDateTime.format("YYYY-MM-DDTHH:mm:ss"),
            arrivalDateTime: this.state.arrivalDateTime.format("YYYY-MM-DDTHH:mm:ss"),
            carrierId: this.state.carrierId,
            aircraftId: this.state.aircraftId,
            prices: this.getPrices(),
            currencyId: this.state.currencyId,
            id: this.state.id
        } as AdministratorFlight;

        this.resetState();

        createFlight(request).then(this.loadFlights);
    }

    private editFlight = () => {
        const request = {
            id: this.state.id,
            originAirportId: this.state.originAirportId,
            destinationAirportId: this.state.destinationAirportId,
            departureDateTime: this.state.departureDateTime.format("YYYY-MM-DD HH:mm:ss"),
            arrivalDateTime: this.state.arrivalDateTime.format("YYYY-MM-DD HH:mm:ss"),
            carrierId: this.state.carrierId,
            aircraftId: this.state.aircraftId,
            prices: this.getPrices(),
            currencyId: this.state.currencyId
        } as AdministratorFlight;

        this.resetState();

        updateFlight(request).then(this.loadFlights);
    }

    private searchIataCodes = (input: string, callback: (options: any) => void) => {
        getIataCodes(input, true).then(results => callback(this.mapLocationsToValues(results)));
    }

    private mapLocationsToValues = (options: Location[]) => {
        return options.map(option => ({
            value: option.id,
            label: `${option.name} - ${option.cityName}, ${option.countryName} (${option.iataCode})`
        }));
    };

    private handleSelectOrigin = (location?: any) => {
        this.setState({originAirportId: location.value});
    }

    private handleSelectDestination = (location?: any) => {
        this.setState({destinationAirportId: location.value});
    }

    private setPrice(travelClass: number, travelerType: number, price: number) {
        var prices = this.state.prices;
        if (!this.state.prices.has(travelClass)) {
            var type = new Map();
            type.set(travelerType, price);
            prices.set(travelClass, type);
        }
        else {
            prices.get(travelClass)?.set(travelerType, price);
        }

        this.setState({prices: prices});
    }

    private setPrices = (flight: AdministratorFlight) => {
        flight.prices.forEach(price => this.setPrice(price.travelClass, price.travelerType, price.price));
    }

    private getPrices = (): Price[] => {
        var result = [] as Price[];
        this.state.prices.forEach((typePrice, travelClass) =>
            typePrice.forEach((price, travelerType) =>
                result.push({travelClass, travelerType, price} as Price)))
        return result;
    }

    private getPricesString = (flight: AdministratorFlight): string => {
        var result = '';
        flight.prices.forEach(price => {
            result = result + " | " + REVERSETRAVELCLASS[price.travelClass] + ' ' + REVERSETRAVELERTYPE[price.travelerType] + ': ' + price.price.toFixed(2);
        });

        return result;
    }
}
