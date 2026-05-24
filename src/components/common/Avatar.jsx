import React from "react";

export default function Avatar({ initial, color = "#58bbb3", size = 28 }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: color, fontSize: size * 0.43 }}
    >
      {initial}
    </span>
  );
}
