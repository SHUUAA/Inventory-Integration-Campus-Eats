import React, { useState } from "react";
import { authentication } from "../firebase/Config";
import { Link } from "react-router-dom";
import { useUserContext } from "../auth/UserContext";
import * as Avatar from "@radix-ui/react-avatar";
import logo from "../assets/logo.png";
import ProfilePic from "../helpers/ProfilePic";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const { userData } = useUserContext();
  const name = authentication.currentUser?.displayName;
  const [firstName, surname] = name.split(" ");
  const initials =
    firstName.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase();
  const image = ProfilePic();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="sticky top-0  bg-white-950 border-gray-200 p-4 mb-10">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <a href="#" className="flex">
          <img className="h-8 mr-2" src={logo} />
          <span className="self-center text-md font-semibold whitespace-nowrap">
            Campus Eats
          </span>
        </a>
        {/* <form>
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-black sr-only"
          >
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block p-4 pl-10 w-full text-sm text-black bg-white-950 rounded-lg border border-gray-300  "
              placeholder="Search Inventory, Products..."
              required
            />
          </div>
        </form> */}
        <div className="flex"></div>
        <div className="flex w-full md:w-auto md:order-1">
          <div className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
            {/* <div className="inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </div> */}
            <Avatar.Root className="select-none items-center justify-center overflow-hidden rounded-full align-middle">
              <Link to={`/${userData.type}/profile`}>
                <Avatar.AvatarImage
                  className="h-[40px] w-[40px] rounded-[inherit] object-cover"
                  src={image}
                  alt="Profile"
                />
                <Avatar.Fallback
                  className="text-red-950 leading-1 flex h-[45px] w-[45px] items-center justify-center bg-brown-950 rounded-full text-[15px] font-medium"
                  delayMs={600}
                >
                  {initials}
                </Avatar.Fallback>
              </Link>
            </Avatar.Root>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SearchBar;
