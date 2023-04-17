import IConfigData from "../Interfaces/IConfigData";

/**
 * Attaches a given access token to a CRM API call. 
 * Returns image gallery details if successful.
 */
async function GETProductImage(accessToken: any, configData: IConfigData, productID: string) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    const requestURL = `${configData.crmAPILinks.productImageEndpoint}?$filter=_kti_product_value eq '${productID}'`;

    headers.append("Authorization", bearer);
    headers.append("Accept", "application/json"); 
    headers.append("OData-MaxVersion", "4.0");  
    headers.append("OData-Version", "4.0");  

    const options = {
        method: 'GET',
        headers: headers
    };

    return await fetch(requestURL, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export default GETProductImage;