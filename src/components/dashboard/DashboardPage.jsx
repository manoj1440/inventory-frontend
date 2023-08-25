import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table } from 'antd';
import './DashboardPage.css'; 
import api from '../../utils/api';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [userOverviewDataSource, setUserOverviewDataSource] = useState([]);

  const fetchDashboard = async () => {
    try {
      const response = await api.request('get', '/api/dashboard');
      setDashboardData(response.data);
      const formattedUserOverview = response.data.userOverview.map(user => ({
        key: user._id,
        name: user.name,
        role: user.role,
        batchesCreated: user.numBatchesCreated,
      }));
      setUserOverviewDataSource(formattedUserOverview);
    } catch (error) {
      console.error('Error fetching dashboardData:', error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const userOverviewColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Batches Assigned',
      dataIndex: 'batchesCreated',
      key: 'batchesCreated',
    },
  ];

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
                title="Total Panels In Batch"
                value={dashboardData.totalPanelsInBatch}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-purple">
              <Statistic
                title="Total Received Batches"
                value={dashboardData.totalReceivedBatches}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
        </Row>
      )}
      {dashboardData && dashboardData.userOverview && dashboardData.userOverview.length > 0 && (
        <div className="user-overview-table">
          <Table
            dataSource={userOverviewDataSource}
            columns={userOverviewColumns}
            pagination={{
              pageSize: 6,
              hideOnSinglePage: true,
            }} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
