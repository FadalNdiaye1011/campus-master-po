import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ courseId: string }> }
) {
    try {
        const params = await context.params;
        const courseId = params.courseId;
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('📝 GET /api/proxy/student/courses/:courseId/assignments/active');
        console.log('Course ID:', courseId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/etudiant/cours/${courseId}/devoirs/actifs`;

        const response = await fetch(url, {
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
        console.log('✅ Active assignments retrieved:', Array.isArray(data) ? data.length : 0);
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