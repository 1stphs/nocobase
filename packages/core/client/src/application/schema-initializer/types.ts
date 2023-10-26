import { ISchema } from '@formily/json-schema';
import { ButtonProps, ListProps, PopoverProps } from 'antd';
import { ComponentType, ReactNode } from 'react';
import type { SchemaInitializerGroupProps, SchemaInitializerItemProps, SchemaInitializerMenuProps } from './components';

export type InsertType = (s: ISchema) => void;

export interface ComponentCommonProps {
  title?: string;
  schema?: ISchema;
}

interface SchemaInitializerItemBaseType<T = {}> extends ComponentCommonProps {
  name?: string | number;
  sort?: number;
  Component?: string | ComponentType<T>;
  componentProps?: T;
  useVisible?: () => boolean;
  [index: string]: any;
}

interface SchemaInitializerItemBaseWithChildren<T = {}> extends SchemaInitializerItemBaseType<T> {
  children?: SchemaInitializerItemType[];
  checkChildrenLength?: boolean;
  useChildren?: () => SchemaInitializerItemType[];
}

interface SchemaInitializerItemDividerType extends SchemaInitializerItemBaseType {
  type: 'divider';
}

interface SchemaInitializerItemOnlyType extends SchemaInitializerItemBaseType<SchemaInitializerItemProps> {
  type: 'item';
}

interface SchemaInitializerGroupType extends SchemaInitializerItemBaseWithChildren<SchemaInitializerGroupProps> {
  type: 'itemGroup';
  divider?: boolean;
}

interface SchemaInitializerMenuType extends SchemaInitializerItemBaseWithChildren<SchemaInitializerMenuProps> {
  type: 'subMenu';
}

export type SchemaInitializerItemType<T = {}> =
  | SchemaInitializerItemBaseType<T>
  | SchemaInitializerItemBaseWithChildren<T>
  | SchemaInitializerItemDividerType
  | SchemaInitializerItemOnlyType
  | SchemaInitializerGroupType
  | SchemaInitializerMenuType;

// TODO: 类型需要优化
export interface SchemaInitializerOptions<P1 = ButtonProps, P2 = ListProps<any>> {
  title?: string;
  insertPosition?: 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd';

  Component?: ComponentType<P1>;
  componentProps?: P1;
  // Like the `style` parameter, it is used to modify the style of the `Component` component.
  componentStyle?: React.CSSProperties;
  style?: React.CSSProperties;

  ItemsComponent?: ComponentType<P2>;
  itemsComponentProps?: P2;
  itemsComponentStyle?: React.CSSProperties;

  noPopover?: boolean;
  popoverProps?: PopoverProps;
  designable?: boolean;
  wrap?: (s: ISchema) => ISchema;
  insert?: InsertType;
  useInsert?: () => InsertType;
  onSuccess?: (data: any) => void;
  items?: SchemaInitializerItemType[];
  icon?: ReactNode;
  'data-testid'?: string;
  [index: string]: any;
}
