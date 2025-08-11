
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserGroupId } from '@/store/slices/userGroupSlice';

const CRMGroupDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [groupDetails, setGroupDetails] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchUserGroupId({ baseUrl, token, id: Number(id) })).unwrap();
        setGroupDetails(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  // Mock data - in real app, this would come from API based on id
  const groupData = {
    id: id,
    name: 'Ghanshyam1234',
    totalMembers: 3,
    image: '/placeholder-avatar.png'
  };

  const members = [
    { id: '1', name: 'Rohit Jain', code: 'B - 1505' },
    { id: '2', name: 'Anurag Demo', code: 'D - 1701' },
    { id: '3', name: 'Sandeep Biswas', code: 'A - 3011' }
  ];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(groupDetails.group_members.map(m => m.user_id));
    }
    setSelectAll(!selectAll);
  };

  const handleMemberToggle = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleRemoveMembers = () => {
    console.log('Removing members:', selectedMembers);
    setSelectedMembers([]);
    setSelectAll(false);
  };

  const handleAddMembers = () => {
    console.log('Adding new members to group');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Group Detail</h1>
      </div>

      {/* Group Info */}
      <div className="flex flex-col items-center py-8">
        <div className="w-32 h-32 rounded-full bg-orange-200 flex items-center justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-orange-400 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center">
              <span className="text-white text-2xl">👤</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{groupDetails.name}</h2>
        <p className="text-red-600 font-medium">Total Members - {groupDetails?.group_members && groupDetails.group_members.length}</p>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Members List</h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Select All Members
            </Button>
            <Button
              variant="outline"
              onClick={handleRemoveMembers}
              disabled={selectedMembers.length === 0}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Remove
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {groupDetails?.group_members && groupDetails.group_members.map((member) => (
            <div key={member.id} className="flex items-center space-x-3 p-3 border-b border-gray-100">
              <Checkbox
                checked={selectedMembers.includes(member.user_id)}
                onCheckedChange={() => handleMemberToggle(member.user_id)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <span className="flex-1 text-gray-700">
                {member.user_name}
              </span>
            </div>
          ))}
        </div>

        {/* Add Members Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={handleAddMembers}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-transparent hover:bg-blue-50 border-none shadow-none"
          >
            <Plus className="w-4 h-4" />
            Add Members
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CRMGroupDetailsPage;
