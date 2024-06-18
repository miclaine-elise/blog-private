import { fetchData } from './fetchData';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { DateTime } from 'luxon';

export default function AllPosts() {
    const { data, error, loading } = fetchData('/posts', 'GET', null);

    // jwt expired
    //   const { handleLogout } = useOutletContext();
    //   if (data && data.error && data.error.name === 'TokenExpiredError') {
    //     // this is such bad practice - need to find a better way to logout after expired jwt
    //     return handleLogout();
    //   }

    if (data && data.error && data.error.name === 'JsonWebTokenError') {
        return <Navigate to="/" replace={true} />;
    }
    return (
        <>
            {loading && <p>loading posts...</p>}
            {error && <p>oopsie, there's an issue</p>}
            {data && (
                <div className="posts-container">
                    {data.allPosts.map((post) => {
                        return (
                            <Link className="post-card" key={post._id} to={`/posts/${post._id}`}>
                                <p className="post-card-title">{post.title}</p>
                                <p className="post-card-summary">{post.summary}</p>
                                <p className="post-card-date">{DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_MED,)}</p>
                                <p className="post-published">
                                    {post.isPublished ? (
                                        <span className="text-true rounded bg-gray-300 px-1">
                                            published
                                        </span>
                                    ) : (
                                        <span className="text-flame rounded bg-gray-300 px-1">
                                            unpublished
                                        </span>
                                    )}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </>
    );
}