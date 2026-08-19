const API_BASE = 'https://gr4o73e1ca.execute-api.ca-west-1.amazonaws.com'

const TODAY_URL = `${API_BASE}/bytes/today`;
const HISTORY_URL = `${API_BASE}/bytes/history`;
const GENERATE_SINGLE_BYTE = `${API_BASE}/bytes/generate`;
const UPDATE_PREFERENCES = `${API_BASE}/bytes/preferences`;

export async function fetchTodaysByte(token) 
{
    const response = await fetch(TODAY_URL,
        {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        }
    );
    if (!response.ok)
    {
        const detail = await response.text();
        const message = JSON.parse(detail).message;
        throw new Error(`${message}`);
    }

    // parse json object into JS object
    return response.json();
}

export async function updatePreferences(token, reqBody)
{
    const response = await fetch(UPDATE_PREFERENCES,
        {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        }
    )

    if (!response.ok)
    {
        const detail = await response.text();
        const message = JSON.parse(detail).message;
        throw new Error(`${message}`);
    }

    // parse json object into JS object
    return response.json();
}

export async function generateNewByte(token)
{
    const response = await fetch(GENERATE_SINGLE_BYTE,
        {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
    );

    if (response.status === 404)
    {
        return null;
    }

    if (!response.ok)
    {
        const detail = await response.text();
        const message = JSON.parse(detail).message;
        throw new Error(`Error, status: ${response.status}, with message: ${message}`);
    }

    // parse json object into JS object
    return response.json();
}

export async function fetchHistory(token)
{
    const response = await fetch(HISTORY_URL,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    if (!response.ok)
    {
        throw new Error(`/bytes/history request failed with status ${response.status}`);
    }

    // parse json object into JS object
    return response.json();
}

