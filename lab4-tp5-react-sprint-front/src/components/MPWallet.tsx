// src/components/MercadoPagoWallet.tsx (Crear este archivo)
import { Wallet } from '@mercadopago/sdk-react'; // Importa el componente Wallet
import React from 'react'; // Puede ser necesario importarlo explícitamente


// Paso 4: Definir los props que este componente espera
interface MercadoPagoWalletProps {
  preferenceId: string | null; // El ID de la preferencia recibido del backend
}

// Componente funcional que recibe el preferenceId como prop
function MercadoPagoWallet ({ preferenceId }: MercadoPagoWalletProps) {

  // La inicialización del SDK (initMercadoPago con la Public Key) se hace en index.tsx/App.tsx
  // La lógica para obtener el preferenceId se hace en CartPage.tsx (o donde se maneje el checkout)

  // Renderiza el componente Wallet SOLO si preferenceId tiene un valor
  return (
    <div className="mercado-pago-wallet-container"> {/* Contenedor opcional para estilos */}
      {preferenceId ? ( // Renderiza condicionalmente
        // El componente Wallet del SDK de MP
        <Wallet
          initialization={{ preferenceId: preferenceId, redirectMode:"blank" }} // Pasa el ID
          // redirectMode:"blank" abre la ventana de pago en una nueva pestaña
          // redirectMode:"self" redirige en la misma pestaña
          // redirectMode:"modal" (si está soportado) abre un modal

          // Personalización opcional del texto del botón
          // customization={{ texts:{ valueProp: 'smart_option'}}}
        />
      ) : (
        // Opcional: Mostrar un indicador de carga o nada mientras se obtiene el ID
        // <div>Cargando opción de pago...</div>
         null // No renderiza nada si no hay ID
      )}
    </div>
  );

}

export default MercadoPagoWallet;