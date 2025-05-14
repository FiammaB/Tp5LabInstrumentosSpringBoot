// src/services/authService.ts

import { Usuario, LoginPayload } from '../models/Usuario'; // Asegúrate de que la ruta sea correcta
// Asegúrate de que la ruta sea correcta
const API_BASE_URL = 'http://localhost:8080/api/auth'; // URL base de tus endpoints de autenticación

// Función para realizar la petición de login al backend
export const login = async (credentials: LoginPayload): Promise<Usuario> => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            // Si la respuesta no es exitosa, lanzamos un error
            const errorText = await response.text();
            throw new Error(errorText || 'Error en el login');
        }

        // Si es exitosa, parseamos la respuesta y creamos una instancia de Usuario
        const usuarioData = await response.json();
        const usuarioAutenticado = new Usuario(
            usuarioData.id,
            usuarioData.nombreUsuario,
            usuarioData.rol
        );

        return usuarioAutenticado; // Retorna el objeto Usuario

    } catch (error) {
        console.error('Error en la petición de login:', error);
        // Relanzamos el error para que el componente que llama lo pueda manejar
        throw error;
    }
};

// Puedes añadir otras funciones relacionadas con autenticación aquí, por ejemplo:
// export const logout = async () => { ... };
// export const checkAuthStatus = async () => { ... };