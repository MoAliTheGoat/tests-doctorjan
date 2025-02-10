import { CodeComponentMeta } from "@plasmicapp/host";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";

type Props = React.PropsWithChildren<{
  modalId: string;
  hasCloseXButton: boolean;
  modalBoxClass: string;
  modalPosition: "top" | "middle" | "bottom";
  showModalPreview: boolean;
  boxStyle?: CSSProperties;
  width?: string;
  height?: string;
}>;

export const Modal = ({
  children,
  modalId,
  hasCloseXButton,
  modalBoxClass,
  modalPosition,
  showModalPreview,
  boxStyle,
  width,
  height,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const handleSetIsOpen = () => {
      const isOpen = dialog.hasAttribute("open");

      if (isOpen) {
        setIsOpen(isOpen);
      } else {
        setTimeout(() => {
          setIsOpen(isOpen);
        }, 200);
      }
    };

    handleSetIsOpen();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation: any) => {
        if (mutation.attributeName === "open") {
          handleSetIsOpen();
        }
      });
    });

    observer.observe(dialog, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      id={modalId}
      className={`modal ${"modal-" + modalPosition} ${
        showModalPreview ? "modal-open" : ""
      }`}
    >
      <div
        className={`modal-box ${modalBoxClass}`}
        style={{ ...boxStyle, width, height }}
      >
        {hasCloseXButton && (
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 focus:outline-none focus-within:outline-none">
              ✕
            </button>
          </form>
        )}
        {(isOpen || showModalPreview) && children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
      <Toaster containerStyle={{ fontFamily: "var(--IranSansX)" }} />
    </dialog>
  );
};

export const ModalMeta: CodeComponentMeta<Props> = {
  name: "Modal",
  displayName: "Fragment/Modal",
  importPath: "./../../../src/fragment/components/Modal",
  props: {
    modalId: {
      displayName: "Modal ID",
      type: "string",
      required: true,
      helpText: "The Modal id should be unique in project.",
    },
    modalBoxClass: {
      displayName: "Modal box classes",
      type: "string",
      helpText:
        "You can use tailwind classes. Read these https://v3.daisyui.com/components/modal/ | https://tailwindcss.com/docs/installatio",
    },
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
    modalPosition: {
      displayName: "Modal position",
      type: "choice",
      options: ["top", "middle", "bottom"],
      defaultValue: "middle",
    },
    showModalPreview: {
      displayName: "Show preview",
      type: "boolean",
      defaultValue: false,
      helpText:
        "Switch this show the modal preview. (turn it off for production)",
    },
    boxStyle: {
      displayName: "Modal style",
      type: "object",
      defaultValue: {},
      helpText: "Add inline styles to the modal box div.",
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
  },
};
