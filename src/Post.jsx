import { fetchData } from './fetchData';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useParams } from "react-router-dom";
import Comments from './Comments.jsx';
import garbage from './assets/garbage.svg';
import pencil from './assets/pencil.svg';
import check from './assets/check.svg';

export default function Post() {
    const { postId } = useParams();
    const { data, error, loading } = fetchData(`/posts/${postId}`, 'GET', null);
    const [remountComments, setRemountComments] = useState(1);
    const navigate = useNavigate();
    // jwt expired
    //   const { handleLogout } = useOutletContext();
    //   if (data && data.error && data.error.name === 'TokenExpiredError') {
    //     // this is such bad practice - need to find a better way to logout after expired jwt
    //     return handleLogout();
    //   }

    // if (data && data.error && data.error.name === 'JsonWebTokenError') {
    //     return <Navigate to="/" replace={true} />;
    // }
    console.log(error);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    function handleRemountComments() {
        setRemountComments((state) => state + 1);
    }
    function handleDelete(e) {
        setFormLoading(true);
        setDeleteError('');

        async function deletePost() {
            try {
                const response = await fetch(
                    `http://localhost:3000/admin/posts/${postId}`,
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
                console.log(data);
                if (data.error) {
                    setFormLoading(false);
                    setDeleteError(data.error);
                }

                setFormLoading(false);
                setDeleteError('');
                navigate(`/posts`);
            } catch (err) {
                console.log("error in post module")
                console.log(err);
                setFormLoading(false);
                setDeleteError('something went wrong');
            }
        }

        deletePost();
    }
    return (
        <div className="post-main-content">
            {loading && <p>loading post...</p>}
            {error && <p>network error - try again </p>}
            {data && (
                <div className="post">
                    <div className="post-actions">
                        <p className="post-published">
                            {data.isPublished ? (
                                <span>published</span>
                            ) : (
                                <span>draft</span>
                            )}
                        </p>
                        <button className="edit-btn" onClick={(() => navigate(`/posts/${data._id}/edit`))}>
                            <img src={pencil}></img>
                        </button>
                        <button className="delete-btn" onClick={handleDelete}>
                            <img src={garbage}></img>
                        </button>
                    </div>
                    <h2 className="post-title">{data.title}</h2>
                    <p className="post-summary">{data.summary}</p>
                    <p className="post-text">{data.text}</p>

                    <p className="post-date">{DateTime.fromISO(data.createdAt).toLocaleString(
                        DateTime.DATE_MED,
                    )}</p>
                </div>
            )}
            <Comments key={remountComments}
                remount={handleRemountComments} />

        </div>
    );
}