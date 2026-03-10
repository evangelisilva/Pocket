import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [currentUser] = useState('Evangeli'); // Mock logged in user
    const [loading, setLoading] = useState(true);

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
        if (categoryNormalizationMap[lower]) {
            return categoryNormalizationMap[lower];
        }
        return clean;
    };

    // Subscribe to Firestore updates
    useEffect(() => {
        const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenseData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                category: normalizeCategory(doc.data().category)
            }));
            setExpenses(expenseData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addExpense = async (newExpense) => {
        try {
            await addDoc(collection(db, 'expenses'), {
                ...newExpense,
                type: newExpense.type || 'expense',
                category: normalizeCategory(newExpense.category),
                date: newExpense.date || new Date().toISOString(),
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding expense: ", error);
        }
    };

    const updateExpense = async (id, updatedExpense) => {
        try {
            const expenseRef = doc(db, 'expenses', id);
            await updateDoc(expenseRef, {
                ...updatedExpense,
                category: updatedExpense.category ? normalizeCategory(updatedExpense.category) : undefined
            });
        } catch (error) {
            console.error("Error updating expense: ", error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await deleteDoc(doc(db, 'expenses', id));
        } catch (error) {
            console.error("Error deleting expense: ", error);
        }
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense, currentUser, loading }}>
            {children}
        </ExpenseContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useExpenses = () => useContext(ExpenseContext);
