import * as React from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useSelecetedItem, useLocalCollection, useUpdateLocalCollection, useConfigData } from '../Contexts/GridContext';
import { useMsal } from '@azure/msal-react';
import UPDATEProductImage from '../API/UPDATEProductImage';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { useId, useBoolean } from '@fluentui/react-hooks';

const dialogStyles = { main: { maxWidth: 450 } };
const dialogContentProps = {
  type: DialogType.normal,
  title: 'Primary Image',
  closeButtonAriaLabel: 'Close',
  subText: 'Item is already set as Primary.',
};

/**
 * Renders Checkbox for item that is Set as Primary
 */
const SetPrimary: React.FC = () => {
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
        if (selectedItems[0].checkbox.props.checkboxState === true) {
            toggleHideDialog();
        }
        else {
            const updatedItems = localCollection.map((collectionItem) => {
                if (collectionItem.kti_primaryimage === true || 
                    collectionItem.kti_productimageid === selectedItems[0].imgGUID) {
    
                    let checkedState = false;
                    if (collectionItem.kti_productimageid === selectedItems[0].imgGUID) {
                        checkedState = true; 
                    }
                    collectionItem.kti_primaryimage = checkedState;
    
                    instance.acquireTokenSilent(request).then((response) => {
                        UPDATEProductImage(response.accessToken, configData, collectionItem)
                    }).catch((e) => {
                        instance.acquireTokenPopup(request).then((response) => {
                            UPDATEProductImage(response.accessToken, configData, collectionItem)
                        }); 
                    });
    
                }
                return collectionItem;
            });
            setLocalCollection(updatedItems);
        }
    };

    return (
        <>
            <PrimaryButton 
                onClick={handleClick}
                disabled={!Boolean(selectedItems.length === 1)}
            >
                Set as Primary
            </PrimaryButton>

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

export default SetPrimary