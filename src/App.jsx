import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import TaskForm from './components/Auth/Admin/TaskForm';
import SupervisorWorkForm from './components/SupervisorWorkForm';
import SubmissionReview from './components/Auth/Admin/SubmissionReview';
import AdminDashboard from './components/Auth/Admin/AdminDashboard';
// import AdminDashboard from './components/Admin/Dashboard';
// import SupervisorDashboard from './components/Supervisor/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='task' element={<TaskForm />} />
        <Route path='work' element={<SupervisorWorkForm />} />
        <Route path='review' element={<SubmissionReview />} />
        <Route path='/admin' element={<AdminDashboard />} />
        </ Routes>
        </ BrowserRouter>
  )}

  export default App