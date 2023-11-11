import { FC } from "react";
import ReactSelect from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  disabled?: boolean;
  label: string;
  options: Option[];
  onChange: (value: string[]) => void;
  value?: string[];
}

const Select: FC<SelectProps> = ({
  disabled,
  label,
  options,
  onChange,
  value,
}) => {
  return (
    <div className=' z-[100]'>
      <label className=''>{label}</label>
      <div className=' mt-2'>
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          classNames={{
            control: () => " text-sm",
          }}
        />
      </div>
    </div>
  );
};

export default Select;