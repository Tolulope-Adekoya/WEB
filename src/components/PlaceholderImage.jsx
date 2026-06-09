export default function PlaceholderImage({ className = "", alt = "", style = {} }) {
  return (
    <div
      className={`placeholder-img ${className}`}
      role="img"
      aria-label={alt || "placeholder image"}
      style={style}
    />
  );
}