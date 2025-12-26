import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider1 from '../../../public/slider1.jpg';
import Slider2 from '../../../public/slider2.jpg';
import Slider3 from '../../../public/slider3.jpg';
import Slider4 from '../../../public/slider4.jpg';
import Slider5 from '../../../public/slider5.jpg';
import Slider6 from '../../../public/slider6.jpg';
import Slider7 from '../../../public/slider7.jpg';
import Slider8 from '../../../public/slider8.jpg';
import Slider9 from '../../../public/slider9.jpg';
import Slider10 from '../../../public/slider10.jpg';
import Slider11 from '../../../public/slider11.jpg';
import Slider12 from '../../../public/slider12.jpg';
import Image from 'next/image';

const ImageSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,          
    speed: 1000,         
    cssEase: 'ease-in-out'
  };

  const sliderImages = [
    Slider1, Slider2, Slider3, Slider4, Slider5, Slider6,
    Slider7, Slider8, Slider9, Slider10, Slider11, Slider12
  ];

  return (
    <Slider {...settings}>
      {sliderImages.map((image, index) => (
        <div 
          key={index}
          style={{ width: '100%', height: '100vh', margin: '0', borderRadius: '0px !important' }}
        >
          <Image
            src={image}
            alt={`Slider ${index + 1}`}
            bgcolor="#000"
            objectFit='cover'
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
