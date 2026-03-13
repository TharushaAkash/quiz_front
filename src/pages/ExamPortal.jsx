import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';
import { Timer, Send, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ExamPortal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            const res = await axios.get(`${API_URL}/exams/${id}`);
            setExam(res.data);
            setTimeLeft(res.data.duration * 60);
        };
        fetchExam();
    }, [id]);

    const submitExam = useCallback(async () => {
        try {
            const formattedAnswers = exam.questions.map((_, index) => {
                const ans = answers[index];
                return ans === undefined ? null : ans;
            });

            await axios.post(`${API_URL}/results`, {
                examId: id,
                answers: formattedAnswers
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            alert('Exam submitted successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Submission failed', err);
            alert('Failed to submit exam. Please try again.');
        }
    }, [answers, exam, id, navigate]);

    useEffect(() => {
        if (isStarted && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (isStarted && timeLeft === 0) {
            submitExam();
        }
    }, [isStarted, timeLeft, submitExam]);

    if (!exam) return <div>Loading exam...</div>;

    if (!isStarted) {
        return (
            <div className="glass-card" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{exam.title}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <p>{exam.description}</p>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Timer size={20} /> Duration: {exam.duration} Minutes
                    </p>
                    <p><BookOpen size={20} /> Total Questions: {exam.questions.length}</p>
                </div>
                <button className="btn-primary" style={{ padding: '1rem 3rem' }} onClick={() => setIsStarted(true)}>
                    Start Exam
                </button>
            </div>
        );
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', height: 'calc(100vh - 180px)', paddingBottom: '2rem' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>QUESTION {currentQuestion + 1} OF {exam.questions.length}</span>
                        <h4 style={{ color: 'var(--primary)', marginTop: '0.2rem' }}>{exam.title}</h4>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontWeight: '700',
                        fontSize: '1.2rem',
                        color: timeLeft < 60 ? 'var(--error)' : 'var(--text-main)',
                        background: timeLeft < 60 ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.05)',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.75rem',
                        border: '1px solid',
                        borderColor: timeLeft < 60 ? 'var(--error)' : 'var(--glass-border)'
                    }}>
                        <Timer size={20} className={timeLeft < 60 ? 'animate-pulse' : ''} /> {formatTime(timeLeft)}
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <span style={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: 'var(--primary)',
                        padding: '6px 14px',
                        borderRadius: '0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {currentQuestion + 1}. QUESTION
                    </span>
                    <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--success)',
                        padding: '6px 14px',
                        borderRadius: '0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {(exam.questions[currentQuestion].correctOptions || []).length > 1 ? 'Multiple Choice' : 'Single Choice'}
                    </span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' }}>
                        {exam.questions[currentQuestion].questionText}
                    </h3>

                    {exam.questions[currentQuestion].codeSnippet && (
                        <div style={{ marginBottom: '2rem', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                            <SyntaxHighlighter
                                language="html"
                                style={oneDark}
                                customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.95rem', background: '#010409' }}
                            >
                                {exam.questions[currentQuestion].codeSnippet}
                            </SyntaxHighlighter>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {exam.questions[currentQuestion].type && exam.questions[currentQuestion].type.includes('Short') ? (
                            <textarea
                                placeholder="Type your answer here..."
                                style={{
                                    padding: '1.2rem',
                                    width: '100%',
                                    fontSize: '1.1rem',
                                    minHeight: '150px',
                                    resize: 'none',
                                    background: 'rgba(15, 23, 42, 0.4)'
                                }}
                                value={answers[currentQuestion] || ''}
                                onChange={(e) => setAnswers({ ...answers, [currentQuestion]: e.target.value })}
                            />
                        ) : (
                            exam.questions[currentQuestion].options.map((option, index) => {
                                const isMulti = (exam.questions[currentQuestion].correctOptions || []).length > 1;
                                const isChecked = (answers[currentQuestion] || []).includes(index);

                                return (
                                    <label key={index} style={{
                                        padding: '1.2rem 1.5rem',
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        background: isChecked ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                                        borderColor: isChecked ? 'var(--primary)' : 'var(--glass-border)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        boxShadow: isChecked ? '0 0 20px rgba(139, 92, 246, 0.1)' : 'none'
                                    }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: isMulti ? '6px' : '50%',
                                            border: '2px solid',
                                            borderColor: isChecked ? 'var(--primary)' : 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s',
                                            background: isChecked ? 'var(--primary)' : 'transparent'
                                        }}>
                                            {isChecked && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: isMulti ? '1px' : '50%' }} />}
                                        </div>
                                        <input
                                            type={isMulti ? "checkbox" : "radio"}
                                            name={`question-${currentQuestion}`}
                                            checked={isChecked}
                                            onChange={() => {
                                                const currentAnswers = Array.isArray(answers[currentQuestion]) ? answers[currentQuestion] : [];
                                                if (isMulti) {
                                                    const newAns = currentAnswers.includes(index)
                                                        ? currentAnswers.filter(a => a !== index)
                                                        : [...currentAnswers, index];
                                                    setAnswers({ ...answers, [currentQuestion]: newAns });
                                                } else {
                                                    setAnswers({ ...answers, [currentQuestion]: [index] });
                                                }
                                            }}
                                            style={{ display: 'none' }}
                                        />
                                        <span style={{ fontSize: '1.05rem', color: isChecked ? 'white' : 'var(--text-main)', fontWeight: isChecked ? '500' : '400' }}>{option}</span>
                                    </label>
                                );
                            })
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button
                        className="glass-card"
                        style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem' }}
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>
                    {currentQuestion === exam.questions.length - 1 ? (
                        <button className="btn-primary" style={{ padding: '0.8rem 2.5rem', borderRadius: '0.75rem' }} onClick={submitExam}>
                            Finish & Submit <Send size={18} />
                        </button>
                    ) : (
                        <button className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '0.75rem' }} onClick={() => setCurrentQuestion(prev => prev + 1)}>
                            Next Question <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Progress Map</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                    {exam.questions.map((_, index) => {
                        const isAnswered = answers[index] !== undefined && (Array.isArray(answers[index]) ? answers[index].length > 0 : answers[index] !== '');
                        return (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                style={{
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: currentQuestion === index ? 'var(--primary)' : (isAnswered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'),
                                    color: currentQuestion === index ? 'white' : (isAnswered ? 'var(--success)' : 'var(--text-muted)'),
                                    border: '1px solid',
                                    borderColor: currentQuestion === index ? 'var(--primary)' : (isAnswered ? 'var(--success)' : 'var(--glass-border)'),
                                    borderRadius: '0.75rem',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)' }}></div>
                        <span>Current Question</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)' }}></div>
                        <span>Answered</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}></div>
                        <span>Remaining</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamPortal;
