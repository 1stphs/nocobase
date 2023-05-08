import { createForm } from '@formily/core';
import { RecursionField, Schema, useField, useFieldSchema } from '@formily/react';
import { isEmpty } from 'lodash';
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useCollection } from '../collection-manager';
import { RecordProvider, useRecord } from '../record-provider';
import { useCollectionManager } from '../collection-manager';
import { useActionContext, useDesignable } from '../schema-component';
import { Templates as DataTemplateSelect } from '../schema-component/antd/form-v2/Templates';
import { BlockProvider, useBlockRequestContext } from './BlockProvider';
import { isArray } from 'mathjs';

export const FormBlockContext = createContext<any>({});

const InternalFormBlockProvider = (props) => {
  const { action, readPretty, params, updateAssociationValues } = props;
  const field = useField();
  const form = useMemo(
    () =>
      createForm({
        readPretty,
      }),
    [],
  );
  const { resource, service } = useBlockRequestContext();
  const formBlockRef = useRef();
  const record = useRecord();
  // if (service.loading) {
  //   return <Spin />;
  // }
  return (
    <FormBlockContext.Provider
      value={{
        params,
        action,
        form,
        field,
        service,
        resource,
        updateAssociationValues,
        formBlockRef,
      }}
    >
      {readPretty ? (
        <RecordProvider parent={isEmpty(record?.__parent) ? record : record?.__parent} record={service?.data?.data}>
          <div ref={formBlockRef}>
            <RenderChildrenWithDataTemplates form={form} />
          </div>
        </RecordProvider>
      ) : (
        <div ref={formBlockRef}>
          <RenderChildrenWithDataTemplates form={form} />
        </div>
      )}
    </FormBlockContext.Provider>
  );
};

export const useIsEmptyRecord = () => {
  const record = useRecord();
  const keys = Object.keys(record);
  if (keys.includes('__parent')) {
    return keys.length > 1;
  }
  return keys.length > 0;
};

const getAssociationAppends = (schema, arr = []) => {
  return schema.reduceProperties((buf, s) => {
    if (s['x-component'] === 'CollectionField' && ['object', 'array'].includes(s.type)) {
      buf.push(s.name);
      if (s['x-component-props'].mode === 'Nester') {
        return getAssociationAppends(s, buf);
      }
      return buf;
    } else {
      if (s['x-component'] === 'Grid') {
        let kk = buf.concat();
        return getNesterAppends(s, kk);
      } else {
        return getAssociationAppends(s, buf);
      }
    }
  }, arr);
};

const getNesterAppends = (gridSchema, data) => {
  gridSchema.reduceProperties((buf, s) => {
    buf.push(getAssociationAppends(s));
    return buf;
  }, data);
  return data.filter((g) => g.length);
};

function flattenNestedList(nestedList) {
  const flattenedList = [];

  function flattenHelper(list, prefix) {
    for (let i = 0; i < list.length; i++) {
      if (Array.isArray(list[i])) {
        flattenHelper(list[i], `${prefix}.${list[i][0]}`);
      } else {
        const str = prefix.replace(`${list[i]}`, '').trim();
        flattenedList.push(`${str}${list[i]}`);
      }
    }
  }

  for (let i = 0; i < nestedList.length; i++) {
    flattenHelper(nestedList[i], nestedList[i][0]);
  }

  return flattenedList;
}

const useAssociationNames = (collection) => {
  const { getCollectionFields } = useCollectionManager();
  const collectionFields = getCollectionFields(collection);
  const associationFields = new Set();
  for (const collectionField of collectionFields) {
    if (collectionField.target) {
      associationFields.add(collectionField.name);
      const fields = getCollectionFields(collectionField.target);
      for (const field of fields) {
        if (field.target) {
          associationFields.add(`${collectionField.name}.${field.name}`);
        }
      }
    }
  }
  const fieldSchema = useFieldSchema();
  const formSchema = fieldSchema.reduceProperties((buf, schema) => {
    if (schema['x-component'] === 'FormV2') {
      return schema;
    }
    return buf;
  }, new Schema({}));
  const gridSchema = formSchema.properties.grid;
  const data = [];
  gridSchema.reduceProperties((buf, s) => {
    buf.push(getAssociationAppends(s));
    return buf;
  }, data);
  const associations = data.filter((g) => g.length);
  const appends = flattenNestedList(associations);
  const updateAssociationValues = associations.concat().map((k) => {
    return k.map((v, index) => {
      const s = index > 0 ? k.slice(0, index + 1) : [v];
      return s.join('.');
    });
  });
  return { appends, updateAssociationValues: appends };
};
export const FormBlockProvider = (props) => {
  const record = useRecord();
  const { collection } = props;
  const { __collection } = record;
  const params = { ...props.params };
  const currentCollection = useCollection();
  const { designable } = useDesignable();
  const isEmptyRecord = useIsEmptyRecord();

  const { appends, updateAssociationValues } = useAssociationNames(collection);
  if (!Object.keys(params).includes('appends')) {
    params['appends'] = appends;
  }
  let detailFlag = false;
  if (isEmptyRecord) {
    detailFlag = true;
    if (!designable && __collection) {
      detailFlag = __collection === collection;
    }
  }
  const createFlag =
    (currentCollection.name === (collection?.name || collection) && !isEmptyRecord) || !currentCollection.name;
  return (
    (detailFlag || createFlag) && (
      <BlockProvider {...props} block={'form'} params={params}>
        <InternalFormBlockProvider {...props} params={params} updateAssociationValues={updateAssociationValues} />
      </BlockProvider>
    )
  );
};

export const useFormBlockContext = () => {
  return useContext(FormBlockContext);
};

export const useFormBlockProps = () => {
  const ctx = useFormBlockContext();
  const record = useRecord();
  const { fieldSchema } = useActionContext();
  const addChild = fieldSchema?.['x-component-props']?.addChild;
  useEffect(() => {
    if (addChild) {
      ctx.form?.query('parent').take((field) => {
        field.disabled = true;
        field.value = new Proxy({ ...record }, {});
      });
    }
  });

  useEffect(() => {
    if (!ctx?.service?.loading) {
      ctx.form?.setInitialValues(ctx.service?.data?.data);
    }
  }, [ctx?.service?.loading]);
  return {
    form: ctx.form,
  };
};

const RenderChildrenWithDataTemplates = ({ form }) => {
  const FieldSchema = useFieldSchema();
  const { findComponent } = useDesignable();
  const field = useField();
  const Component = findComponent(field.component?.[0]) || React.Fragment;

  return (
    <Component {...field.componentProps}>
      <DataTemplateSelect style={{ marginBottom: 18 }} form={form} />
      <RecursionField schema={FieldSchema} onlyRenderProperties />
    </Component>
  );
};

export const findFormBlock = (schema: Schema) => {
  while (schema) {
    if (schema['x-decorator'] === 'FormBlockProvider') {
      return schema;
    }
    schema = schema.parent;
  }
  return null;
};
