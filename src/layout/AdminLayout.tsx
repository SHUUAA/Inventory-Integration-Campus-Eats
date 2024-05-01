import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";

const AdminLayout = () => {

    return(
        <div className="flex h-screen overflow-hidden">
        <div className="large-screen">
          <SideBar></SideBar>
        </div>
        <div className="flex0 relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-white-950">
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet></Outlet>
            </div>
          </main>
        </div>
      </div>
    );

} 

export default AdminLayout;