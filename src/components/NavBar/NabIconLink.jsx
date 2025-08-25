import { NavLink } from "react-router-dom";

/**
 * Simple icon NavLink for the navbar
 * Props:
 * - to: string
 * - label: string (aria label)
 * - badge?: number|string
 * - children: icon (SVG)
 */
export default function NabIconLink({ to, label, badge, children }) {
    return (
        <NavLink
            to={to}
            aria-label={label}
            className={({ isActive }) =>
                "nav-icon-btn" + (isActive ? " nav-icon-btn--active" : "")
            }
            title={label}
        >
            {children}
            {badge != null && (
                <span className="nav-badge" aria-label={`${label} count`}>
          {badge}
        </span>
            )}
        </NavLink>
    );
}
