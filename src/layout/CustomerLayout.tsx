import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import ChatBox from "../components/ChatBox"; // Import the ChatBox component
import { useState } from "react";

const CustomerLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="large-screen">
        <SideBar></SideBar>
      </div>
      <div className="flex-1 relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-neutral-950">
        <SearchBar />
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Outlet></Outlet>
          </div>
        </main>
        {/* Add the chatbox component */}
        <ChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />{" "}
        {/* Add a button to open the chatbox */}
        <button
          className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-red-950 hover:bg-red-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
          onClick={handleToggleChat}
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
        >
          <svg
            xmlns=" http://www.w3.org/2000/svg"
            width="30"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="text-white block border-gray-200 align-middle"
          >
            <path
              d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
              className="border-gray-200"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomerLayout;
