import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';
import {
    TeacherSupportService,
} from '@repo/api';

interface AddSupportModalProps {
    courseId: number;
    courseName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddSupportModal: React.FC<AddSupportModalProps> = ({
                                                             courseId,
                                                             courseName,
                                                             onClose,
                                                             onSuccess,
                                                         }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState('');

    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        typeFichier: 'PDF',
    });

    /**
     * Gère la sélection du fichier
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Vérification de la taille (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                setError('Le fichier ne doit pas dépasser 50 MB');
                return;
            }

            setSelectedFile(file);

            // Détection automatique du type de fichier
            const extension = file.name.split('.').pop()?.toUpperCase();
            if (extension) {
                setFormData(prev => ({ ...prev, typeFichier: extension }));
            }

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
            const uploadedUrl = await TeacherSupportService.uploadFile(selectedFile);

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
     * Soumet le support
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fileUrl) {
            setError('Veuillez d\'abord uploader un fichier');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await TeacherSupportService.createSupport({
                titre: formData.titre,
                description: formData.description,
                urlFichier: fileUrl,
                typeFichier: formData.typeFichier,
                coursId: courseId,
            });

            alert('Support ajouté avec succès !');
            onSuccess();
        } catch (err: any) {
            console.error('❌ Erreur création:', err);
            setError(err.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
                    <div>
                        <h2 className="text-xl font-bold">Ajouter un support pédagogique</h2>
                        <p className="text-sm text-gray-600 mt-1">{courseName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        aria-label="Fermer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Fichier *</label>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id="support-file-upload"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.mp4,.mp3"
                            />
                            <label
                                htmlFor="support-file-upload"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <Upload size={48} className="text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600 mb-1">
                                    Cliquez pour sélectionner un fichier
                                </p>
                                <p className="text-xs text-gray-500">
                                    PDF, DOC, PPT, ZIP, Video, Audio (max 50MB)
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
                                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                </div>
                                            </div>
                                        </div>
                                        {!fileUrl && (
                                            <button
                                                type="button"
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
                                    <span>Fichier prêt à être ajouté</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Titre *</label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Cours chapitre 1"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Description du support..."
                        />
                    </div>

                    {/* Type de fichier */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Type de fichier</label>
                        <select
                            name="typeFichier"
                            value={formData.typeFichier}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="PDF">PDF</option>
                            <option value="DOC">DOC</option>
                            <option value="DOCX">DOCX</option>
                            <option value="PPT">PPT</option>
                            <option value="PPTX">PPTX</option>
                            <option value="ZIP">ZIP</option>
                            <option value="RAR">RAR</option>
                            <option value="MP4">MP4 (Vidéo)</option>
                            <option value="MP3">MP3 (Audio)</option>
                            <option value="OTHER">Autre</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || !fileUrl}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ajout...
                </span>
                            ) : (
                                'Ajouter le support'
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
                </form>
            </div>
        </div>
    );
};

export default AddSupportModal;