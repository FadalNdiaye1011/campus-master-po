'use client';

import { useEffect, useState } from 'react';
import { AuthService, User } from "@repo/auth/src";

export function useAdminAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            // Vérifier d'abord l'URL, puis le localStorage
            const currentUser =
                AuthService.getUserFromUrl() ||
                AuthService.getCurrentUser();

            console.log('🔍 Admin - Vérification auth:', currentUser);

            if (!currentUser) {
                console.log('❌ Admin - Pas d\'utilisateur, redirection vers login');
                // Utiliser getUrlForRole au lieu de localhost hardcodé
                const authUrl = AuthService.getUrlForRole('default');
                window.location.href = authUrl;
                return;
            }

            // Vérifier le rôle et rediriger si nécessaire
            if (currentUser.role !== 'admin') {
                console.log(`⚠️ Admin - Utilisateur est ${currentUser.role}, redirection vers son portail`);
                AuthService.redirectToRoleApp(currentUser.role);
                return;
            }

            console.log('✅ Admin - Utilisateur autorisé');
            setUser(currentUser);
            setLoading(false);
        };

        setTimeout(checkAuth, 100);
    }, []);

    return { user, loading };
}