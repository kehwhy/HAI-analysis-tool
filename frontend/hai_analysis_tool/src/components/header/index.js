import React from "react";
import { AppBar, Toolbar, Link } from "@material-ui/core";

export default function Header() {
  const displayDesktop = () => {
    return <Toolbar><Link color="inherit" href='/'>HAII</Link></Toolbar>;
  };
  
  return (
    <header>
      <AppBar>{displayDesktop()}</AppBar>
    </header>
  );
}