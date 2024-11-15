// src/features/dataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Thunks para cada operación CRUD
export const fetchData = createAsyncThunk(
  "data/fetchData",
  async (url_collection) => {
    const querySnapshot = await getDocs(collection(db, url_collection));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);

export const fetchDataByUser = createAsyncThunk(
  "data/fetchDataByUser",
  async ({ url_collection, userId }) => {
    try {
      const collectionRef = collection(db, url_collection);
      const q = query(collectionRef, where("id_user", "==", userId));
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return documents;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const addItem = createAsyncThunk(
  "data/addItem",
  async ({ url_collection, newData }, { dispatch }) => {
    try {
      const docRef = await addDoc(collection(db, url_collection), newData);
      await dispatch(updateItem({ id: docRef.id, url_collection, newData: { ...newData, id: docRef.id } }));
      return { id: docRef.id, ...newData };
    } catch (error) {
      throw new Error("Error al agregar el item o actualizarlo");
    }
  }
);

export const addSitio = createAsyncThunk(
  "data/addSitio",
  async ({ url_collection, newData }, { dispatch }) => {
    try {
      const docRef = await addDoc(collection(db, url_collection), newData);
      await dispatch(updateItem({ id: docRef.id, url_collection, newData: { ...newData, id: docRef.id } }));
      return { id: docRef.id, ...newData };
    } catch (error) {
      throw new Error("Error al agregar el sitio");
    }
  }
);

export const fetchSitioByUser = createAsyncThunk(
  "data/fetchSitioByUser",
  async ({ url_collection, userId }) => {
    try {
      const collectionRef = collection(db, url_collection);
      const q = query(collectionRef, where("idUser", "==", userId));
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return documents;
    } catch (error) {
      throw new Error("Error al obtener los sitios");
    }
  }
);

export const updateItem = createAsyncThunk(
  "data/updateItem",
  async ({ id, url_collection, newData }) => {
    const docRef = doc(db, url_collection, id);
    await updateDoc(docRef, newData);
    return { ...newData };
  }
);

export const deleteItem = createAsyncThunk(
  "data/deleteItem",
  async ({ id, url_collection }) => {
    const docRef = doc(db, url_collection, id);
    await deleteDoc(docRef);
    return id;
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: { items: [], sitios: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all data
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch data by user
      .addCase(fetchDataByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDataByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add item
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Add sitio
      .addCase(addSitio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSitio.fulfilled, (state, action) => {
        state.loading = false;
        state.sitios.push(action.payload);
      })
      .addCase(addSitio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch sitio by user
      .addCase(fetchSitioByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSitioByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.sitios = action.payload;
      })
      .addCase(fetchSitioByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;


// // src/features/dataSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
// import { db } from "../firebaseConfig";


// // Thunks para cada operación CRUD
// export const fetchData = createAsyncThunk("data/fetchData", async (url_collection) => {
//   const querySnapshot = await getDocs(collection(db, url_collection));
//   return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// });

// export const fetchDataByUser = createAsyncThunk(
//     "data/fetchDataByUser",
//     async ({ url_collection, userId }) => {
//       try {
//         // Crea la referencia a la colección
//         const collectionRef = collection(db, url_collection);
      
//         // Crea una consulta para filtrar documentos donde 'id_user' sea igual al 'userId' proporcionado
//         const q = query(collectionRef, where("id_user", "==", userId));
      
//         console.log("ejecuta");  // Este log se ejecutará cuando inicie la consulta
//         const querySnapshot = await getDocs(q);
        
//         // Si la consulta devuelve resultados, imprime los documentos
//         const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log(documents); // Muestra los documentos encontrados
  
//         // Si no se encuentra ningún documento, puedes mostrar un mensaje también
//         if (documents.length === 0) {
//           console.log("No se encontraron documentos para este usuario.");
//         }
  
//         // Devuelve los documentos encontrados
//         return documents;
//       } catch (error) {
//         console.error("Error al obtener los documentos:", error); // En caso de error, imprime el error
//         throw error; // Lanza el error para ser manejado por Redux
//       }
//     }
//   );
  


// export const addItem = createAsyncThunk("data/addItem", async ({ url_collection, newData }, { dispatch }) => {
//     try {
//         // Agregar el nuevo documento
//         const docRef = await addDoc(collection(db, url_collection), newData);
//         console.log(docRef.id); // Este log debería funcionar

//         // Esperar a que updateItem se complete antes de continuar
//         await dispatch(updateItem({ id: docRef.id, url_collection, newData: { ...newData, id: docRef.id } }));
        
//         return { id: docRef.id, ...newData }; // Retornar el objeto final si es necesario
  
//     } catch (error) {
//       console.error(error);
//       throw new Error("Error al agregar el item o actualizarlo");
//     }
//   });

//   export const addSitio = createAsyncThunk("data/addSitio", async ({ url_collection, newData }, { dispatch }) => {
//     try {
//         // Agregar el nuevo documento
//         const docRef = await addDoc(collection(db, url_collection), newData);

//         // Esperar a que updateItem se complete antes de continuar
//         await dispatch(updateItem({ id: docRef.id, url_collection, newData: { ...newData, id: docRef.id } }));
        
//         return { id: docRef.id, ...newData }; // Retornar el objeto final si es necesario
  
//     } catch (error) {
//       console.error(error);
//       throw new Error("Error al agregar el item o actualizarlo");
//     }
//   });


//   export const fetchSitioByUser = createAsyncThunk(
//     "data/fetchSitioByUser",
//     async ({ url_collection, userId }) => {
//       try {
//         // Crea la referencia a la colección
//         const collectionRef = collection(db, url_collection);
      
//         // Crea una consulta para filtrar documentos donde 'id_user' sea igual al 'userId' proporcionado
//         const q = query(collectionRef, where("idUser", "==", userId));
      
//         console.log("ejecuta");  // Este log se ejecutará cuando inicie la consulta
//         const querySnapshot = await getDocs(q);
        
//         // Si la consulta devuelve resultados, imprime los documentos
//         const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log(documents); // Muestra los documentos encontrados
  
//         // Si no se encuentra ningún documento, puedes mostrar un mensaje también
//         if (documents.length === 0) {
//           console.log("No se encontraron documentos para este usuario.");
//         }
  
//         // Devuelve los documentos encontrados
//         return documents;
//       } catch (error) {
//         console.error("Error al obtener los documentos:", error); // En caso de error, imprime el error
//         throw error; // Lanza el error para ser manejado por Redux
//       }
//     }
//   );
  

// export const updateItem = createAsyncThunk("data/updateItem", async ({ id,url_collection, newData }) => {
//     // console.log("updateItem",id,url_collection,newData);
  
//     const docRef = doc(db, url_collection, id);
//     await updateDoc(docRef, newData);
//     return { ...newData };
// });

// export const deleteItem = createAsyncThunk("data/deleteItem", async ({id,url_collection}) => {
//   const docRef = doc(db, url_collection, id);
//   await deleteDoc(docRef);
//   return id;
// });

// const dataSlice = createSlice({
//   name: "data",
//   initialState: { items: [],sitios:[], loading: false, error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchData.fulfilled, (state, action) => {
//         state.items = action.payload;
//       })
//       .addCase(fetchDataByUser.fulfilled, (state, action) => {
//         state.items = action.payload;
//       })
//       .addCase(addItem.fulfilled, (state, action) => {
//         state.items.push(action.payload);
//       })
//       .addCase(updateItem.fulfilled, (state, action) => {
//         console.log(action.payload);
        
//         // const index = state.items.findIndex(item => item.id === action.payload.id);
//         state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
//       })
//       .addCase(deleteItem.fulfilled, (state, action) => {
//         state.items = state.items.filter(item => item.id !== action.payload);
//       })
//       .addCase(addSitio.fulfilled, (state, action) => {
//         state.sitios.push(action.payload);
//       })
//       .addCase(fetchSitioByUser.fulfilled, (state, action) => {
//         state.sitios = action.payload
//       });
//   },
// });

// export default dataSlice.reducer;
