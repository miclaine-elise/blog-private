import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './App.css';
let localToken = localStorage.getItem('private-jwt');
localToken = localToken ? localToken : null;
export default function App() {
  const [token, setToken] = useState(localToken);

  const navigate = useNavigate();
  function handleLoginSuccess(token) {
    localStorage.setItem('private-jwt', token);
    setToken(token);
    navigate('/posts', { replace: true });
  }

  function handleLogout() {
    localStorage.removeItem('private-jwt');
    setToken(null);

    navigate('/', { replace: true });
  }

  return (
    <div>
      <header>
        <h1>Welcome back, babe</h1>
        <nav className="navbar">
          {token && (
            <>
              <button onClick={(() => navigate("/posts"))}>
                home
              </button>
              <button onClick={(() => { navigate("/posts/new") })}>
                new
              </button>
              <button onClick={handleLogout}>
                logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet context={{ token, handleLoginSuccess, handleLogout }} />
      </main>
    </div >
  );
}
