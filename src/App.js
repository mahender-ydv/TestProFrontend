import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage"
import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import Paper from "./components/Paper";
import TestPaper from "./components/TestPaper";
import Results from "./components/Results";
import MainLayout from "./components/MainLayout";
import NoticeBoard from "./components/NoticeBoard";
import Setting from "./components/SettingPage";
import Analysis from "./components/Analysis";
import Feedback from "./components/Feedback";
import ExamsPage from"./components/ExamsPage";
import VerifyOTP from "./components/VerifyOtp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AddTestPaper from "./components/AddTestPaper";
import AddQuestion from "./components/AddQuestions";
import FileUploadSystem from "./components/FileUploadSystem";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verifyOtp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/file-uploading" element={<FileUploadSystem/>}/>
        
        {/* Layout route with sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/viewTest" element={<Paper />} />
          <Route path="/notice" element={<NoticeBoard />} />
          <Route path="/add-testpaper" element={<AddTestPaper />} />
          <Route path="/add-question" element={<AddQuestion />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/analyze" element={<Analysis />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/exams" element={<ExamsPage />} />
        </Route>

        {/* Pages without sidebar */}
        <Route path="/startTest" element={<TestPaper />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;