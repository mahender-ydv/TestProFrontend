import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";


const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="layout-wrapper d-flex">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
