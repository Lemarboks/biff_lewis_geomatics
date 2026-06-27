const b = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string): string => `${b}${path}`;
