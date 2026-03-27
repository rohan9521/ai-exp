import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import UserDashboard from './screens/UserDashboard';
import Feed from './components/Feed';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/dashboard' element={<UserDashboard />} />
        <Route path='/feed' element={<Feed />} />
      </Routes>
    </Router>
  );
};

export default App;