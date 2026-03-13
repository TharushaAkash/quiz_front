import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';
import { Award, Calendar, CheckCircle, ChevronRight, Trash2 } from 'lucide-react';

const Marks = () => {
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const fetchResults = async () => {
        const res = await axios.get(`${API_URL}/results/user`, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setResults(res.data);
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this result?')) {
            try {
                await axios.delete(`${API_URL}/results/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                fetchResults();
            } catch (err) {
                console.error('Failed to delete result', err);
            }
        }
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '3rem', borderLeft: '4px solid var(--secondary)', paddingLeft: '1.5rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>My Performance</h2>
                <p style={{ color: 'var(--text-muted)' }}>Review your exam history and track your academic progress</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {results.map(result => {
                    const percentage = Math.round((result.score / result.totalQuestions) * 100);
                    const isPass = percentage >= 50;

                    return (
                        <div
                            key={result._id}
                            className="glass-card"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '1.5rem 2rem',
                                transition: 'all 0.3s ease',
                                borderLeft: `6px solid ${isPass ? 'var(--success)' : 'var(--error)'}`,
                            }}
                            onClick={() => navigate(`/review/${result._id}`)}
                        >
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '1rem',
                                    background: isPass ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isPass ? 'var(--success)' : 'var(--error)'
                                }}>
                                    <Award size={30} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.4rem', color: 'white' }}>{result.exam?.title || 'Exam Deleted'}</h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} color="var(--primary)" /> {new Date(result.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={14} color="var(--primary)" /> {result.score} / {result.totalQuestions} Correct</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '2rem',
                                        fontWeight: '800',
                                        color: isPass ? 'var(--success)' : 'var(--error)',
                                        lineHeight: '1'
                                    }}>
                                        {percentage}%
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
                                        {isPass ? 'PASSED' : 'FAILED'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={(e) => handleDelete(e, result._id)}
                                        className="btn-logout"
                                        style={{
                                            background: 'rgba(244, 63, 94, 0.05)',
                                            color: 'var(--error)',
                                            padding: '0.6rem',
                                            borderRadius: '0.75rem',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Delete Result"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {results.length === 0 && (
                <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem', marginTop: '2rem' }}>
                    <Award size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>You haven't attempted any exams yet. Start your first one today!</p>
                </div>
            )}
        </div>
    );
};

export default Marks;
