interface IConfigData {
    productID: string,
    authenticationParameters: {
        msalConfig: {
            auth: {
                clientId: string,
                authority: string,
                redirectUri?: string
            },
            cache: {
                cacheLocation: string,
                storeAuthStateInCookie: boolean
            }
        },
        loginRequest: {
            scopes: string[]
        }
    },
    crmAPILinks: {
        productEndpoint: string,
        productImageEndpoint: string
    },
    storageParameters: {
        storageAccountName: string,
        storageContainerName: string,
        SASTokenRead: string,
        SASTokenCreate: string,
        SASTokenDelete: string
    }
};

export default IConfigData;