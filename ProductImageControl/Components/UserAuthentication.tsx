import * as React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { useConfigData } from '../Contexts/GridContext';

/**
 * Renders popup window for user to login
 */
function handleLogin(instance: IPublicClientApplication) {
    const configData = useConfigData();
    instance.ssoSilent(configData.authenticationParameters.loginRequest).catch(e => {
        console.error(e);
    });
}

/**
 * Renders the component if a user is authenticated
 */
const UserAuthentication = (props: { children: any; }) => {
    const isAuthenticated = useIsAuthenticated();
    const { instance } = useMsal();

    return (
        <>
            { isAuthenticated ? null : handleLogin(instance) }
            { props.children }
        </>
    );
};

export default UserAuthentication;