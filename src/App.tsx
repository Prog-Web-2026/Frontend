import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/common/ProtectedRoute';
import DeliveryProtectedRoute from './components/common/DeliveryProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import DeliveryLayout from './components/layout/DeliveryLayout';
import LoadingScreen from './components/common/LoadingScreen';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const StorePage = lazy(() => import('./pages/store/StorePage'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const CatalogPage = lazy(() => import('./pages/admin/catalog/CatalogPage'));
const ProductForm = lazy(() => import('./pages/admin/products/ProductForm'));
const OrderList = lazy(() => import('./pages/admin/orders/OrderList'));
const OrderDetail = lazy(() => import('./pages/admin/orders/OrderDetail'));
const UserList = lazy(() => import('./pages/admin/users/UserList'));
const ReviewList = lazy(() => import('./pages/admin/reviews/ReviewList'));
const PaymentList = lazy(() => import('./pages/admin/payments/PaymentList'));
const AvailableDeliveries = lazy(() => import('./pages/delivery/AvailableDeliveries'));
const MyDeliveries = lazy(() => import('./pages/delivery/MyDeliveries'));
const DeliveryHistory = lazy(() => import('./pages/delivery/DeliveryHistory'));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/catalog" element={<CatalogPage />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/:id/edit" element={<ProductForm />} />
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/orders/:id" element={<OrderDetail />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/reviews" element={<ReviewList />} />
            <Route path="/admin/payments" element={<PaymentList />} />
          </Route>
        </Route>
        <Route element={<DeliveryProtectedRoute />}>
          <Route element={<DeliveryLayout />}>
            <Route path="/delivery" element={<AvailableDeliveries />} />
            <Route path="/delivery/my-deliveries" element={<MyDeliveries />} />
            <Route path="/delivery/history" element={<DeliveryHistory />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
