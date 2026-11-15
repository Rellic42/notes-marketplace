"use client";
// Shows 5 stars. If onRate is given, the stars are clickable.
export default function Stars({ value = 0, onRate }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? "on" : ""}
          onClick={onRate ? () => onRate(n) : undefined}
          style={{ cursor: onRate ? "pointer" : "default" }}>★</span>
      ))}
    </span>
  );
}
