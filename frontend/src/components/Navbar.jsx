import { useState } from "react";

const links = [["Home", "#home"], ["About", "#about"], ["Features", "#features"], ["How it works", "#how-it-works"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <a className="brand" href="#home"><span className="brand-mark">T</span><span>teamflow<span className="accent">.</span></span></a>
      <nav className={`nav-links ${open ? "open" : ""}`}>
        {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <a href="/login" className="login-link">Log in</a>
        <a href="/signup" className="button button-primary nav-cta">Get started <span>↗</span></a>
      </div>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? "✕" : "☰"}</button>
    </header>
  );
}
