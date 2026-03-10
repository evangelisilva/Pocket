import { useState } from 'react';
import { useLocation } from 'wouter';
import { useExpenses } from '../store/ExpenseContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MerchantInput } from '../components/MerchantInput';
import { formatForInput } from '../utils/dateUtils';

export const AddExpense = () => {
    const [, setLocation] = useLocation();
    const { addExpense, currentUser } = useExpenses();

    // Load any scanned data from sessionStorage
    const scannedDataRaw = sessionStorage.getItem('scannedReceiptData');
    let initialData = {};
    if (scannedDataRaw) {
        try {
            initialData = JSON.parse(scannedDataRaw);
            sessionStorage.removeItem('scannedReceiptData'); // Clear after loading
        } catch (e) {
            console.error("Failed to parse scanned data", e);
        }
    }

    const [formData, setFormData] = useState({
        type: initialData.type || 'expense',
        amount: initialData.amount || '',
        merchant: initialData.merchant || '',
        category: initialData.category || 'Groceries',
        paidBy: currentUser,
        date: formatForInput(initialData.date || new Date()),
        items: initialData.items || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.merchant) return;

        addExpense({
            ...formData,
            amount: parseFloat(formData.amount)
        });

        setLocation('/');
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTypeToggle = (type) => {
        setFormData(prev => ({
            ...prev,
            type,
            category: type === 'income' ? 'Salary' : 'Groceries',
            items: type === 'income' ? [] : prev.items // Clear items if switching to income
        }));
    };

    const handleItemChange = (index, field, value) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { name: '', price: '' }]
        }));
    };

    return (
        <div>
            <h1 className="text-h2 mb-6">Add Expense</h1>

            <Card>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Segmented Control for Type */}
                    <div className="flex p-1 mb-2" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <button
                            type="button"
                            onClick={() => handleTypeToggle('expense')}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '600',
                                backgroundColor: formData.type === 'expense' ? 'var(--bg-tertiary)' : 'transparent',
                                color: formData.type === 'expense' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                boxShadow: formData.type === 'expense' ? 'var(--shadow-sm)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeToggle('income')}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '600',
                                backgroundColor: formData.type === 'income' ? 'var(--bg-tertiary)' : 'transparent',
                                color: formData.type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                                boxShadow: formData.type === 'income' ? 'var(--shadow-sm)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            Income
                        </button>
                    </div>

                    <div>
                        <label className="text-small mb-1 block">Amount ($)</label>
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            required
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-small mb-1 block">
                            {formData.type === 'expense' ? 'Merchant' : 'Source'}
                        </label>

                        <MerchantInput
                            value={formData.merchant}
                            onChange={handleChange}
                            placeholder={formData.type === 'expense' ? "e.g. Target, Costco" : "e.g. Employer, Client"}
                        />
                    </div>

                    <div>
                        <label className="text-small mb-1 block">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            {formData.type === 'expense' ? (
                                <>
                                    <option value="Groceries">Groceries</option>
                                    <option value="Dining Out">Dining Out</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Home">Home</option>
                                    <option value="Credit Card Payment">Credit Card Payment</option>
                                    <option value="Savings">Savings</option>
                                    <option value="Investments">Investments</option>
                                    <option value="Other">Other</option>
                                </>
                            ) : (
                                <>
                                    <option value="Salary">Salary</option>
                                    <option value="Bonus">Bonus</option>
                                    <option value="Gift">Gift</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Interest">Interest</option>
                                    <option value="Refunds">Refunds</option>
                                    <option value="Other">Other</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="text-small mb-1 block">Paid By</label>
                        <select name="paidBy" value={formData.paidBy} onChange={handleChange}>
                            <option value="Evangeli">Evangeli</option>
                            <option value="Heshan">Heshan</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-small mb-1 block">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {formData.type === 'expense' && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-small font-semibold">Receipt Items</label>
                                <button type="button" onClick={addItem} style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>+ Add Item</button>
                            </div>
                            {formData.items.length === 0 && (
                                <p className="text-small mb-2" style={{ fontStyle: 'italic' }}>No items added.</p>
                            )}
                            {formData.items.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2 items-center">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                        placeholder="Item name"
                                        style={{ flex: 1, padding: '0.5rem' }}
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                        placeholder="Price"
                                        style={{ width: '100px', padding: '0.5rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        style={{ color: 'var(--danger)', padding: '0.5rem' }}
                                        title="Remove Item"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button type="submit" className="mt-4">
                        {formData.type === 'expense' ? 'Save Expense' : 'Save Income'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};
