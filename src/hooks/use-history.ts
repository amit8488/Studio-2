'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, orderBy, serverTimestamp, Timestamp, limit, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
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
    const { toast } = useToast();

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        if (user) {
            try {
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
            } catch (error: any) {
                console.error("Error fetching history:", error);
                toast({
                    variant: "destructive",
                    title: "History Error",
                    description: "Could not load history. Please ensure Firestore is enabled and security rules are set.",
                });
                setHistory([]);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const stored = localStorage.getItem('conversionHistory');
                const allHistory: HistoryItem[] = stored ? JSON.parse(stored) : [];
                const pageHistory = allHistory
                    .filter(item => item.sourcePage === sourcePage)
                    .map(item => ({...item, createdAt: new Date(item.id)}));
                setHistory(pageHistory);
            } catch (e) {
                console.error("Failed to load history from local storage", e);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        }
    }, [user, sourcePage, toast]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const addHistory = useCallback(async (item: Omit<HistoryItem, 'id' | 'createdAt' | 'userId'>) => {
        if (user) {
            try {
                const newItem = { ...item, userId: user.uid, createdAt: serverTimestamp() };
                // Check if the same item already exists to avoid duplicates
                const q = query(collection(db, HISTORY_COLLECTION), 
                    where('userId', '==', user.uid), 
                    where('sourcePage', '==', item.sourcePage), 
                    where('input.value', '==', item.input.value), 
                    where('input.unit', '==', item.input.unit)
                );
                const snapshot = await getDocs(q);
                if(snapshot.empty) {
                    await addDoc(collection(db, HISTORY_COLLECTION), newItem);
                }
                await fetchHistory();
            } catch (error: any) {
                console.error("Error adding history:", error);
                toast({
                    variant: "destructive",
                    title: "History Error",
                    description: "Could not save item to history.",
                });
            }
        } else {
            const newItem: HistoryItem = { ...item, id: new Date().toISOString(), createdAt: new Date() };
            
            const stored = localStorage.getItem('conversionHistory');
            let allHistory: any[] = stored ? JSON.parse(stored) : [];

            allHistory = allHistory.filter(i => 
                !(i.sourcePage === item.sourcePage && i.input.unit === item.input.unit && i.input.value === item.input.value)
            );

            const newAllHistory = [newItem, ...allHistory];
            
            const pageHistory = newAllHistory.filter(i => i.sourcePage === sourcePage).slice(0,10);
            const otherPageHistory = newAllHistory.filter(i => i.sourcePage !== sourcePage);

            localStorage.setItem('conversionHistory', JSON.stringify([...pageHistory, ...otherPageHistory]));
            setHistory(pageHistory.map(item => ({...item, createdAt: new Date(item.id)})));
        }
    }, [user, fetchHistory, sourcePage, toast]);

    const clearHistory = useCallback(async () => {
        if (user) {
            try {
                const q = query(collection(db, HISTORY_COLLECTION), where('userId', '==', user.uid), where('sourcePage', '==', sourcePage));
                const snapshot = await getDocs(q);
                await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
                setHistory([]);
            } catch (error: any) {
                console.error("Error clearing history:", error);
                toast({
                    variant: "destructive",
                    title: "History Error",
                    description: "Could not clear history.",
                });
            }
        } else {
            const stored = localStorage.getItem('conversionHistory');
            const allHistory: HistoryItem[] = stored ? JSON.parse(stored) : [];
            const otherPageHistory = allHistory.filter(i => i.sourcePage !== sourcePage);
            localStorage.setItem('conversionHistory', JSON.stringify(otherPageHistory));
            setHistory([]);
        }
    }, [user, sourcePage, toast]);

    return { history, loading, addHistory, clearHistory };
};
