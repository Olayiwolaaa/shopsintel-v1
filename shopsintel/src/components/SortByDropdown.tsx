import React from "react";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "GMV", value: "GMV" },
  { label: "Item Sold", value: "Item Sold" },
  { label: "Followers", value: "Followers" },
  { label: "Avg. video views", value: "Avg. video views" },
  { label: "Engagement Rate", value: "Engagement Rate" },
];

interface SortByDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SortByDropdown: React.FC<SortByDropdownProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border border-white bg-transparent text-white rounded-md text-center"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="text-black">
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SortByDropdown;
