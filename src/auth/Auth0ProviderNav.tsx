import { useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = (props: { children: any }) => {
  const domain = (import.meta as any).env.VITE_REACT_APP_AUTH0_DOMAIN;
  const clientId = (import.meta as any).env.VITE_REACT_APP_AUTH0_CLIENT_ID;
  const audience = (import.meta as any).env.VITE_REACT_APP_AUTH0_API_AUDIENCE;

  const navigate = useNavigate();

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      scope="crud:all"
      domain={domain as string}
      audience={audience}
      clientId={clientId as string}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {props.children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
