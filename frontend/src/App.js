import { useState, useEffect } from 'react';
import axios from "axios";

import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Expression from './views/expression';
import Wrapper from './layouts/Wrapper';
import UserRoute from './layouts/UserRoute';
import Login from './views/login';
import Register from './views/register';


function App() {

  return (
    <BrowserRouter>
      <Wrapper>
        <Routes>
          <Route
            path="/"
            element={
              <UserRoute>
                <Expression />
              </UserRoute>
            }
          />              
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
