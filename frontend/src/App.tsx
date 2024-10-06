import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UploadPage from "./Components/UploadPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage></UploadPage>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
