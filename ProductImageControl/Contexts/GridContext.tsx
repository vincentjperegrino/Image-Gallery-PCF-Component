import * as React from 'react';
import IImageGallery from '../Interfaces/IImageGallery';
import IConfigData from '../Interfaces/IConfigData';

export const ConfigDataContext = React.createContext<IConfigData>(undefined!);
const localCollectionContext = React.createContext<IImageGallery['image']>(undefined!);
const updateLocalCollectionContext = React.createContext<React.Dispatch<IImageGallery['image']>>(undefined!);
const selecetedItemContext = React.createContext<any | undefined>(undefined!);
const updateSelecetedItemContext = React.createContext<React.Dispatch<React.SetStateAction<any | undefined>>>(undefined!);

export function useConfigData() {
    return React.useContext(ConfigDataContext);
}

export function useLocalCollection() {
    return React.useContext(localCollectionContext);
}

export function useUpdateLocalCollection() {
    return React.useContext(updateLocalCollectionContext);
}

export function useSelecetedItem() {
    return React.useContext(selecetedItemContext);
}

export function useUpdateSelecetedItem() {
    return React.useContext(updateSelecetedItemContext);
}

/**
 * Context variables initialization
 */
const GridProvider: React.FC<{}> = ({ children }) => {
    const [localCollection, setLocalCollection] = React.useState<IImageGallery['image']>([]);

    const [selectedItems, setSelectedItems] = React.useState<IImageGallery['image']>([]);

    return (
        <localCollectionContext.Provider value={ localCollection }>
            <updateLocalCollectionContext.Provider value={ setLocalCollection }>
                <selecetedItemContext.Provider value={ selectedItems }>
                    <updateSelecetedItemContext.Provider value={ setSelectedItems }>
                        {children}
                    </updateSelecetedItemContext.Provider>
                </selecetedItemContext.Provider>
            </updateLocalCollectionContext.Provider>
        </localCollectionContext.Provider>
    )
}

export default GridProvider;