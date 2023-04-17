import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode, Selection } from '@fluentui/react/lib/DetailsList';
import { useLocalCollection, useUpdateSelecetedItem } from '../Contexts/GridContext';
import RenderImage from './RenderImage';
import CheckBox from './CheckBox';
import IItems from '../Interfaces/IItems';
import * as CSS from 'csstype';

const columns: IColumn[] = [
    { 
        key: 'fileNameCol', 
        name: 'File Name', 
        fieldName: 'filename', 
        minWidth: 100, 
        maxWidth: 300, 
        isResizable: true,
        isMultiline: true
    },
    { 
        key: 'imgCol', 
        name: 'Image', 
        fieldName: 'img', 
        minWidth: 100, 
        maxWidth: 300, 
        isResizable: true 
    },
    { 
        key: 'primaryCol', 
        name: 'Primary', 
        fieldName: 'checkbox', 
        minWidth: 100, 
        maxWidth: 300, 
        isResizable: true 
    }
];

const containerStyle: CSS.Properties = {
    overflowY: 'auto',
    overflowX: 'auto',
    height: '100%',
    position: 'relative',
    // resize: 'vertical'
};

/**
 * Renders Smart Grid for Product Images
 */
const SmartGrid: React.FC = () => {
    const localCollection = useLocalCollection();
    const setSelectedItems = useUpdateSelecetedItem();
    let updatedItems: IItems['items'] = [];

    //Only execute function below when localCollection updates
    React.useEffect(() => {
        localCollection.map((collectionItem) => {
            updatedItems.push({
                filename: collectionItem.kti_imagename,
                img: <RenderImage imgsrc={collectionItem.kti_producturl}/>,
                checkbox: <CheckBox checkboxID={collectionItem.kti_imagename} checkboxState={collectionItem.kti_primaryimage}/>,
                imgGUID: collectionItem.kti_productimageid
            })
        });
    }, [localCollection])

    const selection = 
            new Selection({
                onSelectionChanged: () => {
                    setSelectedItems(selection.getSelection());
                },
            selectionMode: SelectionMode.multiple,
            });

    const renderList = (): JSX.Element => {
        return (
                <DetailsList
                    items={updatedItems}
                    columns={columns}
                    setKey='set'
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={selection}
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn='Toggle selection'
                    ariaLabelForSelectAllCheckbox='Toggle selection for all items'
                    checkButtonAriaLabel='select row'
                />
        )
    }

    return (
    <div style={containerStyle}>
        {renderList()} 
    </div>
    )
}

export default SmartGrid;