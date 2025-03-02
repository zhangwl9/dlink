/*
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */


import React, {useRef, useState} from "react";
import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Drawer, Dropdown, Menu, Modal} from 'antd';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import ProDescriptions from '@ant-design/pro-descriptions';
import {handleAddOrUpdate, handleRemove, queryData} from "@/components/Common/crud";
import {TenantTableListItem} from "@/pages/AuthenticationCenter/data.d";
import TenantForm from "@/pages/AuthenticationCenter/TenantManager/components/TenantForm";
import GrantTenantTransfer from "@/pages/AuthenticationCenter/TenantManager/components/GrantTenantTransfer";
import {useIntl} from "umi";

const url = '/api/tenant';
const TenantFormList: React.FC<{}> = (props: any) => {
  const [row, setRow] = useState<TenantTableListItem>();
  const [handleGrantTenant, setHandleGrantTenant] = useState<boolean>(false);
  const [tenantRelFormValues, setTenantRelFormValues] = useState({});
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TenantTableListItem[]>([]);
  const [formValues, setFormValues] = useState({});


  const intl = useIntl();
  const l = (id: string, defaultMessage?: string, value?: {}) => intl.formatMessage({id, defaultMessage}, value);


  const editAndDelete = (key: string | number, currentItem: TenantTableListItem) => {
    if (key === 'edit') {
      handleUpdateModalVisible(true);
      setFormValues(currentItem);
    } else if (key === 'delete') {
      Modal.confirm({
        title: l('pages.tenant.delete'),
        content: l('pages.tenant.deleteConfirm'),
        okText: l('button.confirm'),
        cancelText: l('button.cancel'),
        onOk: async () => {
          await handleRemove(url, [currentItem]);
          actionRef.current?.reloadAndRest?.();
        }
      });
    }
  };

  const MoreBtn: React.FC<{
    item: TenantTableListItem;
  }> = ({item}) => (
    <Dropdown
      overlay={
        <Menu onClick={({key}) => editAndDelete(key, item)}>
          <Menu.Item key="edit">{l('button.edit')}</Menu.Item>
          <Menu.Item key="delete">{l('button.delete')}</Menu.Item>
        </Menu>
      }
    >
      <a>
        {l('button.more')} <DownOutlined/>
      </a>
    </Dropdown>
  );


  const handleGrantTenantForm = () => {
    return (
      <Modal title={l('pages.tenant.AssignUser')} visible={handleGrantTenant}
             destroyOnClose={true} width={"90%"}
             onCancel={() => {
               setHandleGrantTenant(false);
             }}
             footer={[
               <Button key="back" onClick={() => {
                 setHandleGrantTenant(false);
               }}>
                 {l('button.close')}
               </Button>,
               <Button type="primary" onClick={async () => {
                 // to save
                 const success = await handleAddOrUpdate(url + "/grantTenantToUser", {
                   tenantId: formValues.id,
                   users: tenantRelFormValues
                 });
                 if (success) {
                   setHandleGrantTenant(false);
                   setFormValues({});
                   if (actionRef.current) {
                     actionRef.current.reload();
                   }
                 }
               }}
               >
                 {l('button.confirm')}
               </Button>,
             ]}>
        <GrantTenantTransfer tenant={formValues} onChange={(value) => {
          setTenantRelFormValues(value);
        }}/>
      </Modal>
    )
  }

  const columns: ProColumns<TenantTableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: l('pages.tenant.TenantCode'),
      dataIndex: 'tenantCode',
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    // {
    //   title: '是否删除',
    //   dataIndex: 'isDelete',
    //   hideInForm: true,
    //   hideInSearch: true,
    //   hideInTable: false,
    //   filters: [
    //     {
    //       text: '未删除',
    //       value: 0,
    //     },
    //     {
    //       text: '已删除',
    //       value: 1,
    //     },
    //   ],
    //   filterMultiple: false,
    //   valueEnum: {
    //     true: {text: '已删除', status: 'Error'},
    //     false: {text: '未删除', status: 'Success'},
    //   },
    // },
    {
      title: l('global.table.note'),
      dataIndex: 'note',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: l('global.table.createTime'),
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: l('global.table.updateTime'),
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
    {
      title: l('global.table.operate'),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: TenantTableListItem) => [
        <a
          onClick={() => {
            handleUpdateModalVisible(true);
            setFormValues(record);
          }}
        >
          {l('button.config')}
        </a>,
        <a
          onClick={() => {
            setHandleGrantTenant(true);
            setFormValues(record);
          }}
        >
          {l('pages.tenant.AssignUser')}
        </a>,
        <MoreBtn key="more" item={record}/>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<TenantTableListItem>
        headerTitle={l('pages.tenant.TenantManager')}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined/> {l('button.create')}
          </Button>,
        ]}
        request={(params, sorter, filter) => queryData(url, {...params, sorter, filter})}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              {l('tips.selected', '',
                {
                  total: <a
                    style={{fontWeight: 600}}>{selectedRowsState.length}</a>
                })}  &nbsp;&nbsp;
            </div>
          }
        >
          <Button type="primary" danger
                  onClick={() => {
                    Modal.confirm({
                      title: l('pages.tenant.delete'),
                      content: l('pages.tenant.deleteConfirm'),
                      okText: l('button.confirm'),
                      cancelText: l('button.cancel'),
                      onOk: async () => {
                        await handleRemove(url, selectedRowsState);
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                      }
                    });
                  }}
          >
            {l('button.batchDelete')}
          </Button>
        </FooterToolbar>
      )}
      <TenantForm
        onSubmit={async (value) => {
          const success = await handleAddOrUpdate(url, value);
          if (success) {
            handleModalVisible(false);
            setFormValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
        }}
        modalVisible={modalVisible}
        values={{}}
      />
      {
        formValues && Object.keys(formValues).length ? (
          <TenantForm
            onSubmit={async (value) => {
              const success = await handleAddOrUpdate(url, value);
              if (success) {
                handleUpdateModalVisible(false);
                setFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setFormValues({});
            }}
            modalVisible={updateModalVisible}
            values={formValues}
          />
        ) : undefined
      }
      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.tenantCode && (
          <ProDescriptions<TenantTableListItem>
            column={2}
            title={row?.tenantCode}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.id,
            }}
            columns={columns}
          />
        )}
      </Drawer>
      {handleGrantTenantForm()}
    </PageContainer>
  );
};

export default TenantFormList;
