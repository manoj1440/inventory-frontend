import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './DashboardPage.css'; // Import your custom styles
import api from '../../utils/api';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});

  const fetchDashboard = async () => {
    try {
      const response = await api.request('get', '/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboardData:', error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>
      {dashboardData && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-blue">
              <Statistic
                title="Total Batches"
                value={dashboardData.totalBatches}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-green">
              <Statistic
                title="Total Panels"
                value={dashboardData.totalPanels}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-orange">
              <Statistic
                title="Total Sent Batches"
                value={dashboardData.totalSentBatches}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-purple">
              <Statistic
                title="Total Unscheduled Batches"
                value={dashboardData.totalUnscheduledBatches}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
        </Row>
      )}
      {dashboardData &&dashboardData.userOverview && dashboardData.userOverview.length>0 && (
        <Row gutter={[16, 16]} className="user-overview-row">
          {dashboardData.userOverview.map(user => (
            <Col key={user._id} xs={24} sm={12} md={8} lg={6}>
              <Card className="user-overview-card">
                <UserOutlined className="user-icon" />
                <h3 className="user-role">{user.role}</h3>
                <p className="user-stat">
                  Batches Created: {user.numBatchesCreated}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DashboardPage;
