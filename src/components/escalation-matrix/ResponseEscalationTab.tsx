import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { X, Plus, Loader2, Edit, Trash2, Filter, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import { AppDispatch, RootState } from '@/store/store'
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice'
import { createResponseEscalation, clearState, fetchResponseEscalations, updateResponseEscalation, deleteResponseEscalation } from '@/store/slices/responseEscalationSlice'
import { ResponseEscalationApiFormData, FMUserDropdown, EscalationMatrixPayload, ResponseEscalationGetResponse, UpdateResponseEscalationPayload } from '@/types/escalationMatrix'
import { ticketManagementAPI, UserAccountResponse } from '@/services/ticketManagementAPI'
import { API_CONFIG } from '@/config/apiConfig'
import { toast } from 'sonner'
import ReactSelect from 'react-select'

// Schema for form validation
const responseEscalationSchema = z.object({
  categoryIds: z.array(z.number()).min(1, 'At least one category must be selected').max(15, 'Maximum 15 categories allowed'),
  escalationLevels: z.object({
    e1: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
    e2: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
    e3: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
    e4: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
    e5: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
  }),
})

type ResponseEscalationFormData = z.infer<typeof responseEscalationSchema>

export const ResponseEscalationTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Local state
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedUsers, setSelectedUsers] = useState<{
    e1: number[]
    e2: number[]
    e3: number[]
    e4: number[]
    e5: number[]
  }>({
    e1: [],
    e2: [],
    e3: [],
    e4: [],
    e5: [],
  })
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  const [expandedRules, setExpandedRules] = useState<Set<number>>(new Set())
  const [editingRule, setEditingRule] = useState<ResponseEscalationGetResponse | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userAccount, setUserAccount] = useState<UserAccountResponse | null>(null)
  const [escalationUsers, setEscalationUsers] = useState<{ id: number; full_name: string }[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Redux selectors
  const { data: categoriesData, loading: categoriesLoading } = useSelector((state: RootState) => state.helpdeskCategories)
  const { loading: submissionLoading, success, error, data: escalationRules, fetchLoading, updateLoading, deleteLoading } = useSelector((state: RootState) => state.responseEscalation)

  // Form setup
  const form = useForm<ResponseEscalationFormData>({
    resolver: zodResolver(responseEscalationSchema),
    defaultValues: {
      categoryIds: [],
      escalationLevels: {
        e1: [],
        e2: [],
        e3: [],
        e4: [],
        e5: [],
      },
    },
  })


  // Options for react-select
  const categoryOptions = categoriesData?.helpdesk_categories?.map(cat => ({ value: cat.id, label: cat.name })) || []
  const userOptions = escalationUsers?.map(user => ({ value: user.id, label: user.full_name })) || []

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchHelpdeskCategories())
    dispatch(fetchResponseEscalations())
    loadUserAccount()
    loadEscalationUsers()
  }, [dispatch])

  // Load user account to get site_id
  const loadUserAccount = async () => {
    try {
      const account = await ticketManagementAPI.getUserAccount()
      setUserAccount(account)
      console.log('User account loaded:', account)
    } catch (error) {
      console.error('Error loading user account:', error)
      toast.error('Failed to load user account!')
    }
  }

  // Load escalation users
  const loadEscalationUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await ticketManagementAPI.getEscalationUsers()
      setEscalationUsers(response.users || [])
      console.log('Escalation users loaded:', response.users)
    } catch (error) {
      console.error('Error loading escalation users:', error)
      toast.error('Failed to load escalation users!')
    } finally {
      setLoadingUsers(false)
    }
  }

  // Handle success/error states
  useEffect(() => {
    if (success) {
      toast.success('Response escalation rule created successfully!')
      // Reset form
      form.reset()
      setSelectedCategories([])
      setSelectedUsers({ e1: [], e2: [], e3: [], e4: [], e5: [] })
      dispatch(fetchResponseEscalations())
      dispatch(clearState())
    }
    if (error) {
      // Ensure error is a string for toast display
      const errorMessage = typeof error === 'string' ? error : 'An error occurred while processing your request';
      toast.error(errorMessage + '!');
      dispatch(clearState());
    }
  }, [success, error, form, dispatch])

  // Helper functions
  const getCategoryName = (id: number) => {
    return categoriesData?.helpdesk_categories?.find(cat => cat.id === id)?.name || 'Unknown Category'
  }

  const getUserName = (id: number) => {
    return escalationUsers.find(user => user.id === id)?.full_name || 'Unknown User'
  }

  const getUserNames = (userIds: string | number[] | null): string => {
    if (!userIds) return ''

    let ids: number[] = []
    if (typeof userIds === 'string') {
      try {
        ids = JSON.parse(userIds)
      } catch {
        return ''
      }
    } else {
      ids = userIds
    }

    if (!Array.isArray(ids) || ids.length === 0) return ''

    return ids.map(id => {
      const user = escalationUsers.find(u => u.id === id)
      return user ? user.full_name : `User ${id}`
    }).join(', ')
  }

  const availableCategories = categoriesData?.helpdesk_categories?.filter(
    cat => !selectedCategories.includes(cat.id)
  ) || []

  const getAvailableUsers = (level: keyof typeof selectedUsers) => {
    return escalationUsers.filter(user => !selectedUsers[level].includes(user.id))
  }

  // Category selection handlers
  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategories.length >= 15) {
      toast.error('Maximum 15 categories allowed!')
      return
    }

    const newCategories = [...selectedCategories, categoryId]
    setSelectedCategories(newCategories)
    form.setValue('categoryIds', newCategories)
  }

  const handleCategoryRemove = (categoryId: number) => {
    const newCategories = selectedCategories.filter(id => id !== categoryId)
    setSelectedCategories(newCategories)
    form.setValue('categoryIds', newCategories)
  }

  // User selection handlers
  const handleUserSelect = (level: keyof typeof selectedUsers, userId: number) => {
    if (selectedUsers[level].length >= 15) {
      toast.error('Maximum 15 users allowed per escalation level!')
      return
    }

    const newUsers = { ...selectedUsers, [level]: [...selectedUsers[level], userId] }
    setSelectedUsers(newUsers)
    form.setValue('escalationLevels', newUsers)
  }

  const handleUserRemove = (level: keyof typeof selectedUsers, userId: number) => {
    const newUsers = { ...selectedUsers, [level]: selectedUsers[level].filter(id => id !== userId) }
    setSelectedUsers(newUsers)
    form.setValue('escalationLevels', newUsers)
  }

  // Toggle rule expansion
  const toggleRuleExpansion = (ruleId: number) => {
    const newExpanded = new Set(expandedRules)
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId)
    } else {
      newExpanded.add(ruleId)
    }
    setExpandedRules(newExpanded)
  }

  // Filter rules based on category
  const filteredRules = selectedCategoryFilter === 'all'
    ? escalationRules
    : escalationRules.filter(rule => {
        const categoryName = getCategoryName(rule.category_id)
        return categoryName.toLowerCase().includes(selectedCategoryFilter.toLowerCase())
      })

  // Handle edit rule
  const handleEditRule = (rule: ResponseEscalationGetResponse) => {
    setEditingRule(rule)

    // Pre-populate form with existing data
    const formData = {
      categoryIds: [rule.category_id],
      escalationLevels: {
        e1: rule.escalations.find(e => e.name === 'E1')?.escalate_to_users ? 
            (typeof rule.escalations.find(e => e.name === 'E1')?.escalate_to_users === 'string' ?
             JSON.parse(rule.escalations.find(e => e.name === 'E1')?.escalate_to_users as string) :
             rule.escalations.find(e => e.name === 'E1')?.escalate_to_users) || [] : [],
        e2: rule.escalations.find(e => e.name === 'E2')?.escalate_to_users ?
            (typeof rule.escalations.find(e => e.name === 'E2')?.escalate_to_users === 'string' ?
             JSON.parse(rule.escalations.find(e => e.name === 'E2')?.escalate_to_users as string) :
             rule.escalations.find(e => e.name === 'E2')?.escalate_to_users) || [] : [],
        e3: rule.escalations.find(e => e.name === 'E3')?.escalate_to_users ?
            (typeof rule.escalations.find(e => e.name === 'E3')?.escalate_to_users === 'string' ?
             JSON.parse(rule.escalations.find(e => e.name === 'E3')?.escalate_to_users as string) :
             rule.escalations.find(e => e.name === 'E3')?.escalate_to_users) || [] : [],
        e4: rule.escalations.find(e => e.name === 'E4')?.escalate_to_users ?
            (typeof rule.escalations.find(e => e.name === 'E4')?.escalate_to_users === 'string' ?
             JSON.parse(rule.escalations.find(e => e.name === 'E4')?.escalate_to_users as string) :
             rule.escalations.find(e => e.name === 'E4')?.escalate_to_users) || [] : [],
        e5: rule.escalations.find(e => e.name === 'E5')?.escalate_to_users ?
            (typeof rule.escalations.find(e => e.name === 'E5')?.escalate_to_users === 'string' ?
             JSON.parse(rule.escalations.find(e => e.name === 'E5')?.escalate_to_users as string) :
             rule.escalations.find(e => e.name === 'E5')?.escalate_to_users) || [] : [],
      }
    }

    form.reset(formData)
    setSelectedCategories([rule.category_id])
    setSelectedUsers(formData.escalationLevels)
    setIsEditDialogOpen(true)
  }

  // Handle update rule
  const handleUpdateRule = async (data: ResponseEscalationFormData) => {
    if (!editingRule) return

    try {
      const payload: UpdateResponseEscalationPayload = {
        id: editingRule.id,
        complaint_worker: {
          category_id: data.categoryIds[0],
        },
        escalation_matrix: {
          e1: { name: 'E1', escalate_to_users: data.escalationLevels.e1 },
          e2: { name: 'E2', escalate_to_users: data.escalationLevels.e2 },
          e3: { name: 'E3', escalate_to_users: data.escalationLevels.e3 },
          e4: { name: 'E4', escalate_to_users: data.escalationLevels.e4 },
          e5: { name: 'E5', escalate_to_users: data.escalationLevels.e5 },
        },
      }

      await dispatch(updateResponseEscalation(payload)).unwrap()
      toast.success('Response escalation rule updated successfully!')
      
      setIsEditDialogOpen(false)
      setEditingRule(null)
      dispatch(fetchResponseEscalations())
      dispatch(clearState())
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update response escalation rule'
      toast.error(errorMessage + '!')
    }
  }

  // Handle delete rule
  const handleDeleteRule = async (ruleId: number) => {
    try {
      await dispatch(deleteResponseEscalation(ruleId)).unwrap()
      toast.success('Response escalation rule deleted successfully!')
      dispatch(clearState())
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete response escalation rule'
      toast.error(errorMessage + '!')
    }
  }

  // Form submission
  const onSubmit = async (data: ResponseEscalationFormData) => {
    try {
      // Validate form data
      if (!data.categoryIds || data.categoryIds.length === 0) {
        toast.error('Please select at least one category!');
        return;
      }

      // Check if at least one escalation level has users
      const hasUsers = Object.values(data.escalationLevels).some(users => users.length > 0);
      if (!hasUsers) {
        toast.error('Please assign users to at least one escalation level!');
        return;
      }

      // Ensure user account is loaded to get site_id
      if (!userAccount?.site_id) {
        toast.error('Unable to determine site ID from user account. Please refresh and try again!')
        return
      }

      // Get site_id from user account API response
      const siteId = userAccount.site_id

      // Transform form data to API payload
      const payload: EscalationMatrixPayload = {
        complaint_worker: {
          society_id: siteId,
          esc_type: 'response',
          of_phase: 'pms',
          of_atype: 'Pms::Site',
        },
        category_ids: data.categoryIds,
        escalation_matrix: {
          e1: { name: 'E1', escalate_to_users: data.escalationLevels.e1 },
          e2: { name: 'E2', escalate_to_users: data.escalationLevels.e2 },
          e3: { name: 'E3', escalate_to_users: data.escalationLevels.e3 },
          e4: { name: 'E4', escalate_to_users: data.escalationLevels.e4 },
          e5: { name: 'E5', escalate_to_users: data.escalationLevels.e5 },
        },
      }

      console.log('Response escalation payload:', JSON.stringify(payload, null, 2));
      console.log('Using site ID from user account:', siteId);
      
      await dispatch(createResponseEscalation(payload)).unwrap()
    } catch (error: unknown) {
      // Handle 422 error specifically for category already taken
      console.log('Full error object:', error);
      console.log('Error type:', typeof error);
      console.log('Error stringified:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to create response escalation rule. Please try again.';
      let shouldShowCategoryTakenMessage = false;
      
      try {
        // Try to extract error information from different possible structures
        if (typeof error === 'string') {
          errorMessage = error;
          // Check if string contains 422 or conflict indicators
          shouldShowCategoryTakenMessage = error.includes('422') || 
                                         error.toLowerCase().includes('already') ||
                                         error.toLowerCase().includes('exists') ||
                                         error.toLowerCase().includes('taken') ||
                                         error.toLowerCase().includes('conflict');
        } else if (error && typeof error === 'object') {
          const errorObj = error as {
            status?: number;
            code?: number;
            message?: string;
            error?: string;
            category_id?: string[];
            response?: {
              status?: number;
              data?: {
                message?: string;
                category_id?: string[];
              };
            };
            data?: {
              message?: string;
              category_id?: string[];
            };
          };
          
          // Check for 422 status first
          const statusIs422 = errorObj.status === 422 || 
                             errorObj?.response?.status === 422 ||
                             errorObj?.code === 422;
          
          // Check for specific category_id error format: {category_id: ["has already been taken"]}
          const hasCategoryIdError = errorObj?.category_id || 
                                    errorObj?.response?.data?.category_id || 
                                    errorObj?.data?.category_id;
          
          if (hasCategoryIdError && Array.isArray(hasCategoryIdError) && hasCategoryIdError.length > 0) {
            // Extract the actual error message from category_id array
            const categoryError = hasCategoryIdError[0];
            if (typeof categoryError === 'string' && categoryError.toLowerCase().includes('already been taken')) {
              shouldShowCategoryTakenMessage = true;
            }
          }
          
          // Fallback checks for other error message formats
          const messageContains422 = (errorObj?.message && errorObj.message.includes('422')) ||
                                    (errorObj?.response?.data?.message && errorObj.response.data.message.includes('422')) ||
                                    (errorObj?.data?.message && errorObj.data.message.includes('422'));
                                    
          const hasConflictMessage = (errorObj?.message && errorObj.message.toLowerCase().includes('already')) ||
                                   (errorObj?.message && errorObj.message.toLowerCase().includes('exists')) ||
                                   (errorObj?.message && errorObj.message.toLowerCase().includes('taken')) ||
                                   (errorObj?.message && errorObj.message.toLowerCase().includes('conflict')) ||
                                   (errorObj?.response?.data?.message && errorObj.response.data.message.toLowerCase().includes('already')) ||
                                   (errorObj?.response?.data?.message && errorObj.response.data.message.toLowerCase().includes('exists')) ||
                                   (errorObj?.response?.data?.message && errorObj.response.data.message.toLowerCase().includes('taken')) ||
                                   (errorObj?.response?.data?.message && errorObj.response.data.message.toLowerCase().includes('conflict')) ||
                                   (errorObj?.data?.message && errorObj.data.message.toLowerCase().includes('already')) ||
                                   (errorObj?.data?.message && errorObj.data.message.toLowerCase().includes('exists')) ||
                                   (errorObj?.data?.message && errorObj.data.message.toLowerCase().includes('taken')) ||
                                   (errorObj?.data?.message && errorObj.data.message.toLowerCase().includes('conflict'));
          
          // Set flag if any condition matches
          shouldShowCategoryTakenMessage = shouldShowCategoryTakenMessage || statusIs422 || messageContains422 || hasConflictMessage;
          
          // Extract error message from various possible locations
          errorMessage = errorObj?.message || 
                        errorObj?.response?.data?.message || 
                        errorObj?.data?.message || 
                        errorObj?.error || 
                        'Failed to create response escalation rule. Please try again.';
        }
      } catch (parseError) {
        console.error('Error parsing error object:', parseError);
        // Use default error message if parsing fails
      }
      
      if (shouldShowCategoryTakenMessage) {
        toast.error('Category name already exists. Please choose a different name!');
      } else {
        // Ensure error message is a string
        const finalErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Failed to create response escalation rule. Please try again.';
        toast.error(finalErrorMessage + '!');
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Escalation Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection Dropdown */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Category Type</Label>
              <ReactSelect
                isMulti
                options={categoryOptions}
                onChange={(selected) => {
                  const newCategories = selected ? selected.map(s => s.value) : [];
                  setSelectedCategories(newCategories);
                  form.setValue('categoryIds', newCategories);
                }}
                value={categoryOptions.filter(option => selectedCategories.includes(option.value))}
                className="mt-1"
                placeholder="Select up to 15 categories..."
                isLoading={categoriesLoading}
                isDisabled={categoriesLoading}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '40px',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'none',
                    '&:hover': {
                      border: '1px solid #cbd5e1'
                    }
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#f1f5f9'
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#334155'
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#64748b',
                    '&:hover': {
                      backgroundColor: '#e2e8f0',
                      color: '#475569'
                    }
                  })
                }}
              />

              {form.formState.errors.categoryIds && (
                <p className="text-sm text-destructive">{form.formState.errors.categoryIds.message}</p>
              )}
            </div>

            {/* Escalation Matrix Table */}
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Levels</TableHead>
                      <TableHead className="font-semibold">Escalation To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(['e1', 'e2', 'e3', 'e4', 'e5'] as const).map((level) => (
                      <TableRow key={level}>
                        <TableCell className="font-medium">
                          {level.toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <ReactSelect
                            isMulti
                            options={userOptions}
                            onChange={(selected) => {
                              const newUsers = selected ? selected.map(s => s.value) : [];
                              const updatedUsers = { ...selectedUsers, [level]: newUsers };
                              setSelectedUsers(updatedUsers);
                              form.setValue('escalationLevels', updatedUsers);
                            }}
                            value={userOptions.filter(option => selectedUsers[level].includes(option.value))}
                            placeholder="Select up to 15 users..."
                            isLoading={loadingUsers}
                            isDisabled={loadingUsers}
                            className="min-w-[250px]"
                            styles={{
                              control: (base) => ({
                                ...base,
                                minHeight: '32px',
                                fontSize: '14px',
                                border: 'none',
                                boxShadow: 'none'
                              }),
                              multiValue: (base) => ({
                                ...base,
                                fontSize: '12px'
                              })
                            }}
                          />

                          {form.formState.errors.escalationLevels?.[level] && (
                            <p className="text-xs text-destructive">{form.formState.errors.escalationLevels[level]?.message}</p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="bg-[#C72030] hover:bg-[#A61B29] text-white border-none font-semibold px-8 py-2" 
            disabled={submissionLoading || categoriesLoading || loadingUsers}
          >
            {submissionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Rule...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>

      {/* Rules List Section */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Filter</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                  Category Type
                </Label>
                <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                  <SelectTrigger className="w-48 border-gray-200 focus:border-[#C72030] focus:ring-[#C72030]">
                    <SelectValue placeholder="Select Category Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesData?.helpdesk_categories?.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="default"
                size="sm" 
                className="bg-[#C72030] hover:bg-[#A61B29] text-white border-none font-semibold px-4"
                onClick={() => setSelectedCategoryFilter('all')}
              >
                Apply
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-4"
                onClick={() => setSelectedCategoryFilter('all')}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {fetchLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#C72030]" />
              <span className="ml-2 text-gray-600">Loading escalation rules...</span>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No escalation rules found.</p>
              <p className="text-sm mt-1">Create your first rule using the form above.</p>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {filteredRules.map((rule, index) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-900">Rule {index + 1}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-[#C72030] hover:bg-[#EDEAE3]"
                          disabled={updateLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                              disabled={deleteLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this response escalation rule for {getCategoryName(rule.category_id)}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteRule(rule.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                          <TableHead className="font-semibold text-gray-900 text-left py-3 px-4 w-1/3">Category Type</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-left py-3 px-4 w-1/6">Levels</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-left py-3 px-4">Escalation To</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-b border-gray-100 hover:bg-gray-50/50">
                          <TableCell className="py-4 px-4 align-top font-medium text-gray-900">
                            {getCategoryName(rule.category_id)}
                          </TableCell>
                          <TableCell className="py-4 px-4 align-top">
                            <div className="space-y-2">
                              {rule.escalations.map((escalation) => (
                                <div key={escalation.name} className="text-sm text-gray-700 font-medium">
                                  {escalation.name}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-4 align-top">
                            <div className="space-y-2">
                              {rule.escalations.map((escalation) => (
                                <div key={escalation.name} className="text-sm text-gray-700">
                                  {getUserNames(escalation.escalate_to_users)}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Response Escalation Rule</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleUpdateRule)} className="space-y-6">
            {/* Same form content as create form */}
            {/* Categories Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Category Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ReactSelect
                  options={categoryOptions}
                  value={categoryOptions.filter(option => selectedCategories.includes(option.value))}
                  onChange={(selected) => {
                    const newCategories = selected ? [selected.value] : [];
                    setSelectedCategories(newCategories);
                    form.setValue('categoryIds', newCategories);
                  }}
                  className="mt-1"
                  placeholder="Select category..."
                  isLoading={categoriesLoading}
                  isDisabled={categoriesLoading}
                />
              </CardContent>
            </Card>

            {/* Escalation Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Escalation Matrix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(['e1', 'e2', 'e3', 'e4', 'e5'] as const).map((level) => (
                  <div key={level} className="space-y-3">
                    <Label className="text-base font-semibold">
                      {level.toUpperCase()} - Escalation Level {level.slice(1)}
                    </Label>
                    
                    <ReactSelect
                      isMulti
                      options={userOptions}
                      value={userOptions.filter(option => selectedUsers[level].includes(option.value))}
                      onChange={(selected) => {
                        const newUsers = selected ? selected.map(s => s.value) : [];
                        const updatedUsers = { ...selectedUsers, [level]: newUsers };
                        setSelectedUsers(updatedUsers);
                        form.setValue('escalationLevels', updatedUsers);
                      }}
                      placeholder="Select up to 15 users..."
                      isLoading={loadingUsers}
                      isDisabled={loadingUsers}
                      className="min-w-[250px]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Rule'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}