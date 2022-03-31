import { useAuth0 } from "@auth0/auth0-react";
import { Box, Heading } from "grommet";
import ReactJson from "react-json-view";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Loader } from "../components/Loading";
import protectRoute from "./ProtectedRoute";

const ProfilePage = () => {
  const { isLoading, user } = useAuth0();
  return (
    <ErrorBoundary>
      <Box fill background="neutral-3">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="medium" level={2}>
            Profile Page
          </Heading>
          <Box
            margin={{ bottom: "1rem" }}
            background="neutral-2"
            pad="medium"
            round
            width="100%"
            style={{ minHeight: "unset" }}
          >
            User profile properties can be changed using the auth0 management
            api. (not implemented in this POC)
          </Box>
          <Box>
            {isLoading ? (
              <Loader themeColor="neutral-3" />
            ) : (
              <Box
                pad="medium"
                background="brand"
                round
                gap="small"
                style={{ minHeight: "unset" }}
              >
                <ReactJson
                  name="user properties"
                  enableClipboard={false}
                  style={{ width: "100%" }}
                  src={user || {}}
                  theme="monokai"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

ProfilePage.displayName = "ProfilePage";

export default protectRoute(ProfilePage, "AuthorizedProfilePage");
