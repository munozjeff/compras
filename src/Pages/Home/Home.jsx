import React, { useEffect, useState } from 'react';
import './Home.style.css';
import CrearListaModal from '../../components/CrearListaModal/CrearListaModal';
import ListaCard from '../../components/ListaCard/ListaCard';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, fetchDataByUser, updateItem } from '../../store/dataSlice';

function Home() {
  const [listas, setListas] = useState([]);
  const [mostrarCrearListaModal, setMostrarCrearListaModal] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { items, loading, error } = useSelector(state => state.data);
  const dispatch = useDispatch();

  useEffect(() => {console.log(items);
  }
  , [items]);

  useEffect(() => {
    if(user?.uid){
      dispatch(fetchDataByUser({url_collection:"listas",userId:user.uid}));
    }
  },[user]);

  const agregarLista = (nombreLista) => {
    const nuevaLista = {
      id_user: user.uid,
      id: "",
      nombre: nombreLista,
      fechaRegistro: new Date().toLocaleString(),
      productos: [],
    };
    
    dispatch(addItem({url_collection:"listas",newData:nuevaLista}));
    // setListas([...listas, nuevaLista]);
    setMostrarCrearListaModal(false);
  };

  const agregarProducto = (idLista, producto) => {
    // console.log(idLista);
    //{ id,url_collection, newData }
    //const list = listas.find(lista => lista.id === idLista);
    //const newData = { ...list, productos: [...list.productos, { ...producto, completado: false }] };
    //dispatch(updateItem({ id: idLista, url_collection:"listas", newData: { ...newData, id: idLista } }));
    // setListas(listas.map((lista) => 
    //   lista.id === idLista 
    //   ? { ...lista, productos: [...lista.productos, { ...producto, completado: false }] } 
    //   : lista
    // ));
    // console.log(listas.length);
    
    // listas.forEach((lista) => 
    // {
    //   console.log(lista.id);
    //   console.log(idLista);
      
    // }
    // );
    
    // const newLists = items.map((lista) => 
    //   lista.id === idLista 
    //   ? { ...lista, productos: [...lista.productos, { ...producto, completado: false }] } 
    //   : lista
    // );  
    const newList = items.find(item => item.id === idLista);
    if(newList){
      const newProducts = [...newList.productos, { ...producto, completado: false }];
      dispatch(updateItem({ id: idLista, url_collection:"listas", newData: { ...newList, productos: newProducts } }));
    }
  };

  const toggleCompletado = (idLista, indexProducto) => {
    const newList = items.find(item => item.id === idLista);
    if(newList){
      const newProducts = newList.productos.map((producto,index) =>
        index === indexProducto
          ? { ...producto, completado: !producto.completado }
          : producto
      );
      dispatch(updateItem({ id: idLista, url_collection:"listas", newData: { ...newList, productos: newProducts } }));
    }
    // const nuevaLista = listas.map((lista) =>
    //   lista.id === idLista
    //     ? {
    //         ...lista,
    //         productos: lista.productos.map((producto, index) =>
    //           index === indexProducto
    //             ? { ...producto, completado: !producto.completado }
    //             : producto
    //         ),
    //       }
    //     : lista
    // );
    // setListas(nuevaLista);
  };

  return (
    <div className="pagina-principal">
      <h1>Mis Listas de Compras</h1>
      <button className="boton-agregar-lista" onClick={() => setMostrarCrearListaModal(true)}>
        + Nueva Lista
      </button>
      
      <div className="lista-tarjetas">
        {[...items]
          .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
          .map((lista) => (
          <ListaCard
            key={lista.id}
            lista={lista}
            onAgregarProducto={agregarProducto}
            toggleCompletado={toggleCompletado} // Pasamos la función para cambiar el estado de completado
          />
        ))}
      </div>

      {mostrarCrearListaModal && (
        <CrearListaModal
          onClose={() => setMostrarCrearListaModal(false)}
          onAgregarLista={agregarLista}
        />
      )}
    </div>
  );
}

export default Home;
