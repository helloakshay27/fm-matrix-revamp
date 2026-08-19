import React from 'react';
import { Radio, RadioProps } from '@mui/material';

// MUI's stock Radio icon centers its inner dot via SVG path geometry, which
// can render visibly off-center on some browser/DPI combinations. These icons
// use flexbox centering instead, which the browser cannot get wrong.
const uncheckedIcon = (
    <span
        style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid var(--color-primary)',
            boxSizing: 'border-box',
            display: 'block',
        }}
    />
);

const checkedIcon = (
    <span
        style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid var(--color-primary)',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <span
            style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
            }}
        />
    </span>
);

export const BrandRadio: React.FC<RadioProps> = (props) => (
    <Radio icon={uncheckedIcon} checkedIcon={checkedIcon} {...props} />
);
