import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import UserProfile from './UserProfile';

function App() {
  return (
    <Routes>
      <Route path="/:username" element={<UserProfile />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
