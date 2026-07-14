"use client";

import { useState } from "react";
import { createReply, likeComment, likeReply, unlikeComment, unlikeReply } from "@/lib/api";
import { getUserAvatarSrc } from "@/lib/avatar";
import type { AuthUser, Comment, Reply } from "@/types";
import { LikesModal } from "./LikesModal";

type CommentThreadProps = {
  comment: Comment;
  currentUser: AuthUser | null;
  onCommentUpdate: (commentId: string, updater: (comment: Comment) => Comment) => void;
};

function formatDateTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  return date.toLocaleDateString();
}

function ReplyItem({
  reply,
  onLikeToggle,
  onShowLikes
}: {
  reply: Reply;
  onLikeToggle: (reply: Reply) => Promise<void>;
  onShowLikes: (reply: Reply, element: HTMLElement) => void;
}) {
  return (
    <div className="_comment_main _comment_main_reply">
      <div className="_comment_image">
        <span className="_comment_image_link">
          <img src={getUserAvatarSrc(reply.author)} alt="Reply author" className="_comment_img1" />
        </span>
      </div>
      <div className="_comment_area">
        <div className="_comment_details _comment_details_dynamic">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <span>
                <h4 className="_comment_name_title">
                  {reply.author.firstName} {reply.author.lastName}
                </h4>
              </span>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{reply.content}</span>
            </p>
          </div>
          {reply.likesCount > 0 ? (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                className="_total border-0 bg-transparent p-0"
                onClick={(event) => onShowLikes(reply, event.currentTarget)}
              >
                {reply.likesCount}
              </button>
            </div>
          ) : null}
          <div className="_comment_reply">
            <div className="_comment_reply_num _comment_reply_num_dynamic">
              <ul className="_comment_reply_list">
                <li>
                  <button type="button" className="border-0 bg-transparent p-0" onClick={() => onLikeToggle(reply)}>
                    <span>{reply.likedByMe ? "Unlike." : "Like."}</span>
                  </button>
                </li>
                <li>
                  <button type="button" className="border-0 bg-transparent p-0">
                    <span>Reply.</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0"
                    onClick={(event) => onShowLikes(reply, event.currentTarget)}
                  >
                    <span>Share</span>
                  </button>
                </li>
                <li>
                  <span className="_time_link">.{formatDateTime(reply.createdAt)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommentThread({ comment, currentUser, onCommentUpdate }: CommentThreadProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [likesTarget, setLikesTarget] = useState<{ title: string; likers: Reply["likers"] | Comment["likers"] } | null>(
    null
  );
  const [likesAnchor, setLikesAnchor] = useState({ top: 0, left: 0 });

  async function handleCommentLikeToggle() {
    const result = comment.likedByMe ? await unlikeComment(comment.id) : await likeComment(comment.id);
    onCommentUpdate(comment.id, (current) => ({ ...current, ...result }));
  }

  async function handleReplySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!replyContent.trim()) {
      return;
    }

    setIsReplying(true);
    try {
      const { reply } = await createReply(comment.id, { content: replyContent.trim() });
      onCommentUpdate(comment.id, (current) => ({
        ...current,
        replies: [...current.replies, reply]
      }));
      setReplyContent("");
    } finally {
      setIsReplying(false);
    }
  }

  async function handleReplyLikeToggle(reply: Reply) {
    const result = reply.likedByMe ? await unlikeReply(reply.id) : await likeReply(reply.id);
    onCommentUpdate(comment.id, (current) => ({
      ...current,
      replies: current.replies.map((item) => (item.id === reply.id ? { ...item, ...result } : item))
    }));
  }

  function openLikesNear(
    title: string,
    likers: Reply["likers"] | Comment["likers"],
    element: HTMLElement
  ) {
    const rect = element.getBoundingClientRect();
    setLikesAnchor({
      top: rect.top - 6,
      left: rect.left + rect.width / 2
    });
    setLikesTarget({ title, likers });
  }

  return (
    <>
      <div className="_comment_main">
        <div className="_comment_image">
          <span className="_comment_image_link">
            <img src={getUserAvatarSrc(comment.author)} alt="Comment author" className="_comment_img1" />
          </span>
        </div>
        <div className="_comment_area">
          <div className="_comment_details _comment_details_dynamic">
            <div className="_comment_details_top">
              <div className="_comment_name">
                <span>
                  <h4 className="_comment_name_title">
                    {comment.author.firstName} {comment.author.lastName}
                  </h4>
                </span>
              </div>
            </div>
            <div className="_comment_status">
              <p className="_comment_status_text">
                <span>{comment.content}</span>
              </p>
            </div>
            {comment.likesCount > 0 ? (
              <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </span>
                </div>
                <button
                  type="button"
                  className="_total border-0 bg-transparent p-0"
                  onClick={(event) => openLikesNear("Comment likes", comment.likers, event.currentTarget)}
                >
                  {comment.likesCount}
                </button>
              </div>
            ) : null}
            <div className="_comment_reply">
              <div className="_comment_reply_num _comment_reply_num_dynamic">
                <ul className="_comment_reply_list">
                  <li>
                    <button type="button" className="border-0 bg-transparent p-0" onClick={handleCommentLikeToggle}>
                      <span>{comment.likedByMe ? "Unlike." : "Like."}</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" className="border-0 bg-transparent p-0">
                      <span>Reply.</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0"
                      onClick={(event) => openLikesNear("Comment likes", comment.likers, event.currentTarget)}
                    >
                      <span>Share</span>
                    </button>
                  </li>
                  <li>
                    <span className="_time_link">.{formatDateTime(comment.createdAt)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {comment.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              onLikeToggle={handleReplyLikeToggle}
              onShowLikes={(nextReply, element) => openLikesNear("Reply likes", nextReply.likers, element)}
            />
          ))}

          <div className="_feed_inner_comment_box">
            <form className="_feed_inner_comment_box_form" onSubmit={handleReplySubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img
                    src={currentUser ? getUserAvatarSrc(currentUser) : "/assets/images/comment_img.png"}
                    alt="Reply"
                    className="_comment_img"
                  />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a comment"
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                  />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={isReplying}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path
                      fill="#000"
                      fillOpacity=".46"
                      fillRule="evenodd"
                      d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button type="button" className="_feed_inner_comment_box_icon_btn" aria-label="Reply media">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path
                      fill="#000"
                      fillOpacity=".46"
                      fillRule="evenodd"
                      d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {likesTarget ? (
        <LikesModal
          title={likesTarget.title}
          likers={likesTarget.likers}
          anchor={likesAnchor}
          onClose={() => setLikesTarget(null)}
        />
      ) : null}
    </>
  );
}
