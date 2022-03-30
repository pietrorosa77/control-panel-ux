import { Box, Heading, Paragraph } from "grommet";
import { ErrorBoundary } from "../components/ErrorBoundary";
import protectRoute from "./ProtectedRoute";

const PricingPage = (props: any) => {
  return (
    <ErrorBoundary>
      <Box fill background="neutral-3">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="large" level={1}>
            Pricing Page
          </Heading>
          <Paragraph>Please, try again later or report the problem.</Paragraph>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

PricingPage.displayName = "PricingPage";

export default protectRoute(PricingPage, "AuthorizedPricingPage");
