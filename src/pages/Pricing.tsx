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
import { getSubscription, loadPricing, stripeCheckout } from "../api";
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
  const [sub, setSub] = useState<any>();

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
      try {
        const subsc: any = await getSubscription(tkn);
        setSub(subsc);
        const subPricing: IPriceItem = {
          id: subsc.plan.id,
          interval: subsc.plan.interval,
          interval_count: subsc.plan.interval_count,
          desc: subsc.plan.nickname,
          unit_amount: subsc.plan.amount,
          currency: subsc.plan.currency,
          lookup_key: subsc.items.data[0].price.lookup_key,
        };
        setSelectedPrice(subPricing);
        setUsers(subsc.quantity);
      } catch (error) {
        setSub(undefined);
      }

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
        <Box
          style={{ alignItems: "center", minHeight: "unset" }}
          alignSelf="center"
        >
          <Heading size="medium" level={2}>
            Pricing Plan
          </Heading>
          {loading && <CenteredLoader themeColor="white" size={100} />}
          {error && (
            <Box pad="medium" background="brand" style={{ minHeight: "unset" }}>
              <Box gap="small">
                <Notification
                  status="critical"
                  title="Error loading pricing"
                  message="There was an error while loading pricing items"
                />
              </Box>
            </Box>
          )}
          {result.length > 0 && (
            <Box
              pad="medium"
              width="100%"
              background="brand"
              round
              style={{ minHeight: "unset" }}
            >
              <Grid gap="small" columns={{ count: "fill", size: "small" }}>
                {result
                  .filter((pr) => (sub ? pr.id === sub.plan.id : pr))
                  .map((value) => (
                    <Card
                      border={{
                        color:
                          value.id === selectedPrice?.id
                            ? "accent-1"
                            : undefined,
                        size:
                          value.id === selectedPrice?.id ? "2px" : undefined,
                      }}
                      background="neutral-3"
                      key={value.id}
                      hoverIndicator
                      onClick={sub ? () => null : () => setSelectedPrice(value)}
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
                <Box style={{ minHeight: "unset" }}>
                  <Box
                    direction="row"
                    align="center"
                    gap="small"
                    pad="medium"
                    style={{ minHeight: "unset" }}
                  >
                    <User color="accent-1" />
                    <Box fill>
                      <RangeInput
                        min={1}
                        max={1000}
                        step={1}
                        value={users}
                        onChange={
                          sub
                            ? () => setUsers(users)
                            : (e) => {
                                setUsers(Number(e.currentTarget.value));
                              }
                        }
                      />
                    </Box>
                  </Box>
                  <Box gap="small" style={{ minHeight: "unset" }}>
                    <Box direction="row" gap="small">
                      Total price for <Text color="accent-1">{users}</Text>
                      users is
                      <Text color="accent-1">
                        {getTotal(selectedPrice.unit_amount, users)}{" "}
                        {selectedPrice.currency}
                      </Text>
                    </Box>
                    {!sub && (
                      <Button
                        label="checkout"
                        onClick={checkout}
                        icon={<Cart />}
                      ></Button>
                    )}
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
