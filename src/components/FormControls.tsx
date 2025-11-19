
import { ChevronDown } from "lucide-react";

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  options: (string | { label: string; value: string })[];
}) {
  const items = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );
  return (
    <div>
      <label className="label">{label}</label>
      <div className="select-wrap">
        <select
          className="select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {items.map((o) => (
            <option key={o.value ?? o.label} value={o.value ?? o.label}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select-caret" size={16} />
      </div>
    </div>
  );
}

export const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="label">{label}</label>
    <input
      type="date"
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
