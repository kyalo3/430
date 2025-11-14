import { MdArrowBack, MdArrowForward } from 'react-icons/md';

const CustomArrows = ({ onPrevClick, onNextClick, currentSlide, totalSlides }) => {
  return (
    <div className="flex items-center justify-end w-64 absolute top-0 right-24">
      <button onClick={onPrevClick} className="text-white rounded-full p-2 bg-emerald-600 hover:bg-emerald-700">
        <MdArrowBack size={30} />
      </button>
      <span className="text-white">
        {currentSlide}/{totalSlides}
      </span>
      <button onClick={onNextClick} className="text-white rounded-full p-2 bg-emerald-600 hover:bg-emerald-700">
        <MdArrowForward size={30} />
      </button>
    </div>
  );
};

export default CustomArrows;
