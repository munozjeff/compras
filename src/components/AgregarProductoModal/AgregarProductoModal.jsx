import React, { useState } from 'react';
import './AgregarProductoModal.style.css';

function AgregarProductoModal({ onClose, onAgregarProducto }) {
  const [nombreProducto, setNombreProducto] = useState('');
  const [sitio, setSitio] = useState('');

  const sitios = ['Supermercado', 'Mercado Local', 'Tienda Online'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAgregarProducto({ nombre: nombreProducto, sitio });
    setNombreProducto('');
    setSitio('');
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
          <select value={sitio} onChange={(e) => setSitio(e.target.value)} required>
            <option value="">Seleccione un sitio</option>
            {sitios.map((sitio, index) => (
              <option key={index} value={sitio}>{sitio}</option>
            ))}
          </select>

          <button type="submit" className="boton-agregar">Agregar</button>
        </form>
        <button className="boton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default AgregarProductoModal;
