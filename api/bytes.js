const TODAY_URL = 'https://api.npoint.io/de4404dc63b45a26470e';
const HISTORY_URL = 'https://api.npoint.io/9a866cce23d298a0b2b8';

export async function fetchTodaysByte() 
{
    const response = await fetch(TODAY_URL);
    if (!response.ok)
    {
        throw new Error(`/bytes/today request faield with status ${response.status}`);
    }

    // parse json object into JS object
    return response.json();
}

export async function fetchHistory()
{
    const response = await fetch(HISTORY_URL);
    if (!response.ok)
    {
        throw new Error(`/bytes/history request failed with status ${response.status}`);
    }

    // parse json object into JS object
    return response.json();
}

