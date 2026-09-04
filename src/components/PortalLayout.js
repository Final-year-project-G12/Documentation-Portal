import Sidebar from "./Sidebar";

function PortalLayout({ children }) {
  return (
    <div className="portal-shell">
      <Sidebar />
      <main className="portal-main">{children}</main>
    </div>
  );
}

export default PortalLayout;
