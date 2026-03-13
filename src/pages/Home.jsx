import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="home-container animate-fade-in" style={{ padding: '6rem 1rem 4rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '4rem' }}>
                <h1 style={{
                    fontSize: '5rem',
                    fontWeight: '800',
                    lineHeight: '1.1',
                    letterSpacing: '-0.04em',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(to right, var(--primary), var(--secondary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Master Your <br /> Future Success
                </h1>
                <p style={{
                    fontSize: '1.4rem',
                    color: 'var(--text-muted)',
                    maxWidth: '800px',
                    margin: '0 auto 3rem',
                    fontWeight: '300'
                }}>
                    The premium MCQ portal for university students. Test your knowledge, <br /> beat the timer, and achieve your peak performance.
                </p>

                {!user ? (
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', borderRadius: '1rem' }}>
                            Start Your Journey <ArrowRight size={20} />
                        </button>
                        <button className="glass-card" onClick={() => navigate('/register')} style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', background: 'transparent' }}>
                            Create Account
                        </button>
                    </div>
                ) : (
                    <button className="btn-primary" onClick={() => navigate('/exams')} style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', borderRadius: '1rem' }}>
                        Access Student Dashboard
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '6rem' }}>
                <div className="glass-card" style={{ transition: 'all 0.4s ease' }}>
                    <div style={{
                        width: '70px', height: '70px', borderRadius: '1.5rem',
                        background: 'rgba(139, 92, 246, 0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <Clock size={32} color="var(--primary)" style={{ animation: 'float 3s ease-in-out infinite' }} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Precision Timing</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Adaptive timers that mirror real exam conditions to sharpen your time management.</p>
                </div>
                <div className="glass-card" style={{ transition: 'all 0.4s ease' }}>
                    <div style={{
                        width: '70px', height: '70px', borderRadius: '1.5rem',
                        background: 'rgba(16, 185, 129, 0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <CheckCircle size={32} color="var(--success)" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Instant Analytics</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Deep-dive analysis of your performance with colorful syntax highlighting for code questions.</p>
                </div>
                <div className="glass-card" style={{ transition: 'all 0.4s ease' }}>
                    <div style={{
                        width: '70px', height: '70px', borderRadius: '1.5rem',
                        background: 'rgba(236, 72, 153, 0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <ShieldCheck size={32} color="var(--secondary)" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Verified Content</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>faculty-curated question sets ensuring you study exactly what you need to excel.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
