import React, { useEffect, useState } from 'react';
import "./Login.style.css"
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setError } from '../../store/authSlice';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function Login() {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector(state => state.auth);
  const navigate = useNavigate();


  useEffect(()=>{
    if (user?.uid) {
      if (user?.rol === 'admin') {
        navigate('/admin');
      }
      else {
        navigate('/');
      }
    }
  },[user])

  const handleLoginChange = (e) => {
    setEmail(e.target.value.slice(0, 40)); // Limita a 40 caracteres
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.slice(0, 250)); // Limita a 250 caracteres
  };

  const gotoRegister = () => {
    if (!validatecredentials()) {
      return
    }
    
    // Redirigir a la página de registro con parámetros
    const credentials = {
      email: Email.toLowerCase(), // Normaliza a minúsculas
      password: password
    }
    navigate('/register', { state: { credentials: credentials } });
  }

  const validatecredentials = () => {
    // Validación de campos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Email || !password || Email.trim() === '' || password.trim() === '') {
      // setError('Todos los campos son obligatorios');
      dispatch(setError('Todos los campos son obligatorios')); // Limpia el mensaje de error
      return false;
    }
    else if (!emailRegex.test(Email)) {
      if (!emailRegex.test(Email)) {
        dispatch(setError('Por favor, ingresa un correo electrónico válido'));
        return false;
      }
    }
    else{
      return true;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatecredentials()) {
      return;
    }

    // Enviar datos al backend para su validación y cifrado
    const credentials = {
      email: Email.toLowerCase(), // Normaliza a minúsculas
      password: password
    }
    dispatch(loginUser(credentials));
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={Email}
            onChange={handleLoginChange}
            maxLength="40"
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            maxLength="250"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Ingresar</button>
        <button type="button" onClick={gotoRegister}>
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Login;
