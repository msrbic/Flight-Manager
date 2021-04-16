import 'react-dates/initialize';
import React from 'react';
import {Button, Col, Form, InputGroup, Table} from "react-bootstrap";
import {DateRangePicker, FocusedInputShape, SingleDatePicker} from 'react-dates';
import moment from "moment";
import "./search.css";
import * as _ from 'lodash';

import 'react-dates/lib/css/_datepicker.css';
import {FlightsSearchRequest} from "../../api/request/flights-search-request";
import {Flight} from "../../api/response/flight";
import {Location} from "../../api/response/location";
import {getIataCodes, searchFlights} from "../../api/flights-api";
import AsyncSelect from 'react-select/async';
import Select from "react-select";
import {Currency} from "../../api/response/currency";
import {getAllCurrencies} from "../../api/currencies-api";
import {FlightDetails} from "../flight-details/flight-details";

const TRAVEL_CLASSES = [
    {label: 'Economy', value: 1},
    {label: 'Premium Economy', value: 2},
    {label: 'Business', value: 3},
    {label: 'First', value: 4}
];

interface Props {

}

interface State {
    focusedInput: FocusedInputShape | null;
    singleDatePickerFocused: boolean;
    returnFlight: boolean;

    originLocations: Location[];
    destinationLocations: Location[];
    currencies: Currency[];

    data: FlightsSearchRequest;
    results: Flight[];

    selectedFlight?: number;
}

interface FlightWithIndex {
    index: number;
    flight: Flight;
}

