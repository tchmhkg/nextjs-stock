import React, { useCallback } from "react";
import Link from "next/link";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import { IconButton } from "@material-ui/core";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import useTranslation from "~/hooks/useTranslation";
import Avatar from "~/components/avatar";
import { useTheme } from "~/theme";
import { useRouter } from "next/router";

const Container = styled.div`
  width: 250px;
`;

const MenuContainer = styled(IconButton)`
  margin: 0 15px;
`;

const iconStyles = colors => {
  return {
    menuIcon: {
      color: "#ECEFF4",
    },
    drawer: {
      backgroundColor: colors.background
    },
    listItemIcon: {
      color: colors.text
    },
    listItemText: {
      color: colors.text
    },
    divider: {
      backgroundColor: colors.border
    }
  };
}

const Menu = () => {
  const router = useRouter();
  const { pathname } = router;
  const [isOpen, setIsOpen] = React.useState(false);
  const {colors} = useTheme();
  const classes = makeStyles(iconStyles(colors))();
  const { locale, t, mode } = useTranslation();

  const toggleDrawer = useCallback((action) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(action);
  }, []);

  const list = useCallback(
    () => (
      <Container
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Avatar />
        <Divider classes={{root: classes.divider}} />
        <List>
          <Link href="/[lang]/market" as={`/${locale}/market`}>
            <ListItem button selected={pathname === '/[lang]/market'}>
              <ListItemIcon className={classes.listItemIcon}>
                <ShowChartIcon />
              </ListItemIcon>
              <ListItemText
                className={classes.listItemText}
                primary={t('Market')} 
              />
            </ListItem>
          </Link>
        </List>
        <Divider classes={{root: classes.divider}} />
      </Container>
    ),
    [mode, classes, locale]
  );

  return (
    <div>
      <React.Fragment>
        <MenuContainer className={classes.menuIcon} onClick={toggleDrawer(!isOpen)}>
          <MenuIcon />
        </MenuContainer>
        <SwipeableDrawer
          classes={{ paper: classes.drawer }}
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
