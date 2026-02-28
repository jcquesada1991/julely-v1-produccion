import { useState, useCallback, createContext, useContext } from 'react';

/* ─────────────────── context ─────────────────── */
const ConfirmCtx = createContext(null);

export function useConfirm() {
    return useContext(ConfirmCtx);
}

/* ─────────────────── provider ─────────────────── */
export function ConfirmProvider({ children }) {
    const [state, setState] = useState(null); // { title, message, resolve }

    const confirm = useCallback((title, message, options = {}) => {
        return new Promise((resolve) => {
            setState({ title, message, resolve, options });
        });
    }, []);

    const handleConfirm = () => {
        state?.resolve(true);
        setState(null);
    };

    const handleCancel = () => {
        state?.resolve(false);
        setState(null);
    };

    return (
        <ConfirmCtx.Provider value={confirm}>
            {children}
            {state && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(30,30,50,0.95), rgba(20,20,35,0.98))',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '420px',
                        width: '90%',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                        animation: 'confirmFadeIn 0.2s ease-out',
                    }}>
                        {/* Icon */}
                        {state.options?.icon === 'alert' ? (
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: 'rgba(234,179,8,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1rem',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                        ) : (
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: 'rgba(239,68,68,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1rem',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                            </div>
                        )}

                        {/* Title */}
                        <h3 style={{
                            color: '#fff', fontSize: '1.2rem', fontWeight: 600,
                            textAlign: 'center', margin: '0 0 0.5rem',
                        }}>{state.title}</h3>

                        {/* Message */}
                        <p style={{
                            color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                            textAlign: 'center', margin: '0 0 1.5rem', lineHeight: 1.5,
                        }}>{state.message}</p>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={handleCancel}
                                style={{
                                    flex: 1, padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '10px', color: '#fff',
                                    fontSize: '0.9rem', fontWeight: 500,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
                                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
                            >
                                Cancelar
                            </button>
                            {state.options?.confirmText ? (
                                <button
                                    onClick={handleConfirm}
                                    autoFocus
                                    style={{
                                        flex: 1, padding: '0.75rem 1rem',
                                        background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                                        border: 'none',
                                        borderRadius: '10px', color: '#fff',
                                        fontSize: '0.9rem', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        boxShadow: '0 4px 15px rgba(234,179,8,0.3)',
                                    }}
                                    onMouseEnter={e => e.target.style.boxShadow = '0 6px 20px rgba(234,179,8,0.5)'}
                                    onMouseLeave={e => e.target.style.boxShadow = '0 4px 15px rgba(234,179,8,0.3)'}
                                >
                                    {state.options?.confirmText}
                                </button>
                            ) : (
                                <button
                                    onClick={handleConfirm}
                                    autoFocus
                                    style={{
                                        flex: 1, padding: '0.75rem 1rem',
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        border: 'none',
                                        borderRadius: '10px', color: '#fff',
                                        fontSize: '0.9rem', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        boxShadow: '0 4px 15px rgba(239,68,68,0.3)',
                                    }}
                                    onMouseEnter={e => e.target.style.boxShadow = '0 6px 20px rgba(239,68,68,0.5)'}
                                    onMouseLeave={e => e.target.style.boxShadow = '0 4px 15px rgba(239,68,68,0.3)'}
                                >
                                    Sí, eliminar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* animation keyframes */}
                    <style>{`
                        @keyframes confirmFadeIn {
                            from { opacity: 0; transform: scale(0.9); }
                            to   { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}
        </ConfirmCtx.Provider>
    );
}
