import React, { useState, useMemo, useCallback, ReactNode, ComponentType } from 'react';
import { ModalContext, ModalContextProps } from './modalContext';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalsConfig, setConfig] = useState<{ key: string; component: ComponentType<any>; props: any; onClose: (res?: any) => void }[]>([]);

  const hideModal: ModalContextProps['hideModal'] = useCallback((modalKey: string) => {
    setConfig((prevConfig) =>
      prevConfig.filter((config) => {
        if (config.key === modalKey) {
          config.onClose();
        }
        return config.key !== modalKey;
      }),
    );
  }, []);

  const showModal: ModalContextProps['showModal'] = useCallback(({ modalKey, component, props }) => {
    return new Promise((resolve) => {
      setConfig((prevConfig) => [
        ...prevConfig,
        {
          key: modalKey,
          component,
          props,
          onClose: (res) => {
            setConfig((prevState) => prevState.filter((config) => config.key !== modalKey));
            resolve(res);
          },
        },
      ]);
    });
  }, []);

  const contextValue: ModalContextProps = useMemo(
    () => ({
      showModal,
      hideModal,
    }),
    [hideModal, showModal],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalsConfig.map((config) => {
        const { component: Component, props, key, onClose } = config;
        return <Component key={key} {...props} onClose={onClose} />;
      })}
    </ModalContext.Provider>
  );
};
