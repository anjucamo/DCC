
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { clamp } from "../../utils";


export const Card: React.FC<
  React.PropsWithChildren<{ header?: React.ReactNode; style?: React.CSSProperties }>
> = ({ header, children, style }) => (
  <div className="card" style={style}>
    {header && <div className="card-header">{header}</div>}
    <div className="card-body">{children}</div>
  </div>
);

export const KpiBox = ({
  title,
  value,
  accent,
}: {
  title: string;
  value: React.ReactNode;
  accent?: string;
}) => (
  <Card>
    <div className="kpi-title">{title}</div>
    <div className="kpi-value" style={{ color: accent || "#111" }}>
      {value}
    </div>
  </Card>
);

export const Progress = ({ value }: { value: number }) => (
  <div className="progress">
    <i style={{ width: clamp(value) + "%" }} />
  </div>
);

export function Gauge({ pctValue }: { pctValue: number }) {
  const v = clamp(pctValue);
  const data = [
    { name: "ok", value: v },
    { name: "rest", value: 100 - v },
  ];

  return (
    <div className="chart h-140">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 8, bottom: 0, left: 0, right: 0 }}>
          <Pie
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            innerRadius={40} // más pequeño
            outerRadius={55} // más pequeño
          >
            <Cell fill="#14b8a6" />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="pill">{children}</span>
);

export function Modal({
  title,
  children,
  onClose,
  maxWidth = 980,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: number;
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div
        className="modal-panel"
        style={{ width: `min(96vw, ${maxWidth}px)` }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="card-header" style={{ padding: 0, border: "none" }}>
            {title}
          </div>
          <button className="btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  const pct = Math.round(((current + 1) / steps.length) * 100);
  return (
    <div>
      <div className="progress-rail">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="stepper">
        {steps.map((t, i) => (
          <div
            key={i}
            className={`step ${i === current ? "active" : ""} ${
              i < current ? "done" : ""
            }`}
          >
            <span className="step-dot">{i < current ? "✓" : i + 1}</span>
            <span className="step-text">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
