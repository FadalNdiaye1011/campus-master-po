// apps/teacher-portal/app/api/proxy/teacher/assignments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const assignmentId = params.id;
        const body = await request.json();
        const token = request.headers.get('authorization');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/enseignant/devoirs/${assignmentId}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Erreur modification', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const assignmentId = params.id;
        const token = request.headers.get('authorization');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/enseignant/devoirs/${assignmentId}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Authorization': token,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Erreur suppression', details: errorText },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Devoir supprimé avec succès',
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}