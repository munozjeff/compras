// src/features/dataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";


// Thunks para cada operación CRUD
export const fetchData = createAsyncThunk("data/fetchData", async (url_collection) => {
  const querySnapshot = await getDocs(collection(db, url_collection));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

export const fetchDataByUser = createAsyncThunk(
    "data/fetchDataByUser",
    async ({ url_collection, userId }) => {
      try {
        // Crea la referencia a la colección
        const collectionRef = collection(db, url_collection);
      
        // Crea una consulta para filtrar documentos donde 'id_user' sea igual al 'userId' proporcionado
        const q = query(collectionRef, where("id_user", "==", userId));
      
        console.log("ejecuta");  // Este log se ejecutará cuando inicie la consulta
        const querySnapshot = await getDocs(q);
        
        // Si la consulta devuelve resultados, imprime los documentos
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(documents); // Muestra los documentos encontrados
  
        // Si no se encuentra ningún documento, puedes mostrar un mensaje también
        if (documents.length === 0) {
          console.log("No se encontraron documentos para este usuario.");
        }
  
        // Devuelve los documentos encontrados
        return documents;
      } catch (error) {
        console.error("Error al obtener los documentos:", error); // En caso de error, imprime el error
        throw error; // Lanza el error para ser manejado por Redux
      }
    }
  );
  


export const addItem = createAsyncThunk("data/addItem", async ({ url_collection, newData }, { dispatch }) => {
    try {
        // Agregar el nuevo documento
        const docRef = await addDoc(collection(db, url_collection), newData);
        console.log(docRef.id); // Este log debería funcionar

        // Esperar a que updateItem se complete antes de continuar
        await dispatch(updateItem({ id: docRef.id, url_collection, newData: { ...newData, id: docRef.id } }));
        
        return { id: docRef.id, ...newData }; // Retornar el objeto final si es necesario
  
    } catch (error) {
      console.error(error);
      throw new Error("Error al agregar el item o actualizarlo");
    }
  });
  

export const updateItem = createAsyncThunk("data/updateItem", async ({ id,url_collection, newData }) => {
    // console.log("updateItem",id,url_collection,newData);
  
    const docRef = doc(db, url_collection, id);
    await updateDoc(docRef, newData);
    return { ...newData };
});

export const deleteItem = createAsyncThunk("data/deleteItem", async ({id,url_collection}) => {
  const docRef = doc(db, url_collection, id);
  await deleteDoc(docRef);
  return id;
});

const dataSlice = createSlice({
  name: "data",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchDataByUser.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        console.log(action.payload);
        
        // const index = state.items.findIndex(item => item.id === action.payload.id);
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default dataSlice.reducer;
