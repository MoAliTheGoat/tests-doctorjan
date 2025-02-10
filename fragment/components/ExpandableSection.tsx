import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CodeComponentMeta } from "@plasmicapp/host";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  initialHeight: number;
  children: ReactNode;
  showMoreButton?: ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
  className?: string;
  isOpen?: boolean;
  onToggleOpen?: (isOpen: boolean) => void;
};

export const ExpandableSection = ({
  children,
  showMoreButton,
  initialHeight,
  onClose,
  onOpen,
  className,
  isOpen: isOpenProp = false,
  onToggleOpen,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const [isOpen, setIsOpen] = useState(isOpenProp || false);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    setIsOpen(isOpenProp === undefined ? !isOpen : isOpenProp);
  }, [isOpenProp]);

  useEffect(() => {
    const measureHeight = () => {
      if (contentRef.current) {
        const calculatedHeight = contentRef.current.scrollHeight;
        setContentHeight(calculatedHeight);
      }
    };

    requestAnimationFrame(measureHeight);

    const observer = new MutationObserver(measureHeight);
    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true });
    }

    return () => {
      if (contentRef.current) {
        observer.disconnect();
      }
    };
  }, [contentRef.current]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!showButton) return;
    setIsOpen(!isOpen);
    onToggleOpen?.(!isOpen);
  };

  const handleComponentClick = () => {
    if (!showButton || isOpen) return;
    setIsOpen(!isOpen);
    onToggleOpen?.(!isOpen);
  };

  const calculatedHeight = useMemo(() => contentHeight + 50, [contentHeight]);
  const showButton = useMemo(
    () => contentHeight > initialHeight,
    [contentHeight, initialHeight],
  );

  const renderShowMoreButton = () => (
    <button onClick={handleToggle} className="btn btn-sm mb-2">
      <span>{isOpen ? "کمتر" : "بیشتر"}</span>
      <motion.span
        animate={{
          rotate: isOpen ? 180 : 0,
        }}
      >
        <FontAwesomeIcon icon={faAngleDown} />
      </motion.span>
    </button>
  );

  return (
    <motion.div
      className={`relative overflow-hidden w-full ${className}`}
      onClick={handleComponentClick}
      initial={{
        height: initialHeight,
      }}
      animate={{
        height: isOpen ? calculatedHeight : showButton ? initialHeight : "auto",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div ref={contentRef}>{children}</div>
      {showButton && (
        <div
          className={`absolute w-full bottom-0 flex justify-center items-end ${
            isOpen
              ? ""
              : "bg-gradient-to-t from-base-100 h-48 pointer-events-none"
          } z-10`}
        >
          {showMoreButton || renderShowMoreButton()}
        </div>
      )}
    </motion.div>
  );
};

export const ExpandableSectionMeta: CodeComponentMeta<Props> = {
  name: "ExpandableSection",
  displayName: "Fragment/ExpandableSection",
  importPath: "./../../../src/fragment/components/ExpandableSection",
  props: {
    children: {
      displayName: "Children",
      type: "slot",
    },
    showMoreButton: {
      displayName: "Button",
      type: "slot",
    },
    initialHeight: {
      displayName: "Initial Height",
      type: "number",
      required: true,
      helpText: "Initial height value in px.",
      defaultValue: 0,
    },
    onClose: {
      type: "eventHandler",
      argTypes: [],
    },
    onOpen: {
      type: "eventHandler",
      argTypes: [],
    },
    className: {
      type: "string",
      displayName: "Class name",
    },
    isOpen: {
      type: "boolean",
      displayName: "Is open",
      defaultValue: false,
    },
    onToggleOpen: {
      type: "eventHandler",
      argTypes: [{ name: "isOpen", type: "boolean" }],
    },
  },
  states: {
    isOpen: {
      type: "writable",
      variableType: "boolean",
      valueProp: "isOpen",
      onChangeProp: "onToggleOpen",
    },
  },
};
