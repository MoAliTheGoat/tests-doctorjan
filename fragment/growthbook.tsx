import { GrowthBook as GB } from "@growthbook/growthbook-react";
import {
  DataProvider,
  GlobalActionsProvider,
  GlobalContextMeta,
} from "@plasmicapp/host";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";

type GrowthBookProps = React.PropsWithChildren<{
  previewAttributes?: Record<string, string>;
  apiHost: string;
  clientKey: string;
}>;

// export const GrowthBook = ({children}:React.PropsWithChildren) => <>{children}</>
export const GrowthBook = ({
  children,
  previewAttributes,
  apiHost = "https://ir-gb-api.azno.space/",
  clientKey = "sdk-6DR9nEBZ8KMYnQG",
}: GrowthBookProps) => {
  const [growthbook, setGrowthbook] = useState<any>();
  const [isReady, setIsReady] = useState(false);
  const [attr, setAttr] = useState({});

  useEffect(() => {
    if (apiHost && clientKey) {
      setGrowthbook(
        new GB({
          apiHost,
          clientKey,
          enabled: true,
          subscribeToChanges: true,
        })
      );
    }
  }, [apiHost, clientKey]);

  useEffect(() => {
    growthbook?.refreshFeatures?.();
    growthbook?.loadFeatures?.({ autoRefresh: true });
  }, [previewAttributes, apiHost, clientKey, isReady, attr]);

  useEffect(() => {
    setIsReady(growthbook?.ready);

    growthbook?.subscribe?.((sb: any) => {
      if (growthbook?.ready) {
        setIsReady(growthbook?.ready);
      }
    });
  }, [growthbook?.ready]);

  useEffect(() => {
    if (isReady) {
      growthbook.setAttributes({
        ...previewAttributes,
      });
    }
  }, [previewAttributes, isReady]);

  function setUserInfo(userId: string) {
    growthbook.setAttributes({
      id: userId,
    });
  }

  const actions = useMemo(
    () => ({
      setAttributes: (attributes: Record<string, any>) => {
        setTimeout(() => {
          growthbook.setAttributes({
            ...attributes,
            ...previewAttributes,
          });

          setAttr(attributes);
        }, 500);
      },
      setAttributeOverrides: (attributes: Record<string, any>) => {
        setTimeout(() => {
          growthbook.setAttributes({
            ...growthbook.getAttributes(),
            ...attributes,
            ...previewAttributes,
          });

          setAttr(attributes);
        }, 500);
      },
    }),
    [isReady, growthbook?.isReady]
  );

  async function setInfoAttributes() {
    const cookieUserId = Cookies.get("userId");

    if (cookieUserId) {
      growthbook.setAttributes({
        id: cookieUserId,
      });
    } else {
      try {
        growthbook.setAttributes({
          id: crypto.randomUUID(),
        });
        // const res = await fetch("https://aznoapi.darkube.app/Home/GetUserId");
        // const data = await res.json();
        // if (res.ok) {
        //   growthbook.setAttributes({
        //     id: data.uniqueId,
        //   });
        // }
      } catch (err) {
        console.error("Failed to fetch user id.", err);
      }
    }
  }

  const features = useMemo(() => {
    if (isReady) {
      setInfoAttributes();

      const getFeaturesFromGrowthbook = Object.keys(
        growthbook.getFeatures()
      ).map((item) => ({
        name: item,
        type:
          typeof growthbook.getFeatures()[item].defaultValue === "boolean"
            ? "boolean"
            : "value",
      }));
      return getFeaturesFromGrowthbook.reduce((previous, current) => {
        return {
          ...previous,
          [current.name]:
            current.type === "value"
              ? growthbook.getFeatureValue(current.name, undefined)
              : growthbook.isOn(current.name),
        };
      }, {});
    }
  }, [
    previewAttributes,
    apiHost,
    clientKey,
    isReady,
    attr,
    growthbook?.ready,
    growthbook?.getAttributes?.(),
  ]);

  return (
    <GlobalActionsProvider contextName="GrowthBook" actions={actions}>
      <DataProvider
        name="GrowthBook"
        data={{
          features,
          isReady,
          attributes: growthbook?.getAttributes() ?? {},
        }}
      >
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};

export const growthBookMeta: GlobalContextMeta<GrowthBookProps> = {
  name: "GrowthBook",
  displayName: "Fragment/GrowthBook",
  props: {
    apiHost: {
      type: "string",
      displayName: "API Host",
      defaultValueHint: "https://cdn.growthbook.io",
    },
    clientKey: {
      type: "string",
      displayName: "Client Key",
      defaultValueHint: "sdk-XXX",
    },
    previewAttributes: {
      type: "object",
      editOnly: true,
      displayName: "Preview Attributes",
      description: "Simulate how your rules will apply to users.",
    },
  },
  globalActions: {
    setAttributes: {
      displayName: "Set Attributes",
      parameters: [
        {
          name: "attributes",
          type: "object",
        },
      ],
    },
    setAttributeOverrides: {
      displayName: "Set Attribute Overrides",
      parameters: [
        {
          name: "attributes",
          type: "object",
        },
      ],
    },
  },
  providesData: true,
  importPath: "./../../../src/fragment/growthbook",
};
