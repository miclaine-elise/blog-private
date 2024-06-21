import { useState, useEffect } from 'react';

export function fetchData(url, method, body) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        async function getData() {
            try {
                const response = await fetch(`http://localhost:3000/admin${url}`,
                    {
                        method: method,
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('private-jwt')}`,
                        },
                        body: ['POST', 'PUT'].includes(method)
                            ? JSON.stringify({ message: body })
                            : null,
                    },
                );

                const data = await response.json();
                if (!ignore) {
                    setData(data);
                    setError(null);
                    setLoading(false);
                }
            } catch (err) {
                if (!ignore) {
                    setData(null);
                    setError(err);
                    setLoading(false);
                }
            }
        }

        getData();
        return () => {
            ignore = true;
        };
    }, []);

    return { data, error, loading };
}