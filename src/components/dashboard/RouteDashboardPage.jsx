import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const RouteDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [customerOverviewDataSource, setCustomerOverviewDataSource] = useState([]);

  const fetchDashboard = async () => {
    try {
      const response = await api.request('get', '/api/dashboard');
      setDashboardData(response.data);

      const formattedCustomerOverview = response.data.customerOverview.map(customer => ({
        key: customer._id,
        name: customer.name,
        role: customer.role,
        numRoutesCreated: customer.numRoutesCreated,
        userRoutes: customer.userRoutes,
      }));
      setCustomerOverviewDataSource(formattedCustomerOverview);
    } catch (error) {
      console.error('Error fetching dashboardData:', error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const customerOverviewColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Route Assigned',
      dataIndex: 'numRoutesCreated',
      key: 'numRoutesCreated',
    },
    {
      title: 'Total Crates',
      dataIndex: 'userRoutes',
      key: 'userRoutes',
      render: (userRoutes) => userRoutes && userRoutes.length > 0 ? userRoutes[0].Crates && userRoutes[0].Crates.length : 'NA'
    }
  ];

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Statistics</h1>
      {dashboardData && dashboardData.routes && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-blue">
              <Statistic
                title="Total Routes"
                value={dashboardData.routes.totalRoutes}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-green">
              <Statistic
                title="Total Crates"
                value={dashboardData.routes.totalCrates}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-orange">
              <Statistic
                title="Total Crates In Route"
                value={dashboardData.routes.totalCratesInRoute}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-green2">
              <Statistic
                title="Total Received Routes"
                value={dashboardData.routes.totalReceivedRoutes}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-purple">
              <div style={{
                marginTop: '-2rem',
                color: 'rgba(0, 0, 0, 0.45)',
              }}>Received/Sent Crates</div>
              <Progress
                type="dashboard"
                percent={(dashboardData.routes.totalReceivedCrates / dashboardData.routes.totalCratesInRoute) * 100}
                format={() => (
                  <span>
                    {dashboardData.routes.totalReceivedCrates} / {dashboardData.routes.totalCratesInRoute}
                  </span>
                )}
              />
            </Card>
          </Col>
        </Row>
      )}
      {dashboardData && dashboardData.customerOverview && dashboardData.customerOverview.length > 0 && (
        <div className="customer-overview-table">
          <h2>Customers Info</h2>
          <CustomTable
            downloadButtonText="Export"
            downloadFileName="Customers"
            data={customerOverviewDataSource}
            isFilter={false}
            columns={customerOverviewColumns}
            pagination={{
              pageSize: 6,
              hideOnSinglePage: true,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RouteDashboardPage;
