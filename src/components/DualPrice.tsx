import React from 'react';

interface DualPriceProps {
  amount: number; // цена в лева
  className?: string;
  fontSize?: string;
}

const EURO_RATE = 1.95583;

const format = (value: number, currency: 'лв' | '€') => {
  return `${value.toFixed(2)} ${currency}`;
};

const DualPrice: React.FC<DualPriceProps> = ({ amount, className = '', fontSize = 'text-lg' }) => {
  const euro = amount / EURO_RATE;
  return (
    <span className={`flex gap-2 items-baseline ${className}`}> 
      <span className={fontSize} style={{ fontWeight: 600 }}>
        {format(amount, 'лв')}
      </span>
      <span className={fontSize} style={{ fontWeight: 600 }}>
        ({format(euro, '€')})
      </span>
    </span>
  );
};

export default DualPrice;
