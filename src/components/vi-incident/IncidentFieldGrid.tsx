import "./IncidentFieldGrid.css";

/** Aligned label / colon / value rows, sized to the card rather than the viewport. */
export const IncidentFieldGrid = ({
  fields,
  columns = 3,
}: {
  fields: { label: string; value?: string; span?: boolean }[];
  columns?: 2 | 3 | 4;
}) => (
  <div className="incident-field-container">
    <dl className="incident-field-grid" data-columns={columns}>
      {fields.map(({ label, value, span }) => (
        <div key={label} className={`incident-field-row${span ? " incident-field-row-full" : ""}`}>
          <dt className="incident-field-label">{label}</dt>
          <span className="incident-field-colon" aria-hidden="true">:</span>
          <dd className="incident-field-value">{value || "-"}</dd>
        </div>
      ))}
    </dl>
  </div>
);
