import { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { fetchData } from './fetchData';
export default function PostEdit() {
    const navigate = useNavigate();
    const { handleLogout } = useOutletContext();
    const { postId } = useParams();


    const { data, error, loading } = fetchData(
        `/posts/${postId}`,
        'GET',
        null,
    );
    // inputs
    const [titleInput, setTitleInput] = useState('');
    const [textInput, setTextInput] = useState('');
    const [summaryInput, setSummaryInput] = useState('');

    useEffect(() => {
        if (data) {
            console.log();
            setTitleInput(data.title);
            setSummaryInput(data.summary);
            setTextInput(data.text);
        }
    }, [data]);

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
                `https://blog-api-production-7765.up.railway.app/admin/posts/${postId}/edit`,
                {
                    method: 'PUT',
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
            <h2>Edit Post</h2>
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