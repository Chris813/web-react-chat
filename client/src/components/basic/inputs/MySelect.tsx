import { FC } from "react";
import Select, { ActionMeta, GroupBase, MultiValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

type FunctionProp = (
  newValue: MultiValue<string>,
  actionMeta: ActionMeta<string>
) => void;
type StateManagerProps<Option> = {
  // 其他属性...
  options: Option[];
  disabled?: boolean;
  label: string;
  onChange: (value: string[]) => void;
  value?: string[];
};

const MySelect: FC<StateManagerProps<Option>> = ({
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
        <Select
          isDisabled={disabled}
          value={value}
          onChange={onChange as unknown as FunctionProp}
          isMulti
          options={options as unknown as GroupBase<string>[]}
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

export default MySelect;
