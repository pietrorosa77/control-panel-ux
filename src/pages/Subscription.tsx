import { Box, Heading, Paragraph } from "grommet";
import { ErrorBoundary } from "../components/ErrorBoundary";
import protectRoute from "./ProtectedRoute";

const SubscriptionPage = (props: any) => {
  return (
    <ErrorBoundary>
      <Box fill background="neutral-3">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="large" level={1}>
            SubscriptionPage
          </Heading>
          <Paragraph>SubscriptionPage</Paragraph>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

SubscriptionPage.displayName = "SubscriptionPage";

export default protectRoute(SubscriptionPage, "AuthorizedPSubscriptionPage");
