import * as React from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { useConfigData, useLocalCollection, useSelecetedItem, useUpdateLocalCollection } from '../Contexts/GridContext';
import { useMsal } from '@azure/msal-react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { useId, useBoolean } from '@fluentui/react-hooks';
import DELETEProductImage from '../API/DELETEProductImage';
import deleteFromBlob from '../AzureBlobStorage/DeleteBlob';

const dialogStyles = { main: { maxWidth: 450 } };
const dialogContentProps = {
  type: DialogType.normal,
  title: 'Delete Product Image',
  closeButtonAriaLabel: 'Close',
  subText: 'Are you sure you want to delete the selected item/s?',
};

/**
 * Removes selected items from Azure Blob Storage and Dataverse.
 */
const DeleteItems: React.FC = ({}) => {
    const { instance, accounts } = useMsal();
    const configData = useConfigData();

    const request = {
        ...configData.authenticationParameters.loginRequest,
        account: accounts[0]
    };

    const selectedItems = useSelecetedItem();
    const localCollection = useLocalCollection();
    const setLocalCollection = useUpdateLocalCollection();

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
        let selectedImages: string[] = []; 
        selectedItems.forEach((selectedItem: { filename: string; imgGUID: string; }) => {
            deleteFromBlob(
                localCollection.at(0)!._kti_product_value + '_' + selectedItem.filename,
                {
                    storageName: configData.storageParameters.storageAccountName!,
                    storagePath: configData.storageParameters.storageContainerName!,
                    sasToken: configData.storageParameters.SASTokenDelete!
                }
            );

            instance.acquireTokenSilent(request).then((response) => {
                DELETEProductImage(response.accessToken, configData, selectedItem.imgGUID);
            }).catch((e) => {
                instance.acquireTokenPopup(request).then((response) => {
                    DELETEProductImage(response.accessToken, configData, selectedItem.imgGUID);
                }); 
            });

            selectedImages.push(selectedItem.imgGUID);
        });

        const updatedItems = localCollection.filter((collectionItem) => {
            return !selectedImages.includes(collectionItem.kti_productimageid);
        })
        setLocalCollection(updatedItems);
        toggleHideDialog();
    };

    return (
        <>
            <PrimaryButton 
                onClick={toggleHideDialog}
                disabled={!Boolean(selectedItems.length)}
            >
                Delete Items
            </PrimaryButton>
            
            <Dialog
                hidden={hideDialog}
                onDismiss={toggleHideDialog}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                <DialogFooter>
                    <PrimaryButton onClick={handleClick} text="Yes" />
                    <DefaultButton onClick={toggleHideDialog} text="No" />
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default DeleteItems