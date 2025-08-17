import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (query: string) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search notes"
    />
  );
};

export default SearchBox;
