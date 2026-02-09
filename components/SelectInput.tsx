import Select, { SingleValue } from 'react-select';

type Option = {
  label: string;
  value: string;
};

type SelectInputProps = {
  options: Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

const SelectInput = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  isDisabled = false,
}: SelectInputProps) => {
  return (
    <div className="w-56">
      <Select
        options={options}
        value={value}
        onChange={(option: SingleValue<Option>) => onChange(option)}
        placeholder={placeholder}
        isDisabled={isDisabled}
        className="w-full"
        classNamePrefix="react-select"
        // ✅ Render menu in body to avoid z-index issues
        menuPortalTarget={document.body}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: '#ffffff',
            borderColor: '#4b5563',
            boxShadow: state.isFocused
              ? '0 0 0 1px #4b5563'
              : 'none',
            ':hover': {
              borderColor: '#4b5563',
            },
            minHeight: '42px',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#ffffff',
            zIndex: 9999, // ✅ high z-index
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? '#e5e7eb'
              : state.isFocused
              ? '#f3f4f6'
              : '#ffffff',
            color: '#111827',
            cursor: 'pointer',
          }),
          singleValue: (base) => ({
            ...base,
            color: '#111827',
          }),
          placeholder: (base) => ({
            ...base,
            color: '#6b7280',
          }),
          input: (base) => ({
            ...base,
            color: '#111827',
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999, // ✅ ensures menu is above all
          }),
        }}
      />
    </div>
  );
};

export default SelectInput;
