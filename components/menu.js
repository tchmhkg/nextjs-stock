import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import ShowChartIcon from '@material-ui/icons/ShowChart';
const Container = styled.div`
  width: 250px;
  margin-left: 10px;
`;

const MenuContainer = styled(IconButton)`
  margin: 0 15px;
`;

function iconStyles() {
    return {
      icon: {
        color: '#ECEFF4',
      },
    }
  }

const Menu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const classes = makeStyles(iconStyles)();

  const toggleDrawer = (action) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    console.log("action", action);
    setIsOpen(action);
  };

  const list = () => (
    <Container
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Market"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Container>
  );

  return (
    <div>
      <React.Fragment>
        <MenuContainer className={classes.icon} onClick={toggleDrawer(!isOpen)}>
          <MenuIcon />
        </MenuContainer>
        <SwipeableDrawer
          anchor="left"
          open={isOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          {list()}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
};

export default Menu;
