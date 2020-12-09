import React, { useCallback } from "react";
import Link from "next/link";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
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

const MenuContainer = styled(IconButton)``;

const iconStyles = colors => {
  return {
    menuIcon: {
      background: colors.primary1,
      background: `-webkit-linear-gradient(to right, ${colors.primary2}, ${colors.primary1})`,
      background: `linear-gradient(to right, ${colors.primary2}, ${colors.primary1});`,
      color: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      width: 50,
      height: 50,
      borderRadius: 25,
      marginLeft: 10
    },
    customHover: {
      "&:hover": { opacity: 0.7 }
    },
    drawer: {
      backgroundColor: colors.background,
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
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

const menuItems = [
  {
    label: 'US Market',
    link: 'market',
  },
  {
    label: 'HK Market',
    link: 'market/hk',
  }
];

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
        <List>
        {menuItems?.map(({label, link}) => (
          <React.Fragment key={link}>
            <Link href={`/[lang]/${link}`} as={`/${locale}/${link}`}>
              <ListItem button selected={pathname === `/[lang]/${link}`}>
                <ListItemIcon className={classes.listItemIcon}>
                  <ShowChartIcon />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary={t(label)} 
                />
              </ListItem>
            </Link>
          </React.Fragment>
        ))}
        </List>
      </Container>
    ),
    [mode, classes, locale, menuItems]
  );

  return (
    <div>
      <React.Fragment>
        <MenuContainer className={[classes.menuIcon, classes.customHover]} onClick={toggleDrawer(!isOpen)}>
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
