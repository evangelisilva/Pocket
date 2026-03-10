import { useState } from 'react';
import { format } from 'date-fns';
import { Card } from './Card';
import { useExpenses } from '../store/ExpenseContext';
import { Trash2, Edit2, Store, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation } from 'wouter';
import { getMerchantLogoUrl } from '../utils/merchants';
import { parseLocalDate } from '../utils/dateUtils';

export const TransactionList = ({ transactions }) => {
    const { deleteExpense } = useExpenses();
    const [, setLocation] = useLocation();
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [visibleCount, setVisibleCount] = useState(10);

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    if (!transactions || transactions.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center mt-4">
                <p className="text-body mb-2">No expenses yet</p>
                <p className="text-small">Add your first expense or scan a receipt.</p>
            </Card>
        );
    }

    const visibleTransactions = transactions.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    return (
        <div className="flex flex-col gap-4 mt-4 relative pb-16">
            {visibleTransactions.map((t) => {
                const logoUrl = getMerchantLogoUrl(t.merchant);
                return (
                    <Card key={t.id} className="flex flex-col gap-2 relative" style={{ padding: '1rem' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    {logoUrl ? (
                                        <img
                                            src={logoUrl}
                                            alt={t.merchant}
                                            style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '4px' }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                if (e.currentTarget.nextElementSibling) {
                                                    e.currentTarget.nextElementSibling.style.display = 'block';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <Store size={20} style={{ display: logoUrl ? 'none' : 'block', color: 'var(--text-muted)' }} />
                                </div>
                                <div className="flex flex-col flex-1" style={{ paddingRight: '5rem' }}>
                                    <div className="flex items-baseline justify-between w-full">
                                        <span className="font-semibold text-body" style={{ color: 'var(--text-primary)' }}>{t.merchant}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{t.category}</span>
                                        <span className="text-small" style={{ color: 'var(--border-color)' }}>•</span>
                                        <span className="text-small" style={{ color: 'var(--text-muted)' }}>{format(parseLocalDate(t.date), 'MMM d, yyyy')}</span>
                                    </div>
                                    <span className="text-small" style={{ color: 'var(--accent-primary)', marginTop: '0.25rem', display: 'inline-block' }}>
                                        {t.type === 'income' ? 'Earned by ' : 'Paid by '}{t.paidBy}
                                    </span>
                                </div>
                            </div>

                            {/* Absolutely positioned details & action buttons for perfect right alignment */}
                            <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                <div className="text-h3 text-right" style={{ fontWeight: '600', color: t.type === 'income' ? 'var(--success)' : 'var(--text-primary)', lineHeight: '1.2' }}>
                                    {t.type === 'income' ? '+' : ''}${parseFloat(t.amount).toFixed(2)}
                                </div>
                                <div className="flex gap-1 justify-end">
                                    <button
                                        onClick={() => setLocation(`/edit/${t.id}`)}
                                        style={{ color: 'var(--text-secondary)', padding: '0.25rem', opacity: 0.7 }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                                        title="Edit Expense"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteExpense(t.id)}
                                        style={{ color: 'var(--danger)', padding: '0.25rem', opacity: 0.7 }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                                        title="Delete Expense"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {t.items && t.items.length > 0 && (
                            <div className="mt-2 pt-3" style={{ borderTop: '1px dashed var(--border-color)' }}>
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleExpand(t.id)}
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    <span className="text-small font-semibold flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                        {t.items.length} Items Included
                                    </span>
                                    <button style={{ color: 'var(--text-muted)' }}>
                                        {expandedIds.has(t.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                                {expandedIds.has(t.id) && (
                                    <div className="flex flex-col gap-2 mt-3 pl-3 border-l-2" style={{ borderColor: 'var(--bg-secondary)' }}>
                                        {t.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-small" style={{ color: 'var(--text-secondary)' }}>
                                                <span>{item.name || 'Unknown Item'}</span>
                                                <span style={{ fontWeight: '500' }}>${parseFloat(item.price || 0).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                );
            })}

            {visibleCount < transactions.length && (
                <div className="flex justify-center mt-2 mb-4">
                    <button
                        onClick={handleLoadMore}
                        style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: 'transparent',
                            color: 'var(--accent-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-full, 9999px)',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Load More ({transactions.length - visibleCount} hidden)
                        <ChevronDown size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
