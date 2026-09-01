import { Link } from "wouter";
import React from "react";
import "./AdminFloatingButton.css";

export default function AdminFloatingButton() {
  return (
    <div className="admin-floating-container">
      <Link href="/admin">
        <a className="admin-floating-button" aria-label="Abrir panel administrador">Área privada</a>
      </Link>
    </div>
  );
}
