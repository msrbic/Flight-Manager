import React from 'react';
import { Nav } from 'react-bootstrap';
import { useHistory } from 'react-router';

interface Props {
    isAdmin?: boolean
    isLoggedIn?: boolean;
    logout: () => void;
}


export const SideNavigation: React.FC = () => {
    const history = useHistory();

    return (
        <Nav className="flex-column">
            <h2>Flights management</h2>
            <Nav.Link onClick={() => history.push('/flights')}>Flights</Nav.Link>
            <Nav.Link onClick={() => history.push('/airports')}>Airports</Nav.Link>
            <Nav.Link onClick={() => history.push('/cities')}>Cities</Nav.Link>
            <Nav.Link onClick={() => history.push('/countries')}>Countries</Nav.Link>
            <Nav.Link onClick={() => history.push('/aircrafts')}>Aircrafts</Nav.Link>
            <Nav.Link onClick={() => history.push('/carriers')}>Carriers</Nav.Link>
            <Nav.Link onClick={() => history.push('/currencies')}>Currencies</Nav.Link>
        </Nav>
    );
}