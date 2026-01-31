// apps/admin/app/api/proxy/semesters/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

/**
 * GET - Liste des semestres
 */
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('📥 GET /api/proxy/semesters - Liste');
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/semestres`, {
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
        console.log('✅ Semestres chargés:', data.length);
        console.log('========================================');

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('❌ Erreur proxy:', error.message);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * POST - Créer un semestre
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('➕ POST /api/proxy/semesters - Créer');
        console.log('Libelle:', body.libelle);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/semestres`, {
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
                { error: 'Erreur création', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Semestre créé:', data.id);
        console.log('========================================');

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('❌ Erreur proxy:', error.message);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}