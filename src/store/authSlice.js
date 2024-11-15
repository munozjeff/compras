// src/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, query, collection, where } from "firebase/firestore";
import { encryptPassword, decryptPassword } from '../utils/cryptoUtils';

// Registrar Usuario y Guardarlo en Firestore
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, additionalData }, { rejectWithValue }) => {
    try {
        if (additionalData.rol === 'admin') {
            // Paso 1: Verificar el número de administradores existentes
            const adminsQuery = query(
                collection(db, "users"),
                where("rol", "==", "admin") // Filtra por rol de administrador
            );
            const adminsSnapshot = await getDocs(adminsQuery);
            console.log(adminsSnapshot.size);
            
            if (adminsSnapshot.size >= 2) {
                // Si ya hay dos o más administradores, se rechaza la operación
                return rejectWithValue("Ya existen dos administradores registrados, no es posible el registro de un nuevo administrador.");
            }
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // // Guarda información adicional en Firestore
        // await setDoc(doc(db, "admin", user.uid), {
        //     email: user.email,
        // });
      // Guarda información adicional en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        ...additionalData, // Datos adicionales (ej. nombre, rol, etc.)
      });
      
      return { uid: user.uid};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login del Usuario y Cargar Información desde Firestore
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtiene los datos adicionales del usuario desde Firestore
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();  // Aquí obtienes todos los datos de Firestore
        return { uid: user.uid,rol:userData.rol};
      } else {
        throw new Error("No user data found!");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout del Usuario
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload; // Actualiza el mensaje de error
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setError } = authSlice.actions;
export default authSlice.reducer;
