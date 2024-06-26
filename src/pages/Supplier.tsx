import * as Dialog from "@radix-ui/react-dialog";
import * as Avatar from "@radix-ui/react-avatar";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { useEffect, useMemo } from "react";
import { authentication, database, storage } from "../firebase/Config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import "../css/ProductList.css";
import FirebaseController from "../firebase/FirebaseController";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { atom, useAtom } from "jotai";
import toast, { Toaster } from "react-hot-toast";
const firebaseController = new FirebaseController();
interface Supplier {
  id: number;
  name: string;
  email: string;
  product: string;
  buyingPrice: number;
  category: string;
  contactNumber: number;
  imageUrl?: string;
}

const suppliersAtom = atom<Supplier[]>([]);
const globalFilterAtom = atom("");
const isLoadingAtom = atom(true);
const errorAtom = atom<string | null>(null);

const nameAtom = atom("");
const emailAtom = atom("");
const productAtom = atom("");
const contactNumberAtom = atom(0);
const categoryAtom = atom("");
const buyingPriceAtom = atom(0);
const fileAtom = atom<File | null>(null);
const openAtom = atom(false);
const formResetKeyAtom = atom(0);

const Supplier = () => {
  const [suppliers, setSuppliers] = useAtom(suppliersAtom);
  const [globalFilter, setGlobalFilter] = useAtom(globalFilterAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setError] = useAtom(errorAtom);

  const [name, setName] = useAtom(nameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [product, setProduct] = useAtom(productAtom);
  const [contactNumber, setContactNumber] = useAtom(contactNumberAtom);
  const [category, setCategory] = useAtom(categoryAtom);
  const [buyingPrice, setBuyingPrice] = useAtom(buyingPriceAtom);
  const [file, setFile] = useAtom(fileAtom);
  const [open, setOpen] = useAtom(openAtom);
  const [formResetKey, setFormResetKey] = useAtom(formResetKeyAtom);

  const [parent] = useAutoAnimate();

  const validateSupplier = () => {
    let isValid = true;
    if (name.trim() === "") {
      toast.error("Name is required.");
      isValid = false;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email address.");
      isValid = false;
    }
    if (product.trim() === "") {
      toast.error("Product is required.");
      isValid = false;
    }
    if (contactNumber <= 0 || isNaN(contactNumber)) {
      toast.error("Invalid contact number.");
      isValid = false;
    }
    if (category === "") {
      toast.error("Category is required.");
      isValid = false;
    }
    if (buyingPrice <= 0 || isNaN(buyingPrice)) {
      toast.error("Invalid buying price.");
      isValid = false;
    }
    return isValid;
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true); // Start loading

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

    fetchSuppliers();
  }, [formResetKey]);

  const fetchSupplier = async (supplierId: number) => {
    try {
      const user = authentication.currentUser;
      const userID = user?.uid;

      if (!userID) {
        throw new Error("User not authenticated or missing UID!");
      }
      //@ts-ignore
      const supplierRef = doc(
        database,
        "suppliers",
        userID,
        "userSuppliers",
        supplierId
      );

      const supplierDocSnap = await getDoc(supplierRef);

      if (!supplierDocSnap.exists()) {
        throw new Error("Supplier not found!");
      }

      const supplierData = supplierDocSnap.data() as Supplier;

      setName(supplierData.name);
      setEmail(supplierData.email);
      setContactNumber(supplierData.contactNumber);
      setProduct(supplierData.product);
      setCategory(supplierData.category);
      setBuyingPrice(supplierData.buyingPrice);
      setFile(null);
    } catch (err) {
      console.error("Failed to fetch supplier:", err);
      //@ts-ignore
      setError(err.message);
    }
  };

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

    if (!validateSupplier()) {
      return; 
    }

    const random = crypto.randomUUID();
    let imageUrl = "";
    if (file) {
      const imageRef = ref(
        storage,
        `SupplierImages/${userID}/${random}-${file.name}`
      );
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
      toast("Supplier added successfully");

      setOpen(false);
      setFormResetKey(formResetKey + 1);
    } catch (error) {
      console.error("Error adding supplier: ", error);
    }
  };

  const handleUpdateSupplier = async (
    updatedSupplier: Supplier,
    newFile?: File | null
  ) => {
    try {
      if (!validateSupplier()) {
        return;
      }
      const user = await firebaseController.getCurrentUser();
      const userID = user?.uid;
      //@ts-ignore
      const supplierRef = doc(
        database,
        "suppliers",
        userID,
        "userSuppliers",
        updatedSupplier.id
      );
      let updatedData: Partial<Supplier> = {
        name: updatedSupplier.name,
        email: updatedSupplier.email,
        contactNumber: updatedSupplier.contactNumber,
        product: updatedSupplier.product,
        category: updatedSupplier.category,
        buyingPrice: updatedSupplier.buyingPrice,
      };

      if (newFile) {
        const random = crypto.randomUUID();
        const imageRef = ref(
          storage,
          `SupplierImages/${userID}/${random}-${newFile.name}`
        );
        await uploadBytes(imageRef, newFile);
        const newImageUrl = await getDownloadURL(imageRef);

        if (updatedSupplier.imageUrl) {
          const oldImageRef = ref(storage, updatedSupplier.imageUrl);
          await deleteObject(oldImageRef);
        }

        updatedData.imageUrl = newImageUrl;
      }

      await updateDoc(supplierRef, updatedData);
      toast("Supplier updated successfully!");
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier.id === updatedSupplier.id ? updatedSupplier : supplier
        )
      );
    } catch (error) {
      console.error("Error updating Supplier:", error);
    }
  };

  const handleSubmitSupplier = async (supplierId: number) => {
    const updatedSupplier: Supplier = {
      id: supplierId,
      name: name,
      email: email,
      contactNumber: contactNumber,
      product: product,
      category: category,
      buyingPrice: buyingPrice,
      imageUrl: suppliers.find((s) => s.id === supplierId)?.imageUrl,
    };

    await handleUpdateSupplier(updatedSupplier, file);
    setOpen(false);
    setFormResetKey(formResetKey + 1);
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

  const handleDeleteSupplier = async (supplierId: number) => {
    try {
      const user = authentication.currentUser;
      const userID = user?.uid;

      if (!userID) {
        console.error("User not authenticated or missing UID!");
        return;
      }
      //@ts-ignore
      const supplierRef = doc(
        database,
        "suppliers",
        userID,
        "userSuppliers",
        supplierId
      );

      const supplierDocSnap = await getDoc(supplierRef);
      if (!supplierDocSnap.exists()) {
        console.error("Supplier not found!");
        return;
      }
      const supplierData = supplierDocSnap.data();
      const imageUrl = supplierData?.imageUrl;

      await deleteDoc(supplierRef);

      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.id !== supplierId)
      );
    } catch (error) {
      console.error("Error deleting supplier: ", error);
    }
  };

  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        id: "avatar",
        header: "Photo",
        cell: ({ row }) => (
          <Avatar.Root className="">
            <Avatar.AvatarImage
              src={row.original.imageUrl}
              alt="Profile Picture"
              className="ml-3 h-[40px] w-[40px] object-cover rounded-full"
            />
          </Avatar.Root>
        ),
      },
      {
        accessorKey: "name",
        header: "Supplier",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "contactNumber",
        header: "Contact Number",
      },
      {
        accessorKey: "product",
        header: "Product",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "buyingPrice",
        header: "Buying Price",
      },
    ],
    []
  );

  const table = useReactTable({
    data: suppliers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, value) => {
      const searchTerm = value.toLowerCase();
      const cellValue = row.getValue(columnId)?.toString() ?? "";
      return cellValue.toLowerCase().includes(searchTerm);
    },

    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
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
      <div className="grid grid-cols-3 gap-8 ">
        <div className="h-16 rounded-lg col-span-2">
          <div className="text-2xl mt-6 ml-6">Suppliers</div>
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search products..."
            className="border m-6 p-2 bg-white rounded-lg shadow-sm"
          />
        </div>

        <div className="relative">
          {" "}
          <div className="h-16 rounded-lg flex justify-end absolute required right-4">
            <div className="m-6 space-x-4">
              <Dialog.Root open={open} onOpenChange={setOpen}>
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
          </div>
        </div>
      </div>

      <div className="h-[630px] mt-16">
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
              <tr key={row.id} className="">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button
                      onClick={() => {
                        fetchSupplier(row.original.id);
                      }}
                      className="focus:relative"
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
                          value={name}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </fieldset>

                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="contactNumber"
                        >
                          Contact Number
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="contactNumber"
                          type="number"
                          value={contactNumber === 0 ? "" : contactNumber}
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
                          value={product}
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

                      <div className="mt-[25px] flex justify-end">
                        <Dialog.Close asChild>
                          <button
                            onClick={() => {
                              handleSubmitSupplier(row.original.id);
                            }}
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
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button className="ml-4 p-2 mt-3 hover:text-white">
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
                        delete your supplier and remove your data from our
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
                            onClick={() =>
                              handleDeleteSupplier(row.original.id)
                            }
                            className="text-red11 bg-red-950 hover:bg-red-1000 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                          >
                            Yes, delete supplier
                          </button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination flex justify-center p-3">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-2 py-1 bg-brown-950 rounded-l shadow-md"
        >
          Previous
        </button>
        <span className="px-2 py-1">
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-2 py-1 bg-brown-950 rounded-r shadow-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Supplier;
