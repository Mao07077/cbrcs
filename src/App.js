import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './page/Landing/Landing';
import ForgotPassword from './page/Forgot_Password/Forgot_password'; //ok
import Dashboard from './page/Dashboard/Dashboard';
import GenerateQuestions from './page/Generate_Question/Generate_questions';
import HelpPage from './page/Help/Help';
import Module from './Admin_Page/Module/module';
import Profile from './page/Profile/profile';
import Settings from './page/Settings/Settings'; // ok na daw sabi ni eron
import Login from './page/Login/Login'; //ok
import ModuleInside from './Admin_Page/Module_Inside/module_inside';
import PostTest from './page/Post_test/Post_test';
import ResetPassword from './page/Reset_Password/Reset_password'; //ok
import Signup from './page/Signup/Signup';
import UploadModule from './page/Upload_Module/Uploadmodule';
import InstructorDashboard from './Admin_Page/Instructor_Dashboards/instructor_dashboard';
import Mail from './Admin_Page/Mail/Mail';
import Createmodule from './Admin_Page/Create_Modules/Create_module';
import CreatePosttest from './Admin_Page/Create_Posttest/create_posttest';
import AdminDashboard from './Admin_Page/Admin_Dashboard/Admin_Dashboard';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path="/Dashboard" element={<Dashboard />} /> //ok
          <Route path="/Forgot_Password" element={<ForgotPassword />} />
          <Route path="/Generate_Questions" element={<GenerateQuestions />} />
          <Route path="/Help" element={<HelpPage />} />
          <Route path="/Module" element={<Module />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/module_inside" element={<ModuleInside />} />
          <Route path="/Post_test" element={<PostTest />} />
          <Route path="/Reset_Password" element={<ResetPassword />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Upload_Module" element={<UploadModule />} />
          <Route path="/Instructor_Dashboard" element={<InstructorDashboard />} />
          <Route path= "/Mail" element ={<Mail/>}/>
          <Route path="/Create_Module" element={<Createmodule />} />
          <Route path="/Create_Posttest" element={<CreatePosttest />} />
          <Route path="/Admin_Dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

