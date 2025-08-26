import Select, { components } from "react-select";

// Header row
const CustomMenuList = (props) => (
  <div className="w-full">
    <div className="bg-gray-100 text-sm font-semibold border border-gray-300 flex">
      <div className="w-28 border-r border-gray-300 px-2 py-1">Code</div>
      <div className="flex-1 px-2 py-1">Name</div>
    </div>
    <components.MenuList {...props}>{props.children}</components.MenuList>
  </div>
);

// Row with two columns
const CustomOption = (props) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className="flex text-sm w-full border-b border-gray-200 hover:bg-gray-50">
        <div className="w-28 border-r border-gray-300 px-2 py-1">{data.code}</div>
        <div className="flex-1 px-2 py-1">{data.name}</div>
      </div>
    </components.Option>
  );
};

// Reusable select with code + name
const TwoColumnSelect = ({ options, value, onChange, placeholder }) => (
  <Select
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    options={options}
    className="w-[20rem]"
    isClearable
    components={{ MenuList: CustomMenuList, Option: CustomOption }}
    formatOptionLabel={(option, { context }) =>
      context === "value" ? `${option.code} - ${option.name}` : null
    }
    styles={{
      option: (provided) => ({
        ...provided,
        backgroundColor: "white",
        color: "#333",
        cursor: "pointer",
      }),
      menu: (provided) => ({
        ...provided,
        border: "1px solid gray",
        marginTop: 0,
      }),
    }}
  />
);

export default TwoColumnSelect;
