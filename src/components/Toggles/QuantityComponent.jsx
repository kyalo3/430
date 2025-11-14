import { useState } from "react";

const QuantityComponent = () => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={decreaseQuantity}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        -
      </button>
      <span className="text-lg">{quantity}</span>
      <button
        onClick={increaseQuantity}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        +
      </button>
    </div>
  );
};

export default QuantityComponent;
