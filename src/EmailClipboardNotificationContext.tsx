import React, { createContext, useState } from "react";

interface EmailClipboardNotificationContextType {
  isCopied: boolean;
  update: (value: boolean) => void;
}

export const EmailClipboardNotificationContext =
  createContext<EmailClipboardNotificationContextType>({
    isCopied: false,
    update: () => {},
  });

export const EmailClipboardNotificationProvider = ({
  children,
}: {
  children: any;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <EmailClipboardNotificationContext.Provider
      value={{
        isCopied,
        update: (value: boolean) => {
          setIsCopied(value);
        },
      }}
    >
      {children}
    </EmailClipboardNotificationContext.Provider>
  );
};
