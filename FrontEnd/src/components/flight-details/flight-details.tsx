// @flow
import * as React from 'react';
import { Table } from "react-bootstrap";
import { Flight, Price, Stop } from "../../api/response/flight";
import * as _ from 'lodash';
import moment from "moment";

type Props = {
    flight?: Flight;
};

export const FlightDetails: React.FC<Props> = (props: Props) => {
    const { flight } = props;
    if (!flight) {
        return null;
    }

    const renderSingleStop = (stop: Stop, index: number) => {
        return (
            <tr key={index}>
                <td>{stop.airportName}</td>
                <td>{stop.arrivalAt.toString()}</td>
                <td>{stop.departureAt.toString()}</td>
            </tr>
        );
    }

    const renderSinglePrice = (price: Price, index: number) => {
        return (
            <tr key={index}>
                <td>{price.travelClass}</td>
                <td>{price.travelerType}</td>
                <td>{price.price}</td>
            </tr>
        );
    }

    return (
        <>
            <h2>Flight details</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Is Amadeus flight</td>
                        <td>{<input type='checkbox' readOnly checked={flight.isAmadeusFlight} />}</td>
                    </tr>
                    <tr>
                        <td>Flight duration</td>
                        <td>{flight.flightDuration}</td>
                    </tr>
                    <tr>
                        <td>Departure airport</td>
                        <td>{flight.departureAirport}</td>
                    </tr>
                    <tr>
                        <td>Arrival airport</td>
                        <td>{flight.arrivalAirport}</td>
                    </tr>
                    <tr>
                        <td>Departure time</td>
                        <td>{moment(flight.departureTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                    </tr>
                    <tr>
                        <td>Arrival time</td>
                        <td>{moment(flight.arrivalTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                    </tr>
                    <tr>
                        <td>Carrier</td>
                        <td>{flight.carrier}</td>
                    </tr>
                    <tr>
                        <td>Price</td>
                        <td>{flight.totalPrice}</td>
                    </tr>
                    <tr>
                        <td>Aircraft</td>
                        <td>{flight.aircraft}</td>
                    </tr>
                    <tr>
                        <td>Is direct flight</td>
                        <td>{<input type='checkbox' readOnly checked={flight.isFlightDirect} />}</td>
                    </tr>
                </tbody>
            </Table>
            <br />

            <h3>Stops</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Airport</th>
                        <th>Arrival</th>
                        <th>Departure</th>
                    </tr>
                </thead>
                <tbody>
                    <>
                        {_.map(flight.stops, renderSingleStop)}
                    </>
                </tbody>
            </Table>
            <br />

            <h3>Prices</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Travel class</th>
                        <th>Traveler type</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <>
                        {_.map(flight.prices, renderSinglePrice)}
                    </>
                </tbody>
            </Table>
        </>
    );
};