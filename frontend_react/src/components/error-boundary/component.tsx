/* eslint-disable react/destructuring-assignment */
import Button from 'app/common/components/button';
import { logger } from 'app/core/App';
import { Component, ErrorInfo, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { ErrorImageContainer, ErrorImageOverlay, ErrorImageText } from './styles';

export interface Props {
  children?: ReactNode;
  name: string;
  content?: JSX.Element;
  onError?: () => void;
}

interface State {
  hasErrored: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasErrored: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public componentDidCatch(error: Error, _info: ErrorInfo) {
    this.setState({ hasErrored: true });
    logger.errorAndReport(error, this.props.name);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  public render() {
    if (this.state.hasErrored) {
      if (this.props.content) {
        return this.props.content;
      }
      return (
        <ErrorImageOverlay>
          <ErrorImageContainer $imageurl="https://i.imgur.com/yW2W9SC.png" />
          <ErrorImageText>
            <FormattedMessage defaultMessage="Sorry this page is broken" />
          </ErrorImageText>
          <Button aria-label="Reload page" onClick={() => window.location.reload()}>
            <FormattedMessage defaultMessage="Reload page" />
          </Button>
        </ErrorImageOverlay>
      );
    }
    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}
