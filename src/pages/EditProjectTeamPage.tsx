import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
}

interface ProjectTeam {
  id: number;
  teamName: string;
  teamLead: string;
  teamMembers: string[];
  totalMembers: number;
  created_on: string;
  created_by: string;
}

export const EditProjectTeamPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [availableMembers, setAvailableMembers] = useState<TeamMember[]>([]);
  const [originalTeam, setOriginalTeam] = useState<ProjectTeam | null>(null);
  
  const [formData, setFormData] = useState({
    teamName: '',
    teamLead: '',
    teamMembers: [] as string[]
  });

  // Field styles for Material-UI components (matching AddInternalUserPage)
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

  // Load available team members and existing team data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsDataLoading(true);
        
        // Mock data for demonstration - replace with actual API calls
        const mockMembers: TeamMember[] = [
          { id: 1, name: 'John Doe', role: 'Senior Developer', department: 'Engineering' },
          { id: 2, name: 'Jane Smith', role: 'Tech Lead', department: 'Engineering' },
          { id: 3, name: 'Sarah Wilson', role: 'Frontend Developer', department: 'Engineering' },
          { id: 4, name: 'Mike Johnson', role: 'Backend Developer', department: 'Engineering' },
          { id: 5, name: 'Lisa Davis', role: 'UI/UX Designer', department: 'Design' },
          { id: 6, name: 'David Brown', role: 'DevOps Engineer', department: 'Operations' },
          { id: 7, name: 'Alex Chen', role: 'Full Stack Developer', department: 'Engineering' },
          { id: 8, name: 'Maria Rodriguez', role: 'QA Engineer', department: 'Quality Assurance' },
          { id: 9, name: 'Robert Wilson', role: 'QA Lead', department: 'Quality Assurance' },
          { id: 10, name: 'Emma Johnson', role: 'Test Analyst', department: 'Quality Assurance' },
          { id: 11, name: 'Tom Anderson', role: 'Junior Developer', department: 'Engineering' },
          { id: 12, name: 'Sophie Williams', role: 'DevOps Lead', department: 'Operations' },
          { id: 13, name: 'David Thompson', role: 'System Administrator', department: 'Operations' }
        ];
        
        setAvailableMembers(mockMembers);

        // Load existing team data based on ID
        const mockTeamsData: ProjectTeam[] = [
          {
            id: 1,
            teamName: 'Frontend Development Team',
            teamLead: 'John Doe',
            teamMembers: ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Lisa Davis'],
            totalMembers: 4,
            created_on: '15/09/2025, 10:30 AM',
            created_by: 'Admin'
          },
          {
            id: 2,
            teamName: 'Backend Development Team',
            teamLead: 'Jane Smith',
            teamMembers: ['Jane Smith', 'David Brown', 'Alex Chen', 'Maria Rodriguez'],
            totalMembers: 4,
            created_on: '14/09/2025, 02:15 PM',
            created_by: 'Admin'
          },
          {
            id: 3,
            teamName: 'QA Testing Team',
            teamLead: 'Robert Wilson',
            teamMembers: ['Robert Wilson', 'Emma Johnson', 'Tom Anderson'],
            totalMembers: 3,
            created_on: '13/09/2025, 09:45 AM',
            created_by: 'Admin'
          },
          {
            id: 4,
            teamName: 'DevOps Team',
            teamLead: 'Sophie Williams',
            teamMembers: ['Sophie Williams', 'David Thompson'],
            totalMembers: 2,
            created_on: '12/09/2025, 03:20 PM',
            created_by: 'Admin'
          }
        ];

        const teamToEdit = mockTeamsData.find(team => team.id === parseInt(id || '0'));
        
        if (!teamToEdit) {
          toast({
            title: "Error",
            description: "Team not found",
            variant: "destructive"
          });
          navigate('/settings/manage-users/project-teams');
          return;
        }

        setOriginalTeam(teamToEdit);
        
        // Exclude team lead from team members for editing
        const membersWithoutLead = teamToEdit.teamMembers.filter(member => member !== teamToEdit.teamLead);
        
        setFormData({
          teamName: teamToEdit.teamName,
          teamLead: teamToEdit.teamLead,
          teamMembers: membersWithoutLead
        });

      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: "Error",
          description: "Failed to load team data",
          variant: "destructive"
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, toast, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTeamMemberToggle = (memberName: string) => {
    setFormData(prev => {
      const isSelected = prev.teamMembers.includes(memberName);
      let newTeamMembers;
      
      if (isSelected) {
        // Remove member
        newTeamMembers = prev.teamMembers.filter(name => name !== memberName);
      } else {
        // Add member
        newTeamMembers = [...prev.teamMembers, memberName];
      }

      return {
        ...prev,
        teamMembers: newTeamMembers
      };
    });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.teamName.trim()) {
      toast({
        title: "Validation Error",
        description: "Team Name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.teamLead) {
      toast({
        title: "Validation Error", 
        description: "Team Lead is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.teamMembers.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one Team Member is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Updating project team:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Auto-include team lead in team members if not already included
      const finalTeamMembers = formData.teamMembers.includes(formData.teamLead) 
        ? formData.teamMembers 
        : [formData.teamLead, ...formData.teamMembers];

      const updatedTeam = {
        ...originalTeam,
        teamName: formData.teamName.trim(),
        teamLead: formData.teamLead,
        teamMembers: finalTeamMembers,
        totalMembers: finalTeamMembers.length
      };

      console.log('Team updated:', updatedTeam);

      toast({
        title: "Success",
        description: "Project team updated successfully",
      });

      // Navigate back to project teams list
      navigate('/settings/manage-users/project-teams');
    } catch (error) {
      console.error('Failed to update project team:', error);
      toast({
        title: "Error",
        description: "Failed to update project team",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings/manage-users/project-teams');
  };

  // Filter available members excluding the selected team lead for team members selection
  const availableMembersForSelection = availableMembers.filter(member => 
    member.name !== formData.teamLead
  );

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center">
            <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
            <span className="text-lg">Loading team data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">EDIT PROJECT TEAM</h1>
      
      {/* Project Team Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Project Team Details
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Team Name */}
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

            {/* Team Lead */}
            <div>
              <FormControl fullWidth variant="outlined" required sx={fieldStyles}>
                <InputLabel>Team Lead</InputLabel>
                <MuiSelect
                  value={formData.teamLead}
                  onChange={(e) => handleInputChange('teamLead', e.target.value)}
                  label="Team Lead *"
                >
                  {availableMembers.map((member) => (
                    <MenuItem key={member.id} value={member.name}>
                      <div>
                        <div>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                          {member.role} - {member.department}
                        </div>
                      </div>
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            {/* Team Members */}
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
                        onClick={() => handleTeamMemberToggle(member.name)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.teamMembers.includes(member.name)}
                          onChange={() => handleTeamMemberToggle(member.name)}
                          className="h-4 w-4 text-[#C72030] focus:ring-[#C72030] border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member.role} - {member.department}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Selected Members Summary */}
              {formData.teamMembers.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Selected Members ({formData.teamMembers.length}):
                  </p>
                  <div className="text-sm text-gray-700">
                    {formData.teamMembers.join(', ')}
                  </div>
                </div>
              )}

              {/* Total Team Size Preview */}
              {(formData.teamLead || formData.teamMembers.length > 0) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Total Team Size:</strong> {
                      (formData.teamLead ? 1 : 0) + formData.teamMembers.length
                    } members
                    {formData.teamLead && (
                      <span className="ml-2">
                        (Team Lead: {formData.teamLead}
                        {formData.teamMembers.length > 0 && ` + ${formData.teamMembers.length} members`})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
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