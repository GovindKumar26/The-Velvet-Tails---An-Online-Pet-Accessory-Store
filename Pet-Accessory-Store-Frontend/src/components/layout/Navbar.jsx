import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/authSlice.js';
import { selectCartItemCount } from '@/features/cartSlice.js';
import { fetchRefundCount } from '@/features/refundsSlice.js';
import { fetchOrderCount } from '@/features/adminOrdersSlice.js';
import { fetchReturnsCount } from '@/features/returnsSlice.js';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItemCount = useSelector(selectCartItemCount);
  const { pendingCount } = useSelector((state) => state.refunds);
  const { pendingOrderCount } = useSelector((state) => state.adminOrders);
  const { count: pendingReturnsCount } = useSelector((state) => state.returns);

  // Poll for refund count every 30 seconds if admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      dispatch(fetchRefundCount());
      const interval = setInterval(() => {
        dispatch(fetchRefundCount());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, dispatch]);

  // Poll for order count every 30 seconds if admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      dispatch(fetchOrderCount('confirmed'));
      const interval = setInterval(() => {
        dispatch(fetchOrderCount('confirmed'));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, dispatch]);

  // Poll for returns count every 30 seconds if admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      dispatch(fetchReturnsCount());
      const interval = setInterval(() => {
        dispatch(fetchReturnsCount());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-50" style={{ boxShadow: '0 10px 25px -5px rgba(92, 57, 117, 0.15), 0 8px 10px -6px rgba(92, 57, 117, 0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img
              src="/logo/Color logo - no background rect.svg"
              alt="The Velvet Tails"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin-only links */}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link
                  to="/admin/orders"
                  className="text-gray-700 hover:text-velvet-purple px-3 py-2 text-sm font-medium relative inline-flex items-center"
                >
                  Orders
                  {pendingOrderCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-velvet-purple rounded-full">
                      {pendingOrderCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/admin/refunds"
                  className="text-gray-700 hover:text-velvet-purple px-3 py-2 text-sm font-medium relative inline-flex items-center"
                >
                  Refunds
                  {pendingCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/admin/returns"
                  className="text-gray-700 hover:text-velvet-purple px-3 py-2 text-sm font-medium relative inline-flex items-center"
                >
                  Returns
                  {pendingReturnsCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-amber-500 rounded-full">
                      {pendingReturnsCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="text-gray-700 hover:text-velvet-purple px-3 py-2 text-sm font-medium inline-flex items-center">
                    Admin
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/admin/products"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/discounts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Discounts
                      </Link>
                      <Link
                        to="/admin/tax"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tax Settings
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* User-only links */}
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-velvet-purple px-3 py-2 text-sm font-medium relative inline-flex items-center"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-velvet-purple rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-velvet-purple px-3 py-2 text-sm font-medium"
                >
                  My Orders
                </Link>
              </>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  {user?.name}
                  {user?.role === 'admin' && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-velvet-purple/10 text-velvet-purple">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-velvet-purple rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-velvet-purple"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-velvet-purple rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && user?.role !== 'admin' && (
              <Link to="/cart" className="relative">
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-velvet-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-velvet-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-velvet-purple"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <>
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {/* Notification badge on hamburger for admin */}
                  {user?.role === 'admin' && (pendingOrderCount > 0 || pendingCount > 0 || pendingReturnsCount > 0) && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingOrderCount + pendingCount + pendingReturnsCount}
                    </span>
                  )}
                </>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Admin mobile links */}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link
                  to="/admin/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-velvet-purple hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                >
                  <span>Orders</span>
                  {pendingOrderCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-velvet-purple rounded-full">
                      {pendingOrderCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/admin/refunds"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-velvet-purple hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                >
                  <span>Refunds</span>
                  {pendingCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/admin/returns"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-velvet-purple hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                >
                  <span>Returns</span>
                  {pendingReturnsCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-amber-500 rounded-full">
                      {pendingReturnsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/admin/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-velvet-purple hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Products
                </Link>
                <Link
                  to="/admin/discounts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-velvet-purple hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Discounts
                </Link>
                <Link
                  to="/admin/tax"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-velvet-purple hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Tax Settings
                </Link>
              </>
            )}

            {/* User mobile links */}
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-velvet-purple hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-velvet-purple hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                >
                  My Orders
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <div className="px-3 py-2 text-sm text-gray-700">
                  {user?.name}
                  {user?.role === 'admin' && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-velvet-purple/10 text-velvet-purple">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-velvet-purple hover:bg-gray-50 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-velvet-purple hover:bg-gray-50 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-white bg-velvet-purple hover:bg-velvet-purple-dark rounded-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
