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


import React from 'react';
import {Tooltip} from 'antd';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons';
import {useIntl} from "umi";

const LineageOps = ({
                      isExpand,
                      isFold,
                      onAction,
                      tableId,
                    }) => [
  isExpand ?
    {
      tooltip: useIntl().formatMessage({id: 'pages.datastudio.label.lineage.expand.lineage'}),
      action: 'shrink',
      component: <FullscreenExitOutlined/>
    }
    :
    {
      tooltip: useIntl().formatMessage({id: 'pages.datastudio.label.lineage.collapse.lineage'}),
      action: 'expand',
      component: <FullscreenOutlined/>
    },
  isFold ?
    {
      tooltip: useIntl().formatMessage({id: 'pages.datastudio.label.lineage.expand.field'}),
      action: 'fold',
      component: <VerticalAlignBottomOutlined/>
    }
    :
    {
      tooltip: useIntl().formatMessage({id: 'pages.datastudio.label.lineage.collapse.field'}),
      action: 'unfold',
      component: <VerticalAlignTopOutlined/>
    }
].map(op => {
  return {
    component: (
      <Tooltip
        title={op.tooltip}
      >
        <span onClick={() => onAction(op.action, tableId)}>
          {
            op.component
          }
        </span>
      </Tooltip>
    )
  }
});

export default LineageOps;
