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
import { fetchFMUsers } from '@/store/slices/fmUserSlice'
import { createResponseEscalation, clearState, fetchResponseEscalations, updateResponseEscalation, deleteResponseEscalation } from '@/store/slices/responseEscalationSlice'
import { ResponseEscalationApiFormData, FMUserDropdown, EscalationMatrixPayload, ResponseEscalationGetResponse, UpdateResponseEscalationPayload } from '@/types/escalationMatrix'
import { toast } from 'sonner'

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

  // Redux selectors
  const { data: categoriesData, loading: categoriesLoading } = useSelector((state: RootState) => state.helpdeskCategories)
  const { data: fmUsersData, loading: fmUsersLoading } = useSelector((state: RootState) => state.fmUsers)
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

  // Process FM Users data for display
  const fmUsers: FMUserDropdown[] = fmUsersData?.fm_users?.map(user => ({
    ...user,
    displayName: `${user.firstname} ${user.lastname}`,
  })) || []

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchHelpdeskCategories())
    dispatch(fetchFMUsers())
    dispatch(fetchResponseEscalations())
  }, [dispatch])

  // Handle success/error states
  useEffect(() => {
    if (success) {
      toast.success('Response escalation rule created successfully')
      // Reset form
      form.reset()
      setSelectedCategories([])
      setSelectedUsers({ e1: [], e2: [], e3: [], e4: [], e5: [] })
      dispatch(fetchResponseEscalations())
      dispatch(clearState())
    }
    if (error) {
      toast.error(error)
      dispatch(clearState())
    }
  }, [success, error, form, dispatch])

  // Helper functions
  const getCategoryName = (id: number) => {
    return categoriesData?.helpdesk_categories?.find(cat => cat.id === id)?.name || 'Unknown Category'
  }

  const getUserName = (id: number) => {
    return fmUsers.find(user => user.id === id)?.displayName || 'Unknown User'
  }

  const getUserNames = (userIds: string | number[] | null): string => {
    if (!userIds) return 'None'
    
    let ids: number[] = []
    if (typeof userIds === 'string') {
      try {
        ids = JSON.parse(userIds)
      } catch {
        return 'None'
      }
    } else {
      ids = userIds
    }
    
    if (!Array.isArray(ids) || ids.length === 0) return 'None'
    
    return ids.map(id => {
      const user = fmUsers.find(u => u.id === id)
      return user ? user.displayName : `User ${id}`
    }).join(', ')
  }

  const availableCategories = categoriesData?.helpdesk_categories?.filter(
    cat => !selectedCategories.includes(cat.id)
  ) || []

  const getAvailableUsers = (level: keyof typeof selectedUsers) => {
    return fmUsers.filter(user => !selectedUsers[level].includes(user.id))
  }

  // Category selection handlers
  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategories.length >= 15) {
      toast.error('Maximum 15 categories allowed')
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
      toast.error('Maximum 15 users allowed per escalation level')
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
    } catch (error: any) {
      toast.error(error.message || 'Failed to update response escalation rule')
    }
  }

  // Handle delete rule
  const handleDeleteRule = async (ruleId: number) => {
    try {
      await dispatch(deleteResponseEscalation(ruleId)).unwrap()
      toast.success('Response escalation rule deleted successfully!')
      dispatch(clearState())
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete response escalation rule')
    }
  }

  // Form submission
  const onSubmit = (data: ResponseEscalationFormData) => {
    // Get society_id from localStorage (set by siteSlice)
    const societyId = localStorage.getItem('selectedSiteId')
    if (!societyId) {
      toast.error('Site not selected. Please select a site first.')
      return
    }

    // Transform form data to API payload
    const payload: EscalationMatrixPayload = {
      complaint_worker: {
        society_id: parseInt(societyId),
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

    dispatch(createResponseEscalation(payload))
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Categories Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Category Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Select
                disabled={categoriesLoading || selectedCategories.length >= 15}
                onValueChange={(value) => handleCategorySelect(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    categoriesLoading ? "Loading categories..." : 
                    selectedCategories.length >= 15 ? "Maximum categories selected" :
                    "Select a category"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Categories */}
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => (
                <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                  {getCategoryName(categoryId)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCategoryRemove(categoryId)}
                  />
                </Badge>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              {selectedCategories.length}/15 categories selected
            </div>

            {form.formState.errors.categoryIds && (
              <p className="text-sm text-destructive">{form.formState.errors.categoryIds.message}</p>
            )}
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
                
                <div className="flex items-center space-x-2">
                  <Select
                    disabled={fmUsersLoading || selectedUsers[level].length >= 15}
                    onValueChange={(value) => handleUserSelect(level, parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={
                        fmUsersLoading ? "Loading users..." :
                        selectedUsers[level].length >= 15 ? "Maximum users selected" :
                        "Select a user"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableUsers(level).map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Users */}
                <div className="flex flex-wrap gap-2">
                  {selectedUsers[level].map((userId) => (
                    <Badge key={userId} variant="outline" className="flex items-center gap-1">
                      {getUserName(userId)}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleUserRemove(level, userId)}
                      />
                    </Badge>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  {selectedUsers[level].length}/15 users selected
                </div>

                {form.formState.errors.escalationLevels?.[level] && (
                  <p className="text-sm text-destructive">{form.formState.errors.escalationLevels[level]?.message}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={submissionLoading || categoriesLoading || fmUsersLoading}
        >
          {submissionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Rule...
            </>
          ) : (
            'Create Response Escalation Rule'
          )}
        </Button>
      </form>

      {/* Rules List Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Response Escalation Rules</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
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
          </div>
        </CardHeader>
        <CardContent>
          {fetchLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading rules...</span>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No response escalation rules found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Type</TableHead>
                  <TableHead>Levels</TableHead>
                  <TableHead>Escalation To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <React.Fragment key={rule.id}>
                    <TableRow>
                      <TableCell>{getCategoryName(rule.category_id)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {['E1', 'E2', 'E3', 'E4', 'E5'].map((level) => {
                            const escalation = rule.escalations.find(e => e.name === level)
                            const hasUsers = escalation?.escalate_to_users && 
                              (typeof escalation.escalate_to_users === 'string' ? 
                               JSON.parse(escalation.escalate_to_users).length > 0 :
                               escalation.escalate_to_users.length > 0)
                            return (
                              <Badge 
                                key={level} 
                                variant={hasUsers ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {level}
                              </Badge>
                            )
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRuleExpansion(rule.id)}
                          className="p-0 h-auto"
                        >
                          {expandedRules.has(rule.id) ? (
                            <>
                              Hide Details <EyeOff className="ml-1 h-3 w-3" />
                            </>
                          ) : (
                            <>
                              View Details <Eye className="ml-1 h-3 w-3" />
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRule(rule)}
                            disabled={updateLoading}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={deleteLoading}
                              >
                                <Trash2 className="h-3 w-3" />
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
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRule(rule.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRules.has(rule.id) && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                              {rule.escalations.map((escalation) => (
                                <div key={escalation.id} className="space-y-2">
                                  <div className="font-semibold text-sm">{escalation.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {getUserNames(escalation.escalate_to_users)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
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
                <div className="flex items-center space-x-2">
                  <Select
                    disabled={categoriesLoading || selectedCategories.length >= 15}
                    onValueChange={(value) => handleCategorySelect(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={
                        categoriesLoading ? "Loading categories..." : 
                        selectedCategories.length >= 15 ? "Maximum categories selected" :
                        "Select a category"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Categories */}
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((categoryId) => (
                    <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                      {getCategoryName(categoryId)}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleCategoryRemove(categoryId)}
                      />
                    </Badge>
                  ))}
                </div>
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
                    
                    <div className="flex items-center space-x-2">
                      <Select
                        disabled={fmUsersLoading || selectedUsers[level].length >= 15}
                        onValueChange={(value) => handleUserSelect(level, parseInt(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={
                            fmUsersLoading ? "Loading users..." :
                            selectedUsers[level].length >= 15 ? "Maximum users selected" :
                            "Select a user"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableUsers(level).map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Selected Users */}
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers[level].map((userId) => (
                        <Badge key={userId} variant="outline" className="flex items-center gap-1">
                          {getUserName(userId)}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleUserRemove(level, userId)}
                          />
                        </Badge>
                      ))}
                    </div>
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