import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { toast } from 'sonner';
import { fetchProjectTeamById, updateProjectTeam, removeMembersFromTeam } from '@/store/slices/projectTeamsSlice';

const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": { borderColor: "#ddd" },
    "&:hover fieldset": { borderColor: "#C72030" },
    "&.Mui-focused fieldset": { borderColor: "#C72030" },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": { color: "#C72030" },
    "& .MuiInputLabel-asterisk": {
      color: "#C72030 !important",
    },
  },
  "& .MuiFormLabel-asterisk": {
    color: "#C72030 !important",
  },
};

export const EditProjectTeamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    teamName: '',
    teamLead: '',
    teamMembers: [
      {
        record_id: '',
        user_id: ''
      }
    ]
  });

  const fetchUsers = async () => {
    try {
      const response = await dispatch(fetchFMUsers()).unwrap();
      setUsers(response.users);
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamDetails = async () => {
    try {
      const response = await dispatch(fetchProjectTeamById({ baseUrl, token, id })).unwrap();
      setFormData({
        teamName: response.name,
        teamLead: response.team_lead.id,
        teamMembers: response.project_team_members.map((member) => ({
          record_id: member.id,
          user_id: member.user.id
        })),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    getTeamDetails();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTeamMemberToggle = async (userId: string) => {
    setFormData(prev => {
      const member = prev.teamMembers.find(member => member.user_id === userId);
      const isSelected = !!member;
      let newTeamMembers;

      if (isSelected) {
        dispatch(removeMembersFromTeam({ baseUrl, token, id: member.record_id }))
          .unwrap()
          .then(() => {
            toast.success('Member removed successfully');
          })
          .catch((error) => {
            console.log(error);
            toast.error('Failed to remove member');
          });

        newTeamMembers = prev.teamMembers.filter(m => m.user_id !== userId);
      } else {
        newTeamMembers = [...prev.teamMembers, { record_id: '', user_id: userId }];
      }

      return {
        ...prev,
        teamMembers: newTeamMembers
      };
    });
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        project_team: {
          name: formData.teamName,
          team_lead_id: formData.teamLead,
          user_ids: formData.teamMembers.map((member) => member.user_id),
        },
      };

      await dispatch(updateProjectTeam({ baseUrl, token, data: payload, id })).unwrap();
      toast.success('Project Team updated successfully');
      navigate('/settings/manage-users/project-teams');
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const availableMembersForSelection = users.filter(member =>
    member.id !== formData.teamLead
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">EDIT PROJECT TEAM</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Project Team Details
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <TextField
                label="Team Name"
                placeholder="Enter Team Name"
                value={formData.teamName}
                onChange={(e) => handleInputChange('teamName', e.target.value)}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            <div>
              <FormControl fullWidth variant="outlined" required sx={fieldStyles}>
                <InputLabel>Team Lead</InputLabel>
                <MuiSelect
                  value={formData.teamLead}
                  onChange={(e) => handleInputChange('teamLead', e.target.value)}
                  label="Team Lead *"
                >
                  {users.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <div>
                        <div>{member.full_name}</div>
                      </div>
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Team Members* (excluding Team Lead)
              </label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto bg-white">
                {availableMembersForSelection.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {formData.teamLead ? 'No other members available' : 'Select a Team Lead first'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableMembersForSelection.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => handleTeamMemberToggle(member.id)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.teamMembers.some(m => m.user_id === member.id)}
                          onChange={() => handleTeamMemberToggle(member.id)}
                          className="h-4 w-4 text-[#C72030] focus:ring-[#C72030] border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {member.full_name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {formData.teamMembers.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Selected Members ({formData.teamMembers.length}):
                  </p>
                  <div className="text-sm text-gray-700">
                    {formData.teamMembers.map((member) => {
                      const user = users.find((user) => user.id === member.user_id);
                      return user ? user.full_name : '';
                    }).join(', ')}
                  </div>
                </div>
              )}

              {(formData.teamLead || formData.teamMembers.length > 0) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Total Team Size:</strong> {
                      (formData.teamLead ? 1 : 0) + formData.teamMembers.length
                    } members
                    {formData.teamLead && (
                      <span className="ml-2">
                        (Team Lead: {users.find((u) => u.id === formData.teamLead)?.full_name})
                        {formData.teamMembers.length > 0 && ` + ${formData.teamMembers.length} members`}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isSubmitting ? 'Updating...' : 'Update Team'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};