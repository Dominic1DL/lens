/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { KubeObject } from "../../../../../../common/k8s-api/kube-object";
import { parseKubeApi } from "../../../../../../common/k8s-api/kube-api-parse";
import getKubeApiFromPathInjectable from "../../../../../../common/k8s-api/kube-api/get-kube-api-from-path.injectable";
import type { AsyncResult } from "../../../../../../common/utils/async-result";
import { getErrorMessage } from "../../../../../../common/utils/get-error-message";

export type CallForResource = (
  selfLink: string
) => Promise<AsyncResult<KubeObject | undefined>>;

const callForResourceInjectable = getInjectable({
  id: "call-for-resource",

  instantiate: (di): CallForResource => {
    const getKubeApiFromPath = di.inject(getKubeApiFromPathInjectable);

    return async (apiPath: string) => {
      const api = getKubeApiFromPath(apiPath);
      const parsed = parseKubeApi(apiPath);

      if (!api || !parsed.name) {
        return { callWasSuccessful: false, error: "Invalid API path" };
      }

      let resource: KubeObject | null;

      try {
        resource = await api.get({
          name: parsed.name,
          namespace: parsed.namespace,
        });
      } catch (e) {
        return { callWasSuccessful: false, error: getErrorMessage(e) };
      }

      return { callWasSuccessful: true, response: resource || undefined };
    };
  },

  causesSideEffects: true,
});

export default callForResourceInjectable;
