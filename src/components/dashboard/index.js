import React from 'react';
import Dashboard from './dashboard';
import requireAuthentication from '../Authentication/requireAuthentication';

function DashboardPage(props, context) {
  return (
    <Dashboard />
  );
}

DashboardPage.propTypes = {};
export default requireAuthentication(DashboardPage);
