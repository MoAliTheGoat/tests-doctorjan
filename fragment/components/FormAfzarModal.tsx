"use client";

import Script, { ScriptProps } from "next/script";
import { useEffect } from "react";

type props = {
  modalOpenerSlot?: React.ReactNode;
  scriptProps?: ScriptProps;
  linkText: string;
  formUrl: string;
};

export const handleFormAfzarClick = (linkText: string) => {
  const anchorElement = Array.from(document.querySelectorAll("a")).filter(
    (el) => el.textContent === linkText,
  );
  if (anchorElement.length > 0) anchorElement[0].click();
};

const FormAfzarModal = ({
  modalOpenerSlot,
  scriptProps,
  linkText,
  formUrl,
}: props) => {
  const hideFormafzarButton = () => {
    const anchorElements = Array.from(document.querySelectorAll("a")).filter(
      (el) => el.innerText === linkText,
    );
    if (anchorElements.length > 0) {
      anchorElements.forEach((el) => (el.style.display = "none"));
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(hideFormafzarButton);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [linkText]);

  return (
    <>
      <Script
        {...scriptProps}
        src={"/form-afzar.js" + `?linkText=${linkText.replace(/ /g, "-")}`}
        strategy="lazyOnload"
        form-style="dialog"
        form-theme=""
        form-link-text={linkText}
        form-url={formUrl}
        rel="prefetch"
        onLoad={hideFormafzarButton}
      />
    </>
  );
};

export default FormAfzarModal;
