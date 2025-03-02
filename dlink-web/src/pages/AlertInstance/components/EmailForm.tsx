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


import React, {useState} from 'react';
import {Button, Divider, Form, Input, Modal, Radio, Switch} from 'antd';
import {AlertInstanceTableListItem} from "@/pages/AlertInstance/data";
import {buildJSONData, getJSONData} from "@/pages/AlertInstance/function";
import {ALERT_TYPE} from "@/pages/AlertInstance/conf";
import {useIntl} from "umi";

export type AlertInstanceFormProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: Partial<AlertInstanceTableListItem>) => void;
  onTest: (values: Partial<AlertInstanceTableListItem>) => void;
  modalVisible: boolean;
  values: Partial<AlertInstanceTableListItem>;
};

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const EmailForm: React.FC<AlertInstanceFormProps> = (props) => {


  const intl = useIntl();
  const l = (id: string, defaultMessage?: string, value?: {}) => intl.formatMessage({id, defaultMessage}, value);

  const [form] = Form.useForm();
  const [formVals, setFormVals] = useState<Partial<AlertInstanceTableListItem>>({
    id: props.values?.id,
    name: props.values?.name,
    type: ALERT_TYPE.EMAIL,
    params: props.values?.params,
    enabled: props.values?.enabled,
  });

  const {
    onSubmit: handleSubmit,
    onCancel: handleModalVisible,
    onTest: handleTest,
    modalVisible,
  } = props;

  const onValuesChange = (change: any, all: any) => {
    setFormVals({...formVals, ...change});
  };

  const sendTestForm = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals(buildJSONData(formVals, fieldsValue));
    handleTest(buildJSONData(formVals, fieldsValue));
  };

  const submitForm = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals(buildJSONData(formVals, fieldsValue));
    handleSubmit(buildJSONData(formVals, fieldsValue));
  };


  const renderContent = (vals) => {
    return (
      <>
        <Divider>{l('pages.registerCenter.alert.instance.email')}</Divider>
        <Form.Item
          name="name"
          label={l('pages.registerCenter.alert.instance.name')}
          rules={[{required: true, message: l('pages.registerCenter.alert.instance.namePleaseHolder')}]}
        >
          <Input placeholder={l('pages.registerCenter.alert.instance.namePleaseHolder')}/>
        </Form.Item>
        <Form.Item
          name="receivers"
          label={l('pages.registerCenter.alert.instance.receivers')}
          rules={[{required: true, message: l('pages.registerCenter.alert.instance.receiversPleaseHolder')}]}
        >
          <Input.TextArea placeholder={l('pages.registerCenter.alert.instance.receiversPleaseHolder')} allowClear
                          autoSize={{minRows: 1, maxRows: 5}}/>
        </Form.Item>
        <Form.Item
          name="receiverCcs"
          label={l('pages.registerCenter.alert.instance.receiverCcs')}
        >
          <Input.TextArea placeholder={l('pages.registerCenter.alert.instance.receiverCcsPleaseHolder')} allowClear
                          autoSize={{minRows: 1, maxRows: 5}}/>
        </Form.Item>
        <Form.Item
          name="serverHost"
          label={l('pages.registerCenter.alert.instance.serverHost')}
          rules={[{required: true, message: l('pages.registerCenter.alert.instance.serverHostPleaseHolder')}]}
        >
          <Input placeholder={l('pages.registerCenter.alert.instance.serverHostPleaseHolder')}/>
        </Form.Item>
        <Form.Item
          name="serverPort"
          label={l('pages.registerCenter.alert.instance.receivers')}
          rules={[{required: true, message: l('pages.registerCenter.alert.instance.serverPortPleaseHolder')}]}
        >
          <Input placeholder={l('pages.registerCenter.alert.instance.serverPortPleaseHolder')}/>
        </Form.Item>
        <Form.Item
          name="sender"
          label={l('pages.registerCenter.alert.instance.sender')}
          rules={[{required: true, message: l('pages.registerCenter.alert.instance.senderPleaseHolder')}]}
        >
          <Input placeholder={l('pages.registerCenter.alert.instance.senderPleaseHolder')}/>
        </Form.Item>
        <Form.Item
          name="enableSmtpAuth"
          label={l('pages.registerCenter.alert.instance.enableSmtpAuth')}
        >
          <Switch  checkedChildren={l('button.enable')} unCheckedChildren={l('button.disable')}
                  defaultChecked={vals.enableSmtpAuth}/>
        </Form.Item>
        {vals.enableSmtpAuth &&
          <>
            <Form.Item
              name="User"
              label={l('pages.registerCenter.alert.instance.emailUser')}
              rules={[{required: true, message: l('pages.registerCenter.alert.instance.emailUserPleaseHolder')}]}
            >
              <Input allowClear placeholder={l('pages.registerCenter.alert.instance.emailUserPleaseHolder')}/>
            </Form.Item>
            <Form.Item
              name="Password"
              label={l('pages.registerCenter.alert.instance.emailPassword')}
              rules={[{required: true, message: l('pages.registerCenter.alert.instance.emailPasswordPleaseHolder')}]}
            >
              <Input.Password allowClear placeholder= {l('pages.registerCenter.alert.instance.emailPasswordPleaseHolder')}/>
            </Form.Item>
          </>}
        <Form.Item
          name="starttlsEnable"
          label={l('pages.registerCenter.alert.instance.starttlsEnable')}
        >
          <Switch  checkedChildren={l('button.enable')} unCheckedChildren={l('button.disable')}
                  defaultChecked={vals.starttlsEnable}/>
        </Form.Item>
        <Form.Item
          name="sslEnable"
          label={l('pages.registerCenter.alert.instance.sslEnable')}
        >
          <Switch  checkedChildren={l('button.enable')} unCheckedChildren={l('button.disable')}
                  defaultChecked={vals.sslEnable}/>
        </Form.Item>
        {(vals.sslEnable) &&
          <Form.Item
            name="smtpSslTrust"
            label={l('pages.registerCenter.alert.instance.smtpSslTrust')}
            rules={[{required: true, message: l('pages.registerCenter.alert.instance.smtpSslTrustPleaseHolder')}]}
          >
            <Input placeholder={l('pages.registerCenter.alert.instance.smtpSslTrustPleaseHolder')}/>
          </Form.Item>
        }
        <Form.Item
          name="enabled"
          label={l('global.table.isEnable')}>
          <Switch  checkedChildren={l('button.enable')} unCheckedChildren={l('button.disable')}
                  defaultChecked={vals.enabled}/>
        </Form.Item>
        <Form.Item
          name="msgtype"
          label={l('pages.registerCenter.alert.instance.msgtype')}
          rules={[{required: true, message: l('pages.registerCenter.alert.instance.msgtypePleaseHolder')}]}
        >
          <Radio.Group>
            <Radio value='text'>{l('pages.registerCenter.alert.instance.text')}</Radio>
            <Radio value='table'>{l('pages.registerCenter.alert.instance.table')}</Radio>
            <Radio value='attachment'>{l('pages.registerCenter.alert.instance.attachment')}</Radio>
            <Radio value='table attachment'>{l('pages.registerCenter.alert.instance.tableAttachment')}</Radio>
          </Radio.Group>
        </Form.Item>
        {(vals.msgtype === "attachment" || vals.msgtype === "table attachment") &&
          <>
            <Form.Item
              name="xls.file.path"
              label={l('pages.registerCenter.alert.instance.xls.file.path')}
            >
              <Input.TextArea placeholder={l('pages.registerCenter.alert.instance.xls.file.pathPleaseHolder')} allowClear
                              autoSize={{minRows: 1, maxRows: 5}}/>
            </Form.Item>

          </>}

      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleModalVisible(false)}>{l('button.cancel')}</Button>
        <Button type="primary" onClick={() => sendTestForm()}>{l('button.test')}</Button>
        <Button type="primary" onClick={() => submitForm()}>{l('button.finish')}</Button>

      </>
    );
  };


  return (
    <Modal
      width={"40%"}
      bodyStyle={{padding: '32px 40px 48px' ,height: '600px', overflowY: 'auto'}}
      destroyOnClose
      title={formVals.id ? l('pages.registerCenter.alert.instance.modify') : l('pages.registerCenter.alert.instance.create')}
      visible={modalVisible}
      footer={renderFooter()}
      onCancel={() => handleModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={getJSONData(formVals as AlertInstanceTableListItem)}
        onValuesChange={onValuesChange}
      >
        {renderContent(getJSONData(formVals as AlertInstanceTableListItem))}
      </Form>
    </Modal>
  );
};

export default EmailForm;
