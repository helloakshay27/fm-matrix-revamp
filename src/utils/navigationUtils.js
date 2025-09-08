import { useLocation } from "react-router-dom";

// Utility function to generate navigation paths based on current route
export const getNavigationPath = (basePath, isCloudRoute = null) => {
  const currentPath = isCloudRoute !== null 
    ? isCloudRoute 
    : window.location.pathname.startsWith('/cloud-');
  
  return currentPath ? `/cloud-${basePath}` : `/${basePath}`;
};

// Hook to determine if current route is a cloud route
export const useIsCloudRoute = () => {
  const location = useLocation();
  return location.pathname.startsWith('/cloud-');
};

// Generate task navigation paths
export const getTaskPaths = (projectId, milestoneId, taskId, isCloudRoute = null) => {
  const isCloud = isCloudRoute !== null 
    ? isCloudRoute 
    : window.location.pathname.startsWith('/cloud-');
  
  const basePrefix = isCloud ? '/cloud-projects' : '/projects';
  
  return {
    project: `${basePrefix}/${projectId}`,
    milestone: `${basePrefix}/${projectId}/milestones`,
    tasks: `${basePrefix}/${projectId}/milestones/${milestoneId}/tasks`,
    taskDetail: `${basePrefix}/${projectId}/milestones/${milestoneId}/tasks/${taskId}`,
    taskDetailSimple: isCloud ? `/cloud-tasks/${taskId}` : `/tasks/${taskId}`
  };
};

// Generate project navigation paths
export const getProjectPaths = (projectId, isCloudRoute = null) => {
  const isCloud = isCloudRoute !== null 
    ? isCloudRoute 
    : window.location.pathname.startsWith('/cloud-');
  
  const basePrefix = isCloud ? '/cloud-projects' : '/projects';
  
  return {
    project: `${basePrefix}/${projectId}`,
    milestones: `${basePrefix}/${projectId}/milestones`
  };
};

// Generate MoM navigation paths
export const getMoMPaths = (momId, isCloudRoute = null) => {
  const isCloud = isCloudRoute !== null 
    ? isCloudRoute 
    : window.location.pathname.startsWith('/cloud-');
  
  return {
    mom: isCloud ? `/cloud-mom/${momId}` : `/mom/${momId}`,
    newMom: isCloud ? `/cloud-mom/new-mom` : `/new-mom`
  };
};
