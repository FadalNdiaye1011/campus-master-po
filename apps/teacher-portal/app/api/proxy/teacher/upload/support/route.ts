import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');

    console.log('========================================');
    console.log('📤 POST /api/proxy/teacher/upload/support');
    console.log('========================================');

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    // Récupère le FormData du request
    const formData = await request.formData();

    const response = await fetch(`${API_BASE_URL}/api/files/upload/support`, {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: formData,
    });

    console.log('📡 Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      return NextResponse.json(
        { error: 'Erreur upload', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Support file uploaded successfully');
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