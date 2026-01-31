// apps/teacher-portal/app/api/proxy/teacher/courses/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

/**
 * PUT - Modifier un cours
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const courseId = params.id;

        const body = await request.json();
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('✏️ PUT /api/proxy/teacher/courses/:id - Modifier');
        console.log('Course ID:', courseId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/enseignant/cours/${courseId}`;

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
        console.log('✅ Course updated');
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
 * DELETE - Supprimer un cours
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const courseId = params.id;

        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('🗑️ DELETE /api/proxy/teacher/courses/:id');
        console.log('Course ID:', courseId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/enseignant/cours/${courseId}`;

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

        console.log('✅ Course deleted');
        console.log('========================================');

        return NextResponse.json({
            success: true,
            message: 'Cours supprimé avec succès',
        });

    } catch (error: any) {
        console.error('❌ Proxy error:', error.message);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}