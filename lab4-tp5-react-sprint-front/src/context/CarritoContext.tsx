import { createContext, useContext, useState, ReactNode } from "react";
import { Instrumento } from "../models/Instrumento";
import { Pedido, PedidoDetalle } from "../models/Pedido";
import pedidoController from "../controllers/PedidoController";
import axios from "axios";

interface CartItem extends Instrumento {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Instrumento) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  finalizarPedido: () => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Instrumento) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const finalizarPedido = async (): Promise<string> => {
    try {
      // Crear objetos DetallePedido
      const detallesPedido: PedidoDetalle[] = cart.map((item) => {
        // Extraemos quantity para que no aparezca en el objeto instrumento
        const { quantity, ...instrumentoProps } = item;
        
        // Crear una nueva instancia de PedidoDetalle
        return new PedidoDetalle(
          instrumentoProps as Instrumento, 
          quantity
        );
      });
      
      // Crear el objeto Pedido
      const pedidoParaEnviar = new Pedido(
        0, // inicializamos con 0, luego llamamos a calcularTotal
        detallesPedido,
        undefined,
        new Date().toISOString()
      );
      
      // Calcular el total
      pedidoParaEnviar.calcularTotal();

      console.log("Pedido que se enviará al backend:", pedidoParaEnviar);
      
      // Llamamos a la función del controlador y manejamos la respuesta
      const response = await pedidoController.createPedido(pedidoParaEnviar);
      
      // Comprobamos que la respuesta existe y tiene la propiedad necesaria
      if (response && response.id) {
        clearCart();
        return `¡Pedido #${response.id} realizado con éxito!`;
      } else {
        console.error("La respuesta del servidor no tiene el formato esperado:", response);
        return "Pedido realizado, pero no se pudo obtener el número de pedido.";
      }
    } catch (error) {
      console.error("Error al finalizar el pedido:", error);
      
      if (axios.isAxiosError(error)) {
        // Manejo específico para errores de Axios
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          return `Error: ${error.response.data.message || error.response.data || 'Error en el servidor'}`;
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          return "Error: No se recibió respuesta del servidor. Verifica tu conexión.";
        } else {
          // Algo ocurrió al configurar la petición
          return `Error al configurar la petición: ${error.message}`;
        }
      }
      
      // Error genérico
      return "Error al realizar el pedido. Intenta de nuevo.";
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cart.reduce((sum, item) => {
    // Convertir costoEnvio a número (0 si es "G")
    const costoEnvio = item.costoEnvio === "G" ? 0 : Number(item.costoEnvio) || 0;
    
    // Calcular subtotal (precio + envío) multiplicado por cantidad
    const subtotal = (Number(item.precio) + costoEnvio) * item.quantity;
    
    return sum + subtotal;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        finalizarPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};