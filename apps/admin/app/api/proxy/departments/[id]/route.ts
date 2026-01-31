// apps/admin/app/api/proxy/departments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

/**
 * GET - Détails d'un département
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const departmentId = params.id;

        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('📥 GET /api/proxy/departments/:id');
        console.log('Department ID:', departmentId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const response = await fetch(
            `${API_BASE_URL}/api/admin/departements/${departmentId}`,
            {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': token,
                },
            }
        );

        console.log('📡 Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            return NextResponse.json(
                { error: 'Département non trouvé', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Département récupéré');
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
 * PUT - Modifier un département
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const departmentId = params.id;

        const body = await request.json();
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('✏️ PUT /api/proxy/departments/:id - Modifier');
        console.log('Department ID:', departmentId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/admin/departements/${departmentId}`;
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
        console.log('✅ Département modifié');
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
 * DELETE - Supprimer un département
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const departmentId = params.id;

        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('🗑️ DELETE /api/proxy/departments/:id');
        console.log('Department ID:', departmentId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/admin/departements/${departmentId}`;
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

        console.log('✅ Département supprimé');
        console.log('========================================');

        return NextResponse.json({
            success: true,
            message: 'Département supprimé avec succès',
        });

    } catch (error: any) {
        console.error('❌ Erreur proxy:', error.message);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}