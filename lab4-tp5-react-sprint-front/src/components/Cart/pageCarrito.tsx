import { useState } from "react";
import { useCart } from "../../context/CarritoContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
    finalizarPedido,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage("El carrito está vacío");
      setMessageType("error");
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const result = await finalizarPedido();
      setMessage(result);
      setMessageType(result.includes("éxito") ? "success" : "error");
    } catch (err) {
      console.error("Error al finalizar el pedido:", err);
        setMessage("Ocurrió un error al procesar el pedido");
      setMessageType("error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Calcular totales separados
  const totalEnvio = cart.reduce(
    
    (sum, item) => sum + (Number(item.costoEnvio) || 0)//error en item.costo envioThe left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
     * item.quantity,
    0
  );
  const totalConEnvio = totalPrice 
  
  const totalProductosSinEnvio = cart.reduce(
    (sum, item) => sum + Number(item.precio) * item.quantity,
    0
  );

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
            {cart.map((item) => (
              <div key={item.id} className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img
                      src={`/img/${item.imagen}`}
                      alt={item.nombre}
                      className="img-fluid rounded-start"
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">{item.nombre}</h5>
                      <p className="card-text mb-1">
                        Precio unitario: ${item.precio.toFixed(2)}
                      </p>
                      {Number(item.costoEnvio) > 0 ? (
                        <p className="card-text text-danger mb-1">
                          + Envío: ${Number(item.costoEnvio).toFixed(2)}
                        </p>
                      ) : (
                        <p className="card-text text-success mb-1">
                          <i className="bi bi-check-circle-fill me-1"></i> Envío
                          gratis
                        </p>
                      )}
                      <div className="d-flex align-items-center mb-3">
                        <label htmlFor={`quantity-${item.id}`} className="me-2">
                          Cantidad:
                        </label>
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
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="btn btn-outline-danger"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      <p className="card-text fw-bold">
                        Subtotal{Number(item.costoEnvio) > 0 ? " (incluye envío)" : ""}:
                        $
                        {(
                          (Number(item.precio) +
                            (Number(item.costoEnvio) || 0)) *
                          item.quantity
                        ).toFixed(2)}
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
                  <span>${totalConEnvio.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={handleCheckout}
                  disabled={isProcessing || cart.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Procesando...
                    </>
                  ) : (
                    "Finalizar Compra"
                  )}
                </button>
                <button
                  onClick={clearCart}
                  className="btn btn-outline-danger w-100"
                  disabled={cart.length === 0 || isProcessing}
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