import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Login from './Login';
import AllPosts from './AllPosts';
import PostCreate from './PostCreate';
import PostEdit from './PostEdit';
import Post from './Post';
// import Error from './Error';
const routes = [
    {
        element: <App />,
        children: [
            {
                path: "/",
                element: <Login />,
            },
            {
                path: "/posts",
                element: <AllPosts />,
            },
            {
                path: "/posts/:postId",
                element: <Post />
            },
            {
                path: "/posts/:postId/edit",
                element: <PostEdit />
            },
            {
                path: "/posts/new",
                element: <PostCreate />
            }
        ]
    },

];

export default routes;
