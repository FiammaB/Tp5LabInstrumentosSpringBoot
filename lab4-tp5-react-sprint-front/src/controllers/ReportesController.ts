type PedidoDataBackend = [number, number, number]; // [year, month, count]


// Asegúrate de que esta URL base coincida con la de tu backend
const API_BASE_URL = 'http://localhost:8080/api/reportes';

// Función para obtener la cantidad de pedidos por mes y año
// Esta función se encargará de la llamada a la API
export const getPedidosCountByMonthAndYear = async (): Promise<PedidoDataBackend[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/pedidos-por-mes-año`); // Llama al endpoint del backend

        if (!response.ok) {
            const errorText = await response.text();
            // Lanzar un error con más información para que el componente lo maneje
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }

        const data: PedidoDataBackend[] = await response.json();
        return data; // Devuelve los datos tal como vienen del backend

    } catch (error) {
        console.error('Error en la petición para obtener pedidos por mes/año:', error);
        // Relanzar el error para que el componente que usa este servicio lo maneje
        throw error;
    }
};




type CantidadVendidaDataBackend = [string, number]; // [nombreInstrumento, cantidadVendida]


// --- Nueva función para obtener la cantidad total vendida por instrumento ---
export const getCantidadVendidaPorInstrumento = async (): Promise<CantidadVendidaDataBackend[]> => {
    try {
        // Llama al nuevo endpoint del backend
        const response = await fetch(`${API_BASE_URL}/cantidad-vendida-por-instrumento`); // Asegúrate de que la URL sea correcta

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al obtener datos de cantidad vendida por instrumento: ${response.status} - ${errorText}`);
        }

        // Los datos serán un array de arrays, ej: [["Guitarra", 15], ["Teclado", 8]]
        const data: CantidadVendidaDataBackend[] = await response.json();
        return data; // Devuelve los datos recibidos

    } catch (error) {
        console.error('Error en la petición para obtener cantidad vendida por instrumento:', error);
        throw error; // Relanzar el error
    }

};
// descargar reporte Excel
export const downloadExcelReport = async (fechaDesde: string, fechaHasta: string): Promise<Response> => {
    try {
        // Construye la URL con los parámetros de fecha
        const url = `${API_BASE_URL}/excel-pedidos?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;

        const response = await fetch(url, {
            method: 'GET',
        });
        if (!response.ok) {
            // Intentamos leer el cuerpo como texto para obtener el mensaje de error del backend si existe
            const errorBody = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorBody || response.statusText}`);
        }


        return response; // Devuelve la respuesta raw si es OK
        // Nota: No llamamos a .json() o .blob() aquí. El componente que llame a esta función lo hará.

    } catch (error) {
        console.error('Error en la petición para descargar reporte Excel:', error);
        throw error; // Relanzar el error para que el componente lo maneje
    }
};



// --- Nueva función para solicitar la descarga del reporte PDF de un instrumento ---
// Recibe el ID del instrumento y devuelve la respuesta raw (Response)
export const downloadInstrumentoPdf = async (instrumentoId: number): Promise<Response> => { // Ajusta el tipo del ID si no es number
    try {
        // Construye la URL del endpoint con el ID del instrumento
        const url = `${API_BASE_URL}/instrumento-pdf/${instrumentoId}`;

        const response = await fetch(url, {
            method: 'GET', // La solicitud es GET
        });

        if (!response.ok) {
            // Intentamos leer el cuerpo como texto para obtener el mensaje de error del backend (ej. 404 Not Found)
            const errorBody = await response.text();
            // Incluir el estado en el mensaje de error
            throw new Error(`Error HTTP ${response.status} al obtener PDF: ${errorBody || response.statusText}`);
        }


        return response; // Devuelve la respuesta raw si es OK

    } catch (error) {
        console.error('Error en la petición para descargar PDF del instrumento:', error);
        throw error; // Relanzar el error
    }
};