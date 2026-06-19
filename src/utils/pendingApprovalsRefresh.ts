const EVENT_NAME = 'pending-approvals-updated';

export const refreshPendingApprovalsCount = () => {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export const onPendingApprovalsRefresh = (handler: () => void) => {
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};
