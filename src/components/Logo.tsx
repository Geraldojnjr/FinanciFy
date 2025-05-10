import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean; // Se quiser mostrar o texto "Financify" ao lado do logo
}

const Logo: React.FC<LogoProps> = ({ className = '', showText = false }) => {
  return (
    <Link
      to="/"
      className={`flex items-center justify-center ${className}`.trim()}
      tabIndex={0}
    >
      <img
        src="/logo_financify.png"
        alt="Logo Financify"
        title="Financify"
        className="h-10 w-10 md:h-12 md:w-12 object-contain transition-all duration-200"
      />
        {showText && (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 32"
            className="h-6 md:h-8 ml-2"
            role="img"
            aria-label="FinanciFy"
        >
            <text
            x="0"
            y="24"
            fontFamily="'Poppins', sans-serif"
            fontWeight="600"
            fontSize="24"
            fill="#7A5CFA"
            >
            Financify
            </text>
        </svg>
        )}
    </Link>
  );
};

export default Logo;