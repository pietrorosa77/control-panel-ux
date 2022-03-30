import { useAuth0 } from "@auth0/auth0-react";
import { Box, Heading } from "grommet";
import ReactJson from "react-json-view";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Loader } from "../components/Loading";
import protectRoute from "./ProtectedRoute";

const ProfilePage = (props: any) => {
  const { isLoading, user } = useAuth0();
  return (
    <ErrorBoundary>
      <Box fill background="neutral-3">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="large" level={1}>
            Profile Page
          </Heading>
          <Box>
            {isLoading ? (
              <Loader themeColor="neutral-3" />
            ) : (
              <ReactJson
                name="user properties"
                enableClipboard={false}
                style={{ width: "100%" }}
                src={user!}
                theme="monokai"
              />
            )}
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

ProfilePage.displayName = "ProfilePage";

export default protectRoute(ProfilePage, "AuthorizedProfilePage");
