import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = "Seleccionar...",
    label,
    name,
    required = false,
    valueKey = "id",
    labelKey = "title",
    renderOption = null
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const filteredOptions = useMemo(() => {
        return options.filter(opt => {
            const text = opt[labelKey] ? opt[labelKey].toString().toLowerCase() : '';
            return text.includes(searchTerm.toLowerCase());
        });
    }, [options, searchTerm, labelKey]);

    const selectedOption = options.find(opt => String(opt[valueKey]) === String(value));

    const handleSelect = (option) => {
        onChange({ target: { name, value: option[valueKey] } });
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', marginBottom: '1rem', width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#475569',
                    marginBottom: '0.5rem'
                }}>
                    {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
                </label>
            )}

            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '0.75rem',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem'
                }}
            >
                <span style={{ color: selectedOption ? '#0F172A' : '#94A3B8' }}>
                    {selectedOption
                        ? (renderOption ? renderOption(selectedOption) : selectedOption[labelKey])
                        : placeholder}
                </span>
                <ChevronDown size={16} color="#64748B" />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    marginTop: '0.25rem',
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    maxHeight: '250px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#F8FAFC',
                            padding: '0.5rem',
                            borderRadius: '6px'
                        }}>
                            <Search size={14} color="#64748B" style={{ marginRight: '0.5rem' }} />
                            <input
                                autoFocus
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Filtrar por nombre..."
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    width: '100%',
                                    outline: 'none',
                                    fontSize: '0.85rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt[valueKey]}
                                    onClick={() => handleSelect(opt)}
                                    style={{
                                        padding: '0.75rem',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        color: '#334155',
                                        transition: 'background 0.2s',
                                        borderBottom: '1px solid #F8FAFC',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#F1F5F9'}
                                    onMouseLeave={(e) => e.target.style.background = 'white'}
                                >
                                    {renderOption ? renderOption(opt) : opt[labelKey]}
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
