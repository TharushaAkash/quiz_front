import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, GraduationCap, Calendar, Edit, Save, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../api';

const Profile = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        universityYear: user?.universityYear || ''
    });

    if (!user) return null;

    const handleSave = async () => {
        try {
            await axios.put(`${API_URL}/users/profile`, formData, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            await refreshUser();
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile', err);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '650px', margin: '4rem auto', padding: '0 1rem' }}>
            <div className="glass-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}></div>

                <button
                    onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.6rem', borderRadius: '0.75rem', transition: 'all 0.2s' }}
                    title={isEditing ? "Cancel" : "Edit Profile"}
                >
                    {isEditing ? <X size={20} /> : <Edit size={20} />}
                </button>

                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '2rem',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    margin: '1.5rem auto 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    color: 'white',
                    boxShadow: '0 10px 30px var(--primary-glow)',
                    transform: 'rotate(-3deg)'
                }}>
                    {user.name.charAt(0)}
                </div>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left', background: 'rgba(15, 23, 42, 0.4)', padding: '2rem', borderRadius: '1.2rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                            <input
                                style={{ width: '100%' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                            <input
                                style={{ width: '100%' }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>University Year</label>
                            <input
                                style={{ width: '100%' }}
                                value={formData.universityYear}
                                onChange={(e) => setFormData({ ...formData, universityYear: e.target.value })}
                            />
                        </div>
                        <button className="btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', borderRadius: '1rem' }} onClick={handleSave}>
                            <Save size={18} /> Update Profile Information
                        </button>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.2rem' }}>{user.name}</h2>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            color: 'var(--accent)',
                            background: 'rgba(6, 182, 212, 0.1)',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {user.role}
                        </span>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(1, 1fr)',
                            gap: '1rem',
                            textAlign: 'left',
                            background: 'rgba(15, 23, 42, 0.4)',
                            padding: '2rem',
                            borderRadius: '1.2rem',
                            marginTop: '2.5rem',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '0.5rem 0' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                                    <Mail size={18} color="var(--primary)" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Email Address</span>
                                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>{user.email}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '0.5rem 0' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                                    <GraduationCap size={18} color="var(--primary)" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Current Academic Level</span>
                                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>{user.universityYear}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '0.5rem 0' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                                    <Calendar size={18} color="var(--primary)" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Member Since</span>
                                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
