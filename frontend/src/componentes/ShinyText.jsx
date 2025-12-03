export default function ShinyText({ text, className = "" }) {
  return (
    <span
      className={`animate-shine bg-gradient-to-r from-gray-700 via-gray-300 to-gray-700 bg-[length:200%_100%] bg-clip-text text-transparent ${className}`}
    >
      {text}
    </span>
  );
}
