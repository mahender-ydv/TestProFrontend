import React from "react";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "primary", trend }) {
  const colorMap = {
    primary: { bg: "rgba(99, 102, 241, 0.12)", text: "var(--primary-500)", border: "rgba(99, 102, 241, 0.2)" },
    purple: { bg: "rgba(139, 92, 246, 0.12)", text: "var(--accent-purple)", border: "rgba(139, 92, 246, 0.2)" },
    emerald: { bg: "rgba(16, 185, 129, 0.12)", text: "var(--accent-emerald)", border: "rgba(16, 185, 129, 0.2)" },
    amber: { bg: "rgba(245, 158, 11, 0.12)", text: "var(--accent-amber)", border: "rgba(245, 158, 11, 0.2)" },
    rose: { bg: "rgba(244, 63, 94, 0.12)", text: "var(--accent-rose)", border: "rgba(244, 63, 94, 0.2)" },
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div className="glass-card p-4 d-flex align-items-center justify-content-between">
      <div>
        <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
          {title}
        </span>
        <h3 className="fw-bold my-1 text-main" style={{ fontSize: "1.75rem" }}>
          {value}
        </h3>
        {subtitle && (
          <span className="text-muted" style={{ fontSize: "0.85rem" }}>
            {trend && <span className="me-1 fw-bold text-success">{trend}</span>}
            {subtitle}
          </span>
        )}
      </div>

      {Icon && (
        <div
          className="d-flex align-items-center justify-content-center rounded-3 p-3"
          style={{
            backgroundColor: scheme.bg,
            color: scheme.text,
            border: `1px solid ${scheme.border}`,
            width: "56px",
            height: "56px",
          }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
