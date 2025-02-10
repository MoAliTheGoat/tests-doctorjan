import { CodeComponentMeta } from "@plasmicapp/host";

import Timeit from "@/src/components/elements/timeit/timeit";
import { useEffect } from "react";

export const TimePicker = ({
  onChange = () => {},
  value = "00:00",
  hourExclude,
  minuteExclude,
  notShowExclude,
  showEdgeNumbers,
  size,
}: any) => {
  useEffect(() => {
    changeTheme("#2563e9");
  }, []);

  const changeTheme = (color: string) => {
    document.documentElement.style.setProperty("--timeit-primary-color", color);
  };

  return (
    <Timeit
      onChange={(time) => {
        if (value !== time) onChange(time);
      }}
      defaultValue={value}
      hourExclude={hourExclude}
      minuteExclude={minuteExclude}
      notShowExclude={notShowExclude}
      showEdgeNumbers={showEdgeNumbers}
      size={size}
    />
  );
};

export const timePickerMeta: CodeComponentMeta<any> = {
  name: "TimePicker",
  displayName: "Fragment/TimePicker",
  importPath: "./../../../src/fragment/components/TimePicker",
  props: {
    value: { type: "string", defaultValue: "00:00" },
    hourExclude: {
      type: "array",
      helpText: "[18, 20, 22]",
    },
    minuteExclude: {
      type: "array",
      helpText: "[15, 30, 25]",
    },
    notShowExclude: {
      type: "boolean",
    },
    onChange: {
      type: "eventHandler",
      argTypes: [
        {
          name: "time",
          type: "string",
        },
      ],
    },
    showEdgeNumbers: {
      type: "boolean",
      defaultValue: true,
    },
    size: {
      type: "choice",
      options: ["sm", "md", "lg"],
      helpText: "sm for small, md for medium and lg for large",
    },
  },
  states: {
    value: {
      type: "writable",
      variableType: "text",
      valueProp: "value",
      onChangeProp: "onChange",
    },
  },
};
