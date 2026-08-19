import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage/LandingPage';
import AuthPage from '../pages/AuthPage/AuthPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SignUpPage from '../pages/AuthPage/SignUpPage';
import LoginPage from '../pages/AuthPage/LoginPage';
import EquipmentPage from '../pages/EquipmentPage/EquipmentPage';
import EquipmentsPage from '../pages/EquipmentPage/EquipmentsPage';
import ProjectPage from '../pages/ProjectPage/ProjectPage';
import ProfilesPage from '../pages/ProfilePage/ProfilesPage';
import ProjectsPage from '../pages/ProjectPage/ProjectsPage';
import HomePage from '../pages/HomePage/HomePage';
import AddEquipmentPage from '../pages/EquipmentPage/AddEquipmentPage';
import AddProjectPage from '../pages/ProjectPage/AddProjectPage';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/equipment/:equipmentId' element={< EquipmentPage/>} />
      <Route path='/equipments' element={<EquipmentsPage />} />
      <Route path='/project/:projectId' element={<ProjectPage />} />
      <Route path='/projects' element={<ProjectsPage />} />
      <Route path='/profile/:profileId' element={<ProfilePage />} />
      <Route path='/profiles' element={<ProfilesPage />} />
      <Route path='/home' element={<HomePage />} />
      // add 
      <Route path='/addEquip' element={<AddEquipmentPage />} />
      <Route path='/addProject' element={<AddProjectPage />} />
    </Routes>
  )
}

export default AppRoutes;