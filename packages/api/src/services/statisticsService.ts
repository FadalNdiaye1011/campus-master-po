// packages/api/src/services/statisticsService.ts

import { ParentService } from '../parent-service';
import type { Statistics } from '../types/statistics.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class StatisticsService extends ParentService {
    private static instance: StatisticsService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): StatisticsService {
        if (!StatisticsService.instance) {
            StatisticsService.instance = new StatisticsService();
        }
        return StatisticsService.instance;
    }

    /**
     * Récupère toutes les statistiques
     */
    static async getStatistics(): Promise<Statistics> {
        const service = StatisticsService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching statistics');

        const response = await service.gethttp.get<Statistics>(
            '/api/proxy/statistics',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }
}