import { useEffect, useState } from "react";
import { authentication, storage } from "../firebase/Config";
import { getDownloadURL, ref } from "firebase/storage";

const ProfilePic = () => {
  const [profileIcon, setProfileIcon] = useState("");
  const userID = authentication.currentUser.uid;
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, `ProfilePictures/${userID}.jpg`);
        const url = await getDownloadURL(imageRef);
        setProfileIcon(url);
      } catch (error) {
        /* empty */
      }
    };

    fetchImage();
  }, []); // Empty dependency array: runs only on mount
  return profileIcon;
};

export default ProfilePic;
