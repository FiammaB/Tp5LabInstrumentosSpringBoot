import React from "react";

const DondeEstamos: React.FC = () => {
    return(
        <div>
            <h1>¿Dónde estamos?</h1>
            <p>Estamos ubicados en Av. San Martin y Av. Las Heras, Ciudad de Mendoza, Argentina.</p>
            <p>Nuestra tienda está abierta de lunes a viernes de 10:00 a 18:00 y los sábados de 10:00 a 14:00.</p>
            <p>¡Te esperamos!</p>
            <h2>Mapa de Ubicación</h2>
            <iframe
                title="Mapa de Ubicación"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.4481140085236!2d-68.8382907!3d-32.8863185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed2dd83f7%3A0xf41c7ab7e3522157!2sAv.%20San%20Mart%C3%ADn%20%26%20Av.%20Las%20Heras%2C%20M5502%20Capital%2C%20Mendoza!5e0!3m2!1ses-419!2sar!4v1745030399141!5m2!1ses-419!2sar"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
            ></iframe>
        </div>
    )}
export default DondeEstamos;