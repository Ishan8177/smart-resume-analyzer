import { AnalysisSession } from '../types';

const STORAGE_KEY = 'smart_resume_analyzer_history_v1';

export function getHistory(): AnalysisSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load history from LocalStorage:', error);
    return [];
  }
}

export function saveSessionToHistory(session: Omit<AnalysisSession, 'id' | 'createdAt'>): AnalysisSession {
  const history = getHistory();
  
  const newSession: AnalysisSession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  // Keep up to 20 recent sessions
  const updatedHistory = [newSession, ...history].slice(0, 20);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save session to LocalStorage:', error);
  }

  return newSession;
}

export function updateSessionInHistory(updatedSession: AnalysisSession): AnalysisSession[] {
  const history = getHistory();
  const index = history.findIndex(s => s.id === updatedSession.id);
  if (index !== -1) {
    history[index] = updatedSession;
  } else {
    history.unshift(updatedSession);
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
  } catch (error) {
    console.error('Failed to update session in LocalStorage:', error);
  }
  return history;
}

export function deleteSessionFromHistory(id: string): AnalysisSession[] {
  const history = getHistory().filter(s => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to update history:', error);
  }
  return history;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
