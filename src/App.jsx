import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Exams from './pages/Exams';
import ExamPortal from './pages/ExamPortal';
import Marks from './pages/Marks';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ResultReview from './pages/ResultReview';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  return (
    <Router>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exams" element={user ? <Exams /> : <Login />} />
          <Route path="/exam/:id" element={user ? <ExamPortal /> : <Login />} />
          <Route path="/marks" element={user ? <Marks /> : <Login />} />
          <Route path="/review/:id" element={user ? <ResultReview /> : <Login />} />
          <Route path="/profile" element={user ? <Profile /> : <Login />} />
          <Route path="/manage-exams" element={user?.role === 'admin' ? <AdminDashboard tab="exams" /> : <Home />} />
          <Route path="/manage-users" element={user?.role === 'admin' ? <AdminDashboard tab="users" /> : <Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
