import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from "./pages/homepage/homepage";
import {Container} from "react-bootstrap";
import {Route, Router, Switch} from "react-router";
import {Login} from "./pages/login/login";
import {createBrowserHistory} from "history";
import {NavigationBar} from './components/navbar/navbar';
import {Currencies} from './pages/currencies/currencies';
import {Aircrafts} from './pages/aircrafts/aircrafts';
import {Airports} from './pages/airports/airports';
import {Cities} from './pages/cities/cities';
import {FlightsManagement} from './pages/flights-management/flights-management';
import {Register} from "./pages/register/register";
import {login} from "./api/accounts-api";
import {VerifyEmail} from "./pages/verify-email/verify-email";
import {ForgotPassword} from "./pages/forgot-password/forgot-password";
import {ResetPassword} from "./pages/reset-password/reset-password";
import { Carriers } from './pages/carriers/carriers';
import { Countries } from './pages/countries/countries';
import { UserManagement } from './pages/user-management/user-management';

const customHistory = createBrowserHistory();

function App() {

    const handleLogin = async (username: string, password: string) => {
        return login(username, password)
            .then(account => {
                localStorage.setItem('jwt', account.jwtToken)
                localStorage.setItem('role', account.role);
                window.location.href = '/';
                return true;
            })
            .catch(err => false);
    }

    const handleLogout = () => {
        window.location.href = '/login';
        localStorage.removeItem('jwt');
        localStorage.removeItem('role');
    }

    return (
        <div className="App">
            <Router history={customHistory}>
                <NavigationBar logout={handleLogout} />
                <Container fluid>
                    <Switch>
                        <Route exact path="/login">
                            <Login handleLogin={handleLogin} />
                        </Route>
                        <Route exact path="/">
                            <Homepage />
                        </Route>
                        <Route exact path="/currencies">
                            <Currencies />
                        </Route>
                        <Route exact path="/register">
                            <Register />
                        </Route>
                        <Route exact path="/Accounts/verify-email">
                            <VerifyEmail />
                        </Route>
                        <Route exact path="/forgot-password">
                            <ForgotPassword />
                        </Route>
                        <Route exact path="/Accounts/reset-password">
                            <ResetPassword />
                        </Route>
                        <Route exact path="/aircrafts">
                            <Aircrafts />
                        </Route>
                        <Route exact path="/flights-management">
                            <FlightsManagement />
                        </Route>
                        <Route exact path="/user-management">
                            <UserManagement />
                        </Route>
                        <Route exact path="/airports">
                            <Airports />
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
            </Router>
        </div>
    );
}

export default App;
