import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { User, Trash2, Plus, ClipboardList, BookOpen, Clock, Edit, Ban, Check, X } from 'lucide-react';

const AdminDashboard = ({ tab }) => {
    const [users, setUsers] = useState([]);
    const [exams, setExams] = useState([]);
    const [showExamForm, setShowExamForm] = useState(false);
    const [uploadMode, setUploadMode] = useState(false);
    const [file, setFile] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [newExam, setNewExam] = useState({
        title: '', description: '', duration: 30,
        questions: [{ questionText: '', options: ['', '', '', ''], correctOptions: [0] }]
    });

    useEffect(() => {
        if (tab === 'users') fetchUsers();
        else fetchExams();
    }, [tab]);

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:5000/api/users', {
            headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setUsers(res.data);
    };

    const fetchExams = async () => {
        const res = await axios.get('http://localhost:5000/api/exams');
        setExams(res.data);
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            fetchUsers();
        }
    };

    const toggleBlockUser = async (user) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${user._id}`, { isBlocked: !user.isBlocked }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            fetchUsers();
        } catch (err) {
            alert('Failed to update block status');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editingUser, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            alert('Failed to update user');
        }
    };

    const deleteExam = async (id) => {
        if (window.confirm('Delete this exam?')) {
            await axios.delete(`http://localhost:5000/api/exams/${id}`);
            fetchExams();
        }
    };

    const addQuestion = () => {
        setNewExam({ ...newExam, questions: [...newExam.questions, { questionText: '', options: ['', '', '', ''], correctOption: 0 }] });
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/exams', newExam);
            resetForm();
            fetchExams();
        } catch (err) {
            alert('Failed to create exam');
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a file');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', newExam.title);
        formData.append('description', newExam.description);
        formData.append('duration', newExam.duration);

        try {
            await axios.post('http://localhost:5000/api/exams/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            resetForm();
            fetchExams();
        } catch (err) {
            alert('Failed to upload file');
        }
    };

    const resetForm = () => {
        setShowExamForm(false);
        setUploadMode(false);
        setFile(null);
        setNewExam({
            title: '', description: '', duration: 30,
            questions: [{ questionText: '', options: ['', '', '', ''], correctOptions: [0] }]
        });
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                        {tab === 'users' ? 'User Administration' : 'Exam Management'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                        {tab === 'users' ? 'Oversee platform members, adjust roles, and manage access' : 'Create, upload, and organize examination content'}
                    </p>
                </div>
                {tab === 'exams' && !showExamForm && (
                    <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }} onClick={() => setShowExamForm(true)}>
                        <Plus size={20} /> Create New Exam
                    </button>
                )}
            </div>

            {showExamForm ? (
                <div className="glass-card animate-fade-in" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', position: 'relative' }}>
                        <button
                            className={!uploadMode ? 'btn-primary' : 'nav-link'}
                            style={{ padding: '0.8rem 1.5rem', borderRadius: '0.75rem', position: 'relative' }}
                            onClick={() => setUploadMode(false)}
                        >
                            Manual Composition
                        </button>
                        <button
                            className={uploadMode ? 'btn-primary' : 'nav-link'}
                            style={{ padding: '0.8rem 1.5rem', borderRadius: '0.75rem' }}
                            onClick={() => setUploadMode(true)}
                        >
                            CSV/Excel Bulk Import
                        </button>
                    </div>

                    <form onSubmit={uploadMode ? handleFileUpload : handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Examination Title</label>
                                <input placeholder="e.g. Advanced JavaScript Patterns" value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Limit (Min)</label>
                                <input type="number" value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: parseInt(e.target.value) })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Short Description</label>
                            <textarea placeholder="Provide an overview of the exam objectives..." value={newExam.description} onChange={e => setNewExam({ ...newExam, description: e.target.value })} style={{ height: '100px' }} />
                        </div>

                        {uploadMode ? (
                            <div style={{
                                padding: '3rem',
                                textAlign: 'center',
                                border: '2px dashed var(--glass-border)',
                                borderRadius: '1.5rem',
                                background: 'rgba(255,255,255,0.02)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                                    <Plus size={32} />
                                </div>
                                <h4 style={{ marginBottom: '0.5rem' }}>Drag and drop your file</h4>
                                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 2rem' }}>Support for .CSV and .XLSX files. Ensure columns match: questionText, option1, option2, option3, option4, correctOption (0-3)</p>
                                <input type="file" onChange={e => setFile(e.target.files[0])} accept=".csv, .xlsx" style={{ background: 'transparent', border: 'none' }} />
                            </div>
                        ) : (
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Questions ({newExam.questions.length})</h4>
                                    <button type="button" onClick={addQuestion} className="glass-card" style={{ padding: '0.5rem 1rem', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: '600' }}>
                                        + Add New Question
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {newExam.questions.map((q, qIndex) => (
                                        <div key={qIndex} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
                                                <div style={{ background: 'var(--primary)', color: 'white', weight: '30px', height: '30px', minWidth: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>{qIndex + 1}</div>
                                                <input placeholder="Enter the question text..." value={q.questionText} onChange={e => {
                                                    const qs = [...newExam.questions];
                                                    qs[qIndex].questionText = e.target.value;
                                                    setNewExam({ ...newExam, questions: qs });
                                                }} required style={{ width: '100%', padding: '0.6rem' }} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginLeft: '2.5rem' }}>
                                                {q.options.map((opt, oIndex) => (
                                                    <div key={oIndex} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={q.correctOptions.includes(oIndex)}
                                                            onChange={() => {
                                                                const qs = [...newExam.questions];
                                                                const currentOptions = qs[qIndex].correctOptions;
                                                                if (currentOptions.includes(oIndex)) {
                                                                    qs[qIndex].correctOptions = currentOptions.filter(o => o !== oIndex);
                                                                } else {
                                                                    qs[qIndex].correctOptions = [...currentOptions, oIndex];
                                                                }
                                                                setNewExam({ ...newExam, questions: qs });
                                                            }}
                                                            style={{ width: '18px', height: '18px' }}
                                                        />
                                                        <input placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => {
                                                            const qs = [...newExam.questions];
                                                            qs[qIndex].options[oIndex] = e.target.value;
                                                            setNewExam({ ...newExam, questions: qs });
                                                        }} required style={{ padding: '0.5rem' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '1.2rem', borderRadius: '1rem', fontSize: '1.1rem' }}>
                                {uploadMode ? 'Upload and Publish' : 'Save & Publish Examination'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn-logout" style={{ padding: '1rem 2rem', borderRadius: '1rem' }}>Discard Changes</button>
                        </div>
                    </form>
                </div>
            ) : (
                tab === 'users' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {users.map(u => (
                            <div key={u._id} className="glass-card" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.2rem 2rem',
                                borderLeft: u.isBlocked ? '4px solid var(--error)' : '4px solid transparent',
                                transition: 'all 0.2s ease'
                            }}>
                                {editingUser && editingUser._id === u._id ? (
                                    <form onSubmit={handleUpdateUser} style={{ display: 'flex', flex: 1, gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}><input value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} style={{ width: '100%', padding: '0.6rem' }} /></div>
                                        <div style={{ flex: 1 }}><input value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} style={{ width: '100%', padding: '0.6rem' }} /></div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button type="submit" className="glass-card" style={{ color: 'var(--success)', padding: '0.5rem' }}><Check size={20} /></button>
                                            <button type="button" onClick={() => setEditingUser(null)} className="glass-card" style={{ color: 'var(--error)', padding: '0.5rem' }}><X size={20} /></button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '0.75rem',
                                                background: u.isBlocked ? 'rgba(244, 63, 94, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: u.isBlocked ? 'var(--error)' : 'var(--primary)'
                                            }}>
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: u.isBlocked ? 'var(--text-muted)' : 'white' }}>{u.name}</span>
                                                    {u.role === 'admin' && <span style={{ fontSize: '0.65rem', fontWeight: '800', background: 'var(--accent)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>ADMIN</span>}
                                                    {u.isBlocked && <span style={{ fontSize: '0.65rem', fontWeight: '800', background: 'var(--error)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>BLOCKED</span>}
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.1rem' }}>{u.email} • {u.universityYear || 'Member'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {u.role !== 'admin' && (
                                                <>
                                                    <button onClick={() => setEditingUser(u)} className="glass-card" style={{ padding: '0.6rem', color: 'var(--primary)', transition: 'all 0.2s' }}>
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => toggleBlockUser(u)} className="glass-card" style={{ padding: '0.6rem', color: u.isBlocked ? 'var(--success)' : 'var(--error)', transition: 'all 0.2s' }}>
                                                        {u.isBlocked ? <Check size={18} /> : <Ban size={18} />}
                                                    </button>
                                                    <button onClick={() => deleteUser(u._id)} className="glass-card" style={{ padding: '0.6rem', color: 'var(--error)', transition: 'all 0.2s' }}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {exams.map(e => (
                            <div key={e._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '1rem', color: 'var(--primary)' }}>
                                        <ClipboardList size={22} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{e.title}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{e.duration} min • {e.questions.length} questions</p>
                                    </div>
                                </div>
                                <button onClick={() => deleteExam(e._id)} className="btn-logout" style={{ padding: '0.6rem', borderRadius: '0.75rem' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default AdminDashboard;
