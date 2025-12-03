export default function SubMenu({ secciones = {} }) {
  return (
    <div
      className="absolute left-0 top-full w-screen bg-[#F9F8F7]
                 py-10 px-20 transition-all duration-300 ease-out z-50
                 animate-fadeSlideDown"
    >
      <div className="grid grid-cols-3 gap-16 text-[11px] text-gray-700">
        {Object.entries(secciones).map(([titulo, items], idx) => (
          <div key={idx}>
            <h4 className="font-semibold mb-4 text-black uppercase tracking-wide text-[12px]">
              {titulo}
            </h4>
            <ul className="space-y-2">
              {items.map((item, j) => (
                <li key={j} className="hover:text-black cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}