import React from "react";
import AdminFloatingButton from "./AdminFloatingButton";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <a href="/aviso-legal">Aviso legal</a>
          <a href="/privacidad">Privacidad</a>
          <a href="/cookies">Cookies</a>
        </div>
        <div className="footer-admin">
          <AdminFloatingButton />
        </div>
      </div>
    </footer>
  );
}
