"use client";

import type { LikeUser } from "@/types";

type LikesModalProps = {
  title: string;
  likers: LikeUser[];
  onClose: () => void;
};

export function LikesModal({ title, likers, onClose }: LikesModalProps) {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 2000 }}>
      <div className="bg-white rounded-4 shadow p-4" style={{ width: "min(480px, 92vw)" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Close
          </button>
        </div>
        {likers.length ? (
          <ul className="list-group">
            {likers.map((liker) => (
              <li key={liker.id} className="list-group-item">
                {liker.firstName} {liker.lastName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mb-0">No likes yet.</p>
        )}
      </div>
    </div>
  );
}
