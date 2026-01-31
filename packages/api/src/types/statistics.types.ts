// packages/api/src/types/statistics.types.ts

export interface Statistics {
    nombreEtudiants: number;
    nombreEtudiantsActifs: number;
    nombreEtudiantsInactifs: number;
    nombreEnseignants: number;
    nombreCours: number;
    nombreModules: number;
    nombreDevoirsTotal: number;
    nombreDevoirsRendus: number;
    nombreDevoirsEnAttente: number;
    tauxRemiseDevoirs: number;
    moyenneGenerale: number;
    performanceParMatiere: Record<string, number>;
    nombreEtudiantsParMatiere: Record<string, number>;
    tauxReussite: number;
    nombreEtudiantsReussis: number;
    nombreEtudiantsEchoues: number;
}