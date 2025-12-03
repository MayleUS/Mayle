import React from "react";

const TextLoader = () => {
  return (
    <>
      <div className="textWrapper">
        <p className="text">Loading...</p>
        <div className="invertbox"></div>
      </div>

      <style jsx>{`
        /* Wrapper del texto */
        .textWrapper {
          height: fit-content;
          min-width: 3rem;
          width: fit-content;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.25ch;
          position: relative;
          z-index: 0;
          color: black; /* Cambiado para que se vea sobre fondo blanco */
          overflow: hidden;
        }

        .text {
          margin: 0;
          padding: 0;
        }

        /* Caja animada que “resalta” el texto */
        .invertbox {
          position: absolute;
          height: 100%;
          aspect-ratio: 1/1;
          left: 0;
          top: 0;
          border-radius: 20%;
          background-color: rgba(0, 0, 0, 0.15); /* Más visible sobre blanco */
          backdrop-filter: invert(100%);
          animation: move 2s ease-in-out infinite;
        }

        /* Animación del invertbox */
        @keyframes move {
          50% {
            left: calc(100% - 3rem);
          }
        }
      `}</style>
    </>
  );
};

export default TextLoader;
