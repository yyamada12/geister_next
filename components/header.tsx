import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Header: React.FC = () => {
  return (
    <AppBar position={"relative"}>
      <Toolbar>
        <Typography variant="h6">Geister</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
