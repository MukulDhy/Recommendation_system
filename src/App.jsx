import { lazy, Suspense } from "react";
// import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading/Loading";
import SignUp from "./pages/Account/SignUp";
import SignIn from "./pages/Account/SignIn";
import ProductScreen from "./pages/Product/ProductScreen";
import Product from "./pages/Product";
import Navbar from "./components/Layout/Home/Navbar/Navbar";
import ProfileScreen from "./pages/Account/Profile";
import ViewHistory from "./pages/Account/ViewHistory";
import Wishlist from "./pages/LikeProduct";
import AiSearch from "./pages/AiSearch";

// Bassically what will happen in the react all the files of react or pages that we write in the routes for navigation will load at the once when vist the site

// But at that time only we need only the home pages and other pages should load another time
// So here comes the lazy which will divide the pages into various chunks size  according to page and only that page is loaded which we wanted to load

const Home = lazy(() => import("./pages/Home/Home"));

const App = () => {



  
  return (
    <Router>
      <Suspense fallback={<Loading></Loading>}>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<SignIn />}></Route>
          <Route path="/products" element={<Product />}></Route>
          <Route path="/product/:id" element={<ProductScreen />}></Route>
          <Route path="/profile" element={<ProfileScreen />}></Route>
          <Route path="/viewHistory" element={<ViewHistory />}></Route>
          <Route path="/like" element={<Wishlist />}></Route>
          <Route path="/ai-search" element={<AiSearch />}></Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
