import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const submissionId = params.id;
        const token = request.headers.get('authorization');

        const { searchParams } = new URL(request.url);
        const note = searchParams.get('note');
        const feedback = searchParams.get('feedback');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        if (!note || !feedback) {
            return NextResponse.json({ error: 'Note et feedback requis' }, { status: 400 });
        }

        const url = `${API_BASE_URL}/api/enseignant/submit/${submissionId}/evaluer?note=${note}&feedback=${encodeURIComponent(feedback)}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Authorization': token,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Erreur évaluation', details: errorText },
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