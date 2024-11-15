import React, { useState } from 'react';
import './CrearListaModal.style.css';

function CrearListaModal({ onClose, onAgregarLista }) {
  const [nombreLista, setNombreLista] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAgregarLista(nombreLista);
    setNombreLista('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nueva Lista de Compras</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre de la Lista</label>
          <input
            type="text"
            value={nombreLista}
            onChange={(e) => setNombreLista(e.target.value)}
            required
          />
          <button type="submit" className="boton-crear">Crear Lista</button>
        </form>
        <button className="boton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default CrearListaModal;
