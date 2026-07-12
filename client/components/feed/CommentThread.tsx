"use client";

import { useState } from "react";
import { createReply, likeComment, likeReply, unlikeComment, unlikeReply } from "@/lib/api";
import type { Comment, Reply } from "@/types";
import { LikesModal } from "./LikesModal";

type CommentThreadProps = {
  comment: Comment;
  onCommentUpdate: (commentId: string, updater: (comment: Comment) => Comment) => void;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function ReplyItem({
  reply,
  onLikeToggle,
  onShowLikes
}: {
  reply: Reply;
  onLikeToggle: (reply: Reply) => Promise<void>;
  onShowLikes: (reply: Reply) => void;
}) {
  return (
    <div className="_comment_main mt-3 ms-4">
      <div className="_comment_image">
        <span className="_comment_image_link">
          <img src="/assets/images/comment_img.png" alt="Reply author" className="_comment_img1" />
        </span>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
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
          <div className="_total_reactions">
            <div className="_total_react">
              <span className="_reaction_like">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </span>
            </div>
            <button type="button" className="_total border-0 bg-transparent p-0" onClick={() => onShowLikes(reply)}>
              {reply.likesCount}
            </button>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <button type="button" className="border-0 bg-transparent p-0" onClick={() => onLikeToggle(reply)}>
                    {reply.likedByMe ? "Unlike." : "Like."}
                  </button>
                </li>
                <li>
                  <button type="button" className="border-0 bg-transparent p-0" onClick={() => onShowLikes(reply)}>
                    Likes.
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

export function CommentThread({ comment, onCommentUpdate }: CommentThreadProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [likesTarget, setLikesTarget] = useState<{ title: string; likers: Reply["likers"] | Comment["likers"] } | null>(
    null
  );

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

  return (
    <>
      <div className="_comment_main">
        <div className="_comment_image">
          <span className="_comment_image_link">
            <img src="/assets/images/txt_img.png" alt="Comment author" className="_comment_img1" />
          </span>
        </div>
        <div className="_comment_area">
          <div className="_comment_details">
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
                onClick={() => setLikesTarget({ title: "Comment likes", likers: comment.likers })}
              >
                {comment.likesCount}
              </button>
            </div>
            <div className="_comment_reply">
              <div className="_comment_reply_num">
                <ul className="_comment_reply_list">
                  <li>
                    <button type="button" className="border-0 bg-transparent p-0" onClick={handleCommentLikeToggle}>
                      {comment.likedByMe ? "Unlike." : "Like."}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0"
                      onClick={() => setLikesTarget({ title: "Comment likes", likers: comment.likers })}
                    >
                      Reply Likes.
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
              onShowLikes={(nextReply) => setLikesTarget({ title: "Reply likes", likers: nextReply.likers })}
            />
          ))}

          <div className="_feed_inner_comment_box mt-3">
            <form className="_feed_inner_comment_box_form" onSubmit={handleReplySubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src="/assets/images/comment_img.png" alt="Reply" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a reply"
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
              </div>
            </form>
          </div>
        </div>
      </div>

      {likesTarget ? (
        <LikesModal title={likesTarget.title} likers={likesTarget.likers} onClose={() => setLikesTarget(null)} />
      ) : null}
    </>
  );
}
