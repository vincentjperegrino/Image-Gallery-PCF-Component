import IConfigData from "../Interfaces/IConfigData";

/**
 * Attaches a given access token and request body parameters to a CRM API call. 
 * Returns Image GUID if request was successful.
 */
async function POSTProductImage(accessToken: any, configData: IConfigData, requestBody: any) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    const postEndpoint = `${configData.crmAPILinks.productImageEndpoint}?$select=kti_productimageid`;

    headers.append('Authorization', bearer);
    headers.append('Accept', 'application/json'); 
    headers.append('OData-MaxVersion', '4.0');  
    headers.append('OData-Version', '4.0');  
    headers.append('Content-Type', 'application/json'); 
    headers.append('Prefer', 'return=representation');

    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(
            {
                "kti_imagename": requestBody.kti_imagename,
                "kti_producturl": requestBody.kti_producturl,
                "kti_primaryimage": requestBody.kti_primaryimage,
                "kti_Product@odata.bind": `/products(${requestBody._kti_product_value})`
            }
        )
    };

    return await fetch(postEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export default POSTProductImage;