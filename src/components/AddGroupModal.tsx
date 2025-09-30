import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { createUserGroup, updateUserGroup } from '@/store/slices/userGroupSlice';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchGroups: () => void;
  isEditing?: boolean
  record?: any
}

export const AddGroupModal = ({ isOpen, onClose, fetchGroups, isEditing, record }: AddGroupModalProps) => {
  const dispatch = useAppDispatch()

  const baseUrl = localStorage.getItem("baseUrl")
  const token = localStorage.getItem("token")

  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(fetchFMUsers()).unwrap();
        setMembers(response.users);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users")
      }
    }

    fetchUsers();
  }, [])

  useEffect(() => {
    if (isEditing && record) {
      setGroupName(record.groupName)
      setSelectedMembers(record.membersList.filter(m => m.active).map(m => m.user_id))
    }
  }, [isEditing, record])

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers([...members]);
    }
    setSelectAll(!selectAll);
  };

  const handleMemberToggle = (member: string) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter(m => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setSelectedMembers([]);
    setSelectAll(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (isEditing) {
      setLoading(true)
      try {
        const payload = {
          pms_usergroups: {
            user_id: localStorage.getItem("userId"),
            name: groupName,
            company_id: localStorage.getItem("selectedCompanyId"),
            swusersoc: selectedMembers
          }
        }

        await dispatch(updateUserGroup({ baseUrl, token, data: payload, id: record.id })).unwrap()

        toast.success("Group updated successfully")
        handleClose();
        fetchGroups();
      } catch (error) {
        console.log(error)
        toast.error(error)
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(true)
      try {
        const payload = {
          pms_usergroups: {
            user_id: localStorage.getItem("userId"),
            name: groupName,
            active: true,
            company_id: localStorage.getItem("selectedCompanyId"),
            swusersoc: selectedMembers
          }
        }

        await dispatch(createUserGroup({ baseUrl, token, data: payload })).unwrap()

        toast.success("Group created successfully")
        handleClose();
        fetchGroups();
      } catch (error) {
        console.log(error)
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">{isEditing ? "Edit Group" : "Add Group"}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium text-gray-700">
              Enter Group Name
            </Label>
            <Input
              id="groupName"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Add Members</Label>
            </div>

            <Button
              onClick={handleSelectAll}
              className="bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-2"
            >
              Select All Members
            </Button>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-2">
                  <Checkbox
                    id={member.id}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => handleMemberToggle(member.id)}
                  />
                  <Label
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {member.full_name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
