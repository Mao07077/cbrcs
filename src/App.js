import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Landing from './page/Landing/Landing';
import ForgotPassword from './page/Forgot_Password/Forgot_password';
import Dashboard from './page/Dashboard/Dashboard'
import Header from './Components/Header'; 
import HelpPage from './page/Help/help';
import Module from './page/Module/Module';
import Profile from './page/Profile/Profile';
import Settings from './page/Settings/Settings';
import Login from './page/Login/login';
import ModuleInside from './page/Module_Inside/module_inside';
import PostTest from './page/PostTest/posttest';
import ResetPassword from './page/Reset_Password/reset_password';
import Signup from './page/Signup/signup';
import InstructorDashboard from './Instructor_Page/Instructor_Dashboards/instructor_dashboard';
import Mail from './Instructor_Page/Mail/Mail';
import CreateModule from './Instructor_Page/Create_module/Create_module';
import CreatePostTest from './Instructor_Page/Create_Posttest/Create_posttest';
import Studentlist from './Instructor_Page/Student_List/Studentlist';
import AdminDashboard from './Admin_Page/Admin_Dashboard/Admin_Dashboard';
import InstructorHeader from './Components/Instructor_Header';
import Accounts from './Admin_Page/Accounts/Accounts';
import Request from './Admin_Page/Request/Request';
import Adminpost from './Admin_Page/AdminPost/AdminPost';




function App() {
  return (
    <div>
      <BrowserRouter>
          <Routes>
          <Route path='/' element={<Landing />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Forgot_Password" element={<ForgotPassword />} />
          <Route path="instructor_Header"element={<InstructorHeader/>}/>
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
          <Route path="/Instructor_Dashboard" element={<InstructorDashboard />} />
          <Route path= "/mail" element ={<Mail/>}/>
            <Route path="/studentlist" element = {<Studentlist/>}/> 
            <Route path= "Header" element = {<Header/>}/>
            <Route path="/Admin_Dashboard" element={<AdminDashboard />} />
            <Route path="/Accounts" element={<Accounts />} />
            <Route path="/Request" element={<Request />} />
            <Route path="/Adminpost" element={<Adminpost />} />
          </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
