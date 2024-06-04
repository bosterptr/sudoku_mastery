import styled from 'styled-components';

export const Root = styled.div`
  margin: auto;
`;

export const Card = styled.div`
  background: ${(p) => p.theme.palette.background.primary};
  border-radius: 28px;
  display: flex;
  flex-direction: row;
  margin: auto;
  min-height: 350px;
  padding: 100px 36px 36px;
  width: 1040px;
`;

export const CardContent = styled.div`
  flex-direction: row;
  flex-wrap: wrap;
  display: flex;
  flex-grow: 1;
`;

export const Title = styled.span`
  color: ${(p) => p.theme.palette.text.primary};
  font-size: 44px;
  font-weight: 400;
`;

export const SubTitle = styled.span`
  margin-top: 16px;
`;

export const FormContainer = styled.div`
  flex-basis: 50%;
  flex-grow: 1;
  max-width: 50%;
  padding-left: 24px;
`;
export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-right: 24px;
`;
export const HalfWidthHeadingContainer = styled.div`
  display: flex;
  flex-basis: 50%;
  flex-direction: column;
  flex-grow: 1;
  max-width: 50%;
  padding-right: 24px;
`;
export const BottomBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: -6px;
  margin-left: -16px;
  margin-top: 32px;
`;

export const BottomBarSubContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
`;
