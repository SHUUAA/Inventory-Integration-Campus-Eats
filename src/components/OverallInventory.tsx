import { useEffect } from "react";
import { database } from "../firebase/Config";
import { collection, getDocs, query } from "firebase/firestore";
import "../css/OverallInventory.css";
import FirebaseController from "../firebase/FirebaseController";
const firebaseController = new FirebaseController();
const user = await firebaseController.getCurrentUser();
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { atom, useAtom } from "jotai";
import { productsUpdatedAtom } from "./ProductList";
interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

const totalProductsAtom = atom(0);
const lowStocksAtom = atom(0);
const categoriesCountAtom = atom(0);

const OverallInventory = () => {
  const [totalProducts, setTotalProducts] = useAtom(totalProductsAtom);
  const [productsUpdated] = useAtom(productsUpdatedAtom);
  const [lowStocks, setLowStocks] = useAtom(lowStocksAtom);
  const [categoriesCount, setCategoriesCount] = useAtom(categoriesCountAtom);
  const [parent, enableAnimations] = useAutoAnimate();
  const userID = user?.uid;

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
      const products = querySnapshot.docs.map((doc) => doc.data() as Product);

      setTotalProducts(products.length);
      setLowStocks(products.filter((product) => product.quantity < 10).length);
      setCategoriesCount(
        new Set(products.map((product) => product.category)).size
      );
    };

    fetchProducts();
  }, [userID, productsUpdated]);

  return (
    <div className="overall-inventory-container container-rounded">
      <h1 className="overall-inventory-header">Overall Inventory</h1>
      <div className="overall-header-row" ref={parent}>
        <div className="overall-column">
          Categories
          <span className="column-text">{categoriesCount}</span>
          <span className="column-subtext">Categories</span>
        </div>
        <div className="overall-column">
          Total Products
          <span className="column-text">{totalProducts}</span>
          <span className="column-subtext">Last 7 Days</span>
          <span className="column-subtext1">Revenue</span>
        </div>
        <div className="overall-column">
          Top Selling
          <span className="column-text">—</span>{" "}
          {/* kamo nalay butang ani sa topselling kay wa ko kabaw say butanga ari */}
          <span className="column-subtext">Last 7 Days</span>
          <span className="column-subtext1">Cost</span>
        </div>
        <div className="overall-column">
          Low Stocks
          <span className="column-text">{lowStocks}</span>
          <span className="column-subtext">Ordered</span>
          <span className="column-subtext1">Not in stock</span>
        </div>
      </div>
    </div>
  );
};

export default OverallInventory;
