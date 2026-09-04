import { navigationItems } from "../data/navigation";

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Documentation navigation">
      <a className="brand" href="#top">
        <span className="brand-mark">PCM</span>
        <span>Documentation Portal</span>
      </a>

      <nav className="navigation">
        {navigationItems.map((item) => (
          <a className={item.active ? "nav-link active" : "nav-link"} href={item.href} key={item.label}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
