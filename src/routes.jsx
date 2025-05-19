import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import AddMoviePage from './pages/AddMoviePage';
import MoviesListPage from './pages/MoviesListPage';
import SignUpPage from './pages/SignUpPage';

// Dummy auth function (replace with your real auth logic)
const isAuthenticated = () => {
  return !!localStorage.getItem("authToken"); // or however you track login
};

// Wrapper for protected routes
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/signin" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root route based on auth status */}
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/movies-list" : "/signin"} replace />} />

        {/* Public route */}
        <Route path="/signin" element={
          isAuthenticated() ? (
            <Navigate to="/movies-list" replace />
          ) : (
            <SignInPage />
          )
        }/>

        <Route path="/signup" element={
          isAuthenticated() ? (
            <Navigate to="/movies-list" replace />
          ) : (
            <SignUpPage />
          )
        }/>

        {/* Protected routes */}
        <Route
          path="/movies-list"
          element={
            <PrivateRoute>
              <MoviesListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-movie"
          element={
            <PrivateRoute>
              <AddMoviePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-movie/:id"
          element={
            <PrivateRoute>
              <AddMoviePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
