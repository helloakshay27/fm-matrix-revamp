import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface CircleOption { id: string; name: string; }
interface UserOption { id: string; name: string; circle_id?: string | number | null; }

// Helper: fetch JSON with auth taken from localStorage
async function authedGet(url: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Missing token');
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

const MobileLMCPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [restrictByCircle, setRestrictByCircle] = useState<boolean>(true);
  const [circles, setCircles] = useState<CircleOption[]>([]);
  const [circlesLoading, setCirclesLoading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersAppendLoading, setUsersAppendLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Derive baseUrl
  const rawBase = localStorage.getItem('baseUrl') || '';
  const baseUrl = rawBase && !/^https?:\/\//i.test(rawBase) ? `https://${rawBase}` : rawBase;

  // Load circles (company id from localStorage if available)
  const loadCircles = async () => {
    const companyId = localStorage.getItem('selectedCompanyId') || searchParams.get('company_id') || '';
    if (!companyId) {
      setCircles([]);
      return;
    }
    try {
      setCirclesLoading(true);
  const host = baseUrl ? baseUrl.replace(/^https?:\/\//,'') : 'live-api.gophygital.work';
  const data = await authedGet(`https://${host}/pms/users/get_circles.json?company_id=${encodeURIComponent(companyId)}`);
      let list: CircleOption[] = [];
      if (Array.isArray(data)) list = data.map((c: any) => ({ id: String(c.id || c.circle_id || c.name), name: c.circle_name || c.name || c.circle || `Circle ${c.id}` }));
      else if (Array.isArray(data?.circles)) list = data.circles.map((c: any) => ({ id: String(c.id || c.circle_id || c.name), name: c.circle_name || c.name || c.circle || `Circle ${c.id}` }));
      setCircles(list);
    } catch (e: any) {
      console.error('Failed to load circles', e);
      toast.error(e.message || 'Failed to load circles');
      setCircles([]);
    } finally { setCirclesLoading(false); }
  };

  // Load users (optionally filtered by circle)
  const loadUsers = async (circleId?: string, page: number = 1, append: boolean = false) => {
    try {
      if (append) setUsersAppendLoading(true);
      else setUsersLoading(true);
      const host = baseUrl ? baseUrl.replace(/^https?:\/\//,'') : 'live-api.gophygital.work';
      const base = `https://${host}/pms/users/company_wise_users.json`;
      const params: string[] = [];
      if (restrictByCircle && circleId) params.push(`q[lock_user_permissions_circle_id_eq]=${encodeURIComponent(circleId)}`);
      if (page && page > 1) params.push(`page=${page}`);
      const url = params.length ? `${base}?${params.join('&')}` : base;
      const data = await authedGet(url);
      const rawUsers = Array.isArray(data?.users) ? data.users : (Array.isArray(data) ? data : []);
      let mapped: UserOption[] = rawUsers.map((u: any) => {
        const first = u.first_name || u.firstname || u.firstName || '';
        const last = u.last_name || u.lastname || u.lastName || '';
        const fullFromParts = `${String(first).trim()} ${String(last).trim()}`.trim();
        const fallbackFull = u.full_name || u.fullName || u.name || `User ${u.id}`;
        const display = fullFromParts || fallbackFull;
        return { id: String(u.id), name: String(display), circle_id: u.circle_id || u.circle || u.circleId };
      });
      // Fallback client-side filter if server didn’t apply
      if (restrictByCircle && circleId) {
        mapped = mapped.filter(u => !u.circle_id || String(u.circle_id) === String(circleId));
      }
      setUsers(prev => {
        if (!append) return mapped;
        const existing = new Map(prev.map(u => [u.id, u] as const));
        for (const u of mapped) existing.set(u.id, u);
        return Array.from(existing.values());
      });
      const p = (data && data.pagination) ? data.pagination : undefined;
      setUsersPage(p?.current_page || page || 1);
      setUsersTotalPages(p?.total_pages || 1);
    } catch (e: any) {
      console.error('Failed to load users', e);
      toast.error(e.message || 'Failed to load users');
      setUsers([]);
    } finally { 
      if (append) setUsersAppendLoading(false);
      else setUsersLoading(false);
    }
  };

  // Initial loads
  useEffect(() => { loadCircles(); }, []);
  useEffect(() => {
    // When restriction toggles off, fetch all users ignoring circle.
    if (!restrictByCircle) {
      setSelectedCircle('');
      setUsers([]); setUsersPage(1); setUsersTotalPages(1);
      loadUsers(undefined, 1, false);
    } else if (restrictByCircle && selectedCircle) {
      setUsers([]); setUsersPage(1); setUsersTotalPages(1);
      loadUsers(selectedCircle, 1, false);
    } else {
      // If restriction on but no circle chosen yet -> empty user list
      setUsers([]);
      setUsersPage(1); setUsersTotalPages(1);
    }
  }, [restrictByCircle, selectedCircle]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        loadCircles(),
        restrictByCircle ? (selectedCircle ? loadUsers(selectedCircle) : Promise.resolve()) : loadUsers()
      ]);
      toast.success('Data refreshed');
    } finally { setRefreshing(false); }
  };

  const circleDisabled = !restrictByCircle;
  const userDisabled = restrictByCircle && !selectedCircle;

  const userPlaceholder = restrictByCircle ? (userDisabled ? 'Select circle first' : 'Select user') : 'Select user';
  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => u.name.toLowerCase().includes(q));
  }, [userSearch, users]);

  const handleUserScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    if (usersLoading || usersAppendLoading) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (nearBottom && usersPage < usersTotalPages) {
      const nextPage = usersPage + 1;
      const circleId = restrictByCircle ? selectedCircle || undefined : undefined;
      loadUsers(circleId, nextPage, true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            {/* <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            LMC
            </CardTitle> */}
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Select LMC Manager</p>
          </CardHeader>
          
          <CardContent className="space-y-6 px-4 sm:px-6">
            {/* Toggle Section */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Switch 
                  id="restrict-circle" 
                  checked={restrictByCircle} 
                  onCheckedChange={setRestrictByCircle}
                  className="data-[state=checked]:bg-[#C72030]" 
                />
                <Label htmlFor="restrict-circle" className="cursor-pointer text-sm sm:text-base font-medium">
                  Restrict by Circle
                </Label>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {restrictByCircle 
                  ? "Select circle first, then choose user" 
                  : "Choose any user directly"
                }
              </p>
            </div>

            {/* Circle Dropdown */}
            <div className="space-y-2">
              <Label className={`block text-sm sm:text-base font-medium text-center ${circleDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                Circle
              </Label>
              <Select 
                value={selectedCircle} 
                onValueChange={v => setSelectedCircle(v)} 
                disabled={circleDisabled || circlesLoading}
              >
                <SelectTrigger className={`w-full h-12 sm:h-14 text-base rounded-xl border-2 transition-all ${
                  circleDisabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300 hover:border-[#C72030] focus:border-[#C72030]'
                }`}>
                  <SelectValue placeholder={circlesLoading ? 'Loading circles...' : 'Select circle'} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {circles.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-base py-3">{c.name}</SelectItem>
                  ))}
                  {!circlesLoading && circles.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No circles available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* User Dropdown with search + infinite scroll */}
            <div className="space-y-2">
              <Label className={`block text-sm sm:text-base font-medium text-center ${userDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                User
              </Label>
              <Select 
                value={selectedUser} 
                onValueChange={v => setSelectedUser(v)} 
                disabled={userDisabled || usersLoading}
              >
                <SelectTrigger className={`w-full h-12 sm:h-14 text-base rounded-xl border-2 transition-all ${
                  userDisabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300 hover:border-[#C72030] focus:border-[#C72030]'
                }`}>
                  <SelectValue placeholder={usersLoading ? 'Loading users...' : userPlaceholder} />
                </SelectTrigger>
                <SelectContent 
                  className="w-[var(--radix-select-trigger-width)]"
                  onOpenAutoFocus={(e) => {
                    // Prevent Radix from focusing the first item; focus our search input instead
                    e.preventDefault();
                    setTimeout(() => searchInputRef.current?.focus(), 0);
                  }}
                >
                  <div className="p-2 sticky top-0 bg-white border-b">
                    <input
                      ref={searchInputRef}
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyDown={(e) => {
                        // Keep typing inside input; avoid Radix Select typeahead/selection
                        e.stopPropagation();
                        if (e.key === 'Enter') e.preventDefault();
                      }}
                      onKeyDownCapture={(e) => {
                        // Extra guard so Select never sees these keys
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Search user..."
                      autoFocus
                      className="w-full h-9 px-3 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                    />
                  </div>
                  <div className="max-h-60 overflow-auto" onScroll={handleUserScroll}>
                    {filteredUsers.map(u => (
                      <SelectItem key={u.id} value={u.id} className="text-base py-3">{u.name}</SelectItem>
                    ))}
                    {(usersLoading || usersAppendLoading) && (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">Loading...</div>
                    )}
                    {!usersLoading && filteredUsers.length === 0 && (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        {restrictByCircle && !selectedCircle 
                          ? 'Please select a circle first' 
                          : 'No users found'
                        }
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button 
                disabled={!selectedUser} 
                onClick={() => toast.success(`Selected user: ${users.find(u => u.id === selectedUser)?.name || selectedUser}`)} 
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-[#C72030] hover:bg-[#a31726] disabled:bg-gray-300 disabled:text-gray-500 rounded-xl transition-all duration-200 transform active:scale-95"
              >
                Submit
              </Button>
              
              {/* <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh} 
                  disabled={refreshing || circlesLoading || usersLoading}
                  className="flex-1 h-10 sm:h-12 text-sm sm:text-base rounded-xl border-2 border-gray-300 hover:border-[#C72030] transition-all"
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => { setSelectedUser(''); setSelectedCircle(''); }} 
                  disabled={!selectedUser && !selectedCircle}
                  className="flex-1 h-10 sm:h-12 text-sm sm:text-base rounded-xl border-2 border-gray-300 hover:border-red-400 hover:text-red-600 transition-all"
                >
                  Clear All
                </Button>
              </div> */}
            </div>

            {/* Status Indicator */}
            {(circlesLoading || usersLoading) && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-[#C72030] mr-2" />
                <span className="text-sm text-gray-600">
                  Loading {circlesLoading ? 'circles' : 'users'}...
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileLMCPage