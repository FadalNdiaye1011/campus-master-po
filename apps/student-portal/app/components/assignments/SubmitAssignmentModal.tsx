import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import {
    StudentAssignment,
    StudentSubmission,
    StudentSubmissionService,
} from '@repo/api';

interface SubmitAssignmentModalProps {
    assignment: StudentAssignment;
    onClose: () => void;
    onSuccess: () => void;
}

const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({
                                                                         assignment,
                                                                         onClose,
                                                                         onSuccess,
                                                                     }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState('');

    const [existingSubmission, setExistingSubmission] = useState<StudentSubmission | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(true);

    /**
     * Charge l'historique des soumissions
     */
    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoadingHistory(true);
                const history = await StudentSubmissionService.getSubmissionHistory(assignment.id);

                if (history.length > 0) {
                    // Prend la dernière soumission
                    setExistingSubmission(history[history.length - 1]);
                }
            } catch (err: any) {
                console.error('❌ Erreur chargement historique:', err);
            } finally {
                setLoadingHistory(false);
            }
        };

        loadHistory();
    }, [assignment.id]);

    /**
     * Gère la sélection du fichier
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Vérification de la taille (max 20MB)
            if (file.size > 20 * 1024 * 1024) {
                setError('Le fichier ne doit pas dépasser 20 MB');
                return;
            }

            setSelectedFile(file);
            setError('');
        }
    };

    /**
     * Upload le fichier
     */
    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Veuillez sélectionner un fichier');
            return;
        }

        try {
            setUploading(true);
            setError('');

            console.log('📤 Upload du fichier...');
            const uploadedUrl = await StudentSubmissionService.uploadFile(selectedFile);

            setFileUrl(uploadedUrl);
            console.log('✅ Fichier uploadé:', uploadedUrl);

            alert('Fichier uploadé avec succès !');
        } catch (err: any) {
            console.error('❌ Erreur upload:', err);
            setError(err.message || 'Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    };

    /**
     * Soumet le devoir
     */
    const handleSubmit = async () => {
        if (!fileUrl) {
            setError('Veuillez d\'abord uploader un fichier');
            return;
        }

        try {
            setLoading(true);
            setError('');

            if (existingSubmission) {
                // Modification d'une soumission existante
                console.log('✏️ Modification soumission');
                await StudentSubmissionService.updateSubmission(existingSubmission.id, {
                    devoirId: assignment.id,
                    fichierUrl: fileUrl,
                });
                alert('Soumission modifiée avec succès !');
            } else {
                // Nouvelle soumission
                console.log('➕ Nouvelle soumission');
                await StudentSubmissionService.submitAssignment({
                    devoirId: assignment.id,
                    fichierUrl: fileUrl,
                });
                alert('Devoir soumis avec succès !');
            }

            onSuccess();
        } catch (err: any) {
            console.error('❌ Erreur soumission:', err);
            setError(err.message || 'Erreur lors de la soumission');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Format de date
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Vérifie si la date limite est dépassée
     */
    const isExpired = new Date(assignment.dateLimite) < new Date();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-xl font-bold">
                        {existingSubmission ? 'Modifier ma soumission' : 'Soumettre le devoir'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        aria-label="Fermer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Assignment Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{assignment.titre}</h3>
                        <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                                <FileText size={14} />
                                <span>{assignment.coursNom}</span>
                            </div>
                            <div className={`flex items-center gap-1 ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                                <AlertCircle size={14} />
                                <span>Limite: {formatDate(assignment.dateLimite)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Expired Warning */}
                    {isExpired && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <AlertCircle size={20} />
                            <span>La date limite de ce devoir est dépassée</span>
                        </div>
                    )}

                    {/* Loading History */}
                    {loadingHistory && (
                        <div className="flex items-center justify-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600" />
                        </div>
                    )}

                    {/* Existing Submission Info */}
                    {!loadingHistory && existingSubmission && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <CheckCircle size={20} />
                                <span className="font-semibold">Vous avez déjà soumis ce devoir</span>
                            </div>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>Date de soumission: {formatDate(existingSubmission.dateSoumission)}</p>
                                {existingSubmission.note !== null && (
                                    <p className="font-semibold">Note: {existingSubmission.note}/20</p>
                                )}
                                {existingSubmission.feedback && (
                                    <p>Feedback: {existingSubmission.feedback}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {existingSubmission ? 'Modifier le fichier' : 'Fichier à soumettre'} *
                        </label>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.zip,.rar"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <Upload size={48} className="text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600 mb-1">
                                    Cliquez pour sélectionner un fichier
                                </p>
                                <p className="text-xs text-gray-500">
                                    PDF, DOC, DOCX, ZIP, RAR (max 20MB)
                                </p>
                            </label>

                            {selectedFile && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText size={20} className="text-blue-600" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {selectedFile.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                </div>
                                            </div>
                                        </div>
                                        {!fileUrl && (
                                            <button
                                                onClick={handleUpload}
                                                disabled={uploading}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                            >
                                                {uploading ? (
                                                    <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Upload...
                          </span>
                                                ) : (
                                                    'Uploader'
                                                )}
                                            </button>
                                        )}
                                        {fileUrl && (
                                            <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={16} />
                        Uploadé
                      </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {fileUrl && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 text-green-800 text-sm">
                                    <CheckCircle size={16} />
                                    <span>Fichier prêt pour la soumission</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !fileUrl || isExpired}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Soumission...
                </span>
                            ) : existingSubmission ? (
                                'Modifier la soumission'
                            ) : (
                                'Soumettre le devoir'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitAssignmentModal;