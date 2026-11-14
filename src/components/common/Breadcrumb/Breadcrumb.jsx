import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import "./Breadcrumb.css";

function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-home" title="Home" aria-label="Home">
        <Home size={15} />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            className="breadcrumb-item"
            key={`${item.label}-${index}`}
          >
            <ChevronRight
              size={14}
              className="breadcrumb-separator"
            />

            {isLast || !item.path ? (
              <span className="breadcrumb-current" aria-current="page" title={item.label}>
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="breadcrumb-link" title={item.label}>
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;