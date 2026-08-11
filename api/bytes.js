const TODAY_URL = 'https://gr4o73e1ca.execute-api.ca-west-1.amazonaws.com/bytes/today';
const HISTORY_URL = 'https://gr4o73e1ca.execute-api.ca-west-1.amazonaws.com/bytes/history';

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
        throw new Error(`/bytes/today request faield with status ${response.status}`);
    }

    if (response.status === 202)
    {
        throw new Error("/bytes/today - No bytes exist yet");
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

