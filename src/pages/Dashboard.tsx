import InventorySummary from "../components/InventorySummary";
import LowQuantityStock from "../components/LowQuantityStock";
import OrderSummary from "../components/OrderSummary";
import ProductSummary from "../components/ProductSummary";
import PurchaseOverview from "../components/PurchaseOverview";
import SalesOverview from "../components/SalesOverview";
import SalesPurchase from "../components/SalesPurchase";
import TopSellingStock from "../components/TopSellingStock";
import "../css/Dashboard.css";

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mb-6">
        <div className="h-40 rounded-lg bg-white-950 lg:col-span-2">
        <SalesOverview></SalesOverview>
        </div>

        <div className="h-40 rounded-lg bg-white-950">
          <InventorySummary></InventorySummary>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mb-6">
        <div className="h-40 rounded-lg bg-white-950 lg:col-span-2">
          <PurchaseOverview></PurchaseOverview>
        </div>
        <div className="h-40 rounded-lg bg-white-950">
          <ProductSummary></ProductSummary>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mb-6">
        <div className="h-56 rounded-lg bg-white-950 lg:col-span-2">
          <SalesPurchase></SalesPurchase>
        </div>

        <div className="h-56 rounded-lg bg-white-950">
          <OrderSummary></OrderSummary>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mb-6">
        <div className="h-56 rounded-lg bg-white-950 lg:col-span-2">
          <TopSellingStock></TopSellingStock>
        </div>
        <div className="h-56 rounded-lg bg-white-950">
          <LowQuantityStock></LowQuantityStock>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
