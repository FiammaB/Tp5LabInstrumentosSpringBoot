import React from "react";
import { Carousel } from "react-bootstrap";

import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Musical Hendrix</h1>

      <Carousel className="home-carousel">
        <Carousel.Item>
          <img className="d-block w-100" src="/img/imagen1.jpg" alt="Primera imagen" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src="/img/imagen2.jpg" alt="Segunda imagen" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src="/img/imagen3.jpg" alt="Tercera imagen" />
        </Carousel.Item>
      </Carousel>

      <p className="home-description">
        Musical Hendrix es una tienda de instrumentos musicales con ya más de 15 años de
        experiencia. Tenemos el conocimiento y la capacidad como para informarte acerca de las
        mejores elecciones para tu compra musical.
      </p>
    </div>
  );
};

export default Home;
