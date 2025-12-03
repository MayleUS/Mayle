import { Link } from "react-router-dom";
import ShinyText from "../../../componentes/ShinyText";
import { useRef, useState, useEffect } from "react";

export default function HeroGallery() {
  const slides = [
    {
      image: "https://res.cloudinary.com/dvgpq1ezx/image/upload/f_auto,q_auto/v1758827001/SIRENA2_vun0fa.jpg",
      category: "Discover",
      title: "New Summer Collection",
      description: "Discover the latest fashion trends with unique and elegant pieces.",
      button: { text: "Shop Now", link: "/categoria/SWIMSUITS" },
    },
    {
      image: "https://res.cloudinary.com/dvgpq1ezx/image/upload/f_auto,q_auto/v1759024265/IMG_3813ffqqee_wqk81a.jpg",
      category: "Explore",
      title: "Urban Style & Comfort",
      description: "Comfort and elegance combined for your everyday life.",
      button: { text: "Discover Collection", link: "/categoria/SKIRTS" },
    },
    {
      image: "https://res.cloudinary.com/dvgpq1ezx/image/upload/f_auto,q_auto/v1759024404/IMG_3814lll_lht680.jpg",
      category: "Luxury",
      title: "Explore New Horizons",
      description: "Refresh your wardrobe with unique and sophisticated pieces.",
      button: { text: "Explore More", link: "/categoria/DRESSES" },
    },
  ];

  const [index, setIndex] = useState(0);
  const galleryRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  // Precargar todas las imágenes
  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = galleryRef.current.scrollLeft;
      const width = galleryRef.current.offsetWidth;
      setIndex(Math.round(scroll / width));
    };
    const gallery = galleryRef.current;
    gallery.addEventListener("scroll", handleScroll);
    return () => gallery.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        galleryRef.current.scrollTo({
          left: next * galleryRef.current.offsetWidth,
          behavior: "smooth",
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const startDrag = (e) => {
    isDragging.current = true;
    galleryRef.current.classList.add("cursor-grabbing");
    startX.current = e.pageX - galleryRef.current.offsetLeft;
    scrollStart.current = galleryRef.current.scrollLeft;
  };

  const endDrag = () => {
    isDragging.current = false;
    galleryRef.current.classList.remove("cursor-grabbing");
  };

  const moveDrag = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    galleryRef.current.scrollLeft = scrollStart.current - (x - startX.current) * 1.5;
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={galleryRef}
        className="flex overflow-x-auto snap-x snap-mandatory cursor-grab select-none scrollbar-hidden"
        onMouseDown={startDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onMouseMove={moveDrag}
        style={{ scrollBehavior: "smooth" }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="snap-start flex-shrink-0 relative"
            style={{ width: "100vw", height: "500px" }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              draggable={false}
              className="object-cover w-full h-full"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <span className="uppercase text-[11px] tracking-widest text-gray-200 mb-2">
                {slide.category}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif uppercase text-white drop-shadow-lg mb-4 leading-snug">
                {slide.title}
              </h2>
              <p className="text-sm md:text-lg text-gray-200 mb-6 max-w-xl drop-shadow-md leading-relaxed">
                {slide.description}
              </p>
              <Link
                to={slide.button.link}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <button className="rounded-full px-6 py-2 border border-gray-200 bg-black bg-opacity-60 relative overflow-hidden group transition hover:bg-opacity-80">
                  <ShinyText
                    text={slide.button.text}
                    disabled={false}
                    speed={3}
                    className="uppercase text-[11px] tracking-wider font-semibold text-white"
                  />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, j) => (
          <div
            key={j}
            className={`h-[4px] w-[30px] transition-all ${j === index ? "bg-white" : "bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}