export class SearchForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            focusedInput: null,
            singleDatePickerFocused: false,
            returnFlight: false,
            originLocations: [],
            destinationLocations: [],
            currencies: [],
            data: {
                departureDate: moment(),
                returnDate: moment().add(7, 'days')
            },
            results: []
        };
    }

    componentDidMount() {
        this.getCurrencies();
    }

    render() {
        return (<>
            {this.renderSearchForm()}
            <br /><br />
            {this.state.results.length > 0 && (this.renderResults())}
            <br />
            {!_.isUndefined(this.state.selectedFlight) && (
                <FlightDetails flight={this.state.results[this.state.selectedFlight]} />
            )}
        </>);
    }

    private renderSearchForm = () => {
        return (
            <Form>
                <Form.Row>
                    <Form.Group as={Col}>
                        <div className="asyncselect-wrapper">
                            <AsyncSelect
                                placeholder="Origin location"
                                loadOptions={this.searchIataCodes}
                                onChange={this.handleSelectOrigin}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <div className="asyncselect-wrapper">
                            <AsyncSelect
                                placeholder="Destination location"
                                loadOptions={this.searchIataCodes}
                                onChange={this.handleSelectDestination}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group as={Col}>
                        <div className="flights-flex-row">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Return flight</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Checkbox
                                checked={this.state.returnFlight || false}
                                onChange={(event: any) => this.setState({returnFlight: event.target.checked})}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group as={Col} md={4}>
                        {!this.state.returnFlight && (
                            <SingleDatePicker
                                date={this.state.data.departureDate ?? moment()}
                                onDateChange={(date: moment.Moment | null) => this.setData({departureDate: date})}
                                focused={this.state.singleDatePickerFocused}
                                onFocusChange={({focused}) => this.setState({singleDatePickerFocused: focused})}
                                displayFormat="DD-MM-YYYY"
                                id="your_unique_id"
                            />
                        )}
                        {this.state.returnFlight && (
                            <DateRangePicker
                                startDate={this.state.data.departureDate ?? moment()}
                                startDateId="your_unique_start_date_id"
                                endDate={this.state.data.returnDate ?? moment().add(7, 'days')}
                                endDateId="your_unique_end_date_id"
                                onDatesChange={this.onDatesChange}
                                focusedInput={this.state.focusedInput}
                                onFocusChange={this.onFocusChange}
                                displayFormat="DD-MM-YYYY"
                            />
                        )}
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Adults</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Adults"
                            value={this.state.data.adults ?? ''}
                            onChange={event => this.setData({adults: event.target.value === '' ? undefined : Number(event.target.value)})}
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Children</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Children"
                            value={this.state.data.children ?? ''}
                            onChange={event => this.setData({children: event.target.value === '' ? undefined : Number(event.target.value)})}
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Infants</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Infants"
                            value={this.state.data.infants ?? ''}
                            onChange={event => this.setData({infants: event.target.value === '' ? undefined : Number(event.target.value)})}
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridTravelClass">
                        <div className="asyncselect-wrapper">
                            <Select
                                placeholder="Travel class"
                                options={TRAVEL_CLASSES}
                                onChange={(item: any) => this.setData({travelClass: item.value})}
                                onMenuOpen={_.noop}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Select
                            placeholder="Currency"
                            options={this.mapCurrenciesToValues(this.state.currencies)}
                            onChange={(item: any) => this.setData({currencyCode: item.value})}
                            onMenuOpen={_.noop}
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <div className="flights-flex-row">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Direct flights only</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Checkbox
                                checked={this.state.data.directFlightsOnly || false}
                                onChange={(event: any) => this.setData({directFlightsOnly: event.target.checked})}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group as={Col}>
                        <div className="flights-flex-row">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Should include Amadeus flights</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Checkbox
                                checked={this.state.data.shouldIncludeAmadeusFlights || false}
                                onChange={(event: any) => this.setData({shouldIncludeAmadeusFlights: event.target.checked})}
                            />
                        </div>
                    </Form.Group>
                </Form.Row>
                <Button variant="primary" onClick={this.onSearchClick}>Search</Button>
            </Form>
        );
    };

    private renderResults = () => {

        const flightsWithIndices = _.map(this.state.results, (flight, index) => ({index, flight} as FlightWithIndex))
        const flightsByReturnFlag = _.partition(flightsWithIndices, flightWrapper => !flightWrapper.flight.isReturnFlight);

        return (
            <>
                {flightsByReturnFlag[0] && (
                    <>
                        <h3>Departure flights</h3>
                        <div className="scrolltable">
                            {this.renderFlightsTable(flightsByReturnFlag[0])}
                            <br />
                        </div>
                    </>
                )}

                {flightsByReturnFlag[1].length > 0 && (
                    <>
                        <h3>Return flights</h3>
                        <div className="scrolltable">
                            {this.renderFlightsTable(flightsByReturnFlag[1])}
                        </div>
                    </>
                )}
            </>
        );
    }

    private renderFlightsTable = (flights: FlightWithIndex[]) => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Departure airport</th>
                        <th>Arrival airport</th>
                        <th>Departure time</th>
                        <th>Arrival time</th>
                        <th>Carrier</th>
                        <th>Price</th>
                        <th>Is direct flight</th>
                        <th>Is Amadeus flight</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(flights, this.renderSingleFlight)}
                </tbody>
            </Table>
        );
    }

    private renderSingleFlight = (wrapper: FlightWithIndex) => {

        const {flight, index} = wrapper;

        return (
            <tr key={index}>
                <td>{flight.departureAirport}</td>
                <td>{flight.arrivalAirport}</td>
                <td>{moment(flight.departureTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                <td>{moment(flight.arrivalTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                <td>{flight.carrier}</td>
                <td>{flight.totalPrice}</td>
                <td>{<input type='checkbox' readOnly checked={flight.isFlightDirect} />}</td>
                <td>{<input type='checkbox' readOnly checked={flight.isAmadeusFlight} />}</td>
                <td><Button onClick={() => this.setState({selectedFlight: index} as State)}>Details</Button>
                </td>
            </tr>
        );
    };

    private onDatesChange = (arg: {startDate: moment.Moment | null, endDate: moment.Moment | null}) => {
        this.setData({departureDate: arg.startDate, returnDate: arg.endDate});
    };

    private onFocusChange = (focusedInput: FocusedInputShape | null) => {
        this.setState({focusedInput: focusedInput} as State)
    }

    private setData = (values: Partial<FlightsSearchRequest>) => {
        this.setState(prevState => {
            return {data: {...prevState.data, ...values}}
        })
    };

    private onSearchClick = () => {
        this.setState({selectedFlight: undefined} as State);
        searchFlights(this.state.data, this.state.returnFlight).then(results => this.setState({results: results} as State));
    }

    private searchIataCodes = (input: string, callback: (options: any) => void) => {
        getIataCodes(input).then(results => callback(this.mapLocationsToValues(results)));
    }

    private getCurrencies = () => {
        getAllCurrencies()
            .then(currencies => this.setState({currencies: currencies} as State));
    }

    private mapLocationsToValues = (options: Location[]) => {
        return options.map(option => ({
            value: option.iataCode,
            label: `${option.name} - ${option.cityName}, ${option.countryName} (${option.iataCode})`
        }));
    };

    private mapCurrenciesToValues = (currencies: Currency[]) => {
        return currencies.map(currency => ({
            label: currency.name,
            value: currency.isoCode
        }));
    }

    private handleSelectOrigin = (location?: any) => {
        this.setData({originIATACode: location.value});
    }
    private handleSelectDestination = (location?: any) => {
        this.setData({destinationIATACode: location.value});
    }
}