import FirebaseController from "../firebase/FirebaseController";
import { useEffect, useState } from "react";
import { database } from "../firebase/Config";
import { Product } from "../components/ProductList";
const firebaseController = new FirebaseController();
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import * as Tabs from "@radix-ui/react-tabs";
import Loader from "../components/Loader";
import { useUserContext } from "../auth/UserContext";
const Products = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const location = useLocation();
  const productID = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const { userData } = useUserContext();
  useEffect(() => {
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
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productID]);

  if (!product) {
    return <Loader></Loader>;
  }

  const handleNaviButton = () => {
    navigate(`/${userData.type}/inventory`);
  }

  return (
    <div>
      <button onClick={handleNaviButton} className="bg-white-950 flex rounded-lg shadow-lg">
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
                {" "}
                <button className="bg-red-950 px-4 py-2 rounded text-white shadow-md">
                  Edit
                </button>
                <button className="bg-white-950 border border-black px-4 py-2 rounded shadow-md">
                  Download
                </button>
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
                <Tabs.Trigger
                  className="bg-white-950 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                  value="tab2"
                >
                  Purchases
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="bg-white-950 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                  value="tab3"
                >
                  Adjustments
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="bg-white-950 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                  value="tab4"
                >
                  History
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value="tab1"
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                  <div className="flow-root w-full ">
                    <p className="mb-5 text-[24px] leading-normal">
                      Primary Details
                    </p>
                    <dl className="-my-3 divide-y divide-brown-1000 text-md">
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
            <img className="rounded-xl w-[200px] shadow-lg" src={product.imageUrl}></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
