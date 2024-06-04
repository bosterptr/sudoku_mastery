import React, { ChangeEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';

const NameContainer = styled.div`
  flex: 1;
  min-width: 0;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${(p) => p.theme.palette.border.medium};
    border-radius: 4px;
  }
`;

const Name = styled.div`
  align-items: center;
  color: ${(p) => p.theme.palette.text.primary};
  cursor: text;
  flex-grow: 1;
  line-height: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: border 0.3s ease;
  white-space: nowrap;
  width: 100%;
`;

const NameInput = styled.input`
  align-items: center;
  background: transparent;
  border: none;
  color: ${(p) => p.theme.palette.text.primary};
  cursor: text;
  flex-grow: 1;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  margin: 0;
  min-height: inherit;
  outline: none;
  overflow: hidden;
  padding: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const EditableText = ({
  initialValue = '',
  onSave,
  className,
  placeholder,
}: {
  initialValue?: string;
  className?: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
}) => {
  const [editing, setEditing] = useState(false);
  const [innerName, setInnerValue] = useState(initialValue);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
      setEditing(false);
    }
  };
  const handleNameClick = () => {
    setEditing(true);
  };
  const handleBlur = () => {
    setEditing(false);
    if (initialValue !== innerName) onSave(innerName);
  };
  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInnerValue(e.target.value);
  };
  useEffect(() => {
    setInnerValue(initialValue);
  }, [initialValue]);
  return (
    <NameContainer className={className}>
      {!editing && (
        <Name onClick={handleNameClick}>{innerName !== '' ? innerName : placeholder}</Name>
      )}
      {editing && (
        <NameInput
          onBlur={handleBlur}
          value={innerName}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          autoFocus
          placeholder={placeholder}
        />
      )}
    </NameContainer>
  );
};

export default EditableText;
