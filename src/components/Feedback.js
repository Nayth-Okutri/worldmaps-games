import React, { useState } from "react";

import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import "../styles/Feedback.css";

const CommentForm = () => {
  const [comment, setComment] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const { t } = useTranslation("menu");
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleUserHandleChange = (e) => {
    setUserHandle(e.target.value);
  };

  const handlePostComment = async () => {
    if (comment.trim() !== "" && userHandle.trim() !== "") {
      const commentsRef = collection(getFirestore(), "comments");
      const newComment = {
        text: comment,
        userHandle,
        date: new Date(),
      };
      await addDoc(commentsRef, newComment);
      setComment("");
      setUserHandle("");
    }
  };

  return (
    <div className="comment-form-container">
      <h2>{t("PostFeedback")}</h2>
      <div className="comment-input">
        <input
          type="text"
          value={userHandle}
          onChange={handleUserHandleChange}
          placeholder="Your User Name"
        />
      </div>
      <div className="comment-textarea">
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Type your comment here"
          rows="4"
          cols="50"
        />
      </div>
      <button className="comment-button" onClick={handlePostComment}>
        Post Comment
      </button>
    </div>
  );
};

export default CommentForm;
