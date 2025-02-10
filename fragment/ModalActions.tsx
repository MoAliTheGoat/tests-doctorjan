import { GlobalActionsProvider, GlobalContextMeta } from "@plasmicapp/host";
import React, { useMemo } from "react";

type Props = React.PropsWithChildren<{}>;

export const ModalActions = ({ children }: Props) => {
  const handleModalOpen = (modalId: string) => {
    (document.getElementById(modalId) as HTMLDialogElement)?.showModal();
  };

  const handleModalClose = (modalId: string) => {
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  };

  const actions = useMemo(
    () => ({
      handleModalOpen: (modalId: string) => handleModalOpen(modalId),
      handleModalClose: (modalId: string) => handleModalClose(modalId),
    }),
    [],
  );

  return (
    <GlobalActionsProvider contextName="ModalActions" actions={actions}>
      {children}
    </GlobalActionsProvider>
  );
};

export const modalActionsMeta: GlobalContextMeta<Props> = {
  name: "ModalActions",
  displayName: "Fragment/ModalActions",
  importPath: "./../../../src/fragment/ModalActions",
  props: {},
  globalActions: {
    handleModalOpen: {
      displayName: "Open Modal",
      parameters: [
        {
          name: "modalId",
          displayName: "Modal ID",
          type: "string",
        },
      ],
    },
    handleModalClose: {
      displayName: "Close Modal",
      parameters: [
        {
          name: "modalId",
          displayName: "Modal ID",
          type: "string",
        },
      ],
    },
  },
};
