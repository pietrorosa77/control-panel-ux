import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Grid,
  Heading,
  Notification,
  RangeInput,
  Text,
} from "grommet";
import { Cart, Code, ServerCluster, User } from "grommet-icons";
import { useEffect, useState } from "react";
import { loadPricing, stripeCheckout } from "../api";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { CenteredLoader } from "../components/Loading";
import protectRoute from "./ProtectedRoute";

interface IPriceItem {
  id: string;
  desc: string;
  interval: string;
  interval_count: number;
  unit_amount: number;
  currency: string;
  lookup_key: string;
}

const Identifier = ({ children, title, subTitle, size, ...rest }: any) => (
  <Box gap="small" align="center" direction="row" pad="small" {...rest}>
    {children}
    <Box>
      <Text size={size} weight="bold">
        {title}
      </Text>
      <Text size={size}>{subTitle}</Text>
    </Box>
  </Box>
);

const PricingPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState<IPriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(false);
  const [selectedPrice, setSelectedPrice] = useState<IPriceItem>();
  const [users, setUsers] = useState<number>(1);

  useEffect(() => {
    onLoadPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadPricing = async () => {
    setLoading(true);
    setResult([]);
    setError(undefined);
    try {
      const tkn = await getAccessTokenSilently();
      const result = await loadPricing(tkn);
      const res: IPriceItem[] = result.data.map((el: any) => ({
        id: el.id,
        interval: el.recurring.interval,
        interval_count: el.recurring.interval_count,
        desc: el.nickname,
        unit_amount: el.unit_amount,
        currency: el.currency,
        lookup_key: el.lookup_key,
      }));
      setResult(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const tkn = await getAccessTokenSilently();
      const session = await stripeCheckout(
        selectedPrice?.id as string,
        users,
        tkn
      );
      window.location.href = session.url;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (key: string) => {
    if (key === "developer") {
      return <Code />;
    }

    return <ServerCluster />;
  };

  const getTotal = (xitem: number, tot: number) => (xitem / 100) * tot;
  return (
    <ErrorBoundary>
      <Box fill background="neutral-3">
        <Box style={{ alignItems: "center" }} alignSelf="center">
          <Heading size="large" level={2}>
            Select the pricing type
          </Heading>
          {loading && <CenteredLoader themeColor="white" size={100} />}
          {error && (
            <Box pad="medium" background="brand">
              <Notification
                status="critical"
                title="Error loading pricing"
                message="There was an error while loading pricing items"
              />
            </Box>
          )}
          {result.length > 0 && (
            <Box pad="medium" height="100%" background="brand" round>
              <Grid gap="medium" columns={{ count: "fit", size: "small" }}>
                {result.map((value) => (
                  <Card
                    border={{
                      color:
                        value.id === selectedPrice?.id ? "accent-1" : undefined,
                      size: value.id === selectedPrice?.id ? "2px" : undefined,
                    }}
                    background="neutral-3"
                    key={value.id}
                    hoverIndicator
                    onClick={() => setSelectedPrice(value)}
                  >
                    <CardBody pad="small">
                      <Identifier
                        title={value.lookup_key}
                        subTitle={value.desc}
                        size="small"
                      >
                        {getIcon(value.lookup_key)}
                      </Identifier>
                    </CardBody>
                    <CardFooter
                      pad={{ horizontal: "medium", vertical: "small" }}
                      background="brand"
                    >
                      <Text size="xsmall">{`Price per single user is ${
                        value.unit_amount / 100
                      } ${value.currency}`}</Text>
                    </CardFooter>
                  </Card>
                ))}
              </Grid>
              {selectedPrice && (
                <Box>
                  <Box direction="row" align="center" gap="small" pad="medium">
                    <User color="accent-1" />
                    <Box align="center" width="small">
                      <RangeInput
                        min={1}
                        max={1000}
                        step={1}
                        value={users}
                        onChange={(e) => {
                          setUsers(Number(e.currentTarget.value));
                        }}
                      />
                    </Box>{" "}
                  </Box>
                  <Box direction="row" gap="small">
                    Total price for <Text color="accent-1">{users}</Text> users
                    is{" "}
                    <Text color="accent-1">
                      {getTotal(selectedPrice.unit_amount, users)}{" "}
                      {selectedPrice.currency}
                    </Text>
                    <Button
                      label="checkout"
                      onClick={checkout}
                      icon={<Cart />}
                    ></Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

PricingPage.displayName = "PricingPage";

export default protectRoute(PricingPage, "AuthorizedPricingPage");
