
import { ParentService } from '@repo/api';

// Création du service
const apiConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
    },
    timeout: 10000, // 10 secondes
};

export const apiService = new ParentService(apiConfig);


export async function fetchData() {
    try {
        const data = await apiService.getData('/endpoint');
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('API Error:', error.message);
        }
        throw error;
    }
}