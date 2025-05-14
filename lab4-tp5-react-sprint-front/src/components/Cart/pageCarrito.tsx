// src/pages/CartPage.tsx (Modificar este archivo)
import { useState } from "react";
import { useCart } from "../../context/CarritoContext"; // Hook para acceder al contexto del carrito
import { Link } from "react-router-dom"; // Para enlaces internos
import { createMercadoPagoPreference } from "../../controllers/MPController"; // Importa la función que llama al backend MP (retorna ID)
import { Pedido } from "../../models/Pedido"; // Importa el modelo Pedido
import axios from 'axios'; // Necesario para isAxiosError en el manejo de errores

// *** Paso 5: Importar el componente que renderiza el Wallet ***
import MercadoPagoWallet from '../../components/MPWallet'; // Asegúrate de que la ruta sea correcta


const CartPage = () => {
  const {
    cart, // El estado del carrito
    removeFromCart, // Función para remover items
    updateQuantity, // Función para actualizar cantidad
    totalItems, // Total de items en el carrito
    // totalPrice, // Ya no se usa directamente en el renderizado de CartPage
    clearCart, // Función para vaciar el carrito (usar al confirmar pago final)
    finalizarPedido, // Llama al backend para guardar el pedido (Debe devolver el Pedido guardado con ID)
  } = useCart();

  // Estados para el manejo de la UI (carga, mensajes)
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // *** Estado para guardar el ID de la preferencia de Mercado Pago ***
  // Inicialmente es null, se llenará al obtener el ID del backend.
  const [mpPreferenceId, setMpPreferenceId] = useState<string | null>(null);


  // Cálculos de totales para mostrar en el resumen (corregidos previamente)
  const totalEnvio = cart.reduce(
    (sum, item) => {
      const costoEnvioItem = item.costoEnvio === "G" ? 0 : Number(item.costoEnvio) || 0;
      return sum + costoEnvioItem * item.quantity;
    },
    0
  );

  const totalProductosSinEnvio = cart.reduce(
    (sum, item) => sum + Number(item.precio) * item.quantity,
    0
  );

  const totalGeneral = totalProductosSinEnvio + totalEnvio;


  // *** Paso 5a: Función que maneja el click en "Confirmar Pedido y Pagar" ***
  // Esta función orquesta el guardado del pedido y la obtención del ID de preferencia de MP.
  const handleConfirmOrder = async () => {
    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
      setMessage("El carrito está vacío");
      setMessageType("error");
      return;
    }

    // Iniciar el proceso: mostrar carga, limpiar mensajes anteriores
    setIsProcessing(true);
    setMessage("Confirmando tu pedido y preparando el pago...");
    setMpPreferenceId(null); // Asegurarse de que no se muestre el Wallet anterior si hubo un intento previo


    try {
      // 1. Llamar al backend para guardar el pedido en la base de datos
      // (finalizarPedido debe encargarse de esto y devolver el Pedido guardado CON SU ID)
      const savedPedido: Pedido = await finalizarPedido(); // <--- Llama a tu lógica de guardar pedido


      if (savedPedido && savedPedido.id) {
        // Si el pedido se guardó exitosamente y tenemos su ID
        setMessage(`Pedido #${savedPedido.id} guardado con éxito. Preparando opción de pago...`);
        setMessageType("success");

        // 2. Llamar al backend para crear la preferencia de Mercado Pago y obtener el ID
        try {
          // Llama a la función que va al backend MP y espera el ID de preferencia
          const preferenceId = await createMercadoPagoPreference(savedPedido); // <--- Llama a tu lógica de crear preferencia en backend


          if (preferenceId) {
            // Si se obtiene el ID de preferencia correctamente
            // *** Paso 5b: Guardar el ID de la preferencia en el estado ***
            setMpPreferenceId(preferenceId); // Al actualizar este estado, se renderizará el componente Wallet
            setMessage("Pedido listo. Utiliza la opción de pago de Mercado Pago para completar la compra.");
            setMessageType("success");

            // ¡Importante! NO limpiar el carrito aquí. El usuario aún no ha pagado a Mercado Pago.
            // clearCart(); // Esta lógica debe ir en el manejador de webhooks o la página de retorno de éxito.

          } else {
             // Esto no debería pasar si el backend devuelve un string vacío o null
             setMessage("Pedido guardado, pero no se pudo obtener el ID de la preferencia de pago.");
             setMessageType("error");
          }

        } catch (mpError: unknown) {
          // Capturar y manejar errores al llamar al backend MP
          console.error("Error al obtener ID de preferencia de Mercado Pago:", mpError);
          let errorMessage = "Ocurrió un error al preparar el componente de pago.";
           if (axios.isAxiosError(mpError)) {
             errorMessage = `Error al comunicarse con Mercado Pago: ${mpError.response?.data?.message || mpError.response?.data || mpError.message || mpError.toString()}`;
           } else if (mpError instanceof Error) {
             errorMessage = `Error interno: ${mpError.message}`;
           }
          setMessage(`Pedido guardado, pero ${errorMessage}`);
          setMessageType("error");
        }

      } else {
        // Capturar error si finalizarPedido no devolvió un Pedido válido con ID
        console.error("finalizarPedido no devolvió un Pedido válido:", savedPedido);
        setMessage("Pedido realizado, pero no se pudo obtener la información necesaria para iniciar el pago.");
        setMessageType("error");
      }

    } catch (err: unknown) {
      // Capturar y manejar errores generales al guardar el pedido
      console.error("Error al finalizar el pedido:", err);
      let errorMessage = "Ocurrió un error desconocido al procesar el pedido.";
       if (axios.isAxiosError(err)) {
          errorMessage = `Error al guardar el pedido: ${err.response?.data?.message || err.response?.data || err.message || err.toString()}`;
       } else if (err instanceof Error) {
           errorMessage = `Error interno al guardar pedido: ${err.message}`;
       }
      setMessage(`Error al procesar el pedido: ${errorMessage}`);
      setMessageType("error");
    } finally {
        // Detener el indicador de carga una vez que todo el proceso (guardar y obtener ID) finaliza
        setIsProcessing(false);
    }
  };


  return (
    <div className="container my-5">
      <h2 className="mb-4">Tu Carrito ({totalItems} items)</h2>

      {/* Mensaje de resultado */}
      {message && (
         <div className={`alert ${messageType === "error" ? "alert-danger" : "alert-success"} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
         </div>
      )}

      {cart.length === 0 ? (
        // ... Mostrar mensaje de carrito vacío ...
         <div className="alert alert-info d-flex flex-column align-items-start">
           <p className="mb-3">Tu carrito está vacío. ¡Agrega algunos instrumentos!</p>
           <Link to="/instrumento" className="btn btn-primary mt-2">Ver instrumentos</Link>
         </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {/* ... Listado de items del carrito (código que ya tienes) ... */}
             {cart.map((item) => (
               <div key={item.id} className="card mb-3">
                 <div className="row g-0">
                   <div className="col-md-3">
                     <img src={`/img/${item.imagen}`} alt={item.nombre} className="img-fluid rounded-start" />
                   </div>
                   <div className="col-md-9">
                     <div className="card-body">
                       <h5 className="card-title">{item.nombre}</h5>
                       <p className="card-text mb-1">Precio unitario: ${item.precio.toFixed(2)}</p>
                       {Number(item.costoEnvio) > 0 ? (
                         <p className="card-text text-danger mb-1">+ Envío: ${Number(item.costoEnvio).toFixed(2)}</p>
                       ) : (
                         <p className="card-text text-success mb-1"><i className="bi bi-check-circle-fill me-1"></i> Envío gratis</p>
                       )}
                       <div className="d-flex align-items-center mb-3">
                         <label htmlFor={`quantity-${item.id}`} className="me-2">Cantidad:</label>
                         <input
                           type="number"
                           id={`quantity-${item.id}`}
                           min="1"
                           value={item.quantity}
                           onChange={(e) => {
                             const value = parseInt(e.target.value);
                             if (!isNaN(value) && value > 0) {
                               updateQuantity(item.id, value);
                             }
                           }}
                           className="form-control w-25 me-3"
                         />
                         <button onClick={() => removeFromCart(item.id)} className="btn btn-outline-danger">
                           <i className="bi bi-trash"></i>
                         </button>
                       </div>
                       <p className="card-text fw-bold">
                         Subtotal{Number(item.costoEnvio) > 0 ? " (incluye envío)" : ""}:
                         ${((Number(item.precio) + (Number(item.costoEnvio) || 0)) * item.quantity).toFixed(2)}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Resumen del Pedido</h5>
                <hr />
                {/* Mostrar Totales Calculados */}
                <div className="d-flex justify-content-between mb-2">
                  <span>Total productos:</span>
                  <span>${totalProductosSinEnvio.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total envío:</span>
                  <span>${totalEnvio.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total general:</span>
                  <span>${totalGeneral.toFixed(2)}</span>
                </div>

                {/* *** Paso 5c: Lógica de renderizado condicional *** */}

                {/* 1. Botón "Confirmar Pedido y Pagar" (visible si no hay MP ID y no está procesando) */}
                {!mpPreferenceId && !isProcessing && (
                    <button
                        className="btn btn-success w-100 mb-2"
                        onClick={handleConfirmOrder} // Inicia el flujo de guardar y obtener ID
                        disabled={cart.length === 0} // Deshabilitado si el carrito está vacío
                    >
                         Confirmar Pedido y Pagar
                    </button>
                )}

                 {/* 2. Indicador de procesamiento (visible si isProcessing es true) */}
                 {isProcessing && (
                      <button className="btn btn-success w-100 mb-2" disabled>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Procesando...
                      </button>
                 )}

                {/* 3. Componente Wallet de Mercado Pago (visible si mpPreferenceId tiene un valor) */}
                {mpPreferenceId && (
                    // Pasar el ID de preferencia al componente que renderiza el Wallet
                    <div className="mt-3"> {/* Añade margen superior para separarlo */}
                        <MercadoPagoWallet preferenceId={mpPreferenceId} />
                    </div>
                )}


                {/* Botón "Vaciar Carrito" */}
                <button
                  onClick={clearCart} // Función para vaciar el carrito
                  className="btn btn-outline-danger w-100 mt-2" // Añadido mt-2
                  // Deshabilitar si el carrito está vacío, procesando, o si ya se generó el ID de MP (para evitar vaciar antes de pagar)
                  disabled={cart.length === 0 || isProcessing || !!mpPreferenceId}
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;