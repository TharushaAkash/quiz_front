import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen } from 'lucide-react';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            const res = await axios.get(`${API_URL}/exams`);
            setExams(res.data);
        };
        fetchExams();
    }, []);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '3rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Available Exams</h2>
                <p style={{ color: 'var(--text-muted)' }}>Choose an exam to test your skills and track your progress</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {exams.map(exam => (
                    <div key={exam._id} className="glass-card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.2rem',
                        padding: '2rem',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.1), transparent)', pointerEvents: 'none' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{
                                background: 'rgba(139, 92, 246, 0.1)',
                                padding: '0.6rem',
                                borderRadius: '0.75rem',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <BookOpen size={20} />
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem' }}>
                                {exam.questions.length} QUESTIONS
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.75rem', color: 'white' }}>{exam.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{exam.description}</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <Clock size={16} color="var(--primary)" /> {exam.duration} Minutes
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', borderRadius: '1rem', marginTop: '0.5rem' }}
                            onClick={() => navigate(`/exam/${exam._id}`)}
                        >
                            <Play size={18} fill="white" /> Start Examination
                        </button>
                    </div>
                ))}
            </div>
            {exams.length === 0 && (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', marginTop: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No exams available at the moment. Check back later!</p>
                </div>
            )}
        </div>
    );
};

export default Exams;
