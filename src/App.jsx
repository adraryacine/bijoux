import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth.jsx'
import StoreLayout from './components/StoreLayout.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import NotFound from './pages/NotFound.jsx'

import AdminLayout from './pages/admin/AdminLayout.jsx'
import Login from './pages/admin/Login.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import ProductForm from './pages/admin/ProductForm.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Boutique publique */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/boutique" element={<Shop />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/commande" element={<Checkout />} />
          <Route path="/merci" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Administration */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="produits/nouveau" element={<ProductForm />} />
          <Route path="produits/:id" element={<ProductForm />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
