import { fetchData } from './fetchData';
import { fetchComments } from './fetchComments';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useParams } from "react-router-dom";
import NewCommentForm from './NewCommentForm';
import triangle from './assets/triangle.svg';
import star from './assets/star.svg';
import garbage from './assets/garbage.svg';
export default function Comments({ remount }) {
    const { postId } = useParams();

    const navigate = useNavigate();
    const remountComments = false;
    const { comments, commentsError, commentsLoading } = fetchComments(`posts/${postId}/comments`, 'GET', null);
    const [commentsDisplayed, setCommentsDisplayed] = useState(true);
    const [newCommentDisplayed, setNewCommentDisplayed] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    function handleNewComment() {
        remount();
    }
    function handleCommentDelete(commentId) {
        setFormLoading(true);
        setDeleteError('');
        async function deleteComment() {
            console.log(commentId);
            try {
                const response = await fetch(
                    `http://localhost:3000/admin/posts/${postId}/${commentId}`,
                    {
                        method: 'DELETE',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('private-jwt')}`,
                        }
                    },
                );
                const data = await response.json();
                if (data.error) {
                    setFormLoading(false);
                    setDeleteError(data.error);
                }

                setFormLoading(false);
                setDeleteError('');
                remount();

            } catch (err) {
                console.log("error in comments module")
                console.log(err);
                setFormLoading(false);
                setDeleteError('something went wrong');
            }
        }

        deleteComment();
    }
    return (
        <>
            {commentsLoading && <p>loading comments...</p>}
            {commentsError && <p>network error - try again </p>}
            {comments && (
                <div className="comments-container">
                    <div className="comments-header">
                        {commentsDisplayed ? <img src={triangle} className='comments-displayed-icon' /> : <img src={triangle} className='comments-hidden-icon' />}
                        <div className="comments-title" onClick={() => setCommentsDisplayed(!commentsDisplayed)}
                        >Comments {`( ` + comments.allComments.length + ` )`}</div>
                        <button onClick={(() => setNewCommentDisplayed(!newCommentDisplayed))}>
                            <span className="new-comment-icon">+</span>
                            <span className="new-comment-hover">new comment</span></button>
                    </div>

                    {newCommentDisplayed ?
                        <NewCommentForm remount={handleNewComment} />
                        : null}
                    {commentsDisplayed ?
                        comments.allComments.map((comment) => {
                            return (
                                <div className="comment" key={comment._id}>
                                    <div className="comment-info">
                                        <p className="comment-author">{comment.author}</p>
                                        {comment.isAdmin ?
                                            <div className="admin-tag">
                                                <img src={star}></img>
                                                <p>admin</p>
                                                <img src={star}></img>
                                            </div> :
                                            null}
                                        <p className="comment-date">{DateTime.fromISO(comment.createdAt).toLocaleString(
                                            DateTime.DATE_MED,
                                        )}</p>
                                    </div>
                                    <div className="comment-actions">
                                        <button className="delete-btn" onClick={(() => handleCommentDelete(comment._id))}>
                                            <img src={garbage}></img>
                                        </button>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>

                                </div>
                            )
                        })
                        : null}
                </div>)}
        </>
    );
}