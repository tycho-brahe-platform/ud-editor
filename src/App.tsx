import '@/styles/base.scss';
import AppToast from './components/App/AppToast';
import { AuthProvider } from './configs/AuthContext';
import configLocalization from './configs/Localization';
import store from './configs/store/store';
import PublicRoutes from './routes/PublicRoutes';
import Header from './components/Header';

function App() {
  configLocalization();

  return (
    <AuthProvider store={store}>
      <Header />
      <PublicRoutes />
      <AppToast />
    </AuthProvider>
  );
}

export default App;
