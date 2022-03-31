import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Heading, Notification } from "grommet";
import { Money, Stripe } from "grommet-icons";
import { useEffect, useMemo, useState } from "react";
import ReactJson from "react-json-view";
import { useLocation, useNavigate } from "react-router-dom";
import { getSubscription, stripeManageSubscription } from "../api";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { CenteredLoader, Loader } from "../components/Loading";
import { StyledButton } from "../components/NavLinks";
import protectRoute from "./ProtectedRoute";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const SubscriptionPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const sessionId = query.get("sessionId");
  const { getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(false);

  useEffect(() => {
    onLoadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadSubscription = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const tkn = await getAccessTokenSilently();
      const result = await getSubscription(tkn, sessionId || undefined);
      setResult(result);
    } catch (e) {
      setError(e);
      // checkErrorAndredirect(e, navigate);
    } finally {
      setLoading(false);
    }
  };

  const onManageSubscription = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const tkn = await getAccessTokenSilently();
      const session = await stripeManageSubscription(result.customer, tkn);
      window.location.href = session.url;
    } catch (e) {
      setError(e);
      // checkErrorAndredirect(e, navigate);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ErrorBoundary>
      <Box fill background="neutral-3" pad="large">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="medium" level={2}>
            Your Subscription
          </Heading>
          {loading && <CenteredLoader themeColor="white" size={100} />}
          {error && (
            <Box
              pad="medium"
              background="brand"
              margin={{ bottom: "1rem" }}
              style={{ minHeight: "unset" }}
            >
              {error.code === 404 ? (
                <Box gap="small">
                  <Notification
                    status="warning"
                    title="No subscriptions assigned to your account"
                    message="Please create one on the pricing page"
                  />
                  <StyledButton
                    label="Pricing"
                    icon={<Money />}
                    onClick={() => navigate("/pricing")}
                  ></StyledButton>
                </Box>
              ) : (
                <Box gap="small">
                  <Notification
                    status="critical"
                    title="Error loading subscription"
                    message="There was an error while loading your subscription details"
                  />
                </Box>
              )}
            </Box>
          )}

          {result && (
            <Box
              pad="medium"
              background="brand"
              round
              gap="small"
              style={{ minHeight: "unset" }}
            >
              <Button
                label="Manage your subscription"
                onClick={onManageSubscription}
                icon={loading ? <Loader themeColor="white" /> : <Stripe />}
              ></Button>
              <ReactJson
                name="sunscription details"
                enableClipboard={false}
                style={{ width: "100%" }}
                src={result}
                theme="monokai"
              />
            </Box>
          )}
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

SubscriptionPage.displayName = "SubscriptionPage";

export default protectRoute(SubscriptionPage, "AuthorizedPSubscriptionPage");
