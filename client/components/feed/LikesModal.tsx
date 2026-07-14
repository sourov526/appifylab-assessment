"use client";

import type { LikeUser } from "@/types";
import { useEffect, useRef } from "react";

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

export function LikesModal({
  title,
  likers,
  anchor,
  onClose,
}: LikesModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const HORIZONTAL_OFFSET_PX = 150;

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

    function handleScroll() {
      onClose();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  const modalWidth = 360;
  const left = anchor.left + HORIZONTAL_OFFSET_PX;
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
          <button
            type="button"
            className="_likes_modal_close"
            onClick={onClose}
          >
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
