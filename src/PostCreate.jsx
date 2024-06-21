import { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function PostCreate() {
    const navigate = useNavigate();
    const { handleLogout } = useOutletContext();

    // inputs
    const [titleInput, setTitleInput] = useState('');
    const [summaryInput, setSummaryInput] = useState('');
    const [textInput, setTextInput] = useState('');

    // loading and error state
    const [formLoading, setFormLoading] = useState(false);
    const [postError, setPostError] = useState('');

    function handleTitleChange(e) {
        setTitleInput(e.target.value);
    }

    function handleTextChange(e) {
        setTextInput(e.target.value);
    }
    function handleSummaryChange(e) {
        setSummaryInput(e.target.value);
    }

    function handleSaveDraft(e) {
        e.preventDefault();
        sendPost(false);
    }
    function handlePostSubmit(e) {
        e.preventDefault();
        setFormLoading(true);
        setPostError('');
        sendPost(true);
    }

    async function sendPost(isPublishedInput) {
        try {
            const response = await fetch(
                `http://localhost:3000/admin/posts/new`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('private-jwt')}`,
                    },
                    body: JSON.stringify({
                        title: titleInput,
                        summary: summaryInput,
                        text: textInput,
                        isPublished: isPublishedInput,
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
                setPostError(data.error);
                return;
            }
            console.log(data._id);
            setFormLoading(false);
            setPostError('');
            navigate(`/posts/${data._id}`);
        } catch (err) {
            setFormLoading(false);
            setPostError('something went wrong');
        }
    }

    return (
        <div className="content-container">
            <h2>Create New Post</h2>
            <form className="form-container" onSubmit={handlePostSubmit}>
                <div className="form-title">
                    <label htmlFor="title">
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Title"
                        value={titleInput}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="summary">
                    </label>
                    <textarea
                        type="text"
                        id="summary"
                        placeholder="Summary"
                        value={summaryInput}
                        onChange={handleSummaryChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="text">
                    </label>
                    <textarea
                        id="text"
                        placeholder="Blah blah blah.."
                        value={textInput}
                        onChange={handleTextChange}
                        required
                    />
                </div>
                <button
                    onClick={handleSaveDraft}
                    value=""
                >save draft</button>
                <button
                    type="submit"
                    value="Create Post"
                >submit</button>
            </form>
            {formLoading && (
                <p>
                    checking action with server..
                </p>
            )}
            {postError !== '' && (
                <p>{postError}</p>
            )}
        </div>
    );
}