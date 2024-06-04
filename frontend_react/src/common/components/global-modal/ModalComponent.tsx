import { useClickAway } from 'app/common/hooks/use-click-away';
import { zIndex } from 'app/core/themes/zIndex';
import CSS from 'csstype';
import { forwardRef, ReactNode, useRef } from 'react';
import styled, { css } from 'styled-components';
import Grow from '../animations/Grow';

const ScrollOverlay = styled.div`
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: ${zIndex.modal};
`;

const clickOverlayStyles = {
  center: css`
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 20px;
  `,
  aside: '',
};

const Overlay = styled.div<{ variant: 'center' | 'aside' }>`
  ${(p) => clickOverlayStyles[p.variant]}
  background: rgba(9, 30, 66, 0.54);
  min-height: 100%;
  transition: background 0.15s linear;
  height: 100%;
`;

const modalStyles = {
  center: css<{ maxWidth?: number }>`
    box-shadow: ${(p) => p.theme.shadows.z3};
    border-radius: 12px;
    max-width: ${(p) => p.maxWidth}px;
    vertical-align: middle;
  `,
  aside: css<{ maxWidth?: number }>`
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
    max-width: ${(p) => p.maxWidth}px;
    min-height: 100vh;
  `,
};

const StyledModal = styled.div<{
  maxWidth?: number;
  textAlign: CSS.Property.TextAlign;
  variant: 'center' | 'aside';
}>`
  ${(p) => modalStyles[p.variant]}
  background: #fff;
  display: inline-block;
  position: relative;
  text-align: ${(p) => p.textAlign};
  width: 100%;
`;

interface Props {
  children?: ReactNode;
  className?: string;
  fadeIn?: boolean;
  onClickAway: () => void;
  onClose: () => void;
  renderContent: ({ close }: { close: () => void }) => void;
  textAlign: CSS.Property.TextAlign;
  variant?: 'center' | 'aside';
  maxWidth?: number;
  withCloseIcon?: boolean;
}
const ModalComponent = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      className,
      fadeIn = true,
      maxWidth,
      onClickAway,
      onClose,
      renderContent,
      textAlign,
      variant,
      withCloseIcon = false,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useClickAway(onClickAway, containerRef);
    return (
      <ScrollOverlay>
        <Grow appear in={fadeIn}>
          <Overlay variant={variant || 'center'} ref={ref}>
            <div ref={containerRef}>
              <StyledModal
                className={className}
                textAlign={textAlign}
                variant={variant || 'center'}
                maxWidth={maxWidth}
              >
                <>
                  {withCloseIcon && (
                    <button onClick={onClose} type="button">
                      X
                    </button>
                  )}
                  {renderContent({ close: onClose })}
                  {children}
                </>
              </StyledModal>
            </div>
          </Overlay>
        </Grow>
      </ScrollOverlay>
    );
  },
);
export default ModalComponent;
