'use client';

import { useEffect, useState } from 'react';
import { AuthService, User } from "@repo/auth/src";

export function useTeacherAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            // Vérifier d'abord l'URL, puis le localStorage
            const currentUser =
                AuthService.getUserFromUrl() ||
                AuthService.getCurrentUser();

            console.log('🔍 teacher - Vérification auth:', currentUser);

            if (!currentUser) {
                console.log('❌ teacher - Pas d\'utilisateur, redirection vers login');
                window.location.href = 'http://localhost:3000';
                return;
            }

            // Utiliser getRedirectPath pour rediriger vers le bon portail
            if (currentUser.role !== 'professor') {
                console.log(`⚠️ teacher - Utilisateur est ${currentUser.role}, redirection vers son portail`);
                // const redirectUrl = AuthService.getRedirectPath(currentUser);
                // window.location.href = redirectUrl;
                return;
            }

            console.log('✅ teacher - Utilisateur autorisé');
            setUser(currentUser);
            setLoading(false);
        };

        setTimeout(checkAuth, 100);
    }, []);

    return { user, loading };
}