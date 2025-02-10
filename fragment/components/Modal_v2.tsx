import { CodeComponentMeta, PlasmicCanvasContext } from "@plasmicapp/host";
import {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";

type Props = React.PropsWithChildren<{
  headerChildren?: ReactNode;
  footerChildren?: ReactNode;
  hasModalHeader?: boolean;
  hasModalFooter?: boolean;
  hasCloseXButton: boolean;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  scroll?: "normal" | "inside" | "outside";
  modalPosition?:
    | "auto"
    | "center"
    | "top"
    | "top-center"
    | "bottom"
    | "bottom-center";
  modalStyle?: CSSProperties;
  width?: string;
  height?: string;
  isModalOpen: boolean;
  onModalOpenChange?: (isOpen: boolean) => void;
  onOpenProp?: () => void;
  onCloseProp?: () => void;
  backdrop?: "transparent" | "opaque" | "blur";
}>;

export const Modal_v2 = ({
  children,
  headerChildren,
  footerChildren,
  hasModalHeader = true,
  hasModalFooter = true,
  size = "md",
  scroll = "normal",
  hasCloseXButton = true,
  modalPosition = "center",
  modalStyle,
  width,
  height,
  isModalOpen = false,
  onModalOpenChange,
  onOpenProp,
  onCloseProp,
  backdrop,
}: Props) => {
  const inEditor = useContext(PlasmicCanvasContext);

  const [isOpen, setIsOpen] = useState(isModalOpen || false);

  const handleClickOpen = () => {
    setIsOpen(true);
    onModalOpenChange?.(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    onModalOpenChange?.(false);
  };

  useEffect(() => {
    if (isOpen) {
      onOpenProp?.();
    } else {
      onCloseProp?.();
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(isModalOpen);
    onModalOpenChange?.(isModalOpen);
  }, [isModalOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={size}
      placement={modalPosition}
      scrollBehavior={scroll}
      hideCloseButton={!hasCloseXButton}
      backdrop={backdrop}
      isDismissable={!inEditor}
      isKeyboardDismissDisabled={!!inEditor}
      style={{ ...modalStyle, width: width, height: height }}
      classNames={{
        header: "border-b-[1px] border-secondary-300",
        footer: "border-t-[1px] border-secondary-300",
      }}
      unstable_disableFocusManagement={!!inEditor}
    >
      <ModalContent>
        {hasModalHeader && <ModalHeader>{headerChildren}</ModalHeader>}
        <ModalBody>{children}</ModalBody>
        {hasModalFooter && <ModalFooter>{footerChildren}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

export const Modal2Meta: CodeComponentMeta<Props> = {
  name: "Modal_v2",
  displayName: "Fragment/Modal_v2",
  importPath: "./../../../src/fragment/components/Modal_v2",
  styleSections: [],
  props: {
    hasCloseXButton: {
      displayName: "Show close x button",
      type: "boolean",
      defaultValue: true,
      helpText: "The x button in the corner of dialog",
    },
    children: {
      displayName: "Children",
      type: "slot",
    },
    headerChildren: {
      displayName: "Modal title",
      type: "slot",
    },
    size: {
      displayName: "Max width",
      type: "choice",
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "full",
      ],
      defaultValue: "md",
    },
    scroll: {
      displayName: "Scroll",
      type: "choice",
      options: ["normal", "inside", "outside"],
      defaultValue: "normal",
      helpText:
        "You can use this prop to set the scroll behavior of the modal.\ninside: The modal content will be scrollable.\noutside: The modal content will be scrollable and the modal will be fixed.",
    },
    footerChildren: {
      displayName: "Modal actions",
      type: "slot",
    },
    hasModalHeader: {
      displayName: "Has header section",
      type: "boolean",
      defaultValue: true,
    },
    hasModalFooter: {
      displayName: "Has footer section",
      type: "boolean",
      defaultValue: true,
    },
    modalPosition: {
      displayName: "Modal position",
      type: "choice",
      options: [
        "auto",
        "center",
        "top",
        "top-center",
        "bottom",
        "bottom-center",
      ],
      defaultValue: "center",
      helpText:
        "Note: The top-center and bottom-center positions mean that the modal is positioned at the top / bottom of the screen on mobile and at the center of the screen on desktop.",
    },
    modalStyle: {
      displayName: "Modal style",
      type: "object",
      defaultValue: {},
      helpText: "Add inline styles to the modal box div.",
    },
    backdrop: {
      displayName: "Backdrop effect",
      type: "choice",
      options: ["transparent", "opaque", "blur"],
      defaultValue: "opaque",
    },
    width: {
      displayName: "Width",
      type: "string",
      defaultValue: undefined,
    },
    height: {
      displayName: "Height",
      type: "string",
      defaultValue: undefined,
    },
    isModalOpen: {
      displayName: "Is open",
      type: "boolean",
      defaultValue: false,
    },
    onModalOpenChange: {
      type: "eventHandler",
      argTypes: [{ name: "isOpen", type: "boolean" }],
    },
    onOpenProp: {
      type: "eventHandler",
      argTypes: [],
    },
    onCloseProp: {
      type: "eventHandler",
      argTypes: [],
    },
  },
  states: {
    isModalOpen: {
      type: "writable",
      variableType: "boolean",
      valueProp: "isModalOpen",
      onChangeProp: "onModalOpenChange",
    },
  },
};
