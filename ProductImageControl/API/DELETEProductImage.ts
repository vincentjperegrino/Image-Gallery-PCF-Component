import IConfigData from "../Interfaces/IConfigData";

/**
 * Attaches a given access token to a CRM API call.
 * Returns none if request was successful.
 */
async function DELETEProductImage(accessToken: any, configData: IConfigData, imgGUID: string) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    const deleteEndpoint = `${configData.crmAPILinks.productImageEndpoint}(${imgGUID})`;

    headers.append("Authorization", bearer);
    headers.append("Accept", "application/json"); 
    headers.append("OData-MaxVersion", "4.0");  
    headers.append("OData-Version", "4.0");  

    const options = {
        method: 'DELETE',
        headers: headers
    };

    return await fetch(deleteEndpoint, options)
        .then(response => response.text())
        .catch(error => console.log(error));
}

export default DELETEProductImage;