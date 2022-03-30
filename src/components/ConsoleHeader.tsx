import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Menu,
  ResponsiveContext,
  Header,
  Nav,
  Heading,
  Avatar,
} from "grommet";
import { Home, Logout, Menu as MenuIcon, Money, Stripe } from "grommet-icons";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "./Loading";
import { StyledButton } from "./NavLinks";

export const HeaderHeight = "80px";

export const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <StyledButton
      label="Log Out"
      icon={<Logout />}
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    />
  );
};

const AuthStatus = (props: { small?: boolean }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return <Loader themeColor="neutral-3" />;
  }

  const noAuth = (
    <Box gap="small" direction={props.small ? "column" : "row"}>
      unhauthorized
    </Box>
  );

  const auth = (
    <Box gap="small" direction="row">
      <Box pad="small">
        <Avatar src={user?.picture} size={props.small ? "small" : undefined} />
      </Box>
    </Box>
  );

  return isAuthenticated ? auth : noAuth;
};

export const ConsoleHeader = () => {
  const navigate = useNavigate();
  return (
    <Header background="brand" pad="medium" height={HeaderHeight}>
      <Box direction="row" align="center" gap="small">
        <Heading level={1} size="medium">
          Control Panel
        </Heading>
      </Box>
      <ResponsiveContext.Consumer>
        {(size) =>
          size === "small" ? (
            <Box justify="end" direction="row">
              <Menu
                a11yTitle="Navigation Menu"
                dropProps={{ align: { top: "bottom", left: "left" } }}
                icon={<MenuIcon color="white" />}
                items={[
                  {
                    label: <Box alignSelf="center">Profile</Box>,
                    onClick: () => navigate(`/Profile`),
                    icon: <AuthStatus small />,
                  },
                  {
                    label: <Box alignSelf="center">Subscription</Box>,
                    onClick: () => navigate(`/Subscription`),
                    icon: (
                      <Box pad="small">
                        <Stripe />
                      </Box>
                    ),
                  },
                  {
                    label: <Box alignSelf="center">Pricing</Box>,
                    onClick: () => navigate(`/Pricing`),
                    icon: (
                      <Box pad="small">
                        <Money />
                      </Box>
                    ),
                  },
                  {
                    label: <Box alignSelf="center">Home</Box>,
                    onClick: () => navigate(`/`),
                    icon: (
                      <Box pad="small">
                        <Home />
                      </Box>
                    ),
                  },
                  {
                    label: <LogoutButton />,
                  },
                ]}
              />
            </Box>
          ) : (
            <Nav direction="row">
              <Box gap="small" direction="row">
                <StyledButton
                  label="Home"
                  icon={<Home />}
                  onClick={() => navigate("/")}
                ></StyledButton>
                <StyledButton
                  label="Pricing"
                  icon={<Money />}
                  onClick={() => navigate("/pricing")}
                ></StyledButton>
                <StyledButton
                  label="Subscription"
                  icon={<Stripe />}
                  onClick={() => navigate("/Subscription")}
                ></StyledButton>

                <LogoutButton />
                <Link to="/Profile">
                  <AuthStatus />
                </Link>
              </Box>
            </Nav>
          )
        }
      </ResponsiveContext.Consumer>
    </Header>
  );
};
