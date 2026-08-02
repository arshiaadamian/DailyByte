const API_BASE = 'https://api.npoint.io/85ba258667a437691c98';

export async function fetchTodaysByte() 
{
    const response = await fetch(API_BASE);
    if (!response.ok)
    {
        throw new Error(`/bytes/today request faield with status ${response.status}`);
    }

    // parse json object into JS object
    return response.json();
}

export async function fetchHistory()
{
    const response = await fetch(`${API_BASE}/bytes/history`);
    if (!response.ok)
    {
        throw new Error(`/bytes/history request failed with status ${response.status}`);
    }

    // parse json object into JS object
    return response.json();
}

