import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const config = {
        success: { icon: CheckCircle, bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
        error: { icon: AlertCircle, bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
        info: { icon: Info, bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' }
    };

    const style = config[type] || config.success;
    const Icon = style.icon;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: style.bg,
            border: `1px solid ${style.border}`,
            color: style.text,
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '400px'
        }}>
            <Icon size={20} />
            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</span>
            <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', marginLeft: 'auto', cursor: 'pointer', color: 'inherit', opacity: 0.6 }}
            >
                <X size={16} />
            </button>
            <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
