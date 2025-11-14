// src/components/CustomArrows.jsx
import { LuChevronLeftCircle, LuChevronRightCircle } from 'react-icons/lu';

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', color: '#065F46' }} // Tailwind class text-emerald-800 in hex
      onClick={onClick}
    >
      <LuChevronLeftCircle size={40} />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', color: '#065F46' }} // Tailwind class text-emerald-800 in hex
      onClick={onClick}
    >
      <LuChevronRightCircle size={40} />
    </div>
  );
};

export { PrevArrow, NextArrow };
