import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Avatar from "@material-ui/core/Avatar";
import "./Nav.css";

const Nav = () => {
  const { user, logout } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const handleLogoutClick = () => logout({ returnTo: window.location.origin });

  return (
    <div>
      <Button
        className="user-button"
        aria-controls="simple-menu"
        aria-haspopup="true"
        ref={menuButtonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Avatar className="avatar" src={user?.picture} />
        <span className="owner-name">{user?.name}</span>
        <ArrowDropDownIcon className="arrow-drop" />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={menuButtonRef.current}
        keepMounted
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default Nav;
