/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import "./cluster-metric-switchers.scss";

import React from "react";
import { observer } from "mobx-react";
import { nodesStore } from "../+nodes/nodes.store";
import { cssNames } from "../../utils";
import { Radio, RadioGroup } from "../radio";
import { kubeClusterStore, MetricNodeRole, MetricType } from "./cluster-overview.store";

export const ClusterMetricSwitchers = observer(() => {
  const { metricType, metricNodeRole, getMetricsValues, metrics } = kubeClusterStore;
  const { masterNodes, workerNodes } = nodesStore;
  const metricsValues = getMetricsValues(metrics);
  const disableRoles = !masterNodes.length || !workerNodes.length;
  const disableMetrics = !metricsValues.length;

  return (
    <div className="ClusterMetricSwitchers flex gaps">
      <div className="box grow">
        <RadioGroup
          asButtons
          className={cssNames("RadioGroup flex gaps", { disabled: disableRoles })}
          value={metricNodeRole}
          onChange={(metric: MetricNodeRole) => kubeClusterStore.metricNodeRole = metric}
        >
          <Radio label="Master" value={MetricNodeRole.MASTER}/>
          <Radio label="Worker" value={MetricNodeRole.WORKER}/>
        </RadioGroup>
      </div>
      <div className="box grow metric-switch">
        <RadioGroup
          asButtons
          className={cssNames("RadioGroup flex gaps", { disabled: disableMetrics })}
          value={metricType}
          onChange={(value: MetricType) => kubeClusterStore.metricType = value}
        >
          <Radio label="CPU" value={MetricType.CPU}/>
          <Radio label="Memory" value={MetricType.MEMORY}/>
        </RadioGroup>
      </div>
    </div>
  );
});
