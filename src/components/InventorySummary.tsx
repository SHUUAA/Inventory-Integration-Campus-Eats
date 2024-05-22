import { useEffect } from "react";
import { database } from "../firebase/Config";
import { collection, getDocs, query } from "firebase/firestore";
import "../css/InventorySummary.css";
import FirebaseController from "../firebase/FirebaseController";
import SalesIcon from "../assets/cash-outline.svg";
import QuantityIcon from "../assets/cube-outline.svg";
import PurchaseIcon from "../assets/bag-check-outline.svg";
import SuppliersIcon from "../assets/people-outline.svg";
import { atom, useAtom } from "jotai";
import { Product } from "./ProductList";
import Supplier from "../pages/Supplier";

const productListAtom = atom<Product[]>([]);
const suppliersAtom = atom<Supplier[]>([]);
const isLoadingAtom = atom(true);
const errorAtom = atom<string | null>(null);
const countSuppliersAtom = atom(0);
const InventorySummary = () => {
  const [productList, setProductList] = useAtom(productListAtom);
  const [suppliers, setSuppliers] = useAtom(suppliersAtom);
  const [countSupplier, setCountSupplier] = useAtom(countSuppliersAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setError] = useAtom(errorAtom);
  const firebaseController = new FirebaseController();

  const getProductList = async () => {
    try {
      const user = await firebaseController.getCurrentUser();
      if (!user) {
        console.error("User not authenticated!");
        return;
      }

      const userID = user.uid;
      const userProductsQuery = query(
        collection(database, "products", userID, "userProducts")
      );
      const data = await getDocs(userProductsQuery);
      const products = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //@ts-ignore
      setProductList(products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      //@ts-ignore
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    setIsLoading(true); // Start loading

    try {
      const user = await firebaseController.getCurrentUser();
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
      setCountSupplier(supplierList.length);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      //@ts-ignore
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProductList();
    fetchSuppliers();
  }, []);

  const lowStockProducts = productList.filter(
    (product) => product.quantity <= product.threshold
  );

  return (
    <div className="main-content">
      <div className="summary-containers">
        <div className="summary-container">
          <div>
            <h3>₱ --</h3>
            <span>Sales</span>
          </div>
          <img src={SalesIcon} alt="Sales Icon" className="svg-icon" />
        </div>
        <div className="summary-container">
          <div>
            <h3>
              {productList.reduce(
                (sum, product) => sum + (product.quantity || 0),
                0
              )}
            </h3>
            <span>Quantity in Hand</span>
          </div>
          <img src={QuantityIcon} alt="Quantity Icon" className="svg-icon" />
        </div>
        <div className="summary-container">
          <div>
            <h3>--</h3>
            <span>Purchase</span>
          </div>
          <img src={PurchaseIcon} alt="Purchase Icon" className="svg-icon" />
        </div>
        <div className="summary-container">
          <div>
            <h3>{countSupplier}</h3>
            <span>Number of Suppliers</span>
          </div>
          <img src={SuppliersIcon} alt="Suppliers Icon" className="svg-icon" />
        </div>
      </div>
      <div className="flex-container">
        <div className="product-list-container h-[500px] overflow-y-auto">
          <h1>Top Selling Stock</h1>
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sold Quantity</th>
                  <th>Remaining Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {productList.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No products available</td>
                  </tr>
                ) : (
                  productList.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>--</td>
                      <td>{product.quantity}</td>
                      <td>₱{product.sellingPrice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="see-all">See All</div>
        </div>
        <div className="low-stock-container h-[500px] overflow-y-auto">
          <h1>Low Quantity Stock</h1>
          <div className="table-container">
            <table className="product-table">
              <tbody>
                {lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3}>No low stock products</td>
                  </tr>
                ) : (
                  lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-image"
                        />
                      </td>
                      <td>
                        <div>
                          <span>{product.name}</span>
                          <span>Remaining Quantity: {product.quantity}</span>
                        </div>
                      </td>
                      <td>low</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="see-all">See All</div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
