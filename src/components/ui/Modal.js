import React from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        className="glass-card w-100 p-4 shadow-lg position-relative"
        style={{
          maxWidth: "540px",
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-strong)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <h4 className="fw-bold mb-0 text-main">{title}</h4>
          <button
            onClick={onClose}
            className="btn btn-sm btn-link  p-1 border-0"
            style={{ borderRadius: "50%" }}
          >
            <X size={20} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
