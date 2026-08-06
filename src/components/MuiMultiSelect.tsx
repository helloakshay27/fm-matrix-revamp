import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Chip,
} from "@mui/material";

interface Option {
    label: string;
    value: string | number;
    id?: string | number;
}

interface MuiMultiSelectProps {
    label?: string | JSX.Element;
    options: Option[];
    value?: Option[];
    onChange?: (values: Option[]) => void;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    maxHeight?: string | number;
}

const BRAND = '#C72030';

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
    maxHeight = "45px",
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

    const minHeight = typeof maxHeight === 'string'
        ? (maxHeight === '36px' ? '36px' : '45px')
        : (maxHeight as number) < 50 ? '36px' : '45px';

    return (
        <FormControl
            fullWidth={fullWidth}
            error={error}
            variant="outlined"
            sx={{
                "& .MuiInputBase-root": {
                    minHeight: minHeight,
                    maxHeight: value.length > 1 ? maxHeight : minHeight,
                    height: value.length > 1 ? "auto" : minHeight,
                    backgroundColor: "#fff",
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#e5e7eb" },
                    "&:hover fieldset": { borderColor: BRAND },
                    "&.Mui-focused fieldset": { borderColor: BRAND },
                },
                "& .MuiInputLabel-root": {
                    backgroundColor: "white",
                    padding: "0 4px",
                    marginLeft: "-2px",
                    "&.Mui-focused": { color: BRAND },
                },
                "& .MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                },
            }}
        >
            <InputLabel id="mui-multi-select-label" shrink>
                {label}
            </InputLabel>
            <Select
                multiple
                labelId="mui-multi-select-label"
                value={value.map((item) => item.value)}
                onChange={handleChange}
                label={label}
                disabled={disabled}
                displayEmpty
                notched
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300,
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            zIndex: 9999,
                        },
                    },
                    disablePortal: false,
                    disableAutoFocus: true,
                    disableEnforceFocus: true,
                }}
                renderValue={() => (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "3px",
                            padding: "2px 0",
                            maxHeight: maxHeight,
                            overflowY: "auto",
                            width: "100%",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                        className="custom-scrollbar"
                    >
                        <style>
                            {`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 4px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: transparent;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: #e0e0e0;
                                    border-radius: 4px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: #bdbdbd;
                                }
                            `}
                        </style>
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
                                    sx={{
                                        height: "22px",
                                        fontSize: "0.75rem",
                                        borderColor: "rgba(199, 32, 48, 0.35)",
                                        color: BRAND,
                                        "& .MuiChip-label": {
                                            padding: "0 6px",
                                        },
                                        "& .MuiChip-deleteIcon": {
                                            fontSize: "14px",
                                            color: BRAND,
                                            margin: "0 2px 0 -2px",
                                            "&:hover": { color: BRAND },
                                        },
                                    }}
                                />
                            ))
                        ) : (
                            <span style={{ color: "#999", lineHeight: "normal", fontSize: "0.875rem" }}>
                                {placeholder || "Select..."}
                            </span>
                        )}
                    </div>
                )}
                sx={{
                    "& .MuiSelect-select": {
                        padding: "8px 14px !important",
                        minHeight: `${minHeight} !important`,
                        display: "flex !important",
                        alignItems: "center",
                        boxSizing: "border-box",
                    },
                }}
            >
                {options.filter((option) => !value.some(v => v.value === option.value)).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MuiMultiSelect;
