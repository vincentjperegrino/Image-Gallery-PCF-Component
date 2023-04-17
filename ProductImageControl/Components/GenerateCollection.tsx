import * as React from 'react';
import { useMsal } from '@azure/msal-react';
import { useConfigData, useUpdateLocalCollection } from '../Contexts/GridContext';
import IImageGallery from '../Interfaces/IImageGallery';
import GETProductImage from '../API/GETProductImage';
import GETProductID from '../API/GETProductID';

/**
 * Format response from CRM get request.
 * Returns Local Collection
 */
function formatProductImageResponse(APIResponse: any | undefined): IImageGallery['image'] {
    let filename: string;
    let srcImage: string;
    let isPrimary: boolean;
    let imageGUID: string;
    let imageProduct: string;
    let imageCollection: IImageGallery['image'] = [];

    if (APIResponse) {
        Object.keys(APIResponse['value']).map((index) => {
            Object.entries(APIResponse['value'][index]).map(([name, value]) => {
                if (name === 'kti_imagename') {
                    filename = value as string;
                }
                else if (name === 'kti_producturl') {
                    srcImage = value as string;
                }
                else if (name === 'kti_primaryimage') {
                    isPrimary = value as boolean;
                }
                else if (name === 'kti_productimageid') {
                    imageGUID = value as string;
                }
                else if (name === '_kti_product_value') {
                    imageProduct = value as string;
                }
            })
            imageCollection.push({
                kti_imagename: filename,
                kti_producturl: srcImage,
                kti_primaryimage: isPrimary,
                kti_productimageid: imageGUID,
                _kti_product_value: imageProduct
            })
        })
    }

    return imageCollection;
};

/**
 * Format response from CRM get request.
 * Returns Local Collection
 */
 function formatProductResponse(APIResponse: any | undefined): string {
    let productID = '';

    if (APIResponse) {
        Object.keys(APIResponse['value']).map((index) => {
            Object.entries(APIResponse['value'][index]).map(([name, value]) => {
                if (name === 'productid') {
                    productID = value as string;
                }
            })
        })
    }

    return productID;
};

/**
 * Generate Local Collection from CRM API call.
 */
const GenerateCollection = (props: { children: any; }) => {
    const setLocalCollection = useUpdateLocalCollection();
    const { instance, accounts } = useMsal();
    const configData = useConfigData();

    const request = {
        ...configData.authenticationParameters.loginRequest,
        account: accounts[0]
    };

    React.useEffect(() => {
        // Silently acquires an access token which is then attached to a request for CRM API data
        instance.acquireTokenSilent(request).then((authResponse) => {
            GETProductID(authResponse.accessToken, configData).then(response => {
                const productID = formatProductResponse(response);
                GETProductImage(authResponse.accessToken, configData, productID).then(response =>
                    setLocalCollection(formatProductImageResponse(response))
                )
            });
        }).catch((e) => {
            instance.acquireTokenSilent(request).then((authResponse) => {
                GETProductID(authResponse.accessToken, configData).then(response => {
                    const productID = formatProductResponse(response);
                    GETProductImage(authResponse.accessToken, configData, productID).then(response =>
                        setLocalCollection(formatProductImageResponse(response))
                    )
                });
            })
        });
    }, [instance, request]);

    return (
        <>
            {props.children}
        </>
    );
};

export default GenerateCollection;