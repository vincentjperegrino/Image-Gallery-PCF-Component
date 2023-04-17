import * as React from 'react';
import SmartGrid from './Components/SmartGrid';
import GridProvider from './Contexts/GridContext';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { AuthenticatedTemplate } from '@azure/msal-react';
import ButtonsStack from './Components/ButtonsStack';
import UserAuthentication from './Components/UserAuthentication';
import GenerateCollection from './Components/GenerateCollection';
import IConfigData from './Interfaces/IConfigData';
import { ConfigDataContext } from './Contexts/GridContext';
import * as CSS from 'csstype';

function ProductImageGridControl (configData: IConfigData) {
  // MSAL instance definition
  const msalInstance = new PublicClientApplication(configData.authenticationParameters.msalConfig);

  const containerStyle: CSS.Properties = {
    position: 'relative',
    height: '800px',
    width: '100%',
};

  return (
    <div style={containerStyle}>
      <ConfigDataContext.Provider value={configData}>
        <MsalProvider instance={msalInstance}>
          <UserAuthentication>
            <AuthenticatedTemplate>
              <GridProvider>
                <GenerateCollection>
                  <ButtonsStack />
                  <SmartGrid />
                </GenerateCollection>
              </GridProvider>
            </AuthenticatedTemplate>
          </UserAuthentication>
        </MsalProvider>
      </ConfigDataContext.Provider>
    </div>
  );
}

export default ProductImageGridControl;