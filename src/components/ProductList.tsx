import React, { useEffect, useState } from "react";
import { database, storage } from "../firebase/Config";
import * as Dialog from "@radix-ui/react-dialog";
import { addDoc, collection, doc, getDocs, query } from "firebase/firestore";
import "../css/ProductList.css";
import FirebaseController from "../firebase/FirebaseController";
import { useNavigate } from "react-router-dom";
const firebaseController = new FirebaseController();
const user = await firebaseController.getCurrentUser();
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
export interface Product {
  id: number;
  name: string;
  buyingPrice: number;
  quantity: number;
  threshold: number;
  expiryDate: string;
  availability: string;
  category: string;
  supplierName: string;
  contactNumber: string;
  storeNames: string[];
  stockInHand: number[];
  imageUrl?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [parent, enableAnimations] = useAutoAnimate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [buyingPrice, setBuyingPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [threshold, setThreshold] = useState(0);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const userID = user?.uid;

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newFile = event.target.files[0];
      setFile(newFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !userID) {
      console.error("User not authenticated or missing UID!");
      return;
    }

    const random = crypto.randomUUID();
    let imageUrl = "";
    if (file) {
      const imageRef = ref(
        storage,
        `ProductImages/${userID}/${random}-${file.name}`
      );
      await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      const userProductsCollection = collection(
        database,
        "products",
        userID,
        "userProducts"
      );
      await addDoc(userProductsCollection, {
        name,
        category,
        buyingPrice,
        quantity,
        expiryDate,
        threshold,
        imageUrl,
      });
      console.log("Product added successfully");
      setOpen(false);
      setFormResetKey(formResetKey + 1);
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || !userID) {
        console.error("User not authenticated or missing UID!");
        return;
      }
      const userProductsQuery = query(
        collection(database, "products", userID, "userProducts")
      );
      const querySnapshot = await getDocs(userProductsQuery);
      const productList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Product)
      );
      setProducts(productList);
    };
    fetchProducts();
  }, [formResetKey, open]);

  const navigate = useNavigate();
  const handleProductList = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const getAvailabilityStatus = (quantity: number) => {
    if (quantity <= 0) {
      return { text: "Out of Stock", color: "red" };
    } else if (quantity <= 10) {
      return { text: "Low Stock", color: "#FFBA18" };
    } else {
      return { text: "In Stock", color: "green" };
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
    },
    {
      accessorKey: "buyingPrice",
      header: "Buying Price",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "threshold",
      header: "Threshold",
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
    },
    {
      accessorKey: "availability",
      header: "Availability",
      cell: ({ row }) => (
        <div
          style={{ color: getAvailabilityStatus(row.original.quantity).color }}
        >
          {getAvailabilityStatus(row.original.quantity).text}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, value) => {
      const searchTerm = value.toLowerCase();
      return row
        .getValue(columnId)
        ?.toString()
        .toLowerCase()
        .includes(searchTerm);
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="inv-inventory-container">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div className="header-and-buttons mb-4">
          <h1 className="inv-inventory-header">Products</h1>
          <div className="search-bar">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search products..."
              className="border p-2 bg-white rounded-lg shadow-md"
            />
          </div>
          <div className="button-row">
            <Dialog.Trigger asChild>
              <button className="p-3 text-white rounded-lg shadow-md bg-red-950 hover:bg-red-800 focus:relative">
                Add Product
              </button>
            </Dialog.Trigger>
          </div>
        </div>

        <div className="h-[350px] overflow-hidden">
          <table className="min-w-full divide-y divide-brown-950">
            <thead className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === "desc"
                          ? " ↓"
                          : " ↑"
                        : null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-brown-950" ref={parent}>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleProductList(row.original)}
                  className="hover:bg-red-950 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination flex justify-center mt-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 bg-brown-950 rounded-l"
          >
            Previous
          </button>
          <span className="px-2 py-1">
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 bg-brown-950 rounded-r"
          >
            Next
          </button>
        </div> 

        <Dialog.Portal>
          <Dialog.Overlay className="bg-black-A6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white-950 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Add Product
            </Dialog.Title>
            <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Add Product here. Click save when you're done.
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
                Product Name
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
                onChange={(e) => setQuantity(e.target.valueAsNumber)}
              />
            </fieldset>

            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-violet11 w-[90px] text-right text-[15px]"
                htmlFor="expiryDate"
              >
                Expiry Date
              </label>
              <input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="expiryDate"
                type="date"
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </fieldset>

            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-violet11 w-[90px] text-right text-[15px]"
                htmlFor="threshold"
              >
                Buying Price
              </label>
              <input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="threshold"
                type="number"
                onChange={(e) => setThreshold(e.target.valueAsNumber)}
              />
            </fieldset>

            <div className="mt-[25px] flex justify-end">
              <Dialog.Close asChild>
                <form onClick={handleSubmit} key={formResetKey}>
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
                className="bg-white-950 text-red-950 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center "
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
      </Dialog.Root>
    </div>
  );
};

export default ProductList;
