
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserGroupId } from '@/store/slices/userGroupSlice';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const CRMGroupDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [groupDetails, setGroupDetails] = useState({
    name: '',
    group_members: []
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await dispatch(fetchUserGroupId({ baseUrl, token, id: Number(id) })).unwrap();
        setGroupDetails(response)
      } catch (error) {
        console.log(error)
        toast.error(error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (

    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">GROUP DETAILS</h1>
        </div>
      </div>

      {loading && <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading attendance data...</div>
      </div>}

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        Error: {error}
      </div>}

      <div className="bg-white rounded-lg border mb-6 p-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center border-4 border-[#C72030]">
            <div className="w-24 h-24 rounded-full bg-[#C72030]/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#C72030]">
                {groupDetails.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {groupDetails.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Total Members - {groupDetails?.group_members && groupDetails.group_members.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6">
          {
            groupDetails?.group_members && groupDetails.group_members.filter(member => member.active).length > 0 ? (
              <div className="grid md:grid-cols-4">
                {groupDetails.group_members
                  .filter(member => member.active)
                  .map((member) => (
                    <div key={member.id} className="flex items-center text-center space-x-3 p-3">
                      <span className="flex-1 text-gray-700">
                        {member.user_name}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center text-gray-400">
                No members added
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default CRMGroupDetailsPage;
