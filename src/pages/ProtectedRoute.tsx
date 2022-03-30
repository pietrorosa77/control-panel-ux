import { withAuthenticationRequired } from "@auth0/auth0-react";
import { CenteredLoader } from "../components/Loading";

export default function protectRoute(
  RouteComponent: any,
  displayName: string,
  claimCheck?: (claims: any) => boolean
) {
  const AuthRoute = withAuthenticationRequired(RouteComponent, {
    onRedirecting: () => <CenteredLoader size={100} themeColor="neutral-3" />,
    claimCheck: (claims) => {
      if (!claimCheck) {
        return true;
      }
      return claimCheck(claims);
    },
  });
  AuthRoute.displayName = displayName;
  return AuthRoute;
}
