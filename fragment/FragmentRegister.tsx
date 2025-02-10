import React, { useMemo } from "react";
import toast, { ToastPosition } from "react-hot-toast";
import {
  DataProvider,
  GlobalActionsProvider,
  GlobalContextMeta,
} from "@plasmicapp/host";
import axios from "axios";

type FragmentProps = React.PropsWithChildren<{
  previewApiConfig: Record<string, any>;
  apiConfig: Record<string, any>;
  rtl: boolean;
}>;

export const Fragment = ({
  children,
  previewApiConfig,
  apiConfig,
  rtl,
}: FragmentProps) => {
  const actions = useMemo(
    () => ({
      showToast: (
        type: "success" | "error",
        message: string,
        placement: ToastPosition = "top-right",
        duration?: number
      ) => {
        toast[type ?? "success"](message, {
          duration,
          position: placement as ToastPosition,
        });
      },
      eventLog: (eventName: string, eventData: Record<string, any>) =>
        eventLogger(eventName, eventData),
      apiRequest: async (
        method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
        url: string,
        params: Record<string, string | string[]> = {},
        body?: Record<string, any>,
        config?: Record<string, any>
      ) => {
        try {
          let result;
          if (method === "GET") {
            result = await axios.get(url, {
              params,
              ...apiConfig,
              ...previewApiConfig,
              ...config,
            });
          } else {
            result = await axios[
              method.toLowerCase() as "post" | "delete" | "put" | "patch"
            ](url, body, {
              params,
              ...apiConfig,
              ...previewApiConfig,
              ...config,
            });
          }
          return result;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return error.response;
          }
        }
      },
    }),
    []
  );

  return (
    <GlobalActionsProvider contextName="Fragment" actions={actions}>
      <DataProvider
        name="Fragment"
        data={{ apiConfig, previewApiConfig, rtl }}
        hidden
      >
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};

export const fragmentMeta: GlobalContextMeta<FragmentProps> = {
  name: "Fragment",
  displayName: "Fragment",
  importPath: "../fragment/fragment",
  props: {
    apiConfig: {
      displayName: "API Config",
      type: "object",
      description: `e.g. { withCredentials: true }`,
    },
    previewApiConfig: {
      displayName: "Preview API Config",
      type: "object",
      description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
      editOnly: true,
    },
    rtl: {
      displayName: "RTL",
      type: "boolean",
      description: `Direction`,
    },
  },
  providesData: true,
  globalActions: {
    showToast: {
      displayName: "Show Toast",
      parameters: [
        {
          name: "type",
          type: {
            type: "choice",
            options: ["success", "error"],
            defaultValueHint: "success",
          },
        },
        {
          name: "message",
          type: {
            type: "string",
            defaultValueHint: "A message for you!",
            required: true,
          },
        },
        {
          name: "placement",
          type: {
            type: "choice",
            options: [
              "top-left",
              "top-center",
              "top-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ],
            defaultValueHint: "top-right",
          },
        },
        {
          name: "duration",
          type: { type: "number", defaultValueHint: 3000 },
        },
      ],
    },
    eventLog: {
      displayName: "Event log",
      parameters: [
        { name: "eventName", type: "string" },
        { name: "eventData", type: "object" },
      ],
    },
    apiRequest: {
      displayName: "API Request",
      parameters: [
        {
          name: "method",
          type: {
            type: "choice",
            options: ["GET", "POST", "DELETE", "PUT", "PATCH"],
            defaultValueHint: "GET",
            defaultValue: "GET",
          },
        },
        {
          name: "url",
          displayName: "URL",
          type: {
            type: "string",
            defaultValueHint: "/api/v1/users",
            required: true,
          },
        },
        {
          displayName: "Query Params",
          name: "params",
          type: { type: "object", description: `e.g. { id: 20 }` },
        },
        {
          displayName: "Body",
          name: "body",
          type: { type: "object", description: `e.g. { id: 20 }` },
        },
        {
          name: "config",
          displayName: "Request Config",
          type: {
            type: "object",
            description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
          },
        },
      ],
    },
  },
};
function eventLogger(eventName: string, eventData: Record<string, any>): any {
  throw new Error("Function not implemented.");
}
