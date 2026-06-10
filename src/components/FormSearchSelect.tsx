import React, {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import Select, {
  components,
  type GroupBase,
  type MenuListProps,
  type StylesConfig,
} from 'react-select';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';

const MENU_MAX_HEIGHT = 280;

export type FormSearchSelectOption = {
  value: string;
  label: string;
};

type ReactSelectOption = FormSearchSelectOption;

type FormSearchSelectExtraProps = {
  menuSearch: string;
  onMenuSearchChange: (value: string) => void;
};

const buildScheduleSelectStyles = (
  hasError: boolean
): StylesConfig<ReactSelectOption, false> => ({
  control: (base, state) => ({
    ...base,
    minHeight: 45,
    height: 45,
    width: '100%',
    fontSize: 14,
    borderRadius: 4,
    borderColor: hasError ? '#d32f2f' : state.isFocused ? '#1976d2' : '#999',
    boxShadow: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
    '&:hover': {
      borderColor: hasError ? '#d32f2f' : '#1976d2',
    },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
  valueContainer: (base) => ({
    ...base,
    height: 43,
    padding: '0 14px',
    cursor: 'pointer',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: 43,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '8px',
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: '8px',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    boxSizing: 'border-box',
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    maxHeight: MENU_MAX_HEIGHT,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#eff6ff' : '#fff',
    color: '#000',
    cursor: 'pointer',
    padding: '8px 12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#999',
    fontSize: 14,
  }),
  singleValue: (base) => ({
    ...base,
    color: '#000',
    fontSize: 14,
  }),
});

const MenuListWithSearch = (
  props: MenuListProps<ReactSelectOption, false, GroupBase<ReactSelectOption>>
) => {
  const { children, innerRef, innerProps, selectProps } = props;
  const extra = selectProps as typeof selectProps & FormSearchSelectExtraProps;
  const { menuSearch, onMenuSearchChange } = extra;

  return (
    <components.MenuList
      {...props}
      innerRef={innerRef}
      innerProps={{
        ...innerProps,
        onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
          e.stopPropagation();
          innerProps?.onWheel?.(e);
        },
        style: {
          ...innerProps?.style,
          padding: 0,
          maxHeight: MENU_MAX_HEIGHT,
          overflowY: 'auto',
          overflowX: 'hidden',
        },
      }}
    >
      <div
        className="mui-search-container"
        style={{ flexShrink: 0 }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <input
          type="text"
          className="mui-search-input"
          placeholder="Type to search..."
          value={menuSearch}
          onChange={(e) => onMenuSearchChange(e.target.value)}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          autoComplete="off"
        />
      </div>
      {children}
    </components.MenuList>
  );
};

MenuListWithSearch.displayName = 'MenuListWithSearch';

export interface FormSearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FormSearchSelectOption[];
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  error?: boolean;
  helperText?: string;
  isClearable?: boolean;
}

export const FormSearchSelect: React.FC<FormSearchSelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  disabled = false,
  isLoading = false,
  error = false,
  helperText,
  isClearable = true,
}) => {
  const inputId = useId();
  const controlRef = useRef<HTMLDivElement>(null);
  const [menuSearch, setMenuSearch] = useState('');

  const selected = useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value]
  );

  const menuOptions = useMemo(() => {
    const q = menuSearch.trim().toLowerCase();
    const filtered = q
      ? options.filter((opt) => opt.label.toLowerCase().includes(q))
      : options;

    if (selected && !filtered.some((opt) => opt.value === selected.value)) {
      return [selected, ...filtered];
    }
    return filtered;
  }, [options, menuSearch, selected]);

  const selectValue = useMemo(
    () => menuOptions.find((opt) => opt.value === value) ?? selected,
    [menuOptions, value, selected]
  );

  const selectStyles = useMemo(() => {
    const baseStyles = buildScheduleSelectStyles(error);
    return {
      ...baseStyles,
      container: (base) => ({
        ...base,
        width: '100%',
      }),
      menu: (base) => {
        const measuredWidth = controlRef.current?.getBoundingClientRect().width;
        const menuBase = {
          ...base,
          zIndex: 9999,
          boxSizing: 'border-box' as const,
        };
        if (!measuredWidth) {
          return {
            ...menuBase,
            width: '100%',
            minWidth: '100%',
            maxWidth: '100%',
          };
        }
        return {
          ...menuBase,
          width: measuredWidth,
          minWidth: measuredWidth,
          maxWidth: measuredWidth,
        };
      },
    };
  }, [error]);

  const handleMenuSearchChange = useCallback((next: string) => {
    setMenuSearch(next);
  }, []);

  const handleChange = useCallback(
    (
      opt: ReactSelectOption | null,
      actionMeta: { action: string }
    ) => {
      if (actionMeta.action === 'clear') {
        onChange('');
        return;
      }
      if (actionMeta.action === 'select-option' && opt) {
        onChange(opt.value);
      }
    },
    [onChange]
  );

  const handleMenuClose = useCallback(() => {
    setMenuSearch('');
  }, []);

  const selectComponents = useMemo(
    () => ({ MenuList: MenuListWithSearch }),
    []
  );

  return (
    <FormControl
      fullWidth
      error={error}
      sx={{
        position: 'relative',
        height: '45px',
        '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
      }}
    >
      {label ? (
        <InputLabel
          shrink
          htmlFor={inputId}
          sx={{
            fontSize: 14,
            color: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)',
            position: 'absolute',
            top: -8,
            left: 10,
            zIndex: 1,
            backgroundColor: '#fff',
            px: 0.5,
            pointerEvents: 'none',
            '&.Mui-focused': { color: '#1976d2' },
          }}
        >
          {label}
        </InputLabel>
      ) : null}
      <div ref={controlRef} style={{ width: '100%' }}>
        <Select<ReactSelectOption, false>
          inputId={inputId}
          options={menuOptions}
          value={selectValue}
          onChange={handleChange}
          components={selectComponents}
          isDisabled={disabled || isLoading}
          isLoading={isLoading}
          isClearable={isClearable}
          placeholder={isLoading ? 'Loading...' : placeholder}
          isSearchable={false}
          onMenuClose={handleMenuClose}
          closeMenuOnSelect
          menuShouldFocus={false}
          menuShouldScrollIntoView={false}
          menuSearch={menuSearch}
          onMenuSearchChange={handleMenuSearchChange}
          menuPortalTarget={
            typeof document !== 'undefined' ? document.body : null
          }
          menuPosition="fixed"
          styles={selectStyles}
          noOptionsMessage={() =>
            isLoading ? 'Loading...' : 'No options found'
          }
          loadingMessage={() => 'Loading...'}
        />
      </div>
      {helperText ? (
        <FormHelperText sx={{ mx: 0 }}>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};
