import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';
import { ChevronLeft, CheckCircle, XCircle, Clock, Award, Calendar } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ResultReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await axios.get(`${API_URL}/results/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setResult(res.data);
            } catch (err) {
                console.error('Failed to fetch result', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading result...</div>;
    if (!result) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Result not found.</div>;

    const { exam, answers, score, totalQuestions, completedAt } = result;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '950px', margin: '0 auto', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <button
                    onClick={() => navigate('/marks')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.75rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                    }}
                >
                    <ChevronLeft size={20} /> Return to Results
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Calendar size={16} /> Taken on {new Date(completedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            <div className="glass-card" style={{ marginBottom: '3rem', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: score / totalQuestions >= 0.5 ? 'var(--success)' : 'var(--error)' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Examination Performance</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{exam.title}</h2>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                <Clock size={16} /> <span>Review Session</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                <Award size={16} color="var(--primary)" /> <span>{score} / {totalQuestions} Correct</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: `8px solid ${score / totalQuestions >= 0.5 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)'}`,
                            borderTopColor: score / totalQuestions >= 0.5 ? 'var(--success)' : 'var(--error)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: score / totalQuestions >= 0.5 ? 'var(--success)' : 'var(--error)' }}>
                                {Math.round((score / totalQuestions) * 100)}%
                            </div>
                            <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Final Score</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {exam.questions.map((q, idx) => {
                    const studentAns = answers[idx]?.selectedOptions || [];
                    const isCorrect = answers[idx]?.isCorrect;
                    const correctOptions = q.correctOptions || [];
                    const isShort = q.type && q.type.includes('Short');

                    return (
                        <div key={idx} className="glass-card" style={{
                            padding: '2rem',
                            borderLeft: `6px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                            background: isCorrect ? 'rgba(16, 185, 129, 0.02)' : 'rgba(244, 63, 94, 0.02)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '0.5rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        color: 'var(--text-muted)'
                                    }}>
                                        QUESTION {idx + 1}
                                    </div>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: isCorrect ? 'var(--success)' : 'var(--error)'
                                    }}>
                                        {isCorrect ? 'POINTS AWARDED' : 'NO POINTS'}
                                    </span>
                                </div>
                                {isCorrect ? (
                                    <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                                        <CheckCircle size={20} /> Correct
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                                        <XCircle size={20} /> Incorrect
                                    </div>
                                )}
                            </div>

                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '600', lineHeight: '1.5' }}>{q.questionText}</h3>

                            {q.codeSnippet && (
                                <div style={{ marginBottom: '1.5rem', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                    <SyntaxHighlighter
                                        language="html"
                                        style={oneDark}
                                        customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.95rem', background: '#010409' }}
                                    >
                                        {q.codeSnippet}
                                    </SyntaxHighlighter>
                                </div>
                            )}

                            {!isShort ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {q.options.map((opt, oIdx) => {
                                        const isSelected = studentAns.includes(oIdx);
                                        const isTruth = correctOptions.includes(oIdx);

                                        let statusColor = 'var(--glass-border)';
                                        let bg = 'rgba(255,255,255,0.02)';
                                        let textColor = 'var(--text-main)';

                                        if (isSelected && isTruth) {
                                            statusColor = 'var(--success)';
                                            bg = 'rgba(16, 185, 129, 0.15)';
                                            textColor = 'white';
                                        } else if (isSelected && !isTruth) {
                                            statusColor = 'var(--error)';
                                            bg = 'rgba(244, 63, 94, 0.15)';
                                            textColor = 'white';
                                        } else if (!isSelected && isTruth) {
                                            statusColor = 'var(--success)';
                                            bg = 'rgba(16, 185, 129, 0.05)';
                                            textColor = 'var(--success)';
                                        }

                                        return (
                                            <div key={oIdx} style={{
                                                padding: '1.2rem 1.5rem',
                                                borderRadius: '0.85rem',
                                                border: `1px solid ${statusColor}`,
                                                background: bg,
                                                fontSize: '1rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.2s',
                                                color: textColor
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <span style={{ fontWeight: '800', opacity: 0.5, fontSize: '0.85rem' }}>{String.fromCharCode(65 + oIdx)}</span>
                                                    <span style={{ fontWeight: (isSelected || isTruth) ? '600' : '400' }}>{opt}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    {isTruth && <span style={{ fontSize: '0.65rem', fontWeight: '800', background: 'var(--success)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>CORRECT</span>}
                                                    {isSelected && <span style={{ fontSize: '0.65rem', fontWeight: '800', background: isTruth ? 'rgba(0,0,0,0.2)' : 'var(--error)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>YOUR SELECTION</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Response</div>
                                        <div style={{
                                            padding: '1.2rem',
                                            borderRadius: '0.85rem',
                                            border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                                            background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            fontWeight: '600',
                                            color: isCorrect ? 'var(--success)' : 'var(--error)'
                                        }}>
                                            {studentAns[0] || '(No entry found)'}
                                        </div>
                                    </div>
                                    {!isCorrect && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--success)', textTransform: 'uppercase' }}>Expected Answer</div>
                                            <div style={{ padding: '1.2rem', borderRadius: '0.85rem', border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)', color: 'white', fontWeight: '500' }}>
                                                {q.correctAnswer}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isCorrect && !isShort && (
                                <div style={{
                                    marginTop: '2rem',
                                    padding: '1.2rem',
                                    background: 'rgba(244, 63, 94, 0.1)',
                                    borderRadius: '1rem',
                                    color: 'var(--error)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    fontSize: '0.95rem',
                                    fontWeight: '500'
                                }}>
                                    <div style={{ background: 'var(--error)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <XCircle size={16} />
                                    </div>
                                    <span>Explanation needed: The correct mapping for this question was: <span style={{ fontWeight: '800' }}>{correctOptions.map(o => String.fromCharCode(65 + o)).join(', ')}</span></span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResultReview;
