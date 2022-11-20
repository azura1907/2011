import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom/dist';
import './App.css';
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthContext from './context/userContext';
import { ErrorPage } from './pages/404/ErrorPage';
import AddProductPage from './pages/addProductPage/AddProductPage';
import { HomePage } from './pages/dashboard/homePage/HomePage';
import { ProductsPage } from './pages/dashboard/products/ProductsPage';
import { LoginPage } from './pages/loginPage/LoginPage';
function App() {
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);


  return (
    <AuthContext.Provider value={{
      user,
      setUser
    }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace={true} />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/dashboard/products" element={<ProductsPage />} />
            <Route path="/dashboard/add-product" element={<AddProductPage />} />
            <Route path="/dashboard/edit-product/:id" element={<AddProductPage />} />
          </Route>

        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
