import IConfigData from "../Interfaces/IConfigData";

/**
 * Attaches a given access token and request body parameters to a CRM API call. 
 * Returns response status if request was successful
 */
async function UPDATEProductImage(accessToken: any, configData: IConfigData, requestBody: any) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    const patchEndpoint = `${configData.crmAPILinks.productImageEndpoint}(${requestBody.kti_productimageid})`;

    headers.append('Authorization', bearer);
    headers.append('Accept', 'application/json'); 
    headers.append('OData-MaxVersion', '4.0');  
    headers.append('OData-Version', '4.0');  
    headers.append('Content-Type', 'application/json'); 

    const options = {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(
            {
                kti_primaryimage: requestBody.kti_primaryimage
            }
        )
    };

    return await fetch(patchEndpoint, options)
        .then(response => response.status)
        .catch(error => console.log(error));
}

export default UPDATEProductImage;