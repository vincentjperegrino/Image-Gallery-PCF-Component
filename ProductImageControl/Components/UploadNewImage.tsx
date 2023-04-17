import * as React from 'react';
import {PrimaryButton } from '@fluentui/react/lib/Button';
import { useConfigData, useLocalCollection, useUpdateLocalCollection } from '../Contexts/GridContext';
import POSTProductImage from '../API/POSTProductImage';
import { useMsal } from '@azure/msal-react';
import uploadFileToBlob from '../AzureBlobStorage/UploadBlob';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { useId, useBoolean } from '@fluentui/react-hooks';

/**
 * Format response from CRM post request.
 * Returns Image GUID
 */
function formatResponse(APIResponse: any | undefined): string {
    let imageID = '';
    Object.entries(APIResponse).map(([name, value]) => {
        if (name === 'kti_productimageid') {
            imageID = value as string;
        }
    });
    return imageID;
};

const dialogStyles = { main: { maxWidth: 450 } };
const dialogContentProps = {
  type: DialogType.normal,
  title: 'File Duplication',
  closeButtonAriaLabel: 'Close',
  subText: 'File already exists!',
};

/**
 * Renders file input dialog box to upload on azure storage blob and dataverse table
 */
const UploadNewImage: React.FC = ({}) => {

    const { instance, accounts } = useMsal();
    const configData = useConfigData();

    const request = {
        ...configData.authenticationParameters.loginRequest,
        account: accounts[0]
    };

    const localCollection = useLocalCollection();
    const setLocalCollection = useUpdateLocalCollection();
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);

    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const labelId: string = useId('dialogLabel');
    const subTextId: string = useId('subTextLabel');
  
    const modalProps = React.useMemo(
      () => ({
        titleAriaId: labelId,
        subtitleAriaId: subTextId,
        isBlocking: true,
        styles: dialogStyles
      }),
      [labelId, subTextId],
    );
  
    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const fileUploaded = event.target.files[0];
        let isExist = false;
        let existingItemGuid = '';
        localCollection.map((collectionItem) => {
            if(collectionItem.kti_imagename === fileUploaded.name){
                isExist = true;
                existingItemGuid = collectionItem.kti_productimageid
            }
        })

        if(isExist) {
            toggleHideDialog();
        }
        else {
            uploadFileToBlob(
                fileUploaded,
                localCollection.at(0)!._kti_product_value,
                {
                    storageName: configData.storageParameters.storageAccountName!,
                    storagePath: configData.storageParameters.storageContainerName!,
                    sasToken: configData.storageParameters.SASTokenCreate!
                }
            ).then((value) => {
                const imgURL: string = value + '?' + configData.storageParameters.SASTokenRead;
    
                const newItem = { 
                    kti_imagename: fileUploaded.name, 
                    kti_producturl: imgURL,
                    kti_primaryimage: false,
                    _kti_product_value: localCollection.at(0)!._kti_product_value
                 }; 
    
                instance.acquireTokenSilent(request).then((response) => {
                    POSTProductImage(response.accessToken, configData, newItem).then((response) => {
                        const imgGUID = formatResponse(response);
                        setLocalCollection([
                            ...localCollection,
                            {
                                kti_imagename: newItem.kti_imagename,
                                kti_producturl: newItem.kti_producturl,
                                kti_primaryimage: newItem.kti_primaryimage,
                                kti_productimageid: imgGUID,
                                _kti_product_value: localCollection.at(0)!._kti_product_value
                            }
                        ]);
                    });
                }).catch((e) => {
                    instance.acquireTokenPopup(request).then((response) => {
                        POSTProductImage(response.accessToken, configData, newItem).then((response) => {
                            const imgGUID = formatResponse(response);
                            setLocalCollection([
                                ...localCollection,
                                {
                                    kti_imagename: newItem.kti_imagename,
                                    kti_producturl: newItem.kti_producturl,
                                    kti_primaryimage: newItem.kti_primaryimage,
                                    kti_productimageid: imgGUID,
                                    _kti_product_value: localCollection.at(0)!._kti_product_value
                                }
                            ]);
                        })
                    }); 
                });            
            });
        }
        hiddenFileInput.current!.value = '';
    };
    
    return (
        <>
            <PrimaryButton onClick={handleClick}>
                New
            </PrimaryButton>
            <input 
                type='file'
                ref={hiddenFileInput}
                onInput={handleChange}
                accept='image/*'
                style={{display: 'none'}}
            /> 

            <Dialog
                hidden={hideDialog}
                onDismiss={toggleHideDialog}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                <DialogFooter>
                    <PrimaryButton onClick={toggleHideDialog} text="OK" />
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default UploadNewImage;