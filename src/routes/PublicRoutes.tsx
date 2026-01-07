import Home from '@/pages/Home';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import ErrorPage from './session/ErrorPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route path="/" element={<Home />} />
    </Route>
  ),
  { basename: import.meta.env.VITE_APP_PUBLIC_URL }
);

export default function PublicRoutes() {
  return <RouterProvider router={router} />;
}
