import Slider from 'react-slick';
import { MdArrowRightAlt } from "react-icons/md";



const articles = [
  {
    title: "Bridging the Path to Wellness through Cash Assistance",
    image: "https://via.placeholder.com/600x400", // Replace with your image URLs
    link: "#"
  },
  {
    title: "Nourishing Hope",
    image: "https://via.placeholder.com/600x400", // Replace with your image URLs
    link: "#"
  },
  {
    title: "Closing the Gap, Breastfeeding Support for All",
    image: "https://via.placeholder.com/600x400", // Replace with your image URLs
    link: "#"
  }
  // Add more articles as needed
];

const ArticleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true, // Show arrows for navigation
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="w-full p-4">
      <Slider {...settings}>
        {articles.map((article, index) => (
          <div key={index} className="p-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <a href={article.link} className="flex text-red-500 font-normal gap-2 text-m items-center">
                <MdArrowRightAlt /> Read Article
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ArticleSlider;
