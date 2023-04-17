import * as React from 'react';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import ICheckboxProps from '../Interfaces/ICheckboxProps';

/**
 * Render Checkbox component if item is Set as Primary
 */
const CheckBox: React.FC<ICheckboxProps> = ({ checkboxID, checkboxState }) => {
    return (
        <>
            { checkboxState ? 
                <Checkbox
                    name={'CheckboxItem'}
                    id={checkboxID}
                    checked={checkboxState}
                /> 
                :  
                <></>
            }
            
        </>
    );
}

export default CheckBox