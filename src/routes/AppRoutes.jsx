import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../auth/ProtectedRoute";
import GuestRoute from "../auth/GuestRoute";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import EmployeesList from "../modules/employee-information/EmployeesList";
import EmployeeAdd from "../modules/employee-information/EmployeeAdd";
import EmployeeSetup from "../modules/employee-information/EmployeeSetup";
import AutoNumberSchemeList from "../modules/employee-information/AutoNumberSchemeList";
import OrganizationSettings from "../modules/organization-setting/OrganizationSetting";
import OrganizationDetails from "../modules/organization-setting/OrganizationDetails";
import SetupList from "../modules/organization-setting/setup/SetupList";
import SetupFormModal from "../modules/organization-setting/setup/SetupFormModal";

function AppRoutes() {
  return (
    <Routes>

      {/* ==================== AUTHENTICATION ==================== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
      </Route>

      {/* ==================== APPLICATION ==================== */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/employee-information/employeeslist" element={<EmployeesList />}/>
        <Route path="/employee-information/addEmployee"element={<EmployeeAdd />}/>
        <Route path="/employee-information/setup" element={<EmployeeSetup />}/>
        <Route path="/employee-information/setup/auto-number-scheme" element={<AutoNumberSchemeList />}/>
        <Route path="/organization-settings" element={<OrganizationSettings />}/>
        <Route path="/organization-settings/details" element={<OrganizationDetails />}/>
        <Route path="/organization-settings/:setupType" element={<SetupList />}>
          <Route path="add" element={<SetupFormModal />} />
        </Route>
      </Route>

      {/* ==================== DEFAULT ==================== */}
      <Route path="*" element={<Navigate to="/login" replace />}/>

    </Routes>
  );
}

export default AppRoutes;