import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import {useHistory} from 'react-router';

interface Props {
    logout: () => void;
}

export const NavigationBar: React.FC<Props> = (props: Props) => {

    const history = useHistory();

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Flights application</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link onClick={() => history.push('/')}>Search flights</Nav.Link>
                {!localStorage.getItem('jwt') && (
                    <Nav.Link onClick={() => history.push('/login')}>Login</Nav.Link>
                )}

                {localStorage.getItem('role') === 'Admin' && (
                    <Nav.Link onClick={() => history.push('/flights-management')}>Flights management</Nav.Link>
                )}
                {localStorage.getItem('role') === 'Admin' && (
                    <Nav.Link onClick={() => history.push('/user-management')}>User management</Nav.Link>
                )}
                                
                {localStorage.getItem('jwt') && (
                    <Nav.Link onClick={props.logout}>Logout</Nav.Link>
                )}
            </Nav>
        </Navbar>
    );
}