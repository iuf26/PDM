import React, { useCallback } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, text, onEdit }) => {
  const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);
  return (
    <IonItem onClick={handleEdit}>
      <IonLabel>{text}</IonLabel>
    </IonItem>
  );
};

export default Item;
