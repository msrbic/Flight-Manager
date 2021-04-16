import React, {Component} from "react";
import {SearchForm} from "../../components/search/search";
import './homepage.css';
import {Redirect} from "react-router";


class Homepage extends Component<{}, {}> {

    render() {
        return (
            <div className="homepage">
                <h2>Flights search</h2>
                <br/>
                <div className="search-wrapper">
                    <SearchForm/>
                </div>
                {
                    !localStorage.getItem('jwt') && <Redirect to='/login'/>
                }
            </div>
        );
    }
}

export default Homepage;