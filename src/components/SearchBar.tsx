import React, { useEffect, useState } from "react";
import "../css/SearchBar.css";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { authentication } from "../config/firebase";
import { Link } from "react-router-dom";
import { useUserContext } from "../types/UserTypeContext";
import * as Avatar from "@radix-ui/react-avatar";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileIcon, setProfileIcon] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const { userData } = useUserContext();
  const storage = getStorage();
  const userID = authentication.currentUser.uid;
  const name = authentication.currentUser?.displayName;
  const [firstName, surname] = name.split(" ");
  const initials = firstName.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const imageRef = ref(storage, `ProfilePictures/${userID}.jpg`);
        const url = await getDownloadURL(imageRef);
        setProfileIcon(url);
      } catch (error) {
        /* empty */
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, []); // Empty dependency array: runs only on mount

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-box">
            <button type="submit" className="search-icon">
              {" "}
              {/* Add button */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                style={{ stroke: "#ccc" }}
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search product, supplier, orders"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </form>
        <div className="icon-container">
          <Avatar.Root className="bg-blackA1 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <Link to={`/${userData.type}/profile`}>
              <Avatar.AvatarImage
                className="h-full w-full rounded-[inherit] object-cover"
                src={profileIcon}
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
  );
};

export default SearchBar;
