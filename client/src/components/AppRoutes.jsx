import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage/LandingPage';
import AuthPage from '../pages/AuthPage/AuthPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/' element={<AuthPage />} />
      <Route path='/' element={<ProfilePage />} />
      <Route path='/' element={<LandingPage />} />
    </Routes>
  )
}

export default AppRoutes;