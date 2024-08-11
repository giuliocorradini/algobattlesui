import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './globals.css'
import HomePage from './routes/home';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EditorPage from './routes/editor/editor';
import LoginPage from './routes/login/login';
import { AuthenticationContext } from './lib/api';
import { useState } from 'react';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/editor/:pk",
    element: <EditorPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  }
]);

function RouterProviderWithAuthenticationContext() {
  const [ [isLogged, token], setAuthentication ] = useState([false, null])

  return <AuthenticationContext.Provider value={{
    isLogged: isLogged,
    token: token,
    setAuthentication: setAuthentication
  }}>
    <RouterProvider router={router} />
  </AuthenticationContext.Provider>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProviderWithAuthenticationContext />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
