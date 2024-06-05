import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileScreen = () => {

    const {user} = useSelector((state) => state.user)


  return (
    <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-800 py-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <h2 className="px-6 py-4 text-2xl font-bold text-gray-800 bg-indigo-100">
          Public Profile
        </h2>

        <div className="py-8 px-6">
          <img
            className="w-40 h-40 rounded-full border-4 border-indigo-300 mx-auto mb-6"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
            alt="Profile Picture"
          />

          <div className="flex justify-center space-x-4 mb-8">
            <Link to={"/like"}>
              <button className="py-3 px-6 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none">
                Liked Products
              </button>
            </Link>
            <Link to={"/viewHistory"}>
              <button className="py-3 px-6 text-base font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:text-indigo-800 focus:outline-none">
                Interactions
              </button>
            </Link>
          </div>

          <form>
            <div className="mb-6">
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                Full Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-4 py-2 text-sm text-gray-800 bg-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your first name"
                value={user.name}
                required
              />
            </div>


            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 text-sm text-gray-800 bg-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your.email@mail.com"
                value={user.email}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="profession"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                Mobile No
              </label>
              <input
                type="text"
                id="profession"
                className="w-full px-4 py-2 text-sm text-gray-800 bg-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your profession"
                value={user.mobileNo}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="profession"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                Total interactions
              </label>
              <input
                type="text"
                id="profession"
                className="w-full px-4 py-2 text-sm text-gray-800 bg-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your profession"
                value={user.viewHistory.length}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="profession"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                Total Liked Product
              </label>
              <input
                type="text"
                id="profession"
                className="w-full px-4 py-2 text-sm text-gray-800 bg-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your profession"
                value={user.interactions.length}
                required
              />
            </div>

            {/* <button
              type="submit"
              className="w-full py-2 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Save
            </button> */}
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProfileScreen;
