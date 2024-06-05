// import React from "react";
import Navbar from "../../components/Layout/Home/Navbar/Navbar";
import Banner from "../../components/Layout/Home/Banner/Banner";
import BannerBottom from "../../components/Layout/Home/Banner/BannerBottom";
// import ProductCart from "../../components/Product/ProductCart";
import ViewedProduct from "../../components/TrendingProduct";
import RecommendationProduct from "../../components/RecommendedProduct";
import TrendingProduct from "../../components/TrendingProduct";
import Alert from "../../components/Alert/Alert";
import { useState } from "react";
import MostLiked from "../../components/MostLikedProduct";

const Home = () => {
  return (
    <div>
      <Banner />
      <BannerBottom />
      <TrendingProduct></TrendingProduct>
      <MostLiked></MostLiked>
      <RecommendationProduct></RecommendationProduct>
    </div>
  );
};

export default Home;
