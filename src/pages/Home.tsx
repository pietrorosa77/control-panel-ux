import { Box, Heading, Paragraph } from "grommet";
import { ErrorBoundary } from "../components/ErrorBoundary";
import protectRoute from "./ProtectedRoute";

const HomePage = (props: any) => {
  return (
    <ErrorBoundary>
      <Box fill background="neutral-3">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="large" level={1}>
            HomePage
          </Heading>
          <Paragraph>HomePage</Paragraph>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

HomePage.displayName = "HomePage";

export default protectRoute(HomePage, "AuthorizedHomePage");
