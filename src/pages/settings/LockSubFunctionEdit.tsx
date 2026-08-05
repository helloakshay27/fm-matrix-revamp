import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/** Legacy edit route — redirects to the list; editing opens as a popup there. */
export const LockSubFunctionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    navigate('/settings/account/lock-sub-function', {
      replace: true,
      state: id ? { editLockSubFunctionId: Number(id) } : undefined,
    });
  }, [navigate, id]);

  return null;
};
