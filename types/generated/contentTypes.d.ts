import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    profile_photo: Attribute.Media & Attribute.Required;
    landscape_photo: Attribute.Media;
    university: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 50;
      }>;
    description: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 300;
      }>;
    courses: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::course.course'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 50;
      }>;
    role_str: Attribute.String & Attribute.Required;
    calendar_events: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::calendar-event.calendar-event'
    >;
    user_response_questionnaires: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::user-response-questionnaire.user-response-questionnaire'
    >;
    qualifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::qualification.qualification'
    >;
    user_objectives: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::user-objective.user-objective'
    >;
    log: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::log.log'
    >;
    activities: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::activity.activity'
    >;
    notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::notification.notification'
    >;
    subsections_completed: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::subsection.subsection'
    >;
    PeerReviewAnswers: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::peer-review-answer.peer-review-answer'
    >;
    groups: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::group.group'
    >;
    SelfAssesmentAnswers: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::self-assesment-answer.self-assesment-answer'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiActivityActivity extends Schema.CollectionType {
  collectionName: 'activities';
  info: {
    singularName: 'activity';
    pluralName: 'activities';
    displayName: 'Activity';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    deadline: Attribute.DateTime & Attribute.Required;
    ponderation: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }>;
    file: Attribute.Media;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    evaluable: Attribute.Boolean;
    qualifications: Attribute.Relation<
      'api::activity.activity',
      'oneToMany',
      'api::qualification.qualification'
    >;
    evaluators: Attribute.Relation<
      'api::activity.activity',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    categories: Attribute.JSON &
      Attribute.CustomField<
        'plugin::multi-select.multi-select',
        [
          'Ethical commitment',
          'Learning capability and responsibility',
          'Teamwork',
          'Creative and entrepreneurial capacity',
          'Sustainability',
          'Communicative ability'
        ]
      >;
    PeerReviewRubrica: Attribute.JSON;
    section: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::section.section'
    >;
    type: Attribute.Enumeration<
      [
        'peerReview',
        'task',
        'forum',
        'questionnaire',
        'thinkAloud',
        'selfAssessment'
      ]
    >;
    task_to_review: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::activity.activity'
    >;
    BeingReviewedBy: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::activity.activity'
    >;
    usersToPair: Attribute.Integer & Attribute.DefaultTo<1>;
    groupActivity: Attribute.Boolean & Attribute.DefaultTo<false>;
    numberOfStudentsperGroup: Attribute.Integer;
    start_date: Attribute.DateTime;
    subsection: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::subsection.subsection'
    >;
    ponderationStudent: Attribute.Integer &
      Attribute.SetMinMax<{
        max: 100;
      }>;
    SelfAssesmentRubrica: Attribute.JSON;
    selfAssesmentAnswers: Attribute.Relation<
      'api::activity.activity',
      'oneToMany',
      'api::self-assesment-answer.self-assesment-answer'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCalendarEventCalendarEvent extends Schema.CollectionType {
  collectionName: 'calendar_events';
  info: {
    singularName: 'calendar-event';
    pluralName: 'calendar-events';
    displayName: 'Calendar Event';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    date: Attribute.DateTime;
    users: Attribute.Relation<
      'api::calendar-event.calendar-event',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::calendar-event.calendar-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::calendar-event.calendar-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCourseCourse extends Schema.CollectionType {
  collectionName: 'courses';
  info: {
    singularName: 'course';
    pluralName: 'courses';
    displayName: 'Course';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 150;
      }>;
    description: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 300;
      }>;
    cover: Attribute.Media;
    start_date: Attribute.Date & Attribute.Required;
    end_date: Attribute.Date & Attribute.Required;
    students: Attribute.Relation<
      'api::course.course',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    sections: Attribute.Relation<
      'api::course.course',
      'oneToMany',
      'api::section.section'
    >;
    professor: Attribute.Relation<
      'api::course.course',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    tags: Attribute.JSON;
    forums: Attribute.Relation<
      'api::course.course',
      'oneToMany',
      'api::forum.forum'
    >;
    evaluators: Attribute.Relation<
      'api::course.course',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    studentManaged: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::course.course',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::course.course',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiForumForum extends Schema.CollectionType {
  collectionName: 'forums';
  info: {
    singularName: 'forum';
    pluralName: 'forums';
    displayName: 'Forum';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    course: Attribute.Relation<
      'api::forum.forum',
      'manyToOne',
      'api::course.course'
    >;
    posts: Attribute.Relation<
      'api::forum.forum',
      'manyToMany',
      'api::forum-post.forum-post'
    >;
    title: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::forum.forum',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::forum.forum',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiForumAnswerForumAnswer extends Schema.CollectionType {
  collectionName: 'forum_answers';
  info: {
    singularName: 'forum-answer';
    pluralName: 'forum-answers';
    displayName: 'Forum Answer';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Attribute.UID;
    autor: Attribute.Relation<
      'api::forum-answer.forum-answer',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    forum_posts: Attribute.Relation<
      'api::forum-answer.forum-answer',
      'manyToMany',
      'api::forum-post.forum-post'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::forum-answer.forum-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::forum-answer.forum-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiForumPostForumPost extends Schema.CollectionType {
  collectionName: 'forum_posts';
  info: {
    singularName: 'forum-post';
    pluralName: 'forum-posts';
    displayName: 'Forum Post';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 50;
      }>;
    autor: Attribute.Relation<
      'api::forum-post.forum-post',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    content: Attribute.RichText &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    forum_tags: Attribute.Relation<
      'api::forum-post.forum-post',
      'manyToMany',
      'api::forum-tag.forum-tag'
    >;
    forum_answers: Attribute.Relation<
      'api::forum-post.forum-post',
      'manyToMany',
      'api::forum-answer.forum-answer'
    >;
    forums: Attribute.Relation<
      'api::forum-post.forum-post',
      'manyToMany',
      'api::forum.forum'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::forum-post.forum-post',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::forum-post.forum-post',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiForumTagForumTag extends Schema.CollectionType {
  collectionName: 'forum_tags';
  info: {
    singularName: 'forum-tag';
    pluralName: 'forum-tags';
    displayName: 'Forum Tag';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 50;
      }>;
    forum_posts: Attribute.Relation<
      'api::forum-tag.forum-tag',
      'manyToMany',
      'api::forum-post.forum-post'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::forum-tag.forum-tag',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::forum-tag.forum-tag',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGroupGroup extends Schema.CollectionType {
  collectionName: 'groups';
  info: {
    singularName: 'group';
    pluralName: 'groups';
    displayName: 'Group';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    users: Attribute.Relation<
      'api::group.group',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    activity: Attribute.Relation<
      'api::group.group',
      'oneToOne',
      'api::activity.activity'
    >;
    qualifications: Attribute.Relation<
      'api::group.group',
      'oneToMany',
      'api::qualification.qualification'
    >;
    PeerReviewAnswers: Attribute.Relation<
      'api::group.group',
      'oneToMany',
      'api::peer-review-answer.peer-review-answer'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::group.group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::group.group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLogLog extends Schema.CollectionType {
  collectionName: 'logs';
  info: {
    singularName: 'log';
    pluralName: 'logs';
    displayName: 'Log';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    logins: Attribute.JSON;
    user: Attribute.Relation<
      'api::log.log',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::log.log', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::log.log', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiNotificationNotification extends Schema.CollectionType {
  collectionName: 'notifications';
  info: {
    singularName: 'notification';
    pluralName: 'notifications';
    displayName: 'Notification';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content: Attribute.Text;
    users: Attribute.Relation<
      'api::notification.notification',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    type: Attribute.String;
    link: Attribute.String;
    readJSON: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPeerReviewAnswerPeerReviewAnswer
  extends Schema.CollectionType {
  collectionName: 'peer_review_answers';
  info: {
    singularName: 'peer-review-answer';
    pluralName: 'peer-review-answers';
    displayName: 'PeerReviewAnswers';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    qualifications: Attribute.Relation<
      'api::peer-review-answer.peer-review-answer',
      'manyToMany',
      'api::qualification.qualification'
    >;
    Answers: Attribute.JSON;
    user: Attribute.Relation<
      'api::peer-review-answer.peer-review-answer',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    group: Attribute.Relation<
      'api::peer-review-answer.peer-review-answer',
      'manyToOne',
      'api::group.group'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::peer-review-answer.peer-review-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::peer-review-answer.peer-review-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQualificationQualification extends Schema.CollectionType {
  collectionName: 'qualifications';
  info: {
    singularName: 'qualification';
    pluralName: 'qualifications';
    displayName: 'qualification';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    activity: Attribute.Relation<
      'api::qualification.qualification',
      'manyToOne',
      'api::activity.activity'
    >;
    user: Attribute.Relation<
      'api::qualification.qualification',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    comments: Attribute.Text;
    evaluator: Attribute.Relation<
      'api::qualification.qualification',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    qualification: Attribute.Decimal;
    file: Attribute.Media;
    delivered: Attribute.Boolean;
    delivered_data: Attribute.DateTime;
    peer_review_qualifications: Attribute.Relation<
      'api::qualification.qualification',
      'oneToMany',
      'api::qualification.qualification'
    >;
    group: Attribute.Relation<
      'api::qualification.qualification',
      'manyToOne',
      'api::group.group'
    >;
    PeerReviewAnswers: Attribute.Relation<
      'api::qualification.qualification',
      'manyToMany',
      'api::peer-review-answer.peer-review-answer'
    >;
    SelfAssesmentAnswers: Attribute.Relation<
      'api::qualification.qualification',
      'manyToMany',
      'api::self-assesment-answer.self-assesment-answer'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::qualification.qualification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::qualification.qualification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuestionnaireQuestionnaire extends Schema.CollectionType {
  collectionName: 'questionnaires';
  info: {
    singularName: 'questionnaire';
    pluralName: 'questionnaires';
    displayName: 'Questionnaire';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    Options: Attribute.JSON & Attribute.Required;
    description: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    user_response_questionnaires: Attribute.Relation<
      'api::questionnaire.questionnaire',
      'oneToMany',
      'api::user-response-questionnaire.user-response-questionnaire'
    >;
    subsection: Attribute.Relation<
      'api::questionnaire.questionnaire',
      'oneToOne',
      'api::subsection.subsection'
    >;
    type: Attribute.Enumeration<['scaling', 'standard']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::questionnaire.questionnaire',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::questionnaire.questionnaire',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSectionSection extends Schema.CollectionType {
  collectionName: 'sections';
  info: {
    singularName: 'section';
    pluralName: 'sections';
    displayName: 'Section';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    subsections: Attribute.Relation<
      'api::section.section',
      'oneToMany',
      'api::subsection.subsection'
    >;
    activity: Attribute.Relation<
      'api::section.section',
      'oneToOne',
      'api::activity.activity'
    >;
    course: Attribute.Relation<
      'api::section.section',
      'manyToOne',
      'api::course.course'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::section.section',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::section.section',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSelfAssesmentAnswerSelfAssesmentAnswer
  extends Schema.CollectionType {
  collectionName: 'self_assesment_answers';
  info: {
    singularName: 'self-assesment-answer';
    pluralName: 'self-assesment-answers';
    displayName: 'SelfAssesmentAnswers';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    qualifications: Attribute.Relation<
      'api::self-assesment-answer.self-assesment-answer',
      'manyToMany',
      'api::qualification.qualification'
    >;
    user: Attribute.Relation<
      'api::self-assesment-answer.self-assesment-answer',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    QuestionnaireAnswers: Attribute.JSON;
    activity: Attribute.Relation<
      'api::self-assesment-answer.self-assesment-answer',
      'manyToOne',
      'api::activity.activity'
    >;
    RubricAnswers: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::self-assesment-answer.self-assesment-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::self-assesment-answer.self-assesment-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubsectionSubsection extends Schema.CollectionType {
  collectionName: 'subsections';
  info: {
    singularName: 'subsection';
    pluralName: 'subsections';
    displayName: 'Subsection';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    fase: Attribute.String & Attribute.Required;
    finished: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    start_date: Attribute.DateTime;
    end_date: Attribute.DateTime;
    activity: Attribute.Relation<
      'api::subsection.subsection',
      'oneToOne',
      'api::activity.activity'
    >;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 150;
      }>;
    landscape_photo: Attribute.Media;
    questionnaire: Attribute.Relation<
      'api::subsection.subsection',
      'oneToOne',
      'api::questionnaire.questionnaire'
    >;
    users_who_completed: Attribute.Relation<
      'api::subsection.subsection',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    content: Attribute.RichText;
    files: Attribute.Media;
    section: Attribute.Relation<
      'api::subsection.subsection',
      'manyToOne',
      'api::section.section'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subsection.subsection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subsection.subsection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserObjectiveUserObjective extends Schema.CollectionType {
  collectionName: 'user_objectives';
  info: {
    singularName: 'user-objective';
    pluralName: 'user-objectives';
    displayName: 'User Objective';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    objective: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    user: Attribute.Relation<
      'api::user-objective.user-objective',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    completed: Attribute.Boolean & Attribute.DefaultTo<false>;
    categories: Attribute.JSON &
      Attribute.CustomField<
        'plugin::multi-select.multi-select',
        [
          'Ethical commitment',
          'Learning capability and responsibility',
          'Teamwork',
          'Creative and entrepreneurial capacity',
          'Sustainability',
          'Communicative ability'
        ]
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-objective.user-objective',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-objective.user-objective',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserResponseQuestionnaireUserResponseQuestionnaire
  extends Schema.CollectionType {
  collectionName: 'user_response_questionnaires';
  info: {
    singularName: 'user-response-questionnaire';
    pluralName: 'user-response-questionnaires';
    displayName: 'UserResponseQuestionnaire';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user: Attribute.Relation<
      'api::user-response-questionnaire.user-response-questionnaire',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    responses: Attribute.JSON;
    finished: Attribute.Boolean;
    timeToComplete: Attribute.Time;
    questionnaire: Attribute.Relation<
      'api::user-response-questionnaire.user-response-questionnaire',
      'manyToOne',
      'api::questionnaire.questionnaire'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-response-questionnaire.user-response-questionnaire',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-response-questionnaire.user-response-questionnaire',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::activity.activity': ApiActivityActivity;
      'api::calendar-event.calendar-event': ApiCalendarEventCalendarEvent;
      'api::course.course': ApiCourseCourse;
      'api::forum.forum': ApiForumForum;
      'api::forum-answer.forum-answer': ApiForumAnswerForumAnswer;
      'api::forum-post.forum-post': ApiForumPostForumPost;
      'api::forum-tag.forum-tag': ApiForumTagForumTag;
      'api::group.group': ApiGroupGroup;
      'api::log.log': ApiLogLog;
      'api::notification.notification': ApiNotificationNotification;
      'api::peer-review-answer.peer-review-answer': ApiPeerReviewAnswerPeerReviewAnswer;
      'api::qualification.qualification': ApiQualificationQualification;
      'api::questionnaire.questionnaire': ApiQuestionnaireQuestionnaire;
      'api::section.section': ApiSectionSection;
      'api::self-assesment-answer.self-assesment-answer': ApiSelfAssesmentAnswerSelfAssesmentAnswer;
      'api::subsection.subsection': ApiSubsectionSubsection;
      'api::user-objective.user-objective': ApiUserObjectiveUserObjective;
      'api::user-response-questionnaire.user-response-questionnaire': ApiUserResponseQuestionnaireUserResponseQuestionnaire;
    }
  }
}
