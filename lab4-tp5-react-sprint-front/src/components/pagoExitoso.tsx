

import { useLocation, Link } from 'react-router-dom'; // ¡Importa Link!

const PagoExitoso = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const externalReference = queryParams.get('external_reference');
  const paymentId = queryParams.get('payment_id');

  return (
    <div className="container my-5 text-center">
      <h2 className="text-success">¡Pago Exitoso!</h2>
      <p>Tu compra ha sido confirmada.</p>
      {externalReference && <p>ID de tu pedido: **#{externalReference}**</p>}
      {paymentId && <p>ID de pago de Mercado Pago: {paymentId}</p>}
      <p className="mt-4">Gracias por tu compra.</p>

      {/* *** Agrega este botón para volver a ver productos *** */}
      <Link to="/instrumento" className="btn btn-primary mt-3 me-2"> {/* Ajusta la ruta si tu página de productos es diferente */}
        Ver más productos
      </Link>

      {/* Puedes mantener el enlace "Volver a la Tienda" si quieres, o usar solo uno */}
      {/* <Link to="/" className="btn btn-secondary mt-3">Volver a la Tienda Principal</Link> */}

    </div>
  );
};

export default PagoExitoso;