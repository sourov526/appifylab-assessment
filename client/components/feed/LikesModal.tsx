"use client";

import { useEffect, useRef } from "react";
import type { LikeUser } from "@/types";

type LikesModalAnchor = {
  top: number;
  left: number;
};

type LikesModalProps = {
  title: string;
  likers: LikeUser[];
  anchor: LikesModalAnchor;
  onClose: () => void;
};

export function LikesModal({ title, likers, anchor, onClose }: LikesModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
  const modalWidth = Math.min(360, viewportWidth - 24);
  const left = Math.max(12 + modalWidth / 2, Math.min(anchor.left, viewportWidth - modalWidth / 2 - 12));
  const top = Math.max(96, anchor.top);

  return (
    <div className="_likes_modal_overlay">
      <div
        ref={cardRef}
        className="_likes_modal_card _likes_modal_card_anchor"
        style={{ top: `${top}px`, left: `${left}px`, width: `${modalWidth}px` }}
      >
        <div className="_likes_modal_head">
          <h5 className="_likes_modal_title">{title}</h5>
          <button type="button" className="_likes_modal_close" onClick={onClose}>
            Close
          </button>
        </div>
        {likers.length ? (
          <ul className="_likes_modal_list">
            {likers.map((liker) => (
              <li key={liker.id} className="_likes_modal_item">
                {liker.firstName} {liker.lastName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="_likes_modal_empty">No likes yet.</p>
        )}
      </div>
    </div>
  );
}
