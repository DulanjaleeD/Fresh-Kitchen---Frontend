import { Navigate, Route, Routes } from 'react-router';
import { SessionProvider } from '../state/auth/SessionProvider';
import { BasketProvider } from '../state/basket/BasketProvider';
import { RequireSession } from '../ui/guards/RequireSession';
import { Header } from '../ui/layout/Header';
import { AccessPage } from '../pages/AccessPage';
import { MenuDashboardPage } from '../pages/MenuDashboardPage';
import { BasketPage } from '../pages/BasketPage';
import { PurchasePage } from '../pages/PurchasePage';
import { ControlCenterPage } from '../pages/ControlCenterPage';

export function App() {
  return (
    <SessionProvider>
      <BasketProvider>
        <Routes>
          <Route path="/login" element={<AccessPage mode="login" />} />
          <Route path="/register" element={<AccessPage mode="register" />} />

          <Route element={<Header />}>
            <Route
              path="/"
              element={
                <RequireSession>
                  <MenuDashboardPage />
                </RequireSession>
              }
            />
            <Route
              path="/cart"
              element={
                <RequireSession>
                  <BasketPage />
                </RequireSession>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireSession>
                  <PurchasePage />
                </RequireSession>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireSession role="ADMIN">
                  <ControlCenterPage />
                </RequireSession>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BasketProvider>
    </SessionProvider>
  );
}
