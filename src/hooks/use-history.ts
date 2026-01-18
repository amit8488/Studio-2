'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, orderBy, serverTimestamp, Timestamp, limit, deleteDoc, doc } from 'firebase/firestore';
import { type ConversionInput, type ConversionResult } from '@/lib/conversion';

export type HistoryItem = {
    id: string;
    input: ConversionInput;
    result: ConversionResult;
    sourcePage: 'home' | 'seven-twelve';
    sevenTwelveInput?: { hectare: string; are: string; sqm: string };
    createdAt: Date;
    userId?: string;
};

const HISTORY_COLLECTION = 'history';

export const useHistory = (sourcePage: 'home' | 'seven-twelve') => {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        if (user) {
            const q = query(collection(db, HISTORY_COLLECTION), where('userId', '==', user.uid), where('sourcePage', '==', sourcePage), orderBy('createdAt', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(d => {
                const data = d.data();
                return {
                    ...data,
                    id: d.id,
                    createdAt: (data.createdAt as Timestamp).toDate(),
                } as HistoryItem;
            });
            setHistory(items);
        } else {
            try {
                const stored = localStorage.getItem('conversionHistory');
                const allHistory: HistoryItem[] = stored ? JSON.parse(stored) : [];
                const pageHistory = allHistory
                    .filter(item => item.sourcePage === sourcePage)
                    .map(item => ({...item, createdAt: new Date(item.id)})); // The id is the iso date string
                setHistory(pageHistory);
            } catch (e) {
                console.error("Failed to load history from local storage", e);
                setHistory([]);
            }
        }
        setLoading(false);
    }, [user, sourcePage]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const addHistory = useCallback(async (item: Omit<HistoryItem, 'id' | 'createdAt' | 'userId'>) => {
        if (user) {
            const newItem = { ...item, userId: user.uid, createdAt: serverTimestamp() };
            await addDoc(collection(db, HISTORY_COLLECTION), newItem);
            fetchHistory(); // refetch to get the new list with server-generated timestamp and order.
        } else {
            const newItem: HistoryItem = { ...item, id: new Date().toISOString(), createdAt: new Date() };
            
            const stored = localStorage.getItem('conversionHistory');
            let allHistory: any[] = stored ? JSON.parse(stored) : [];

            // filter out duplicates from all history for same source page and input
            allHistory = allHistory.filter(i => 
                !(i.sourcePage === item.sourcePage && i.input.unit === item.input.unit && i.input.value === item.input.value)
            );

            const newAllHistory = [newItem, ...allHistory];
            
            const pageHistory = newAllHistory.filter(i => i.sourcePage === sourcePage).slice(0,10);
            const otherPageHistory = newAllHistory.filter(i => i.sourcePage !== sourcePage);

            localStorage.setItem('conversionHistory', JSON.stringify([...pageHistory, ...otherPageHistory]));
            setHistory(pageHistory.map(item => ({...item, createdAt: new Date(item.id)})));
        }
    }, [user, fetchHistory, sourcePage]);

    const clearHistory = useCallback(async () => {
        if (user) {
            const q = query(collection(db, HISTORY_COLLECTION), where('userId', '==', user.uid), where('sourcePage', '==', sourcePage));
            const snapshot = await getDocs(q);
            await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
            setHistory([]);
        } else {
            const stored = localStorage.getItem('conversionHistory');
            const allHistory: HistoryItem[] = stored ? JSON.parse(stored) : [];
            const otherPageHistory = allHistory.filter(i => i.sourcePage !== sourcePage);
            localStorage.setItem('conversionHistory', JSON.stringify(otherPageHistory));
            setHistory([]);
        }
    }, [user, sourcePage]);

    return { history, loading, addHistory, clearHistory };
};
