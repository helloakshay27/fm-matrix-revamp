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
import { X, Plus, Loader2 } from 'lucide-react'
import { AppDispatch, RootState } from '@/store/store'
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice'
import { fetchFMUsers } from '@/store/slices/fmUserSlice'
import { createResponseEscalation, clearState } from '@/store/slices/responseEscalationSlice'
import { ResponseEscalationApiFormData, FMUserDropdown, EscalationMatrixPayload } from '@/types/escalationMatrix'
import { toast } from '@/hooks/use-toast'

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

  // Redux selectors
  const { data: categoriesData, loading: categoriesLoading } = useSelector((state: RootState) => state.helpdeskCategories)
  const { data: fmUsersData, loading: fmUsersLoading } = useSelector((state: RootState) => state.fmUsers)
  const { loading: submissionLoading, success, error } = useSelector((state: RootState) => state.responseEscalation)

  // Form setup
  const { handleSubmit, setValue, formState: { errors } } = useForm<ResponseEscalationFormData>({
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
  }, [dispatch])

  // Handle success/error states
  useEffect(() => {
    if (success) {
      toast({
        title: 'Success',
        description: 'Response escalation rule created successfully',
      })
      // Reset form
      setSelectedCategories([])
      setSelectedUsers({ e1: [], e2: [], e3: [], e4: [], e5: [] })
      setValue('categoryIds', [])
      setValue('escalationLevels', { e1: [], e2: [], e3: [], e4: [], e5: [] })
      dispatch(clearState())
    }
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
      dispatch(clearState())
    }
  }, [success, error, setValue, dispatch])

  // Category selection handlers
  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategories.length >= 15) {
      toast({
        title: 'Limit Reached',
        description: 'Maximum 15 categories allowed',
        variant: 'destructive',
      })
      return
    }
    
    const newCategories = [...selectedCategories, categoryId]
    setSelectedCategories(newCategories)
    setValue('categoryIds', newCategories)
  }

  const handleCategoryRemove = (categoryId: number) => {
    const newCategories = selectedCategories.filter(id => id !== categoryId)
    setSelectedCategories(newCategories)
    setValue('categoryIds', newCategories)
  }

  // User selection handlers
  const handleUserSelect = (level: keyof typeof selectedUsers, userId: number) => {
    if (selectedUsers[level].length >= 15) {
      toast({
        title: 'Limit Reached',
        description: 'Maximum 15 users allowed per escalation level',
        variant: 'destructive',
      })
      return
    }

    const newUsers = { ...selectedUsers, [level]: [...selectedUsers[level], userId] }
    setSelectedUsers(newUsers)
    setValue('escalationLevels', newUsers)
  }

  const handleUserRemove = (level: keyof typeof selectedUsers, userId: number) => {
    const newUsers = { ...selectedUsers, [level]: selectedUsers[level].filter(id => id !== userId) }
    setSelectedUsers(newUsers)
    setValue('escalationLevels', newUsers)
  }

  // Form submission
  const onSubmit = (data: ResponseEscalationFormData) => {
    // Get society_id from localStorage (set by siteSlice)
    const societyId = localStorage.getItem('selectedSiteId')
    if (!societyId) {
      toast({
        title: 'Error',
        description: 'Site not selected. Please select a site first.',
        variant: 'destructive',
      })
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

  const getCategoryName = (id: number) => {
    return categoriesData?.categories?.find(cat => cat.id === id)?.name || 'Unknown Category'
  }

  const getUserName = (id: number) => {
    return fmUsers.find(user => user.id === id)?.displayName || 'Unknown User'
  }

  const availableCategories = categoriesData?.categories?.filter(
    cat => !selectedCategories.includes(cat.id)
  ) || []

  const getAvailableUsers = (level: keyof typeof selectedUsers) => {
    return fmUsers.filter(user => !selectedUsers[level].includes(user.id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {errors.categoryIds && (
              <p className="text-sm text-destructive">{errors.categoryIds.message}</p>
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

                {errors.escalationLevels?.[level] && (
                  <p className="text-sm text-destructive">{errors.escalationLevels[level]?.message}</p>
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
    </div>
  )
}