import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './globals.css'
import HomePage from './routes/home/home';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EditorPage from './routes/editor/editor';
import LoginPage from './routes/login/login';
import { AuthenticationContext, CurrentUserContext } from './lib/api';
import { useState, useEffect } from 'react';
import SettingsPage from './routes/user/settings';
import { checkLocalStorageToken } from './lib/api';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import RegisterPage from './routes/register/register';
import MultiplayerPage from './routes/multiplayer/multiplayer';
import { MultiplayerWebsocketProvider } from './routes/multiplayer/websocket';
import { ChallengeContextProvider } from './routes/multiplayer/challengecontext';
import PublisherPage from './routes/publisher/publisher';
import RecentlyPlayedPage from './routes/home/recent';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/recent",
    element: <RecentlyPlayedPage />,
  },
  {
    path: "/editor/:pk",
    element: <EditorPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/settings",
    element: <SettingsPage />
  },
  {
    path: "/multiplayer",
    element: <MultiplayerPage />
  },
  {
    path: "/multiplayer/editor/:pk",
    element: <EditorPage multiplayer />
  },
  {
    path: "/publisher",
    element: <PublisherPage multiplayer />
  }
  ]);

function RouterProviderWithAuthenticationContext() {
  const [[isLogged, token], setAuthentication] = useState([false, null])
  const [user, setUser] = useState({})

  // Check in local storage for a token
  useEffect(() => {
    if (isLogged)
      return

    checkLocalStorageToken(setAuthentication)
  }, [])

  return <AuthenticationContext.Provider value={{
    isLogged: isLogged,
    token: token,
    setAuthentication: setAuthentication
  }}>
    <CurrentUserContext.Provider value={{
      user: user,
      setUser: setUser
    }}>
      <MultiplayerWebsocketProvider>
        <ChallengeContextProvider>
          <RouterProvider router={router} />
        </ChallengeContextProvider>
      </MultiplayerWebsocketProvider>
    </CurrentUserContext.Provider>
  </AuthenticationContext.Provider>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Theme>
      <RouterProviderWithAuthenticationContext />
    </Theme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
