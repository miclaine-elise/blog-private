import { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';

export default function Login() {
    const { handleLoginSuccess, token } = useOutletContext();

    if (token) {
        return <Navigate to="/posts" replace={true} />;
    }

    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const [formLoading, setFormLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    function handleUsernameChange(e) {
        setUsernameInput(e.target.value);
    }

    function handlePasswordChange(e) {
        setPasswordInput(e.target.value);
    }

    function handleLoginSubmit(e) {
        e.preventDefault();
        setFormLoading(true);
        setLoginError('');

        async function sendLoginPost() {
            try {
                const response = await fetch(
                    `https://blog-api-production-7765.up.railway.app/admin/login`,
                    {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({
                            username: usernameInput,
                            password: passwordInput,
                        }),
                    },
                );

                const data = await response.json();
                if (data.error) {
                    setFormLoading(false);
                    setLoginError(data.error);
                    return;
                }

                setFormLoading(false);
                setLoginError('');
                handleLoginSuccess(data.token);
            } catch (err) {
                setFormLoading(false);
                setLoginError('something went wrong');
            }
        }

        sendLoginPost();
    }

    return (
        <div className="content-container">
            <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-input-container">
                    <label htmlFor="email">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="form-input"
                        value={usernameInput}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>
                <div className="form-input-container">
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={passwordInput}
                        onChange={handlePasswordChange}
                        minLength={6}
                        required
                    />
                </div>
                <input
                    type="submit"
                    value="Login"
                    className="login-btn"
                />
            </form>
            {formLoading && (
                <p className="form-loading-text">
                    checking action with server..
                </p>
            )}
            {loginError !== '' && (
                <p className="login-error-text">{loginError}</p>
            )}
        </div>
    );
}