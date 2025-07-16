import React from 'react';
import { GroupsPageTemplate } from '@/components/GroupsPageTemplate';

export const AssetGroupsPageNew = () => {
  return (
    <GroupsPageTemplate
      title="ASSET GROUPS"
      breadcrumb="Setup > Asset Groups"
      apiEndpoint="/pms/asset_groups.json"
      subGroupApiEndpoint="/pms/asset_sub_groups.json"
      groupType="asset"
    />
  );
};