import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { smoothScrollTo } from '../utils/smoothScroll';

export function ScrollLink({ to, children, className, onClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handle = (e) => {
    e.preventDefault();
    onClick?.();
    if (location.pathname === '/') smoothScrollTo(to);
    else navigate(`/#${to}`);
  };

  return (
    <a href={`/#${to}`} className={className} onClick={handle}>
      {children}
    </a>
  );
}