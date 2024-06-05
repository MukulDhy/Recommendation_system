import { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { logoLight } from "../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Store/Slice/userSlice";
import Alert from "../../components/Alert/Alert";
import SmallLoader from "../../components/Loading/SmallLoader";

const SignIn = () => {
  // ============= Initial State Start here =============
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  const { loading, user, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  // ============= Event Handler Start here =============
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  // ============= Event Handler End here ===============
  const handleSignUp = (e) => {
    e.preventDefault();

    if (!email) {
      setErrEmail("Enter your email");
    }

    if (!password) {
      setErrPassword("Create a password");
    }
    // ============== Getting the value ==============
    if (email && password) {
      // setSuccessMsg(
      //   `Hello dear, Thank you for your attempt. We are processing to validate your access. Till then stay connected and additional assistance will be sent to you by your mail at ${email}`
      // );

      dispatch(
        loginUser({
          email: email,
          password,
        })
      ).then((result) => {
        if (result.payload) {
          setEmail("");
          setPassword("");
        }
      });
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <p className="text-lg font-extrabold font-titleFont">
              Eccomerce <span className="text-red-600">Website</span>
            </p>
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Get started for free
            </h1>
            <p className="text-base">Create your account to access more</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get Recommendation based on your view history
              </span>
              <br />
              {/* Get Recommendation based on your view history */}
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trending product
              </span>
              <br />
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Most Liked Product
              </span>
              <br />
              {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur! */}
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Recommendation based on the Category
              </span>
              <br />
              {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur! */}
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Ai search System
              </span>
              <br />
              {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur! */}
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Join Us more exciting features
              </span>
              <br />
              {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur! */}
            </p>
          </div>
          {/* <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              © OREBI
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div> */}
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
          <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center scrollbar-none scrollbar-thumb-primeColor">
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
              Sign in
            </h1>
            <div className="flex flex-col gap-3">
              {/* Email */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Email
                </p>
                <input
                  onChange={handleEmail}
                  value={email}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="email"
                  placeholder="john@workemail.com"
                />
                {errEmail && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errEmail}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Password
                </p>
                <input
                  onChange={handlePassword}
                  value={password}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="password"
                  placeholder="Create password"
                />
                {errPassword && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errPassword}
                  </p>
                )}
              </div>

              <button
                onClick={handleSignUp}
                className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
              >
                Sign In
              </button>
              <p className="text-sm text-center font-titleFont font-medium">
                Dont have an Account?{" "}
                <Link to="/signup">
                  <span className="hover:text-blue-600 duration-300">
                    Sign up
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </form>
        {error && <Alert message={error} type={"danger"}></Alert>}
        {loading && <SmallLoader></SmallLoader>}
      </div>
    </div>
  );
};

export default SignIn;
