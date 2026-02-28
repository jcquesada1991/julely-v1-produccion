import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Link, X, Image as ImageIcon, Loader } from 'lucide-react';

/**
 * ImageUploader — Componente reutilizable para subir imágenes.
 * Soporta dos modos:
 *   1. Subir archivo desde el dispositivo (→ Supabase Storage)
 *   2. Pegar una URL externa directamente
 *
 * Props:
 *   value        — URL actual de la imagen (string)
 *   onChange     — función(url: string) que recibe la URL resultante
 *   bucket       — nombre del bucket en Supabase Storage (default: 'product-gallery')
 *   folder       — subcarpeta dentro del bucket (default: 'uploads')
 *   label        — texto del label (default: 'Imagen')
 *   placeholder  — texto del input URL (default: 'https://...')
 */
export default function ImageUploader({
    value = '',
    onChange,
    bucket = 'product-gallery',
    folder = 'uploads',
    label = 'Imagen',
    placeholder = 'https://...',
    disableUrl = false,
    multiple = false,
    maxFiles = 3,
    maxSizeMB = 10,
}) {
    const [mode, setMode] = useState(disableUrl ? 'upload' : 'url'); // 'url' | 'upload'
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (multiple && files.length > maxFiles) {
            setError(`Puedes subir un máximo de ${maxFiles} archivos a la vez.`);
            return;
        }

        // Validar tipos y tamaños
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Solo se permiten imágenes (JPG, PNG, WebP, etc.)');
                return;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                setError(`Alguna imagen supera los ${maxSizeMB} MB permitidos.`);
                return;
            }
        }

        setError('');
        setUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const ext = file.name.split('.').pop();
                const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(fileName);

                return publicUrl;
            });

            const publicUrls = await Promise.all(uploadPromises);

            if (multiple) {
                // Return array of urls if multiple
                onChange(publicUrls);
            } else {
                // Return single url
                onChange(publicUrls[0]);
            }
        } catch (err) {
            setError('Error al subir imagen(es): ' + (err.message || 'Inténtalo de nuevo'));
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const clearImage = () => {
        onChange('');
        setError('');
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        background: 'var(--bg-main)',
        color: 'var(--text-primary)',
        boxSizing: 'border-box',
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            {/* Label + toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {label}
                </label>
                {!disableUrl && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={() => setMode('url')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.3rem 0.7rem', borderRadius: '6px', cursor: 'pointer',
                                fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-color)',
                                background: mode === 'url' ? 'var(--primary-color)' : 'transparent',
                                color: mode === 'url' ? 'white' : 'var(--text-secondary)',
                            }}
                        >
                            <Link size={12} /> URL
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('upload')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.3rem 0.7rem', borderRadius: '6px', cursor: 'pointer',
                                fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-color)',
                                background: mode === 'upload' ? 'var(--primary-color)' : 'transparent',
                                color: mode === 'upload' ? 'white' : 'var(--text-secondary)',
                            }}
                        >
                            <Upload size={12} /> Subir archivo
                        </button>
                    </div>
                )}
            </div>

            {/* Mode: URL */}
            {!disableUrl && mode === 'url' && (
                <input
                    type="text"
                    style={inputStyle}
                    value={typeof value === 'string' ? value : ''}
                    onChange={(e) => { onChange(e.target.value); setError(''); }}
                    placeholder={placeholder}
                />
            )}

            {/* Mode: Upload */}
            {mode === 'upload' && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple={multiple}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        style={{
                            width: '100%', padding: '2rem', border: '2px dashed var(--border-color)',
                            borderRadius: '10px', background: 'var(--bg-card-hover)',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            color: 'var(--text-secondary)', display: 'flex',
                            flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.borderColor = 'var(--primary-color)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        {uploading ? (
                            <>
                                <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                <span>Subiendo imagen...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={24} />
                                <span style={{ fontWeight: 600 }}>Haz clic para seleccionar imagen{multiple ? ' (hasta 3)' : ''}</span>
                                <span style={{ fontSize: '0.75rem' }}>JPG, PNG, WebP · Máx {maxSizeMB} MB {multiple ? 'en total' : ''}</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ marginTop: '0.4rem', color: '#EF4444', fontSize: '0.8rem' }}>
                    {error}
                </div>
            )}

            {/* Preview (only for single value) */}
            {!multiple && value && typeof value === 'string' && (
                <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                    <img
                        src={value}
                        alt="Vista previa"
                        style={{
                            height: '100px', width: '160px', objectFit: 'cover',
                            borderRadius: '8px', border: '1px solid var(--border-color)',
                            display: 'block',
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <button
                        type="button"
                        onClick={clearImage}
                        style={{
                            position: 'absolute', top: '-8px', right: '-8px',
                            background: '#EF4444', color: 'white', border: 'none',
                            borderRadius: '50%', width: '22px', height: '22px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', padding: 0,
                        }}
                    >
                        <X size={12} />
                    </button>
                </div>
            )}

            {/* Spin animation (inline keyframes workaround) */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
