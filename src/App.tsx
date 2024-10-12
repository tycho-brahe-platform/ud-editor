import "@/styles/base.scss";
import AppToast from "./components/App/AppToast";
import { AuthProvider } from "./configs/AuthContext";
import configLocalization from "./configs/Localization";
import store from "./configs/store/store";
import Template from "./pages/Template";

function App() {
  configLocalization();

  return (
    <AuthProvider store={store}>
      <Template />
      <AppToast />
    </AuthProvider>
  );
}

export default App;
