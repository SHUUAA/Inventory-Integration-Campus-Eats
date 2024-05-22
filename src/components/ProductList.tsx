import React, { useEffect } from "react";
import { authentication, database, storage } from "../firebase/Config";
import * as Dialog from "@radix-ui/react-dialog";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
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
import toast, { Toaster } from "react-hot-toast";
import { atom, useAtom } from "jotai";
import Supplier from "../pages/Supplier";
export interface Product {
  supplier: {name: string, email: string, contactNumber: number, category: string, buyingPrice: number, imageUrl?: string};
  id: number;
  name: string;
  sellingPrice: number;
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

const productsAtom = atom<Product[]>([]);
const globalFilterAtom = atom("");
const isLoadingAtom = atom(false);
const errorAtom = atom<string | null>(null);
export const productsUpdatedAtom = atom(0);

const nameAtom = atom("");
const categoryAtom = atom("");
const sellingPriceAtom = atom(0);
const quantityAtom = atom(0);
const expiryDateAtom = atom("");
const imageUrlAtom = atom("");
const thresholdAtom = atom(0);
const fileAtom = atom<File | null>(null);
const openAtom = atom(false);
const shouldRefetchAtom = atom(false);
const suppliersAtom = atom<Supplier[]>([]);
const selectedSupplierAtom = atom<Supplier | null>(null);

const ProductList: React.FC = () => {
  const [suppliers, setSuppliers] = useAtom(suppliersAtom);
  const [products, setProducts] = useAtom(productsAtom);
  const [, setProductsUpdated] = useAtom(productsUpdatedAtom);
  const [globalFilter, setGlobalFilter] = useAtom(globalFilterAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setError] = useAtom(errorAtom);
  const [selectedSupplier, setSelectedSupplier] = useAtom(selectedSupplierAtom);
  const [name, setName] = useAtom(nameAtom);
  const [category, setCategory] = useAtom(categoryAtom);
  const [sellingPrice, setSellingPrice] = useAtom(sellingPriceAtom);
  const [quantity, setQuantity] = useAtom(quantityAtom);
  const [expiryDate, setExpiryDate] = useAtom(expiryDateAtom);
  const [threshold, setThreshold] = useAtom(thresholdAtom);
  const [file, setFile] = useAtom(fileAtom);
  const [open, setOpen] = useAtom(openAtom);
  const [, setImageUrl] = useAtom(imageUrlAtom);
  const [shouldRefetch, setShouldRefetch] = useAtom(shouldRefetchAtom);

  const [parent] = useAutoAnimate();
  const userID = user?.uid;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newFile = event.target.files[0];
      setFile(newFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = authentication.currentUser;
    if (!user) {
      console.error("User not authenticated or missing UID!");
      return;
    }

    const userID = user.uid;

    setIsLoading(true);

    let imageUrl = "";
    if (file) {
      const random = crypto.randomUUID();
      const imageRef = ref(
        storage,
        `ProductImages/${userID}/${random}-${file.name}`
      );
      await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(imageRef);
      setImageUrl(imageUrl);
    }

    try {
      const userProductsCollection = collection(
        database,
        "products",
        userID,
        "userProducts"
      );
      await addDoc(userProductsCollection, {
        supplier: selectedSupplier,
        name,
        category,
        sellingPrice,
        quantity,
        expiryDate,
        threshold,
        imageUrl,
      });
      setProductsUpdated((prev) => prev + 1);
      setShouldRefetch(true);
      setOpen(false);
      toast("Product added successfully");
    } catch (error) {
      console.error("Error adding product: ", error);
      //@ts-ignore
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || !userID) {
        console.error("User not authenticated or missing UID!");
        return;
      }
      setIsLoading(true);
      try {
        const userProductsQuery = query(
          collection(database, "products", userID, "userProducts")
        );
        const querySnapshot = await getDocs(userProductsQuery);
        const productList = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as unknown as Product)
        );
        setProducts(productList);
      } catch (error) {
        //@ts-ignore
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (shouldRefetch) {
      fetchProducts();
      setShouldRefetch(false);
    }
    fetchProducts();
  }, [shouldRefetch]);

  const navigate = useNavigate();
  const handleProductList = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const fetchSuppliers = async () => {
    setIsLoading(true);

    try {
      const user = authentication.currentUser;
      const userID = user?.uid;

      if (!userID) {
        throw new Error("User not authenticated or missing UID!");
      }

      const userSupplierQuery = query(
        collection(database, "suppliers", userID, "userSuppliers")
      );
      const querySnapshot = await getDocs(userSupplierQuery);
      const supplierList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as unknown as Supplier)
      );

      setSuppliers(supplierList);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      //@ts-ignore
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
    },
    {
      accessorKey: "sellingPrice",
      header: "Selling Price",
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

  const getAvailabilityStatus = (quantity: number) => {
    if (quantity <= 0) {
      return { text: "Out of Stock", color: "red" };
    } else if (quantity <= threshold) {
      return { text: "Low Stock", color: "#FFBA18" };
    } else {
      return { text: "In Stock", color: "green" };
    }
  };

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
      const cellValue = row.getValue(columnId)?.toString() ?? ""; // Convert to string (or empty if undefined)
      return cellValue.toLowerCase().includes(searchTerm);
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="inv-inventory-container">
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
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div className="header-and-buttons mb-4">
          <h1 className="inv-inventory-header">Products</h1>
          <div className="search-bar">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search products..."
              className="border p-2 bg-white rounded-lg shadow-sm"
            />
          </div>
          <div className="button-row">
            <Dialog.Trigger asChild>
              <button
                onClick={fetchSuppliers}
                className="p-3 text-white rounded-lg shadow-md bg-red-950 hover:bg-red-800 focus:relative"
              >
                Add Product
              </button>
            </Dialog.Trigger>
          </div>
        </div>

        <div className="h-[350px] overflow-hidden">
          <table
            className="min-w-full divide-y divide-brown-950"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
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
            className="px-2 py-1 bg-brown-950 rounded-l shadow-md"
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
            className="px-2 py-1 bg-brown-950 rounded-r shadow-md"
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
                className="text-black w-[90px] text-right text-[15px]"
                htmlFor="supplier"
              >
                Supplier
              </label>
              <select
                className="bg-neutral-950 text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="supplier"
                value={selectedSupplier?.id || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const supplier = suppliers.find(
                    (s) => s.id.toString() === selectedId
                  );
                  setSelectedSupplier(supplier || null);
                }}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-violet11 w-[90px] text-right text-[15px]"
                htmlFor="productName"
              >
                Product Name
              </label>
              <select
                className="bg-neutral-950 text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="productName"
                required
                onChange={(e) => setName(e.target.value)}
              >
                <option value="">Select Product Name</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.product}>
                    {supplier.product}
                  </option>
                ))}
              </select>
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
                <option value="">Select Product Category</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.category}>
                    {supplier.category}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-violet11 w-[90px] text-right text-[15px]"
                htmlFor="sellingPrice"
              >
                Selling Price
              </label>
              <input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="sellingPrice"
                type="number"
                onChange={(e) => setSellingPrice(e.target.valueAsNumber)}
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
                Threshold
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
