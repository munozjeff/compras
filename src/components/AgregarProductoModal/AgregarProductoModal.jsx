import React, { useEffect, useState } from 'react';
import './AgregarProductoModal.style.css';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, addSitio, fetchSitioByUser } from '../../store/dataSlice';

function AgregarProductoModal({ onClose, onAgregarProducto}) {
  const [nombreProducto, setNombreProducto] = useState('');
  const [sitio, setSitio] = useState('');
  // const [sitios, setSitios] = useState(['Supermercado', 'Mercado Local', 'Tienda Online']);
  const [mostrarModalSitio, setMostrarModalSitio] = useState(false);
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const {sitios} = useSelector((state) => state.data);


  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchSitioByUser({userId: user.uid, url_collection: "sitios"}));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAgregarProducto({ nombre: nombreProducto, sitio });
    setNombreProducto('');
    setSitio('');
  };

  const handleAbrirModalSitio = () => {
    setMostrarModalSitio(true);
  };

  const handleCerrarModalSitio = () => {
    setMostrarModalSitio(false);
  };

  const handleAgregarSitio = (nuevoSitio) => {
    const fechaRegistro = new Date().toLocaleString(); // Captura la fecha y hora del sistema
    const sitioObj = { nombre: nuevoSitio, fechaRegistro, idUser: user.uid };
    dispatch(addSitio({ url_collection: "sitios", newData: sitioObj }));
    // if (nuevoSitio && !sitios.includes(nuevoSitio)) {
    //   setSitios([...sitios, nuevoSitio]);
    // }
    setMostrarModalSitio(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre del Producto</label>
          <input
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            required
          />

          <label>Sitio de Compra</label>
          <div className="sitio-select-container">
            <select value={sitio} onChange={(e) => setSitio(e.target.value)} required>
              <option value="">Seleccione un sitio</option>
              {sitios.map((sitio, index) => (
                <option key={index} value={sitio.nombre}>{sitio.nombre}</option>
              ))}
            </select>

            <button
              type="button"
              className="boton-agregar-sitio"
              onClick={handleAbrirModalSitio}
            >
              +
            </button>
          </div>

          <button type="submit" className="boton-agregar">Agregar Producto</button>
        </form>

        <button className="boton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>

      {/* Modal para agregar sitio */}
      {mostrarModalSitio && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar Nuevo Sitio</h2>
            <input
              type="text"
              id="nuevo-sitio"
              placeholder="Nombre del nuevo sitio"
            />
            <button
              className="boton-agregar"
              onClick={() => {
                const nuevoSitio = document.getElementById('nuevo-sitio').value;
                handleAgregarSitio(nuevoSitio);
              }}
            >
              Agregar Sitio
            </button>
            <button className="boton-cerrar" onClick={handleCerrarModalSitio}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgregarProductoModal;
