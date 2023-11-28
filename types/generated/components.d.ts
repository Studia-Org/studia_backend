import type { Schema, Attribute } from '@strapi/strapi';

export interface NoseType extends Schema.Component {
  collectionName: 'components_nose_types';
  info: {
    displayName: 'type';
  };
  attributes: {
    type: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'nose.type': NoseType;
    }
  }
}
