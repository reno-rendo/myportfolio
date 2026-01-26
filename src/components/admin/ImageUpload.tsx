import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export function ImageUpload({ value, onChange, className = '' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onChange(data.url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
            setPreview(value || null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
            />

            {preview ? (
                <div className="relative group">
                    <img
                        src={preview.startsWith('data:') ? preview : `http://localhost:3000${preview}`}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-zinc-700"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? <Loader2 className="animate-spin" size={16} /> : 'Change'}
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={handleRemove}
                            disabled={uploading}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={24} />
                        </div>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-zinc-500 transition-colors"
                    disabled={uploading}
                >
                    {uploading ? (
                        <Loader2 className="animate-spin text-zinc-400" size={32} />
                    ) : (
                        <>
                            <Upload className="text-zinc-500" size={32} />
                            <span className="text-sm text-zinc-500">Click to upload image</span>
                            <span className="text-xs text-zinc-600">Recommended: 800x600px, max 5MB</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
