// src/pages/CartPage.tsx
import { useState } from "react";
import { useCart } from "../../context/CarritoContext";
import { Link } from "react-router-dom";
import { createMercadoPagoPreference } from "../../controllers/MPController";//eeror : createMercadoPagoPreference no se encuentra en el contexto
import { Pedido } from "../../models/Pedido";//error: Pedido no se encuentra en el contexto
import axios from 'axios'; // Importar axios si lo necesitas para isAxiosError

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    clearCart,
    finalizarPedido, // Esta función devuelve el Pedido guardado
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  // *** Nuevo estado para guardar el init_point de Mercado Pago ***
  const [mpInitPoint, setMpInitPoint] = useState<string | null>(null);

  // ... Cálculos de totalEnvio, totalProductosSinEnvio, totalGeneral (ya corregidos) ...
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

  // *** Función para manejar el click en el botón inicial (Confirmar Pedido) ***
  const handleConfirmOrder = async () => { // Renombrada de handleCheckout
    if (cart.length === 0) {
      setMessage("El carrito está vacío");
      setMessageType("error");
      return;
    }

    setIsProcessing(true);
    setMessage("Confirmando tu pedido y preparando el pago...");
    setMpInitPoint(null); // Asegurarse de que el botón de MP no esté visible al iniciar

    try {
      // 1. Guardar el pedido en el backend
      const savedPedido: Pedido = await finalizarPedido();

      if (savedPedido && savedPedido.id) {
        setMessage(`Pedido #${savedPedido.id} guardado con éxito. Generando enlace de pago...`);
        setMessageType("success");

        // 2. Llamar al backend para crear la preferencia de Mercado Pago
        try {
          // Pasamos el objeto Pedido completo guardado (según tu último ajuste)
          const initPoint = await createMercadoPagoPreference(savedPedido);

          if (initPoint) {
            // *** Guardar el init_point en el estado en lugar de redirigir inmediatamente ***
            setMpInitPoint(initPoint);
            setMessage("Pedido listo. Haz click en 'Pagar con Mercado Pago' para completar la compra.");
            setMessageType("success");
            // No limpiamos el carrito aquí, el usuario aún no pagó.
            // clearCart(); // <-- Eliminar o mover esta línea a la confirmación de pago real (webhook/retorno)
          } else {
             setMessage("Pedido guardado, pero no se pudo obtener la URL de pago de Mercado Pago.");
             setMessageType("error");
          }

        } catch (mpError: unknown) {
          console.error("Error al generar preferencia de Mercado Pago:", mpError);
          let errorMessage = "Ocurrió un error al preparar el pago con Mercado Pago.";
          if (axios.isAxiosError(mpError)) {
            errorMessage = `Error al comunicarse con Mercado Pago: ${mpError.response?.data?.message || mpError.response?.data || mpError.message}`;
          } else if (mpError instanceof Error) {
            errorMessage = `Error interno: ${mpError.message}`;
          }
          setMessage(`Pedido guardado, pero ${errorMessage}`);
          setMessageType("error");
        }

      } else {
        console.error("finalizarPedido no devolvió un Pedido válido:", savedPedido);
        setMessage("Pedido realizado, pero no se pudo obtener la información necesaria para iniciar el pago.");
        setMessageType("error");
      }

    } catch (err: unknown) {
      console.error("Error al finalizar el pedido:", err);
      let errorMessage = "Ocurrió un error desconocido al procesar el pedido.";
       if (axios.isAxiosError(err)) {
          errorMessage = `Error al guardar el pedido: ${err.response?.data?.message || err.response?.data || err.message}`;
       } else if (err instanceof Error) {
           errorMessage = `Error interno al guardar pedido: ${err.message}`;
       }
      setMessage(`Error al procesar el pedido: ${errorMessage}`);
      setMessageType("error");
    } finally {
        setIsProcessing(false); // Detener el indicador de carga una vez que handleConfirmOrder finaliza
    }
  };

  // *** Función para manejar el click en el botón de Mercado Pago (para redirigir) ***
  const handlePayWithMP = () => {
      if (mpInitPoint) {
          // Redirigir al usuario a la página de pago de Mercado Pago
          window.location.href = mpInitPoint;
      }
  };


  return (
    <div className="container my-5">
      <h2 className="mb-4">Tu Carrito ({totalItems} items)</h2>

      {/* Mensaje de resultado */}
      {message && (
        <div
          className={`alert ${
            messageType === "error" ? "alert-danger" : "alert-success"
          }`}
        >
          {message}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="alert alert-info d-flex flex-column align-items-start">
          <p className="mb-3">
            Tu carrito está vacío. ¡Agrega algunos instrumentos!
          </p>
          <Link to="/instrumento" className="btn btn-primary mt-2">
            Ver instrumentos
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {/* ... listado de items del carrito ... */}
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
                {/* Usar los totales calculados */}
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

                {/* *** Botón para confirmar el pedido (Guarda en BD y prepara MP link) *** */}
                {!mpInitPoint && ( // Mostrar solo si aún no tenemos el link de MP
                    <button
                        className="btn btn-success w-100 mb-2"
                        onClick={handleConfirmOrder} // Llama a la nueva función
                        disabled={isProcessing || cart.length === 0}
                    >
                        {isProcessing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Procesando...
                            </>
                        ) : (
                            "Confirmar Pedido y Pagar" // Texto del botón
                        )}
                    </button>
                )}

                {/* *** Botón de Mercado Pago (aparece después de confirmar el pedido) *** */}
                {mpInitPoint && ( // Mostrar solo si ya tenemos el link de MP
                     <button
                        className="btn btn-primary w-100 mb-2" // O el estilo que prefieras para MP
                        onClick={handlePayWithMP} // Llama a la función de redirección
                        disabled={isProcessing} // Deshabilitar si se está procesando algo
                     >
                        Pagar con Mercado Pago
                     </button>
                )}


                <button
                  onClick={clearCart}
                  className="btn btn-outline-danger w-100"
                  // Deshabilitar si el carrito está vacío, se está procesando, o si ya se generó el link de MP (para evitar vaciar antes de pagar)
                  disabled={cart.length === 0 || isProcessing || !!mpInitPoint}
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