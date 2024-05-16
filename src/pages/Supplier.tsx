import * as Dialog from "@radix-ui/react-dialog";
import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useMemo, useReducer, useState } from "react";
import { database, storage } from "../firebase/Config";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import "../css/ProductList.css";
import FirebaseController from "../firebase/FirebaseController";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const firebaseController = new FirebaseController();
interface Supplier {
  name: string;
  email: string;
  product: string;
  buyingPrice: number;
  category: string;
  contactNumber: number;
  imageUrl?: string;
}

const Supplier = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [contactNumber, setContactNumber] = useState(0);
  const [category, setCategory] = useState("");
  const [buyingPrice, setBuyingPrice] = useState(0);
  const [file, setFile] = useState(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const user = await firebaseController.getCurrentUser();
      const userID = user?.uid;

      if (!userID) {
        console.error("User not authenticated or missing UID!");
        return;
      }
      const userSupplierQuery = query(
        collection(database, "suppliers", userID, "userSuppliers")
      );
      const querySnapshot = await getDocs(userSupplierQuery);
      const supplierList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as unknown as Supplier)
      );
      setSuppliers(supplierList);
    };
    fetchSuppliers();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newFile = event.target.files[0];
      setFile(newFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await firebaseController.getCurrentUser();
    const userID = user?.uid;
    if (!userID) {
      console.error("User not authenticated or missing UID!");
      return;
    }
    let imageUrl = "";
    if (file) {
      const imageRef = ref(storage, `SupplierImages/${userID}/${file.name}`);
      await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      const userSuppliersCollection = collection(
        database,
        "suppliers",
        userID,
        "userSuppliers"
      );
      await addDoc(userSuppliersCollection, {
        name,
        email,
        contactNumber,
        product,
        category,
        buyingPrice,
        imageUrl,
      });
      console.log("Supplier added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error adding supplier: ", error);
    }
  };

  const foodCategories = [
    "Prepared Foods",
    "Frozen Foods",
    "Canned/Jarred Foods",
    "Boxed Foods",
    "Fresh Foods",
    "Baked Goods",
    "Dairy Products",
    "Snack Foods",
    "Beverages",
  ];

  const handleDeleteSupplier = async (supplierId: string) => {
    try {
      const user = await firebaseController.getCurrentUser();
      const userID = user?.uid;

      if (!userID) {
        console.error("User not authenticated or missing UID!");
        return;
      }

      const supplierRef = doc(
        database,
        "suppliers",
        userID,
        "userSuppliers",
        supplierId
      );
      await deleteDoc(supplierRef);

      // Update the local state to reflect the deletion
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.id !== supplierId)
      );

      console.log("Supplier deleted successfully");
    } catch (error) {
      console.error("Error deleting supplier: ", error);
    }
  };

  return (
    <div className="bg-white-950 w-full mb-6 shadow-lg rounded-xl mt-4">
      <div className="grid grid-cols-3 gap-8 ">
        <div className="h-16 rounded-lg col-span-2">
          <div className="text-2xl mt-6 ml-6">Suppliers</div>
        </div>

        <div className="relative">
          {" "}
          <div className="h-16 rounded-lg flex justify-end absolute required right-4">
            <div className="m-6 space-x-4">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="p-3 text-white rounded-lg shadow-md bg-red-950 hover:bg-red-800 focus:relative">
                    Add Supplier
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="bg-black-A6 data-[state=open]:animate-overlayShow fixed inset-0" />
                  <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white-950 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                      Add Supplier
                    </Dialog.Title>
                    <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                      Add Supplier here. Click save when you're done.
                    </Dialog.Description>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-black w-[90px] text-right text-[15px]"
                        htmlFor="name"
                      >
                        Upload Photo
                      </label>
                      <input type="file" onChange={handleFileChange} />
                    </fieldset>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-violet11 w-[90px] text-right text-[15px]"
                        htmlFor="name"
                      >
                        Supplier Name
                      </label>
                      <input
                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </fieldset>

                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-violet11 w-[90px] text-right text-[15px]"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        id="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </fieldset>

                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-violet11 w-[90px] text-right text-[15px]"
                        htmlFor="contactnumber"
                      >
                        Contact Number
                      </label>
                      <input
                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        id="contactnumber"
                        type="number"
                        onChange={(e) =>
                          setContactNumber(e.target.valueAsNumber)
                        }
                      />
                    </fieldset>

                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-violet11 w-[90px] text-right text-[15px]"
                        htmlFor="product"
                      >
                        Product
                      </label>
                      <input
                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        id="product"
                        type="text"
                        onChange={(e) => setProduct(e.target.value)}
                      />
                    </fieldset>

                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-violet11 w-[90px] text-right text-[15px]"
                        htmlFor="category"
                      >
                        Category
                      </label>
                      <select
                        className="bg-neutral-950 text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        id="category"
                        required
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {foodCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </fieldset>

                    <fieldset className="mb-[15px] flex items-center gap-5">
                      <label
                        className="text-violet11 w-[90px] text-right text-[15px]"
                        htmlFor="buyingprice"
                      >
                        Buying Price
                      </label>
                      <input
                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        id="buyingprice"
                        type="number"
                        onChange={(e) => setBuyingPrice(e.target.valueAsNumber)}
                      />
                    </fieldset>

                    <div className="mt-[25px] flex justify-end">
                      <Dialog.Close asChild>
                        <button
                          onClick={handleSubmit}
                          className="bg-red-950 hover:bg-red-1000 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                        >
                          Save changes
                        </button>
                      </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className=" bg-white-950 text-red-950 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center "
                        aria-label="Close"
                      >
                        Close
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
              <button className="bg-white-950 border border-black px-4 py-2 rounded shadow-md">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="inv-header-row mt-4">
        <button className="inv-column bg-white-950">Supplier Name</button>
        <button className="inv-column bg-white-950">Email</button>
        <button className="inv-column bg-white-950">Contact Number</button>
        <button className="inv-column bg-white-950">Product</button>
        <button className="inv-column bg-white-950">Category</button>
        <button className="inv-column bg-white-950">Buying Price</button>
      </div>
      <div className="h-[600px] overflow-y-auto">
        {suppliers.map((suppliers) => {
          return (
            <div
              className="inv-header-row inv-data-row"
              key={suppliers.product}
            >
              <div className="inv-column">
                <Avatar.Root className="relative">
                  <Avatar.AvatarImage
                    src={suppliers.imageUrl}
                    alt="Profile Picture"
                    className="inline-flex h-[30px] w-[30px] select-none overflow-hidden rounded-full "
                  />
                </Avatar.Root>
                {""}
                {suppliers.name}
              </div>
              <div className="inv-column">{suppliers.email}</div>
              <div className="inv-column">{suppliers.contactNumber}</div>
              <div className="inv-column">{suppliers.product}</div>
              <div className="inv-column">{suppliers.category}</div>
              <div className="inv-column">₱{suppliers.buyingPrice}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Supplier;
