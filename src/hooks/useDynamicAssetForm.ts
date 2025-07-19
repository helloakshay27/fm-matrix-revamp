import { useState } from 'react';
import { assetFieldsConfig } from '@/config/assetFieldsConfig';

interface ExtraField {
  field_name: string;
  field_value: string;
  group_name: string;
  category_name: string;
  field_type: string;
}

interface FormState {
  [key: string]: string;
}

export const useDynamicAssetForm = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [extraFieldsData, setExtraFieldsData] = useState<FormState>({});
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Initialize expanded sections when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setExtraFieldsData({});
    
    // Set all sections as expanded by default for the new category
    if (assetFieldsConfig[category]) {
      const initialExpanded: { [key: string]: boolean } = {};
      assetFieldsConfig[category].forEach((section, index) => {
        initialExpanded[`${category}-${index}`] = true;
      });
      setExpandedSections(initialExpanded);
    }
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setExtraFieldsData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const generateExtraFieldsAttributes = (): ExtraField[] => {
    if (!selectedCategory || !assetFieldsConfig[selectedCategory]) {
      return [];
    }

    const extraFields: ExtraField[] = [];
    
    assetFieldsConfig[selectedCategory].forEach(section => {
      section.fields.forEach(field => {
        const fieldValue = extraFieldsData[field.name] || '';
        if (fieldValue) {
          extraFields.push({
            field_name: field.name,
            field_value: fieldValue,
            group_name: section.title,
            category_name: selectedCategory,
            field_type: field.type
          });
        }
      });
    });

    return extraFields;
  };

  const getCategoryConfig = () => {
    return selectedCategory && assetFieldsConfig[selectedCategory] 
      ? assetFieldsConfig[selectedCategory] 
      : [];
  };

  const hasCustomFields = () => {
    return selectedCategory && assetFieldsConfig[selectedCategory];
  };

  return {
    selectedCategory,
    extraFieldsData,
    expandedSections,
    handleCategoryChange,
    toggleSection,
    handleFieldChange,
    generateExtraFieldsAttributes,
    getCategoryConfig,
    hasCustomFields
  };
};