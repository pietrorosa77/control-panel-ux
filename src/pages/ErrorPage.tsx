import { Box, Heading, Paragraph } from "grommet";
import { useParams } from "react-router";
import { ErrorBoundary } from "../components/ErrorBoundary";

const ErrorPage = (props: { code?: string }) => {
  const params = useParams();
  const errorCode = props.code || params.code;
  return (
    <ErrorBoundary>
      <Box fill background="neutral-3">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="large" level={1}>
            Error {errorCode}
          </Heading>
          <Paragraph>Please, try again later or report the problem.</Paragraph>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default ErrorPage;
