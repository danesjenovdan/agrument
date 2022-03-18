import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../store/slices/user.js';
import Header from '../components/Header.jsx';
import RenderSpinner from '../components/RenderSpinner.jsx';
import DashContainer from '../components/Dashboard/Container.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser())
      .unwrap()
      .catch(() => {
        navigate('/login', { replace: true });
      });
  }, []);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="container-fluid">
        <Header title="Agrument" subTitle="Dashboard" small />
        <RenderSpinner isLoading={user.loading} data={user.data}>
          {() => <DashContainer />}
        </RenderSpinner>
      </div>
    </div>
  );
}
