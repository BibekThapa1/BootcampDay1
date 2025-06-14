import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const Banner = () => {
  const items = [
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <img
        src="https://cdn.britannica.com/17/196817-050-6A15DAC3/vegetables.jpg"
        alt="Fresh Fruits"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center  bg-opacity-40 text-white text-center px-4">
        <h2 className="text-lg md:text-2xl font-bold">Fresh Organic Fruits</h2>
        <p className="text-sm md:text-lg">Get farm-fresh fruits delivered to your doorstep.</p>
      </div>
    </div>,
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <img
        src="https://img.freepik.com/free-vector/vegetables-grocery-store-banner-template_23-2148606713.jpg"
        alt="Fresh Vegetables"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center  bg-opacity-40 text-white text-center px-4">
        <h2 className="text-lg md:text-2xl font-bold">Farm Fresh Vegetables</h2>
        <p className="text-sm md:text-lg">100% organic vegetables sourced locally.</p>
      </div>
    </div>,
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <img
        src="https://img.freepik.com/free-vector/healthy-food-promotion-banner-template_23-2148606711.jpg"
        alt="Healthy Grains"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center  bg-opacity-40 text-white text-center px-4">
        <h2 className="text-lg md:text-2xl font-bold">Healthy Grains & Pulses</h2>
        <p className="text-sm md:text-lg">Whole grains, rice, and pulses for a balanced diet.</p>
      </div>
    </div>,
  ];

  return (
    <AliceCarousel
      autoPlay
      autoPlayStrategy="none"
      autoPlayInterval={2000}
      animationDuration={1000}
      animationType="fadeout"
      infinite
      touchTracking
      disableDotsControls
      disableButtonsControls
      items={items}
    />
  );
};

export default Banner;