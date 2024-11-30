import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './landing';
import ForgotPassword from './forgot_password';
import Dashboard from './dashboard';
import GenerateQuestions from './generate_questions';
import HelpPage from './help';
import Module from './module';
import Profile from './profile';
import Settings from './settings';
import InstructorPage from './instractor';
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
import Studentlist from './Studentlist';




function App() {
  return (
    <div>
      <BrowserRouter>
          <Routes>
          <Route path='/' element={<Landing />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Forgot_Password" element={<ForgotPassword />} />
          <Route path="/Generate_Questions" element={<GenerateQuestions />} />
          <Route path="/Help" element={<HelpPage />} />
          <Route path="/module" element={<Module />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/module/:id" element={<ModuleInside />} />
          <Route path="/post-test/:moduleId" element={<PostTest />} />
          <Route path= "/createmodule" element={<CreateModule />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/createposttest/:id" element={<CreatePostTest />} />
          <Route path="/Reset_Password" element={<ResetPassword />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Upload_Module" element={<UploadModule />} />
          <Route path="/Instructor_Dashboard" element={<InstructorDashboard />} />
          <Route path= "/mail" element ={<Mail/>}/>
            <Route path="/studentlist" element = {<Studentlist/>}/> 
            <Route path="/instructor_dashboard" element={<InstructorDashboard />} />
          </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
