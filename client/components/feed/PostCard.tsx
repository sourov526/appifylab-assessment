"use client";

import { useRef, useState } from "react";
import { createComment, likePost, resolveApiAssetUrl, unlikePost } from "@/lib/api";
import type { Comment, FeedPost } from "@/types";
import { CommentThread } from "./CommentThread";
import { LikesModal } from "./LikesModal";

type PostCardProps = {
  post: FeedPost;
  onPostUpdate: (postId: string, updater: (post: FeedPost) => FeedPost) => void;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

export function PostCard({ post, onPostUpdate }: PostCardProps) {
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const postImageUrl = resolveApiAssetUrl(post.imageUrl);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

  async function handlePostLikeToggle() {
    const result = post.likedByMe ? await unlikePost(post.id) : await likePost(post.id);
    onPostUpdate(post.id, (current) => ({ ...current, ...result }));
  }

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!commentContent.trim()) {
      return;
    }

    setIsSubmittingComment(true);
    try {
      const { comment } = await createComment(post.id, { content: commentContent.trim() });
      onPostUpdate(post.id, (current) => ({
        ...current,
        comments: [...current.comments, comment]
      }));
      setCommentContent("");
    } finally {
      setIsSubmittingComment(false);
    }
  }

  function updateComment(commentId: string, updater: (comment: Comment) => Comment) {
    onPostUpdate(post.id, (current) => ({
      ...current,
      comments: current.comments.map((comment) => (comment.id === commentId ? updater(comment) : comment))
    }));
  }

  return (
    <>
      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
          <div className="_feed_inner_timeline_post_top">
            <div className="_feed_inner_timeline_post_box">
              <div className="_feed_inner_timeline_post_box_image">
                <img src="/assets/images/txt_img.png" alt="Author" className="_comment_img1" />
              </div>
              <div className="_feed_inner_timeline_post_box_txt">
                <h4 className="_feed_inner_timeline_post_box_title">
                  {post.author.firstName} {post.author.lastName}
                </h4>
                <p className="_feed_inner_timeline_post_box_para">
                  {formatDateTime(post.createdAt)} . <span>{post.visibility === "PUBLIC" ? "Public" : "Private"}</span>
                </p>
              </div>
            </div>
            <div className="_feed_inner_timeline_post_box_dropdown">
              <button type="button" className="_feed_timeline_post_dropdown_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
          </div>

          <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>

          {postImageUrl ? (
            <div className="_feed_inner_timeline_image">
              <img src={postImageUrl} alt="Post" className="_time_img" />
            </div>
          ) : null}
        </div>

        <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
          <div
            className="_feed_inner_timeline_total_reacts_image"
            role="button"
            tabIndex={0}
            onClick={() => setShowLikes(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setShowLikes(true);
              }
            }}
          >
            <img src="/assets/images/react_img1.png" alt="Reaction" className="_react_img1" />
            <img src="/assets/images/react_img2.png" alt="Reaction" className="_react_img" />
            <img src="/assets/images/react_img3.png" alt="Reaction" className="_react_img" />
            <img src="/assets/images/react_img4.png" alt="Reaction" className="_react_img _rect_img_mbl_none" />
            <img src="/assets/images/react_img5.png" alt="Reaction" className="_react_img _rect_img_mbl_none" />
            <p className="_feed_inner_timeline_total_reacts_para">{post.likesCount}</p>
          </div>
          <div className="_feed_inner_timeline_total_reacts_txt">
            <p className="_feed_inner_timeline_total_reacts_para1">
              <span>{post.comments.length}</span> Comment
            </p>
            <p className="_feed_inner_timeline_total_reacts_para2">
              <span>0</span> Share
            </p>
          </div>
        </div>

        <div className="_feed_inner_timeline_reaction">
          <button
            type="button"
            className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${post.likedByMe ? "_feed_reaction_active" : ""}`}
            onClick={handlePostLikeToggle}
          >
            <span className="_feed_inner_timeline_reaction_link">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                  <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                  <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                  <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                  <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
                </svg>
                {post.likedByMe ? "Haha" : "Like"}
              </span>
            </span>
          </button>
          <button
            type="button"
            className="_feed_inner_timeline_reaction_comment _feed_reaction"
            onClick={() => commentInputRef.current?.focus()}
          >
            <span className="_feed_inner_timeline_reaction_link">
              <span>
                <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                  <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                  <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                </svg>
                Comment
              </span>
            </span>
          </button>
          <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction" onClick={() => setShowLikes(true)}>
            <span className="_feed_inner_timeline_reaction_link">
              <span>
                <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                  <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                </svg>
                Share
              </span>
            </span>
          </button>
        </div>

        <div className="_feed_inner_timeline_cooment_area">
          <div className="_feed_inner_comment_box">
            <form className="_feed_inner_comment_box_form" onSubmit={handleCommentSubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src="/assets/images/comment_img.png" alt="Comment" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    ref={commentInputRef}
                    className="form-control _comment_textarea"
                    placeholder="Write a comment"
                    value={commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                  />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={isSubmittingComment}>
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
                <button type="button" className="_feed_inner_comment_box_icon_btn" aria-label="Comment media">
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

        <div className="_timline_comment_main">
          {post.comments.length > 1 ? (
            <div className="_previous_comment">
              <button type="button" className="_previous_comment_txt">
                View {post.comments.length - 1} previous comments
              </button>
            </div>
          ) : null}
          {post.comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} onCommentUpdate={updateComment} />
          ))}
        </div>
      </div>

      {showLikes ? <LikesModal title="Post likes" likers={post.likers} onClose={() => setShowLikes(false)} /> : null}
    </>
  );
}
