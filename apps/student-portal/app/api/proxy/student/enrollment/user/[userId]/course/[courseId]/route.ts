// apps/student-portal/app/api/proxy/student/enrollment/user/[userId]/course/[courseId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ userId: string; courseId: string }> }
) {
    try {
        const params = await context.params;
        const userId = params.userId;
        const courseId = params.courseId;
        const token = request.headers.get('authorization');

        console.log('========================================');
        console.log('➕ POST /api/proxy/student/enrollment');
        console.log('User ID:', userId);
        console.log('Course ID:', courseId);
        console.log('========================================');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        const url = `${API_BASE_URL}/api/etudiant/inscription/user/${userId}/cours/${courseId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': token,
            },
            body: '',
        });

        console.log('📡 Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            return NextResponse.json(
                { error: 'Erreur inscription', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Enrollment successful');
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