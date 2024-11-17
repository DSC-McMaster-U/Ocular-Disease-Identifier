import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UploadPage from "./Components/UploadPage";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Dashboard from "./Components/UserDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage></UploadPage>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/user/dashboard" element={<Dashboard></Dashboard>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
