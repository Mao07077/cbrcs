import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './page/Landing/Landing';//ok
import ForgotPassword from './page/Forgot_Password/Forgot_password'; //ok
import Dashboard from './page/Dashboard/Dashboard';
import GenerateQuestions from './page/Generate_Question/Generate_questions';
import HelpPage from './page/Help/Help';
import Module from './module';
import Profile from './profile';
import Settings from './page/Settings/Settings';
import Login from './page/Login/Login';
import ModuleInside from './module_inside';
import PostTest from './posttest';
import ResetPassword from './page/Reset_Password/Reset_password';
import Signup from './page/Signup/Signup';
import UploadModule from './page/Upload_Module/Uploadmodule';
import InstructorDashboard from './instructor_dashboard';
import Mail from './Mail';



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
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/module_inside" element={<ModuleInside />} />
          <Route path="/Post_test" element={<PostTest />} />
          <Route path="/Reset_Password" element={<ResetPassword />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Upload_Module" element={<UploadModule />} />
          <Route path="/Instructor_Dashboard" element={<InstructorDashboard />} />
          <Route path= "/mail" element ={<Mail/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

