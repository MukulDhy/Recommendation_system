import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { Button } from "flowbite-react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../../Store/Slice/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [products, setProduct] = useState([]);

  useEffect(() => {
    if (user) {
      setProduct(user.interactions);
    }
    // Fetch products if needed
  }, [user]);

  const handleLogOut = () => {
    console.log("Logout");
    dispatch(logoutUser());
  };

  return (
    <div className="w-full shadow-xl bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* Logo */}
          <div className="flex h-14 cursor-pointer items-center gap-2 text-primeColor">
            <Link to={"/"}>
              <p className="text-lg font-extrabold font-titleFont">
                Ecommerce <span className="text-red-600">Website</span>
              </p>
            </Link>
          </div>

          <div className="flex gap-2 items-center">
            <Link to={"/products"}>
              <Button className="bg-primeColor">
                Products
                <HiOutlineArrowRight className="ml-2 h-5 w-5 text-red-600" />
              </Button>
            </Link>
            <Link to={"/ai-recommendation"}>
              <Button className="bg-primeColor">
                AI Recommendation
                <HiOutlineArrowRight className="ml-2 h-5 w-5 text-red-600" />
              </Button>
            </Link>
            <Link to={"/ai-search"}>
              <Button className="bg-primeColor">
                AI Search
                <HiOutlineArrowRight className="ml-2 h-5 w-5 text-red-600" />
              </Button>
            </Link>
          </div>

          {!user ? (
            <div className="flex flex-row gap-2">
              <Link to={"/login"}>
                <Button className="bg-primeColor">Login</Button>
              </Link>
              <Link to={"/signup"}>
                <Button className="bg-primeColor">Sign Up</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-row gap-4 items-center">
              <p className="font-bold font-titleFont">
                Hi <span className="text-red-700">{user.name}</span>
              </p>
              <Link to="/profile">
                <div className="relative">
                  <FaUser />
                </div>
              </Link>
              <Link to="/viewHistory">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    fill="black"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h12v12H0z"></path>
                    <path d="M24 9C14 9 5.46 15.22 2 24c3.46 8.78 12 15 22 15 10.01 0 18.54-6.22 22-15-3.46-8.78-11.99-15-22-15zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"></path>
                  </svg>
                </div>
              </Link>
              <Link to="/like">
                <div className="relative">
                  <BsSuitHeartFill />
                  <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                    {products.length > 0 ? products.length : 0}
                  </span>
                </div>
              </Link>
              <Button className="bg-primeColor" onClick={handleLogOut}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
