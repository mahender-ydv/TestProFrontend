import React from "react";
import { Bell, Sparkles, Pin, Calendar, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function NoticeBoard() {
  const notices = [
    {
      id: 1,
      title: "Mid-Term Online Assessment Schedule Announced",
      date: "August 20, 2026",
      category: "Exam Alert",
      priority: "high",
      content:
        "All enrolled students must review their subject test schedules under the Dashboard. Make sure to complete proctored sample papers prior to official start.",
    },
    {
      id: 2,
      title: "New Data Structures & Algorithms Problem Set Added",
      date: "August 15, 2026",
      category: "Resource",
      priority: "medium",
      content:
        "Over 50+ new LeetCode questions spanning Dynamic Programming and Graph algorithms have been added to the Exams section.",
    },
    {
      id: 3,
      title: "System Maintenance & Glassmorphic UI Upgrade",
      date: "August 10, 2026",
      category: "System Update",
      priority: "info",
      content:
        "TestPro has received a major visual upgrade introducing Dark/Light mode switching, enhanced proctored anti-cheat detection, and performance charts.",
    },
  ];

  return (
    <div className="container-fluid p-0 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-main mb-1 d-flex align-items-center gap-2">
            Notice Board & Announcements <Bell size={24} className="text-primary" />
          </h2>
          <p className="text-muted mb-0">Stay updated with official examination schedules, platform announcements, and guidelines.</p>
        </div>
      </div>

      <div className="row g-4">
        {notices.map((notice) => (
          <div key={notice.id} className="col-12">
            <div className="glass-card p-4 position-relative overflow-hidden">
              <div className="d-flex align-items-start justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`tp-badge ${
                      notice.priority === "high"
                        ? "tp-badge-danger"
                        : notice.priority === "medium"
                        ? "tp-badge-warning"
                        : "tp-badge-primary"
                    }`}
                  >
                    <Pin size={12} /> {notice.category}
                  </span>
                  <span className="text-muted fs-7 d-flex align-items-center gap-1">
                    <Calendar size={14} /> {notice.date}
                  </span>
                </div>
              </div>

              <h4 className="fw-bold text-main mb-2">{notice.title}</h4>
              <p className="text-muted fs-6 mb-0 lh-base">{notice.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
