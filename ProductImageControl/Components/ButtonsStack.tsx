import * as React from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import UploadNewImage from './UploadNewImage';
import SetPrimary from './SetPrimary';
import DeleteItems from './DeleteItems';

// Tokens definition
const stackTokens: IStackTokens = { childrenGap: 10, padding: 10};

/**
 * Top-right button container
 */
const ButtonsStack: React.FC = ({}) => {
    return (
        <>
            <Stack horizontal horizontalAlign='end' tokens={stackTokens}>
                <SetPrimary/>
                <UploadNewImage/>
                <DeleteItems/>
            </Stack>
        </>
    );
}

export default ButtonsStack;