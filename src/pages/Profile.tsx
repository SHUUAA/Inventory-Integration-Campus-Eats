import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import FirebaseController from "../firebase/FirebaseController";
import toast, { Toaster } from "react-hot-toast";
import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../firebase/Config";
const firebaseController = new FirebaseController();
const user = await firebaseController.getCurrentUser();
const userEmail = user?.email;
const userRef = collection(database, "users");
const q = query(userRef, where("email", "==", userEmail));
import { useUserContext } from "../auth/UserContext";
import ProfilePic from "../helpers/ProfilePic";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Profile = () => {
  const userContext = useUserContext();
  const { userData } = userContext ?? { userData: {} };
  const [file, setFile] = useState<File | null>(null);
  const userID = user?.uid;
  const userName = user?.displayName;
  const storage = getStorage();
  const userType = (userData as { type: string }).type;
  const userBio = (userData as { bio: string }).bio;
  const [firstName, surname] = userName!.split(" ");
  const initials =
    firstName.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase();
  const userImage = ProfilePic();
  const [parent] = useAutoAnimate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const [bio, setBio] = useState("");
  const setBioTextField = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setBio(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast("Please select a file!");
      return;
    }

    const metadata = {
      contentType: file.type, 
    };

    let storageRef;
    getDocs(q)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          storageRef = ref(storage, `ProfilePictures/${userID}.jpg`);
        } else {
          const document = querySnapshot.docs[0];
          storageRef = ref(storage, `ProfilePictures/${userID}.jpg`);
          updateDoc(document.ref, {
            bio: bio,
          })
            .then(() => {
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        }

        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.error(error);
          },
          () => {
            toast("🎉 Profile updated successfully!");
            setTimeout(function () {
              location.reload();
            }, 2000);
          }
        );
      })
      .catch((error) => {
        console.error("Error querying documents:", error);
      });
  };

  return (
    <div>
      <div className="bg-white-950 w-full mb-6 shadow-lg rounded-xl mt-4">
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FFFAF1",
            },
          }}
        />
        <div className="p-6">
          <div className="grid">
            <Dialog.Root>
              <div className="flex flex-row-reverse">
                <Dialog.Trigger asChild>
                  <button
                    className="p-3 text-white rounded-lg shadow-md bg-red-950 hover:bg-red-800 focus:relative"
                    title="Edit Quiz"
                  >
                    <div>Edit Profile</div>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="bg-black-A6 data-[state=open]:animate-overlayShow fixed inset-0" />
                  <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white-950 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="text-black m-0 text-[17px] font-medium">
                      Edit profile
                    </Dialog.Title>
                    <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                      Make changes to your profile here. Click save when you're
                      done.
                    </Dialog.Description>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-black w-[90px] text-right text-[15px]"
                        htmlFor="name"
                      >
                        Upload Photo
                      </label>
                      <input className="" type="file" onChange={handleFileUpload} />
                    </fieldset>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-black w-[90px] text-right text-[15px]"
                        htmlFor="bio"
                      >
                        Bio
                      </label>
                      <textarea
                        id="Bio"
                        onChange={setBioTextField}
                        className="text-black shadow-brown-950 focus:shadow-brown-950 inline-flex h-[200px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      />
                    </fieldset>
                    <div className="mt-[25px] flex justify-end">
                      <Dialog.Close asChild>
                        <button
                          onClick={handleSubmit}
                          className="bg-red-950 text-black hover:bg-red-800 focus:shadow-red-800 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                        >
                          Save changes
                        </button>
                      </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className="text-red-950 bg-white-950 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center "
                        aria-label="Close"
                      >
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
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </div>
              <div className="w-full flex justify-center">
                <Avatar.Root className="relative" ref={parent}>
                  <Avatar.AvatarImage
                  //@ts-ignore
                    src={userImage}
                    alt="Profile Picture"
                    className="bg-blackA1 inline-flex h-[150px] w-[150px] object-cover select-none items-center justify-center overflow-hidden rounded-full align-middle"
                  />
                  <Avatar.AvatarFallback className="text-red-950 leading-1 flex h-[150px] w-[150px] items-center justify-center bg-brown-950 rounded-full text-[45px] font-medium">
                    {initials}
                  </Avatar.AvatarFallback>
                </Avatar.Root>
              </div>
            </Dialog.Root>
            <div className="w-full text-center">
              <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                <div className="p-3 text-center">
                  <div className="text-md text-slate-600">{userEmail}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <h3 className="text-3xl text-slate-700 font-bold leading-normal mb-1">
              {userName}
            </h3>
            <div className="text-md mt-0 mb-2 text-slate-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>
              {userType}
            </div>
          </div>
          <div className="mt-6 py-6 border-t border-slate-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <p className="font-light leading-relaxed text-slate-600 mb-4">
                  {userBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative pt-6 pb-2 mt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-6/12 px-4 mx-auto text-center"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
