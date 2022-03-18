import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.jsx';
// import Edit from './subpages/Edit';
import Admin from './subpages/Admin.jsx';
import List from './subpages/List.jsx';
import Main from './subpages/Main.jsx';

export default function Container() {
  return (
    <div className="container dash__container">
      <Navbar />
      <Routes>
        {/* <Route path="/dash/edit/:date" render={() => <Edit state={state} />} /> */}
        <Route path="admin" element={<Admin />} />
        <Route path="list" element={<List />} />
        <Route path="*" element={<Main />} />
      </Routes>
    </div>
  );
}
