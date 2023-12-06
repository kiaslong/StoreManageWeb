import Home from './pages/Home';
import Login from './pages/Login'; // Import your Login component here
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
