import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './landing';
import ForgotPassword from './forgot_password';
import Dashboard from './dashboard';
import GenerateQuestions from './generate_questions';
import HelpPage from './help';
import Module from './module';
import Profile from './profile';
import Settings from './settings';
import Login from './login';
import ModuleInside from './module_inside';
import PostTest from './posttest';
import ResetPassword from './reset_password';
import Signup from './signup';
import UploadModule from './uploadmodule';
import InstructorDashboard from './instructor_dashboard';
import Mail from './Mail';
import CreateModule from './Create_module';
import CreatePostTest from './create_posttest';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/generate_questions" element={<GenerateQuestions />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/module" element={<Module />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/module/:id" element={<ModuleInside />} />
          <Route path="/post-test/:moduleId" element={<PostTest />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/uploadmodule" element={<UploadModule />} />
          <Route path="/instructor_dashboard" element={<InstructorDashboard />} />
          <Route path= "/mail" element={<Mail />} />
          <Route path= "/createmodule" element={<CreateModule />} />
          <Route path="/createposttest/:id" element={<CreatePostTest />} /> {/* Use :id */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
