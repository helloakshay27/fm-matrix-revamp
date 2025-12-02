import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Chip,
} from "@mui/material";
import { SyntheticEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface Option {
    label: string;
    value: string | number;
    id?: string | number;
}

interface MuiMultiSelectProps {
    label?: string;
    options: Option[];
    value?: Option[];
    onChange?: (values: Option[]) => void;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    fullWidth?: boolean;
    disabled?: boolean;
}

export const MuiMultiSelect = ({
    label,
    options,
    value = [],
    onChange,
    error,
    helperText,
    placeholder,
    fullWidth = true,
    disabled = false,
}: MuiMultiSelectProps) => {
    const handleChange = (event: any) => {
        const selectedValues = event.target.value;
        const selectedOptions = (Array.isArray(selectedValues) ? selectedValues : []).map(
            (val) => options.find((opt) => opt.value === val)
        ).filter(Boolean) as Option[];

        if (onChange) {
            onChange(selectedOptions);
        }
    };

    const handleDeleteChip = (chipValue: string | number) => {
        const updatedValues = value.filter((item) => item.value !== chipValue);
        if (onChange) {
            onChange(updatedValues);
        }
    };

    return (
        <FormControl fullWidth={fullWidth} error={error} variant="outlined">
            <InputLabel shrink>{label}</InputLabel>
            <Select
                multiple
                value={value.map((item) => item.value)}
                onChange={handleChange}
                label={label}
                disabled={disabled}
                displayEmpty
                renderValue={(selected) => (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                        }}
                    >
                        {value.length > 0 ? (
                            value.map((item) => (
                                <Chip
                                    key={item.value}
                                    label={item.label}
                                    onDelete={() => handleDeleteChip(item.value)}
                                    size="small"
                                    variant="outlined"
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                    }}
                                />
                            ))
                        ) : (
                            <span style={{ color: "#999" }}>
                                {placeholder || "Select..."}
                            </span>
                        )}
                    </div>
                )}
                sx={{
                    height: { xs: 28, sm: 36, md: 45 },
                    "& .MuiInputBase-input, & .MuiSelect-select": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                    },
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

export default MuiMultiSelect;
