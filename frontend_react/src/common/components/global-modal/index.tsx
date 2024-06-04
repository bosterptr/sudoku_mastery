import { DEFAULT_APP_MODAL_PORTAL_ELEMENT_ID } from 'app/core/constants/elementIds';
import NOOP from 'app/utils/noop';
import CSS from 'csstype';
import { forwardRef, ReactNode, Suspense, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ModalComponent from './ModalComponent';

interface Props {
  children?: ReactNode;
  className?: string;
  clickAway?: boolean;
  closeWithEnter?: boolean;
  disableOverflow?: boolean;
  fadeIn?: boolean;
  isOpen?: boolean;
  maxWidth?: number;
  onClose?: () => void;
  renderContent?: ({ close }: { close: () => void }) => void;
  textAlign?: CSS.Property.TextAlign;
  variant?: 'center' | 'aside';
  withCloseIcon?: boolean;
}

const GlobalModal = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      className,
      clickAway = false,
      closeWithEnter = false,
      disableOverflow = true,
      fadeIn = true,
      isOpen: propsIsOpen,
      onClose: tellParentToClose,
      renderContent = NOOP,
      textAlign = 'left',
      variant,
      maxWidth,
      withCloseIcon = false,
    },
    ref,
  ) => {
    const [stateIsOpen, setStateOpen] = useState(false);
    const isControlled = typeof propsIsOpen === 'boolean';
    const isOpen = isControlled ? propsIsOpen : stateIsOpen;
    const modalPortalElem = document.getElementById(DEFAULT_APP_MODAL_PORTAL_ELEMENT_ID);
    if (modalPortalElem === null) throw new Error();

    const closeModal = useCallback(() => {
      if (!isControlled) {
        setStateOpen(false);
      } else if (tellParentToClose) tellParentToClose();
    }, [isControlled, tellParentToClose]);

    const handleClickAway = () => {
      if (clickAway) closeModal();
    };
    useEffect(() => {
      if (disableOverflow) document.body.style.overflow = 'hidden';
      return () => {
        if (disableOverflow) document.body.style.overflow = 'visible';
      };
    }, [disableOverflow, isOpen]);
    useEffect(() => {
      function keyListener(event: KeyboardEvent) {
        if (event.key === 'Escape') closeModal();
        if (closeWithEnter && event.key === 'Enter') closeModal();
      }
      document.addEventListener('keydown', keyListener);
      return () => document.removeEventListener('keydown', keyListener);
    });
    if (isOpen) {
      return createPortal(
        <Suspense fallback={null}>
          <ModalComponent
            className={className}
            fadeIn={fadeIn}
            onClickAway={handleClickAway}
            onClose={closeModal}
            ref={ref}
            renderContent={renderContent}
            textAlign={textAlign}
            variant={variant}
            maxWidth={maxWidth}
            withCloseIcon={withCloseIcon}
          >
            {children}
          </ModalComponent>
        </Suspense>,
        modalPortalElem,
      );
    }
    return null;
  },
);

export default GlobalModal;
