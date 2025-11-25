import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectProps,
} from "@mui/material";

interface Option {
    label: string;
    value: string | number;
}

interface MuiSelectFieldProps extends Omit<SelectProps<any>, "label"> {
    label?: string;
    options: Option[];
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
}

export const MuiSelectField = ({
    label,
    options,
    error,
    helperText,
    fullWidth = true,
    ...props
}: MuiSelectFieldProps) => {
    return (
        <FormControl fullWidth={fullWidth} error={error} variant="outlined">
            {label && <InputLabel shrink>{label}</InputLabel>}
            <Select
                {...props}
                label={label}
                variant="outlined"
                sx={{
                    height: { xs: 28, sm: 36, md: 45 },
                    "& .MuiInputBase-input, & .MuiSelect-select": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                    },
                    ...props.sx,
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MuiSelectField;
