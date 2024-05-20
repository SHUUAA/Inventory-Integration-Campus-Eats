import { useEffect } from "react";
import { authentication, storage } from "../firebase/Config";
import { getDownloadURL, ref } from "firebase/storage";
import { atom, useAtom } from "jotai";

const profileIconAtom = atom<string | null>(null); 

const ProfilePic = () => {
  const [profileIcon, setProfileIcon] = useAtom(profileIconAtom);
  const userID = authentication.currentUser?.uid;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, `ProfilePictures/${userID}.jpg`);
        const url = await getDownloadURL(imageRef);
        setProfileIcon(url);
      } catch (error) {
        setProfileIcon(null); 
        console.error("Error fetching profile picture:", error);
      }
    };

    if (userID) { 
      fetchImage();
    }
  }, [userID]); 

  return profileIcon;
};

export default ProfilePic;