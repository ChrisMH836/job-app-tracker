import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import App from './App.tsx';
import Auth from './components/Auth/Auth.tsx';
import Login from './components/Auth/Login/Login.tsx';
import Register from './components/Auth/Register/Register.tsx';
import JobModalLayout from './components/JobModalLayout/JobModalLayout.tsx';
import JobItemCreatorModal from './components/JobModalLayout/JobItemCreatorModal/JobItemCreatorModal.tsx';
import JobItemModalView from './components/JobModalLayout/JobItemModalView/JobItemModalView.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        //catch and redirect /auth urls to /auth/login
        <Route path="auth" element={<Auth />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="app" element={<App />}>
          <Route path = "jobs" element = {<JobModalLayout />}>
          <Route path = "new" element = {<JobItemCreatorModal />} />
          </Route>
          <Route path = ":id" element = {<JobItemModalView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
