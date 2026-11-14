import {
  Bell,
} from "lucide-react";

function Notifications() {

  const notificationCount = 3;

  return (
    <button
      type="button"
      className="header-notification"
      aria-label="Notifications"
    >

      <Bell size={20} />

      {notificationCount > 0 && (
        <span className="notification-badge">
          {notificationCount > 9
            ? "9+"
            : notificationCount}
        </span>
      )}

    </button>
  );
}

export default Notifications;