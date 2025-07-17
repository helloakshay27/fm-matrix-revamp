import React from 'react';
import { GroupsPageTemplate } from '@/components/GroupsPageTemplate';

export const ChecklistGroupsPage = () => {
  return (
    <GroupsPageTemplate
      title="CHECKLIST GROUPS"
      breadcrumb="Setup > Checklist Groups"
      apiEndpoint="/pms/asset_groups.json"
      subGroupApiEndpoint="/pms/checklist_sub_groups.json"
      groupType="checklist"
    />
  );
};