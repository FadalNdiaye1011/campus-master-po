import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

export async function POST(request: NextRequest) {
    try {
        // Lire le body de la requête
        const body = await request.json();
        console.log('📦 Body reçu:', body);

        // Faire la requête vers le vrai backend
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(body),
        });
        console.log('📡 Backend response status:', response.status);
        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Backend error:', errorData);

            return NextResponse.json(
                { error: 'Erreur d\'authentification', details: errorData },
                { status: response.status }
            );
        }

        const backendData = await response.json();
        console.log('✅ Backend response data:', backendData);

        // Transformer la réponse pour correspondre au format attendu par le frontend
        const transformedData = {
            user: {
                id: backendData.userId.toString(),
                email: backendData.email,
                name: `${backendData.firstName} ${backendData.lastName}`,
                role: backendData.role.toLowerCase(), // ADMIN → admin
            },
            token: backendData.token,
        };

        console.log('🔄 Transformed data:', transformedData);

        // Retourner la réponse transformée
        return NextResponse.json(transformedData, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error: any) {
        console.error('❌ Erreur dans le proxy:', error);

        return NextResponse.json(
            {
                error: 'Erreur serveur',
                message: error.message,
                details: 'Le serveur backend a rencontré une erreur',
            },
            { status: 500 }
        );
    }
}

// Gérer les requêtes OPTIONS (preflight CORS)
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}