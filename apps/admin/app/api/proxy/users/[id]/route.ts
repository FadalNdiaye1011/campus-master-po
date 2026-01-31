// apps/admin/app/api/proxy/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

/**
 * PUT - Modifier un utilisateur (AVEC ID)
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Next.js 15: params est une Promise
        const params = await context.params;
        const userId = params.id;

        const body = await request.json();
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('✏️ PUT /api/proxy/users/:id - Modifier');
        console.log('User ID:', userId);
        console.log('Body:', body);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        if (!userId || userId === 'undefined') {
            console.error('❌ User ID manquant ou undefined');
            return NextResponse.json(
                { error: 'ID utilisateur manquant' },
                { status: 400 }
            );
        }

        const url = `${API_BASE_URL}/api/admin/users/${userId}`;
        console.log('📡 Backend URL:', url);

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

        const responseText = await response.text();

        if (!response.ok) {
            console.error('❌ Backend error:', responseText);
            return NextResponse.json(
                {
                    error: 'Erreur modification',
                    status: response.status,
                    details: responseText,
                },
                { status: response.status }
            );
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            data = { message: 'Utilisateur modifié avec succès' };
        }

        console.log('✅ Utilisateur modifié');
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
 * DELETE - Supprimer un utilisateur (AVEC ID)
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Next.js 15: params est une Promise
        const params = await context.params;
        const userId = params.id;

        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('🗑️ DELETE /api/proxy/users/:id - Supprimer');
        console.log('User ID:', userId);
        console.log('Type:', typeof userId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        if (!userId || userId === 'undefined') {
            console.error('❌ User ID manquant ou undefined');
            return NextResponse.json(
                { error: 'ID utilisateur manquant' },
                { status: 400 }
            );
        }

        const url = `${API_BASE_URL}/api/admin/users/${userId}`;
        console.log('📡 Backend URL:', url);

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
                {
                    error: 'Erreur suppression',
                    status: response.status,
                    details: errorText,
                },
                { status: response.status }
            );
        }

        console.log('✅ Utilisateur supprimé');
        console.log('========================================');

        return NextResponse.json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });

    } catch (error: any) {
        console.error('❌ Erreur proxy:', error.message);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}

