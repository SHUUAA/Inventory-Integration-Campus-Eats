import FirebaseController from "../firebase/FirebaseController";
import { useEffect, useState } from "react";
import { database, storage } from "../firebase/Config";
import { Product } from "../components/ProductList";
const firebaseController = new FirebaseController();
import { useLocation, useNavigate } from "react-router-dom";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Loader from "../components/Loader";
import { useUserContext } from "../auth/UserContext";
import { deleteObject, ref } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
const Products = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [buyingPrice, setBuyingPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [threshold, setThreshold] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const location = useLocation();
  const productID = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { userData } = userContext ?? { userData: {} };
  const [open, setOpen] = useState(false);
  const [productUpdated, setProductUpdated] = useState(false); // Option 2: Flag for re-fetch

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      const user = await firebaseController.getCurrentUser();
      const userID = user?.uid;

      const productRef = doc(
        database,
        "products",
        userID,
        "userProducts",
        productID
      );

      try {
        const docSnap = await getDoc(productRef);
        if (docSnap.exists()) {
          if (isMounted) {
            setProduct({
              id: docSnap.id,
              ...docSnap.data(),
            } as unknown as Product);
          }
          if (product) {
            setName(product.name);
            setCategory(product.category);
            setBuyingPrice(product.buyingPrice);
            setQuantity(product.quantity);
            setExpiryDate(product.expiryDate);
            setThreshold(product.threshold);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productID, productUpdated, open]); // Dependency array

  if (!product) {
    return <Loader></Loader>;
  }

  const handleNaviButton = () => {
    navigate(`/${userData.type}/inventory`);
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

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const user = await firebaseController.getCurrentUser();
      const userID = user?.uid;
      const productRef = doc(
        database,
        "products",
        userID,
        "userProducts",
        updatedProduct.id
      );

      await updateDoc(productRef, {
        name: updatedProduct.name,
        category: updatedProduct.category,
        buyingPrice: updatedProduct.buyingPrice,
        quantity: updatedProduct.quantity,
        expiryDate: updatedProduct.expiryDate,
        threshold: updatedProduct.threshold,
      });

      setProduct(updatedProduct);
      setProductUpdated(true);
      toast("Successfully updated product!");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedProduct: Product = {
      id: product.id,
      name: name,
      category: category,
      buyingPrice: buyingPrice,
      quantity: quantity,
      expiryDate: expiryDate,
      threshold: threshold,
    };
    setOpen(false);
    await handleUpdateProduct(updatedProduct);
  };

  const handleDeleteProduct = async (productID: number) => {
    try {
      const user = await firebaseController.getCurrentUser();
      const userID = user?.uid;

      if (!userID) {
        console.error("User not authenticated or missing UID!");
        return;
      }

      const productDocRef = doc(
        database,
        "products",
        userID,
        "userProducts",
        productID
      );
      const productDocSnap = await getDoc(productDocRef);

      if (!productDocSnap.exists()) {
        console.error("Product not found!");
        return;
      }

      const productData = productDocSnap.data();
      const imageUrl = productData.imageUrl;

      await deleteDoc(productDocRef);

      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        console.log("Image deleted successfully");
      }

      navigate(`/${userData.type}/inventory`);
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <div>
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
      <button
        onClick={handleNaviButton}
        className="p-3 bg-white-950 flex rounded-lg shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clipRule="evenodd"
          />
        </svg>
        Go Back
      </button>
      <div className="bg-white-950 w-full mb-6 shadow-lg rounded-xl mt-4">
        <div className="grid grid-cols-3 gap-8 ">
          <div className="h-16 rounded-lg col-span-2">
            <div className="text-2xl mt-6 ml-6">{product.name}</div>
          </div>

          <div className="relative">
            {" "}
            <div className="h-16 rounded-lg flex justify-end absolute required right-4">
              <div className="m-6 space-x-4">
                <Dialog.Root open={open} onOpenChange={setOpen}>
                  <Dialog.Trigger asChild>
                    <button className="p-3 text-white rounded-lg shadow-md bg-neutral-950 focus:relative">
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="bg-black-A6 data-[state=open]:animate-overlayShow fixed inset-0" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white-950 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                      <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                        Edit Product
                      </Dialog.Title>
                      <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                        Make changes to your product here. Click save when
                        you're done.
                      </Dialog.Description>
                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="name"
                        >
                          Product Name
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </fieldset>

                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="category"
                        >
                          Product Category
                        </label>

                        <select
                          className="bg-neutral-950 text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="category"
                          required
                          value={category}
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
                          htmlFor="price"
                        >
                          Buying Price
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="price"
                          type="number"
                          value={buyingPrice}
                          onChange={(e) =>
                            setBuyingPrice(e.target.valueAsNumber)
                          }
                        />
                      </fieldset>

                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="quantity"
                        >
                          Quantity
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.valueAsNumber)}
                        />
                      </fieldset>

                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="expiry"
                        >
                          Expiry Date
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="expiry"
                          type="date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </fieldset>

                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="value"
                        >
                          Threshold Value
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="value"
                          type="number"
                          value={threshold}
                          onChange={(e) => setThreshold(e.target.valueAsNumber)}
                        />
                      </fieldset>
                      <div className="mt-[25px] flex justify-end">
                        <Dialog.Close asChild>
                          <form onClick={handleSubmit}>
                            <button
                              type="submit"
                              className="bg-red-950 hover:bg-red-1000 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                            >
                              Save changes
                            </button>
                          </form>
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
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button className="p-3 text-white rounded-lg shadow-md bg-red-950 hover:bg-red-800 focus:relative">
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="bg-black-A6 data-[state=open]:animate-overlayShow fixed inset-0" />
                    <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white-950 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                      <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                        Are you absolutely sure?
                      </AlertDialog.Title>
                      <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                        This action cannot be undone. This will permanently
                        delete your product and remove your data from our
                        servers.
                      </AlertDialog.Description>
                      <div className="flex justify-end gap-[25px]">
                        <AlertDialog.Cancel asChild>
                          <button className="text-mauve11 bg-neutral-950 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                            Cancel
                          </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red11 bg-red-950 hover:bg-red-1000 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                          >
                            Yes, delete product
                          </button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 m-6">
            <Tabs.Root className="flex flex-col w-full" defaultValue="tab1">
              <Tabs.List
                className="shrink-0 flex border-b border-mauve6"
                aria-label="Manage your account"
              >
                <Tabs.Trigger
                  className="bg-white-950 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                  value="tab1"
                >
                  Overview
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value="tab1"
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                  <div className="flow-root w-[800px] ">
                    <p className="mb-5 text-[24px] leading-normal">
                      Primary Details
                    </p>
                    <dl className="text-md">
                      <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-large text-gray-900">
                          Product Name
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2">
                          {product.name}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-large text-gray-900">
                          Product Category
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2">
                          {product.category}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-large text-gray-900">
                          Buying Price
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2">
                          ₱{product.buyingPrice}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-large text-gray-900">Quantity</dt>
                        <dd className="text-gray-700 sm:col-span-2">
                          {product.quantity}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-large text-gray-900">
                          Expiry Date
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2">
                          {product.expiryDate}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-large text-gray-900">
                          Threshold Value
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2">
                          {product.threshold}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
          <div className="col-span-1 ml-6 p-24">
            <img
              className="rounded-xl w-[200px] shadow-lg"
              src={product.imageUrl}
            ></img>
            <div className="relative bg-white pt-3">
              <h3 className="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
                {product.name}
              </h3>

              <p className="mt-1.5 tracking-wide text-gray-900">
                ₱{product.buyingPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
