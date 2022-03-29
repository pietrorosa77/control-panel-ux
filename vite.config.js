import reactJsx from "vite-react-jsx";
import eslintPlugin from "vite-plugin-eslint";

export default {
  server: {
    port: 9000,
  },
  plugins: [reactJsx(), eslintPlugin({ cache: false })],
};
