import Home from '@/pages/Home';
import UniversalDependencies from '@/pages/UniversalDependencies';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import NotFound from './session/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />}>
      <Route path="/" element={<Home />} />
      <Route path="/tycho" element={<Home />} />
      <Route path="/ud" element={<UniversalDependencies />} />
    </Route>
  ),
  { basename: import.meta.env.VITE_APP_PUBLIC_URL }
);

export default function PublicRoutes() {
  return <RouterProvider router={router} />;
}
