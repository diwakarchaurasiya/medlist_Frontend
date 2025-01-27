async function fetchFromApi(url, method, body = null) {
    try {
        const options = {
            method: method.toUpperCase(), // Ensure method is in uppercase
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Re-throw the error for the caller to handle
    }
}

export default fetchFromApi;