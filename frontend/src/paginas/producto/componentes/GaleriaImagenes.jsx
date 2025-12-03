export default function GaleriaImagenes({ imagenes }) {
  return (
    <div
      className="flex flex-col gap-6 w-full max-w-[560px] mx-auto overflow-y-auto pr-2 scrollbar-hidden"
      style={{ height: "calc(120vh)" }}
    >
      {imagenes.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Vista ${i + 1}`}
          className="w-full h-auto object-cover"
        />
      ))}
    </div>
  );
}
