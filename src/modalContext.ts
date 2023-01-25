import React, { ComponentType } from 'react';

export type ModalContextProps = {
  showModal: <R = any>({ modalKey, component, props }: { modalKey: string; component: ComponentType<any>; props?: any }) => Promise<R>;
  hideModal: (modalKey: string) => void;
};

export const defaultContext: ModalContextProps = {
  showModal: (() => {
    return Promise.resolve();
  }) as ModalContextProps['showModal'],
  hideModal: () => {},
};

export const ModalContext = React.createContext<ModalContextProps>(defaultContext);
