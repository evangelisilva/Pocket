import { useState, useRef, useEffect } from 'react';
import { POPULAR_MERCHANTS, getMerchantLogoUrl } from '../utils/merchants';
import { Store } from 'lucide-react';

export const MerchantInput = ({ value, onChange, placeholder = "e.g. Target, Costco" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filtered, setFiltered] = useState(POPULAR_MERCHANTS);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const text = e.target.value;
        onChange(e);
        setFiltered(POPULAR_MERCHANTS.filter(m => m.name.toLowerCase().includes(text.toLowerCase())));
        setIsOpen(true);
    };

    const selectMerchant = (merchantName) => {
        onChange({ target: { name: 'merchant', value: merchantName } });
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                name="merchant"
                required
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                autoComplete="off"
            />

            {isOpen && (filtered.length > 0 || value) && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 100,
                    boxShadow: 'var(--shadow-md)',
                    listStyle: 'none'
                }}>
                    {filtered.map(m => (
                        <li
                            key={m.name}
                            onClick={() => selectMerchant(m.name)}
                            className="flex items-center gap-4 p-2 cursor-pointer hover:bg-secondary"
                            style={{ cursor: 'pointer', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <img
                                src={getMerchantLogoUrl(m.name)}
                                alt={m.name}
                                style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'contain' }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                        e.currentTarget.nextElementSibling.style.display = 'block';
                                    }
                                }}
                            />
                            <Store size={24} style={{ display: 'none', color: 'var(--text-muted)' }} />
                            <span>{m.name}</span>
                        </li>
                    ))}
                    {/* Custom entry if not exactly matching any known */}
                    {value && !filtered.find(m => m.name.toLowerCase() === value.toLowerCase()) && (
                        <li
                            onClick={() => selectMerchant(value)}
                            className="flex items-center gap-4 p-2 cursor-pointer hover:bg-secondary"
                            style={{ cursor: 'pointer', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Store size={24} style={{ color: 'var(--text-muted)' }} />
                            <span>Use "{value}"</span>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};
