import '@/styles/base.scss';
import configLocalization from './configs/Localization';
import PublicRoutes from './routes/PublicRoutes';
import store from './configs/store/store';
import { AuthProvider } from './configs/AuthContext';

export default function App() {
  configLocalization();

  return (
    <AuthProvider store={store}>
      <main>
        <PublicRoutes />
      </main>
    </AuthProvider>
  );
}
