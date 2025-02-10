import { init, track } from "@amplitude/analytics-browser";
import { GlobalActionsProvider, GlobalContextMeta } from "@plasmicapp/host";
import React, { useEffect, useMemo } from "react";

type AmplitudeProps = React.PropsWithChildren<{
  apiKey: string;
}>;

const AMPLITUDE_API_KEY = "064b5bc305560114d8e12f64f691161d";

// export const Amplitude  = ({children}:React.PropsWithChildren) => <>{children}</>
export const Amplitude = ({ children, apiKey }: AmplitudeProps) => {
  useEffect(() => {
    init(AMPLITUDE_API_KEY, undefined, {
      defaultTracking: {
        sessions: true,
      },
      serverUrl: "https://ext.azno.space/amplitude/2/httpapi",
    });
  }, []);

  const trackAmplitudeEvent = (
    eventName: string,
    eventProperties?: Record<string, any>
  ) => {
    track(eventName, eventProperties);
  };

  const actions = useMemo(
    () => ({
      trackAmplitudeEvent: (
        eventName: string,
        eventProperties?: Record<string, any>
      ) => trackAmplitudeEvent(eventName, eventProperties),
    }),
    []
  );

  return (
    <GlobalActionsProvider contextName="Amplitude" actions={actions}>
      {children}
    </GlobalActionsProvider>
  );
};

export const amplitudeMeta: GlobalContextMeta<AmplitudeProps> = {
  name: "Amplitude",
  displayName: "Fragment/Amplitude",
  importPath: "./../../../src/fragment/Amplitude",
  props: {
    apiKey: "string",
  },
  globalActions: {
    trackAmplitudeEvent: {
      displayName: "Track Amplitude Event",
      parameters: [
        {
          name: "eventName",
          type: {
            type: "string",
            required: true,
          },
        },
        {
          name: "eventProperties",
          type: "object",
        },
      ],
    },
  },
};
