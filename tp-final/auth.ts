const tokenKey = 'mini-glpi-token'

export function getToken(): string | null {
    return localStorage.getItem(tokenKey);
}

export function saveToken(token: string): void {
    localStorage.setItem(tokenKey, token);
}

export function clearToken(): void {
    localStorage.removeItem(tokenKey);
}