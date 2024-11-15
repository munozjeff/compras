import React, { useEffect, useState } from 'react';
import './Register.style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setError } from '../../store/authSlice';
import { encodeImageToBase64, decodeBase64ToImage } from '../../utils/imageUtils';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    password:'',
    nombres: '',
    apellidos: '',
    tipoDocumento: '',
    numeroDocumento: '',
    genero: '',
    // correo: '',
    telefono: '',
    rol: '',
    fechaNacimiento: '',
    foto: null,
  });

  // const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(state => state.auth);

  const location = useLocation();
  const credentials = location.state?.credentials; // Accede a 'referrer'

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
    
  // },[referrer])

  useEffect(() => {
    if (error) {
      alert('ERROR: ' + error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !formData.password ||
      !formData.nombres ||
      !formData.apellidos ||
      !formData.tipoDocumento ||
      !formData.numeroDocumento ||
      !formData.genero ||
      // !formData.correo ||
      !formData.telefono ||
      !formData.rol ||
      !formData.fechaNacimiento
    ) {
      dispatch(setError('Todos los campos son obligatorios'))
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      dispatch(setError('El correo electrónico no es válido'))
      return;
    }

    if (!/^\d{10}$/.test(formData.telefono)) {
      dispatch(setError('El número de teléfono debe tener 10 dígitos'))
      return;
    }

    const {password,foto,...rest} = formData
 
    
    if (credentials.password !== password) {
      dispatch(setError('Las contraseñas no coinciden')) 
      return;  
    }

    const send = async (foto) =>{
      const base64 = await handleImageChange(foto);
      dispatch(registerUser({ email:credentials.email, password:credentials.password, additionalData: {...rest,correo:credentials.email,foto:base64} }));
    }
    send(foto)
  };

  const handleImageChange = async (foto) => {
    if (foto) {
      const base64 = await encodeImageToBase64(foto);
      return base64;
    }
    return null;
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={credentials?.email || ""} onChange={handleChange} disabled/>
        
        <label>Password:</label>
        <input type="password" name="password" value={credentials?.password || ""} onChange={handleChange} />

        <label>Confirmar password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />

        <label>Nombres:</label>
        <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} />

        <label>Apellidos:</label>
        <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} />

        <label>Tipo de Documento:</label>
        <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="DNI">DNI</option>
          <option value="Pasaporte">Pasaporte</option>
          <option value="Licencia">Licencia de Conducir</option>
        </select>

        <label>Número de Documento:</label>
        <input type="text" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleChange} />

        <label>Género:</label>
        <select name="genero" value={formData.genero} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>

        {/* <label>Correo Electrónico:</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} /> */}

        <label>Número de Teléfono:</label>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />

        <label>Rol:</label>
        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="user">Cliente</option>
          <option value="admin">Administrador</option>
        </select>

        <label>Fecha de Nacimiento:</label>
        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />

        <label>Foto:</label>
        <input type="file" name="foto" onChange={handleFileChange} />

        {error && <p className="error-message">{error}</p>}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
