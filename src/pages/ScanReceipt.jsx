import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { UploadCloud, Loader2, Camera } from 'lucide-react';
import { scanReceipt } from '../services/geminiService';

export const ScanReceipt = () => {
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result.split(',')[1];

                try {
                    const data = await scanReceipt(base64String, file.type);

                    // Store the complete extracted data in sessionStorage to pass it safely (including the new items array)
                    sessionStorage.setItem('scannedReceiptData', JSON.stringify(data));
                    setLocation('/add');
                } catch (err) {
                    setError(err.message || 'Failed to scan receipt. Please try again.');
                    setLoading(false);
                }
            };

            reader.readAsDataURL(file);
        } catch {
            setError('Failed to read image file.');
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-h2 mb-6">Scan Receipt</h1>

            {error && (
                <Card className="mb-4 text-center p-4 border-danger" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
                    {error}
                </Card>
            )}

            <Card className="flex flex-col items-center justify-center text-center p-8 gap-4 border-dashed border-2 w-full">
                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Loader2 size={48} className="animate-spin" color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                        <p className="text-body font-semibold">Scanning Receipt...</p>
                        <p className="text-small">Gemini is extracting the details</p>
                    </div>
                ) : (
                    <>
                        <div style={{ backgroundColor: 'var(--accent-light)', padding: '1rem', borderRadius: '50%' }}>
                            <UploadCloud size={32} color="var(--accent-primary)" />
                        </div>
                        <div>
                            <h3 className="text-h3 mb-2">Upload a Receipt</h3>
                            <p className="text-small">
                                Take a picture of your receipt or upload an image. We'll use AI to extract the merchant, amount, category, and date automatically.
                            </p>
                        </div>

                        <div className="flex flex-row gap-4 w-full mt-4">
                            {/* Camera Input */}
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                id="receipt-camera"
                                className="hidden"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <Button
                                variant="primary"
                                onClick={() => document.getElementById('receipt-camera').click()}
                                className="flex-1 flex items-center justify-center gap-2 py-3"
                            >
                                <Camera size={18} />
                                <span className="text-center">Take Photo</span>
                            </Button>

                            {/* Gallery/File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                id="receipt-upload"
                                className="hidden"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <Button
                                variant="secondary"
                                onClick={() => document.getElementById('receipt-upload').click()}
                                className="flex-1 flex items-center justify-center gap-2 py-3"
                            >
                                <UploadCloud size={18} />
                                <span className="text-center">Upload Image</span>
                            </Button>
                        </div>
                    </>
                )}
            </Card>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
