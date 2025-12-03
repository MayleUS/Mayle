export default function InfoStrip() {
  return (
    <div className="w-full bg-[#D5C8B5] overflow-hidden py-2">
      {/* Fila única → hacia la izquierda */}
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="mx-8 text-white text-sm tracking-[0.15em] uppercase">
          FREE shipping to Colombia on purchases over $200 USD
        </span>
        <span className="mx-8 text-white text-sm tracking-[0.15em] uppercase">
          FREE shipping to Colombia on purchases over $200 USD
        </span>
        <span className="mx-8 text-white text-sm tracking-[0.15em] uppercase">
          FREE shipping to Colombia on purchases over $200 USD
        </span>
        <span className="mx-8 text-white text-sm tracking-[0.15em] uppercase">
          FREE shipping to Colombia on purchases over $200 USD
        </span>
        <span className="mx-8 text-white text-sm tracking-[0.15em] uppercase">
          FREE shipping to Colombia on purchases over $200 USD
        </span>
      </div>
    </div>
  );
}