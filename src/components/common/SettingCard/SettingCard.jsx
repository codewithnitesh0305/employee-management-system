import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import "./SettingCard.css";

function SettingCard({
  icon: Icon,
  title,
  description,
  to,
}) {
  return (
    <Link to={to} className="setting-card">
      <span className="setting-card-icon">
        <Icon size={22} strokeWidth={1.75} />
      </span>

      <span className="setting-card-body">
        <span className="setting-card-title">
          {title}
        </span>

        <span className="setting-card-description">
          {description}
        </span>
      </span>

      <ChevronRight
        size={18}
        className="setting-card-chevron"
      />
    </Link>
  );
}

export default SettingCard;