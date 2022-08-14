import './App.css';
import React, { createContext } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'
import SearchResults from './pages/SearchResults';
import Login from './pages/Login'
import Register from './pages/Register'
import Movie from './pages/Movie'
import Profile from './pages/Profile'
import PageNotFound from './pages/PageNotFound';
import useToken from './util/useToken'

import { ThemeProvider } from '@mui/material';
import Theme from './Theme';

export const UserContext = createContext()

function App() {
  const { token, setToken } = useToken()

  return (
    <UserContext.Provider value={token}>
      <ThemeProvider theme={Theme}>
          <Routes>
            <Route exact path="/" element={token ? <Navigate replace to="/home" /> : <Navigate replace to="/login" />} />
            <Route exact path="/login" element={<Login setToken={setToken} />} />
            <Route exact path="/register" element={<Register setToken={setToken} />} />
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="/home" element={token ? <Home /> : <Navigate replace to="/login" />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/movies/:imdb_id" element={<Movie />} />
            <Route path="/:u_id" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;