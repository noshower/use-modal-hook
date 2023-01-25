import { useContext, useCallback, useState, ComponentType, useEffect } from 'react';
import { defaultContext, ModalContext } from './modalContext';
import { ModalProvider } from './modalProvider';

const generateModalKey = (() => {
  let count = 0;

  return () => {
    count += 1;
    return `${count}`;
  };
})();

function useModal({ destroyOnUnmount = true }: { destroyOnUnmount?: boolean } = {}) {
  const [key] = useState(generateModalKey);
  const context = useContext(ModalContext);

  useEffect(() => {
    return () => {
      if (destroyOnUnmount) {
        context.hideModal(key);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (context === defaultContext) {
    console.error('useModal hook 需要配合 ModalProvider 才能正常使用');
  }

  const showModal = useCallback(
    <P extends { onClose: (param: any) => void }>({ props, component }: { props: Omit<P, 'onClose'>; component: ComponentType<P> }) => {
      return context.showModal<Parameters<P['onClose']>[0]>({ modalKey: key, component, props });
    },
    [context, key],
  );

  const hideModal = useCallback(() => context.hideModal(key), [context, key]);

  return [showModal, hideModal] as const;
}

export { useModal, ModalContext, ModalProvider };
