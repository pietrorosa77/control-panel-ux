import { Grommet, grommet } from "grommet";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth0ProviderWithHistory from "./auth/Auth0ProviderNav";
import ErrorPage from "./pages/ErrorPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { HomePage, PricingPage, ProfilePage, SubscriptionPage } from "./pages";
import { ConsoleHeader } from "./components/ConsoleHeader";
import { deepMerge } from "grommet/utils";

const font = {
  family: "'Sora',sans-serif",
  size: "14px",
  face: `/* latin-ext */
  @font-face {
    font-family: 'Sora';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/sora/v3/xMQOuFFYT72X5wkB_18qmnndmSdSnk-DKQJRBg.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Sora';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/sora/v3/xMQOuFFYT72X5wkB_18qmnndmSdSnk-NKQI.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }`,
};

const SiteTheme = deepMerge(grommet, {
  global: {
    colors: {
      "neutral-3": "#4a4d70",
      brand: "#2b2e4b",
    },
    font,
  },
});
const App = () => {
  return (
    <ErrorBoundary>
      <Grommet full theme={SiteTheme}>
        <Router>
          <Auth0ProviderWithHistory>
            <ConsoleHeader />
            <Routes>
              <Route path="/Profile" element={<ProfilePage />} />
              <Route path="/Subscription" element={<SubscriptionPage />} />
              <Route path="/Pricing" element={<PricingPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/error/:code" element={<ErrorPage />} />
              <Route path="*" element={<ErrorPage code="404" />} />
            </Routes>
          </Auth0ProviderWithHistory>
        </Router>
      </Grommet>
    </ErrorBoundary>
  );
};

export default App;
