import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Heading } from "grommet";
import { ErrorBoundary } from "../components/ErrorBoundary";
import protectRoute from "./ProtectedRoute";
import { callPing, callProtectedPing } from "../api";
import { useState } from "react";
import { Loader } from "../components/Loading";
import ReactJson from "react-json-view";

const HomePage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(false);

  const callPingClick = async () => {
    setLoading(true);
    setResult(undefined);
    setError(undefined);
    try {
      const result = await callPing();
      setResult(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const callPingProtectedClick = async () => {
    setLoading(true);
    setResult(undefined);
    setError(undefined);
    const tkn = await getAccessTokenSilently();
    try {
      const result = await callProtectedPing(tkn);
      setResult(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const callPingProtectedClickNJoTkn = async () => {
    setLoading(true);
    setResult(undefined);
    setError(undefined);

    try {
      const result = await callProtectedPing("wrong token");
      setResult(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Box fill background="neutral-3">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="large" level={1}>
            HomePage
          </Heading>
          <Box gap="small" direction="row">
            <Button
              onClick={callPingClick}
              disabled={loading}
              label="Call Ping"
            ></Button>
            <Button
              onClick={callPingProtectedClickNJoTkn}
              disabled={loading}
              label="Call protected Ping WITHOUT auth token "
            ></Button>
            <Button
              onClick={callPingProtectedClick}
              disabled={loading}
              label="Call protected Ping with auth token "
            ></Button>
          </Box>
          <Box gap="small" direction="row" pad="small">
            {loading && <Loader themeColor="neutral-3"></Loader>}
            {result && (
              <Box fill background="status-ok" pad="large">
                <ReactJson
                  name="user properties"
                  enableClipboard={false}
                  style={{ width: "100%" }}
                  src={result}
                  theme="monokai"
                />
              </Box>
            )}
            {error && (
              <Box background="status-error" pad="large">
                <ReactJson
                  name="user properties"
                  enableClipboard={false}
                  style={{ width: "100%" }}
                  src={{ error: error.message }}
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

HomePage.displayName = "HomePage";

export default protectRoute(HomePage, "AuthorizedHomePage");
