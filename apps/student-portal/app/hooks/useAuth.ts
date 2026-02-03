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


            if (!currentUser) {

                const authUrl = AuthService.getUrlForRole('default');
                window.location.href = authUrl;
                return;
            }

            // Utiliser getRedirectPath pour rediriger vers le bon portail
            if (currentUser.role !== 'student') {
                console.log(`⚠️ Student - Utilisateur est ${currentUser.role}, redirection vers son portail`);
                // const redirectUrl = AuthService.getRedirectPath(currentUser);
                // window.location.href = redirectUrl;
                return;
            }

            console.log('✅ Student - Utilisateur autorisé');
            setUser(currentUser);
            setLoading(false);
        };

        setTimeout(checkAuth, 100);
    }, []);

    return { user, loading };
}