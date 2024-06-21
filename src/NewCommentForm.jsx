import { useState } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function NewCommentForm({ remount }) {
    const { postId } = useParams();

    const navigate = useNavigate();
    const { handleLogout } = useOutletContext();

    // inputs
    const [authorInput, setAuthorInput] = useState('');
    const [textInput, setTextInput] = useState('');
    // loading and error state
    const [formLoading, setFormLoading] = useState(false);
    const [commentError, setCommentError] = useState('');

    function handleAuthorChange(e) {
        setAuthorInput(e.target.value);
    }

    function handleTextChange(e) {
        setTextInput(e.target.value);
    }

    function handleCommentSubmit(e) {
        e.preventDefault();
        setFormLoading(true);
        setCommentError('');
        sendComment(true);
    }

    async function sendComment() {
        try {
            const response = await fetch(
                `https://blog-api-floral-butterfly-9264.fly.dev/admin/posts/${postId}/comments/new`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('private-jwt')}`,
                    },
                    body: JSON.stringify({
                        author: authorInput,
                        text: textInput,
                        isAdmin: true,
                    }),
                },
            );

            const data = await response.json();

            // if jwt expired
            if (data && data.error && data.error.name === 'TokenExpiredError') {
                // this is such bad practice - need to find a better way to logout after expired jwt
                return handleLogout();
            }

            if (data.error) {
                setFormLoading(false);
                setCommentError(data.error);
                return;
            }
            console.log(data._id);
            setFormLoading(false);
            setCommentError('');
            remount();
        } catch (err) {
            console.log("error in newcomment form")
            console.log(err);
            setFormLoading(false);
            setCommentError('something went wrong');
        }
    }

    return (
        <div className="content-container">
            <h2>New Comment</h2>
            <form className="new-comment-container" onSubmit={handleCommentSubmit}>
                <div className="new-comment-text">
                    <label htmlFor="text">
                    </label>
                    <textarea
                        rows="2"
                        type="text"
                        id="text"
                        placeholder="Wow, you're so cool and funny"
                        value={textInput}
                        onChange={handleTextChange}
                        required
                    />
                </div>
                <div className="new-comment-author">
                    <label htmlFor="author">
                    </label>
                    <input
                        type="text"
                        id="author"
                        placeholder="name"
                        value={authorInput}
                        onChange={handleAuthorChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    value="Post"
                >post</button>
            </form>
            {formLoading && (
                <p>
                    checking action with server..
                </p>
            )}
            {commentError !== '' && (
                <p>{commentError}</p>
            )}
        </div>
    );
}