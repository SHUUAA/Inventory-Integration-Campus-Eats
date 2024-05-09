import React, { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import FirebaseController from "../config/FirebaseController";
import DataFetch from "../components/data/Fetch";
import toast, { Toaster } from "react-hot-toast";
import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";

const firebaseController = new FirebaseController();
const user = await firebaseController.getCurrentUser();

const Profile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState(""); // Store the download URL
  const [, setIsLoading] = useState(false);
  const userID = user?.uid;
  const userName = user?.displayName;
  const userEmail = user?.email;
  const storage = getStorage();
  const userData = DataFetch();
  const userType = (userData as { type: string }).type;
  const [firstName, surname] = userName!.split(" ");
  const initials =
    firstName.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const imageRef = ref(storage, `ProfilePictures/${userID}.jpg`);
        const url = await getDownloadURL(imageRef);
        setImageURL(url);
      } catch (error) {
        /* empty */
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [setIsLoading, storage, userID]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast("Please select a file!");
      return;
    }

    const metadata = {
      contentType: file.type, // Use the actual file type
    };

    const storageRef = ref(storage, `ProfilePictures/${userID}.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setImageURL(downloadURL);
      toast("🎉 Profile Picture updated successfully!");
      setTimeout(function () {
        location.reload();
      }, 1000);
    });
  };

  return (
    <div>
      <div className="bg-white-950 w-full mb-6 shadow-lg rounded-xl mt-4">
        <Toaster
          position="bottom-right"
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
                    className="p-3 text-white rounded-lg bg-red-950 hover:bg-red-800 focus:relative"
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
                      <input type="file" onChange={handleFileUpload} />
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
                        className="text-slate-700 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </div>
              <div className="w-full flex justify-center">
                <Avatar.Root className="relative">
                  {imageURL && (
                    <Avatar.AvatarImage
                      src={imageURL}
                      alt="Profile Picture"
                      className="bg-blackA1 inline-flex h-[150px] w-[150px] select-none items-center justify-center overflow-hidden rounded-full align-middle"
                    />
                  )}
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
                  An artist of considerable range, Mike is the name taken by
                  Melbourne-raised, Brooklyn-based Nick Murphy writes, performs
                  and records all of his own music, giving it a warm.
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
