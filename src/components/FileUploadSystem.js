import React, { useState } from "react";
import { UploadCloud, FileCheck, AlertCircle } from "lucide-react";

const FileUploadSystem = ({ testPaperId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a valid CSV/Excel file to upload");
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    if (testPaperId) {
      formData.append("testPaperId", testPaperId);
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/new/fileUpload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage({ type: "success", text: data.message || "File uploaded successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "File upload failed. Please verify format." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-card p-4 p-md-5 text-center">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle p-4 mb-3"
        style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", color: "var(--primary-500)" }}
      >
        <UploadCloud size={40} />
      </div>

      <h4 className="fw-bold text-main mb-1">Bulk Question Importer</h4>
      <p className="text-muted fs-6 mb-4">
        Upload CSV or JSON file containing question statements, options, and correct answers.
      </p>

      {message && (
        <div className={`tp-badge ${message.type === "success" ? "tp-badge-success" : "tp-badge-danger"} w-100 p-3 mb-4 rounded-3`}>
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="file"
            className="tp-input"
            accept=".csv, .xlsx, .json"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="tp-btn tp-btn-primary px-4 py-3 w-100 fs-6"
          disabled={uploading}
        >
          {uploading ? "Uploading Data..." : "Upload Question Dataset"}
        </button>
      </form>
    </div>
  );
};

export default FileUploadSystem;
