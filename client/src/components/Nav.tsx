import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Avatar from "@material-ui/core/Avatar";

import "./Nav.css";
import { useAppSelector, useAppDispatch } from "../store";

const Nav = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleLogoutClick = () => dispatch({ type: "USER_LOGOUT" });

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
