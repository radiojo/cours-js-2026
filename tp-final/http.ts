import { clearToken, getToken } from './auth';

export async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers = new Headers(options.headers);
    headers.set('content-type', 'application/json')
    if (token) {
        headers.set('authorization', `Bearer ${token}`)
    }

    const response = await fetch(`http://localhost:3000${url}`, {
        ...options,
        headers
    });

    // Gérer le cas où le token est expiré ou invalide (401 Unauthorized)
    // Gérer le cas où la requête échoue pour d'autres raisons (par exemple, 404 Not Found, 500 Internal Server Error)
    // Dans les autres cas, retourner la réponse JSON si la requête est réussie (status 200 OK)

    // ...
}