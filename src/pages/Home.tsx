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
        <Box style={{ alignItems: "center" }} alignSelf="center" pad="medium">
          <Heading size="medium" level={2}>
            Control Panel test project
          </Heading>
          <Box
            background="brand"
            pad="large"
            round
            width="100%"
            style={{ minHeight: "unset" }}
          >
            This simple console aims to be a POC to show the integration with a
            third party auth service (auth0) and a third party subscription /
            payment management service (stripe). The front end uses React with
            Grommet components and Vite.js build. Back end api are written in
            nodejs with Fastify.
          </Box>
          <Box
            margin={{ top: "1rem" }}
            background="neutral-2"
            pad="large"
            round
            width="100%"
            style={{ minHeight: "unset" }}
          >
            Simple test calling Api with or without jwt token obtained from
            Auth0
            <Box gap="small">
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
      </Box>
    </ErrorBoundary>
  );
};

HomePage.displayName = "HomePage";

export default protectRoute(HomePage, "AuthorizedHomePage");
