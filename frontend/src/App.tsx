import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UploadPage from "./Components/UploadPage";
import SignUp from "./Components/SignUp";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage></UploadPage>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
