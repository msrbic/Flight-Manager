import * as React from 'react';
import {useEffect, useState} from 'react';
import {useLocation} from "react-router";
import {verifyEmail} from "../../api/accounts-api";
import './verify-email.css';

export const VerifyEmail: React.FC = () => {

    const query = new URLSearchParams(useLocation().search);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        verifyEmail(query.get('token') ?? '')
            .then(response => {
                setSuccess(response.ok);
            })
    });

    return (
        <div className="verify-email-wrapper">
            <h1>Verify email result</h1>
            <h2>Success: {String(success)}</h2>
        </div>
    );

}