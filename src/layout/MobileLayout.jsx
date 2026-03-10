import { Link, useLocation } from 'wouter';
import { Home, PlusCircle, Camera } from 'lucide-react';

export const MobileLayout = ({ children }) => {
    const [location] = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/add', icon: PlusCircle, label: 'Add' },
        { path: '/scan', icon: Camera, label: 'Scan' }
    ];

    return (
        <div className="app-container">
            <main className="main-content">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'var(--bg-tertiary)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '1rem 0',
                paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
                zIndex: 50,
            }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path;

                    return (
                        <Link key={item.path} href={item.path}>
                            <a
                                className="flex flex-col items-center gap-1"
                                style={{
                                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    textDecoration: 'none'
                                }}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '600' : '400' }}>
                                    {item.label}
                                </span>
                            </a>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
