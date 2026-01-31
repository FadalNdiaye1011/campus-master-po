// apps/admin/app/api/proxy/users/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

/**
 * GET - Liste des utilisateurs (avec recherche optionnelle)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword');

        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('📥 GET /api/proxy/users');
        console.log('Keyword:', keyword || 'none');
        console.log('========================================');

        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant' },
                { status: 401 }
            );
        }

        // Construire l'URL avec ou sans recherche
        let apiUrl = `${API_BASE_URL}/api/admin/users`;
        if (keyword) {
            apiUrl = `${API_BASE_URL}/api/admin/users/search?keyword=${encodeURIComponent(keyword)}`;
        }

        console.log('📡 Backend URL:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': token,
            },
        });

        console.log('📡 Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            return NextResponse.json(
                { error: 'Erreur backend', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Users retrieved:', Array.isArray(data) ? data.length : 0);
        console.log('========================================');

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('❌ Proxy error:', error.message);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * POST - Créer un utilisateur
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('➕ POST /api/proxy/users - Créer');
        console.log('Email:', body.email);
        console.log('========================================');

        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant' },
                { status: 401 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(body),
        });

        console.log('📡 Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            return NextResponse.json(
                { error: 'Erreur lors de la création', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ User created:', data.userId);
        console.log('========================================');

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('❌ Proxy error:', error.message);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}