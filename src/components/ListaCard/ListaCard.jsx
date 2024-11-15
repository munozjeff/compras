import React, { useEffect, useState } from 'react';
import './ListaCard.style.css';
import AgregarProductoModal from '../AgregarProductoModal/AgregarProductoModal';

function ListaCard({ lista, onAgregarProducto, toggleCompletado }) {
  const [mostrarProductoModal, setMostrarProductoModal] = useState(false);

  const handleAgregarProducto = (producto) => {
    onAgregarProducto(lista.id, producto);
    setMostrarProductoModal(false);
  };

  useEffect(() => {console.log(lista);
  }, [lista]);

  return (
    <div className="lista-card">
      <h3>{lista.nombre}</h3>
      <p>Creado: {lista.fechaRegistro}</p>
      <button className="boton-agregar-producto" onClick={() => setMostrarProductoModal(true)}>
        + Agregar Producto
      </button>

      <ul className="lista-productos">
        {lista.productos.map((producto, index) => (
          <li
            key={index}
            className={producto.completado ? 'producto-completado' : ''}
            onDoubleClick={() => toggleCompletado(lista.id, index)} // Doble clic para cambiar completado
          >
            <span>{producto.nombre}</span> - <span>{producto.sitio}</span>
          </li>
        ))}
      </ul>

      {mostrarProductoModal && (
        <AgregarProductoModal
          onClose={() => setMostrarProductoModal(false)}
          onAgregarProducto={handleAgregarProducto}
        />
      )}
    </div>
  );
}

export default ListaCard;
