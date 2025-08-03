import { NavLink } from "react-router-dom";
import { Home, PoundSterling, Target, MapPin, User } from "lucide-react";

const MobileNavigation = () => {
  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/finance", icon: PoundSterling, label: "Finance" },
    { to: "/targets", icon: Target, label: "Targets" },
    { to: "/city-info", icon: MapPin, label: "City" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Icon size={18} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;