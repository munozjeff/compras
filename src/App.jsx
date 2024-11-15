import { useEffect, useState } from 'react'
import './App.css'
import Home from './Pages/Home/Home'
import Login from './components/Login/Login'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import Register from './components/Register/Register';
import PrivateRoute from './utils/privateRoute';
import Spinner from './components/Spinner/Spinner';


function App() {
  const [count, setCount] = useState(0)
  const { loading: authLoading } = useSelector(state => state.auth);
  const { loading: dataLoading } = useSelector(state => state.data);
  return (
    <>
      {authLoading || dataLoading && <Spinner />}
      <Routes>
        {/* <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NoMatch />} />
        </Route> */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        {/* <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home/>} />
          <Route path="*" element={<h1>Ruta no definia</h1>} />
        </Route> */}

        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/admin" element={<h1>ADMIN</h1>} />
        </Route>

        {/* Ruta solo para usuarios regulares */}
        <Route element={<PrivateRoute requiredRole="user" />}>
          <Route path="/" element={<Home/>} />
        </Route>

        <Route path="*" element={<h1>Ruta no definia</h1>} />
      </Routes>
    </>
  )
}

export default App
