import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, ClipboardList, Home, FileText } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div style={{ position: 'sticky', top: '1.5rem', zIndex: 1000, padding: '0 1.5rem' }}>
            <nav className="glass-card" style={{
                padding: '0.75rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '1rem',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--glass-border)',
            }}>
                <Link to="/" style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textDecoration: 'none',
                    letterSpacing: '-0.02em'
                }}>
                    QuizMaster
                </Link>
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <Link to="/" className="nav-link"><Home size={18} /> Home</Link>
                    {user.role === 'admin' ? (
                        <>
                            <Link to="/manage-users" className="nav-link"><User size={18} /> Users</Link>
                            <Link to="/manage-exams" className="nav-link"><ClipboardList size={18} /> Exams</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/exams" className="nav-link"><ClipboardList size={18} /> Exams</Link>
                            <Link to="/marks" className="nav-link"><FileText size={18} /> Marks</Link>
                            <Link to="/profile" className="nav-link"><User size={18} /> Profile</Link>
                        </>
                    )}
                    <button onClick={handleLogout} className="btn-logout" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--error)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.75rem' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>
            <style>{`
                .nav-link {
                    color: var(--text-muted);
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    transition: all 0.3s ease;
                    font-weight: 500;
                    font-size: 0.95rem;
                }
                .nav-link:hover { 
                    color: var(--text-main);
                    transform: translateY(-1px);
                }
                .nav-link svg {
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default Navbar;
