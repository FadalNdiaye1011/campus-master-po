// apps/admin/app/api/proxy/matieres/[id]/activer/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const matiereId = params.id;
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('✅ PUT /api/proxy/matieres/:id/activer');
        console.log('Matiere ID:', matiereId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/admin/matieres/${matiereId}/activer`;

        const response = await fetch(url, {
            method: 'PUT',
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
                { error: 'Erreur activation', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Matière activée');
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