import { useState } from 'react';
import { useExpenses } from '../store/ExpenseContext';
import { Card } from '../components/Card';
import { TransactionList } from '../components/TransactionList';
import { Filter, ArrowRight } from 'lucide-react';
import { parseLocalDate } from '../utils/dateUtils';

export const Dashboard = () => {
    const { expenses } = useExpenses();

    // Filters State
    const [filterUser, setFilterUser] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterMerchants, setFilterMerchants] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Fixed Merchant List for Filters
    const filterMerchantList = ['Walmart', 'Amazon', 'Market 32', 'Weee!', 'Other'];

    // Fixed Category Master List & Deduplication
    const defaultCategories = [
        'Bonus', 'Credit Card', 'Dining Out', 'Education', 'Entertainment', 'Food',
        'Government', 'Groceries', 'Health', 'Home', 'Interest', 'Investment',
        'Other', 'Personal Care', 'Refunds', 'Salary', 'Shopping', 'Technology',
        'Transport', 'Travel', 'Utilities', 'Work'
    ];

    // Map common variations to their master category
    const categoryNormalizationMap = {
        'investments': 'Investment',
        'credit card payment': 'Credit Card',
        'credit card payments': 'Credit Card',
        'grocery': 'Groceries',
        'dining': 'Dining Out',
        'restaurant': 'Dining Out',
        'auto': 'Transport',
        'gas': 'Transport'
    };

    const normalizeCategory = (cat) => {
        if (!cat) return '';
        const clean = cat.trim();
        const lower = clean.toLowerCase();
        // Check if there's a mapped master category (case-insensitive key)
        if (categoryNormalizationMap[lower]) {
            return categoryNormalizationMap[lower];
        }
        return clean;
    };

    const categoriesMap = new Map();
    defaultCategories.forEach(c => categoriesMap.set(c.toLowerCase(), c));

    expenses.forEach(e => {
        if (e.category) {
            const normalized = normalizeCategory(e.category);
            if (normalized && !categoriesMap.has(normalized.toLowerCase())) {
                categoriesMap.set(normalized.toLowerCase(), normalized);
            }
        }
    });

    const categories = ['All', ...Array.from(categoriesMap.values()).sort((a, b) => a.localeCompare(b))];

    // Apply Filters to Transactions
    const filteredTransactions = expenses.filter(t => {
        const matchesUser = filterUser === 'All' || t.paidBy === filterUser;
        const matchesType = filterType === 'All' || t.type === filterType;
        const matchesCategory = filterCategory === 'All' ||
            (t.category && normalizeCategory(t.category).toLowerCase() === filterCategory.toLowerCase());

        let matchesMerchant = true;
        if (filterMerchants.length > 0) {
            const isKnownMerchant = filterMerchantList.includes(t.merchant);
            const includesOther = filterMerchants.includes('Other');
            const matchesSpecific = filterMerchants.includes(t.merchant);
            const matchesOther = includesOther && (!isKnownMerchant || t.merchant === 'Other');

            matchesMerchant = matchesSpecific || matchesOther;
        }

        let matchesDate = true;
        const tDate = parseLocalDate(t.date).getTime();

        if (startDate) {
            const start = new Date(startDate).getTime();
            if (tDate < start) matchesDate = false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (tDate > end.getTime()) matchesDate = false;
        }

        return matchesUser && matchesType && matchesCategory && matchesMerchant && matchesDate;
    });

    const toggleMerchant = (merchant) => {
        setFilterMerchants(prev =>
            prev.includes(merchant)
                ? prev.filter(m => m !== merchant)
                : [...prev, merchant]
        );
    };

    const incomes = filteredTransactions.filter(e => e.type === 'income');
    const expensesOnly = filteredTransactions.filter(e => e.type === 'expense');

    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalSpent = expensesOnly.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const balance = totalIncome - totalSpent;

    // Calculate who paid what
    const youSpent = expensesOnly
        .filter(e => e.paidBy === 'Evangeli')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const husbandSpent = expensesOnly
        .filter(e => e.paidBy === 'Heshan')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Calculate who earned what
    const youIncome = incomes
        .filter(e => e.paidBy === 'Evangeli')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const husbandIncome = incomes
        .filter(e => e.paidBy === 'Heshan')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <h1 className="text-h1 mb-10 tracking-tight">Family Expenses</h1>

            {/* Total Balance Card */}
            <Card className="mb-10 bg-secondary border-none shadow-none" style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem' }}>
                <p className="text-body mb-1" style={{ color: 'var(--text-secondary)' }}>Total Balance</p>
                <h2 className="text-h1" style={{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    ${balance.toFixed(2)}
                </h2>
                <div className="flex gap-4 mt-4 text-small">
                    <div className="flex flex-col">
                        <span style={{ color: 'var(--text-secondary)' }}>Income</span>
                        <span style={{ color: 'var(--success)', fontWeight: '600' }}>+${totalIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span style={{ color: 'var(--text-secondary)' }}>Expenses</span>
                        <span style={{ color: 'var(--danger)', fontWeight: '600' }}>-${totalSpent.toFixed(2)}</span>
                    </div>
                </div>
            </Card>

            {/* Breakdown Grid */}
            <h3 className="text-h3 mb-2">Breakdown</h3>
            <div className="flex gap-4 mb-8">
                <Card className="flex-1 bg-secondary border-none" style={{ padding: '1rem' }}>
                    <p className="text-body mb-1" style={{ color: 'var(--text-secondary)' }}>Evangeli</p>
                    <h2 className="text-h2" style={{ color: (youIncome - youSpent) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {(youIncome - youSpent) >= 0 ? '+' : '-'}${Math.abs(youIncome - youSpent).toFixed(2)}
                    </h2>
                    <div className="flex gap-4 mt-4 text-small">
                        <div className="flex flex-col">
                            <span style={{ color: 'var(--text-secondary)' }}>Income</span>
                            <span style={{ color: 'var(--success)', fontWeight: '600' }}>+${youIncome.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span style={{ color: 'var(--text-secondary)' }}>Expenses</span>
                            <span style={{ color: 'var(--danger)', fontWeight: '600' }}>-${youSpent.toFixed(2)}</span>
                        </div>
                    </div>
                </Card>
                <Card className="flex-1 bg-secondary border-none" style={{ padding: '1rem' }}>
                    <p className="text-body mb-1" style={{ color: 'var(--text-secondary)' }}>Heshan</p>
                    <h2 className="text-h2" style={{ color: (husbandIncome - husbandSpent) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {(husbandIncome - husbandSpent) >= 0 ? '+' : '-'}${Math.abs(husbandIncome - husbandSpent).toFixed(2)}
                    </h2>
                    <div className="flex gap-4 mt-4 text-small">
                        <div className="flex flex-col">
                            <span style={{ color: 'var(--text-secondary)' }}>Income</span>
                            <span style={{ color: 'var(--success)', fontWeight: '600' }}>+${husbandIncome.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span style={{ color: 'var(--text-secondary)' }}>Expenses</span>
                            <span style={{ color: 'var(--danger)', fontWeight: '600' }}>-${husbandSpent.toFixed(2)}</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Transactions Section */}
            <div className="mb-4">
                <h3 className="text-h3 mb-6">Recent Transactions</h3>

                {/* Inline Filter Section (Toolbar Edition) */}
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Primary Toolbar Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <Filter size={18} style={{ color: 'var(--text-primary)' }} />
                        </div>

                        <div className="flex flex-1 items-center gap-2">
                            <select
                                value={filterUser}
                                onChange={(e) => setFilterUser(e.target.value)}
                                className="px-2.5 py-2 rounded-lg bg-secondary border border-border-color text-sm focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none appearance-none cursor-pointer flex-1"
                                style={{ minWidth: '95px', backgroundColor: 'var(--bg-secondary)', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.8em' }}
                            >
                                <option value="All">Everyone</option>
                                <option value="Evangeli">Evangeli</option>
                                <option value="Heshan">Heshan</option>
                            </select>

                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-2.5 py-2 rounded-lg bg-secondary border border-border-color text-sm focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none appearance-none cursor-pointer flex-1"
                                style={{ minWidth: '85px', backgroundColor: 'var(--bg-secondary)', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.8em' }}
                            >
                                <option value="All">All Types</option>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>

                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-2.5 py-2 rounded-lg bg-secondary border border-border-color text-sm focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none appearance-none cursor-pointer flex-1"
                                style={{ minWidth: '110px', backgroundColor: 'var(--bg-secondary)', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.8em' }}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat === 'All' ? 'Categories' : cat}</option>
                                ))}
                            </select>

                        </div>

                        <button
                            onClick={() => {
                                setFilterUser('All');
                                setFilterType('All');
                                setFilterCategory('All');
                                setFilterMerchants([]);
                                setStartDate('');
                                setEndDate('');
                            }}
                            className="text-sm text-accent-primary hover:opacity-80 transition-opacity flex-shrink-0 ml-2"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Time Period Filter (Full Width, No Labels) */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <input
                            type={startDate ? "date" : "text"}
                            placeholder="From"
                            onPointerDown={(e) => (e.currentTarget.type = "date")}
                            onBlur={(e) => (!e.target.value ? (e.target.type = "text") : null)}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-border-color text-sm focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none cursor-pointer"
                            style={{ backgroundColor: 'var(--bg-secondary)', color: startDate ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        />
                        <div className="flex-shrink-0 text-text-muted opacity-50">
                            <ArrowRight size={16} />
                        </div>
                        <input
                            type={endDate ? "date" : "text"}
                            placeholder="To"
                            onPointerDown={(e) => (e.currentTarget.type = "date")}
                            onBlur={(e) => (!e.target.value ? (e.target.type = "text") : null)}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-border-color text-sm focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none cursor-pointer"
                            style={{ backgroundColor: 'var(--bg-secondary)', color: endDate ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        />
                    </div>

                    <div className="mt-4 mb-6">
                        <div className="flex flex-wrap" style={{ gap: '2px' }}>
                            {filterMerchantList.map(m => {
                                const isActive = filterMerchants.includes(m);
                                return (
                                    <button
                                        key={m}
                                        onClick={() => toggleMerchant(m)}
                                        className={`quick-store-btn ${isActive ? 'active' : ''}`}
                                    >
                                        {m}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <TransactionList transactions={filteredTransactions} />
            </div>
        </div>
    );
};
