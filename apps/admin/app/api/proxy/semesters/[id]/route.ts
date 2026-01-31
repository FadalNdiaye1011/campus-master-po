// apps/admin/app/api/proxy/semesters/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

/**
 * PUT - Modifier un semestre
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const semesterId = params.id;

        const body = await request.json();
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('✏️ PUT /api/proxy/semesters/:id - Modifier');
        console.log('Semester ID:', semesterId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/admin/semestres/${semesterId}`;
        console.log('📡 URL:', url);

        const response = await fetch(url, {
            method: 'PUT',
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
                { error: 'Erreur modification', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Semestre modifié');
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
 * DELETE - Supprimer un semestre
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const semesterId = params.id;

        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('🗑️ DELETE /api/proxy/semesters/:id');
        console.log('Semester ID:', semesterId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/admin/semestres/${semesterId}`;
        console.log('📡 URL:', url);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Authorization': token,
            },
        });

        console.log('📡 Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            return NextResponse.json(
                { error: 'Erreur suppression', details: errorText },
                { status: response.status }
            );
        }

        console.log('✅ Semestre supprimé');
        console.log('========================================');

        return NextResponse.json({
            success: true,
            message: 'Semestre supprimé avec succès'
        });

    } catch (error: any) {
        console.error('❌ Erreur proxy:', error.message);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}