import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Landing from './page/Landing/Landing';
import ForgotPassword from './page/Forgot_Password/Forgot_password';
import Dashboard from './page/Dashboard/Dashboard'
import Header from './Components/Header'; 
import HelpPage from './page/Help/help';
import ModuleSH from './page/Module/ModuleSH';
import Module from './page/Module/Module';
import Profile from './page/Profile/Profile';
import Settings from './page/Settings/Settings';
import Login from './page/Login/login';
import ModuleInside from './page/Module_Inside/ModuleInside';
import PostTest from './page/PostTest/posttest';
import ResetPassword from './page/Reset_Password/reset_password';
import Signup from './page/Signup/signup';
import InstructorDashboard from './Instructor_Page/Instructor_Dashboards/instructor_dashboard';
import Message from './Instructor_Page/Message/Message';
import CreateModule from './Instructor_Page/Create_module/Create_module';
import CreatePostTest from './Instructor_Page/Create_Posttest/Create_posttest';
import Studentlist from './Instructor_Page/Student_List/Studentlist';
import AdminDashboard from './Admin_Page/Admin_Dashboard/Admin_Dashboard';
import InstructorHeader from './Components/Instructor_Header';
import Accounts from './Admin_Page/Accounts/Accounts';
import Request from './Admin_Page/Request/Request';
import Adminpost from './Admin_Page/AdminPost/AdminPost';
import ModuleList from './Instructor_Page/ModuleList/ModuleList';
import Report from './Admin_Page/Reports/Report';
import StudyHabits_landingpage from './page/Study_habits/Habits_Landing/StudyHabits_landingpage';
import Flashcard from './page/Study_habits/Flashcard/Flashcard';
import Flashcard_landing from './page/Study_habits/Flashcard/Flashcard_landing';
import Survey from './page/Survey/survey';
import Scheduler from './page/Study_habits/Scheduler/Scheduler';
import Notes from './page/Study_habits/notes/notes';
import Music from './page/Study_habits/Music/Music';
import LearnTogether from './page/Study_habits/learn_together/learn_together';
import Chat from './page/Study_habits/Instructor_chat/chat';
import SendReport from './page/SendReport/SendReport';
import PreTest from './page/PreTest/pretest';
import StudentReport from './Admin_Page/StudentReport/StudentReport';




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
          <Route path="/modulesh" element={<ModuleSH />} />
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
          <Route path= "/Message" element ={<Message/>}/>
            <Route path="/studentlist" element = {<Studentlist/>}/> 
            <Route path= "Header" element = {<Header/>}/>
            <Route path="/Admin_Dashboard" element={<AdminDashboard />} />
            <Route path="/Accounts" element={<Accounts />} />
            <Route path="/Request" element={<Request />} />
            <Route path="/Adminpost" element={<Adminpost />} />
            <Route path="/ModuleList" element={<ModuleList/>}/>
            <Route path="/Report" element={<Report/>}/>
            <Route path="/StudyHabits_landingpage" element={<StudyHabits_landingpage/>}/>
            <Route path="/Flashcards" element={<Flashcard/>}/>
            <Route path="/Flashcards/:moduleId" element={<Flashcard />} />
            <Route path="/Flashcard_landing" element={<Flashcard_landing/>}/>
            <Route path="/Survey" element={<Survey/>}/>
            <Route path="/Scheduler" element={<Scheduler />} />
            <Route path="/notes" element= {<Notes/>}/> 
            <Route path="/Music" element= {<Music/>}/>
            <Route path="/learn_together" element= {<LearnTogether/>}/>
            <Route path="/chat" element= {<Chat/>}/>
            <Route path="/SendReport" element={<SendReport />} />
            <Route path="/pre-test/:moduleId" element={<PreTest />} />
            <Route path="/StudentReport" element={<StudentReport />} />
          </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
