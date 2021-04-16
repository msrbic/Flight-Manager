import React, {Component, useState} from "react";
import {Container} from "react-bootstrap";
import {Redirect, Route, BrowserRouter, Switch} from "react-router-dom";
import {SideNavigation} from "../../components/sidenav/sidenav";
import {Aircrafts} from "../aircrafts/aircrafts";
import {Currencies} from "../currencies/currencies";
import {Airports} from "../airports/airports";
import {Login} from "../login/login";
import {createBrowserHistory} from "history";
import { Cities } from "../cities/cities";
import { Carriers } from "../carriers/carriers";
import { Countries } from "../countries/countries";

interface Props {
}


export class FlightsManagement extends Component<Props, {}> {


    render() {
        return (
            <div className="flightsManagement">
                <div className="admin">
                    <BrowserRouter>
                        <SideNavigation />
                        <Container className="test">
                            <Switch>
                                <Route exact path="/currencies">
                                    <Currencies/>
                                </Route>
                                <Route exact path="/aircrafts">
                                    <Aircrafts/>
                                </Route>
                                <Route exact path="/airports">
                                    <Airports/>
                                </Route>
                                <Route exact path="/cities">
                                    <Cities />
                                </Route>
                                <Route exact path="/carriers">
                                    <Carriers />
                                </Route>
                                <Route exact path="/countries">
                                    <Countries />
                                </Route>
                            </Switch>
                        </Container>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}

