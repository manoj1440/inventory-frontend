import React, { useState } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ExcelExport from './ExcelExport';

const CustomTable = ({ data, columns, downloadButtonText, downloadFileName, pagination, isFilter = false }) => {
    const [columnFilters, setColumnFilters] = useState({});
    const [currentPagination, setCurrentPagination] = useState(pagination || {});

    const onChangePagination = (pagination, filters) => {
        setCurrentPagination(pagination);
        setColumnFilters({ ...filters });
    };

    const applyFilters = (data, filters) => {
        const filtered = data.filter((record) => {
            return Object.keys(filters).every((key) => {
                const filterValue = filters[key];
                if (filterValue === null) return true; // Skip filtering for this column

                const recordValue = record[key];

                if (Array.isArray(filterValue)) {
                    if (filterValue.length === 0) {
                        return true; // No filter values, so include the record
                    }
                    return filterValue.some((filter) =>
                        recordValue.toLowerCase().includes(filter.toLowerCase())
                    );
                }

                if (typeof filterValue === 'string' && typeof recordValue === 'string') {
                    return recordValue.toLowerCase().includes(filterValue.toLowerCase());
                }

                return recordValue === filterValue;
            });
        });

        return filtered;
    };

    const filteredData = applyFilters(data, columnFilters);

    const generateColumnFilter = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => confirm()}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => {
                        clearFilters(); // Clear Ant Design filter
                        setSelectedKeys([]); // Clear the filter input value
                        setColumnFilters((prevFilters) => ({
                            ...prevFilters,
                            [dataIndex]: null, // Reset the filter in columnFilters
                        }));
                    }}

                    size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select());
            }
        },
    });

    const enhancedColumns = columns.map((column) =>
        column.key === 'actions'
            ? column
            : {
                ...column,
                ...generateColumnFilter(column.dataIndex),
            }
    );


    return (
        <>
            <ExcelExport
                data={filteredData}
                buttonText={downloadButtonText}
                fileName={downloadFileName}
            />
            <Table
                dataSource={isFilter ? [...filteredData] : data}
                columns={isFilter ? enhancedColumns : columns}
                pagination={currentPagination}
                onChange={(pagination, filters) => {
                    onChangePagination(pagination, filters)
                }}
            />
        </>
    );
};

export default CustomTable;
