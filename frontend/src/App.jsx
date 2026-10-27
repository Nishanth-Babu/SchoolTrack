import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import RoleSwitcherModal from './components/common/RoleSwitcherModal';
import { getCurrentUser } from './store/slices/authSlice';
import { fetchNotifications } from './store/slices/notificationSlice';

function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser()).then(() => {
        dispatch(fetchNotifications(false));
      });
    }
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <RoleSwitcherModal />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer />
      </BrowserRouter>
    </Provider>
  );
}
