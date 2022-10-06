export async function fetchAPI(query: string, {variables}: any = {}) {
  const apiUrl = process.env.DELIVERY_API_URL;
  const gqlToken = process.env.DELIVERY_API_AUTH_TOKEN;

  const headers = { 
    'Content-Type': 'application/json',
    'X-GQL-Token': gqlToken!
  };

  const res = await fetch(apiUrl!, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}
