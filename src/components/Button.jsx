export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        width: '100%',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-primary)',
        },
        secondary: {
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
        },
        accent: {
            backgroundColor: 'var(--accent-primary)',
            color: '#fff',
        }
    };

    return (
        <button
            style={{ ...baseStyle, ...variants[variant], ...props.style }}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
};
