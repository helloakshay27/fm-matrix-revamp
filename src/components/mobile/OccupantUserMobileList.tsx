import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchOccupantUsers } from "@/store/slices/occupantUsersSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, Eye, Search } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";

interface OccupantUserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  active: boolean;
  departmentName?: string;
  entity?: string;
}

export const OccupantUserMobileList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    users: occupantUsersData,
    pagination: statePagination,
    loading,
  } = useAppSelector((state: RootState) => state.occupantUsers);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [occupantUsers, setOccupantUsers] = useState<OccupantUserData[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  const loadUsers = () => {
    const [firstName = "", lastName = ""] = searchQuery.trim().split(" ");

    dispatch(
      fetchOccupantUsers({
        page: currentPage,
        perPage: 10,
        ...(firstName && { firstname_cont: firstName }),
        ...(lastName && { lastname_cont: lastName }),
      })
    );
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  useEffect(() => {
    if (occupantUsersData && "transformedUsers" in (occupantUsersData as any)) {
      const data = occupantUsersData as any;
      setOccupantUsers(data.transformedUsers);
      setPagination({
        current_page:
          statePagination?.current_page ?? data.pagination?.current_page ?? 1,
        total_count:
          statePagination?.total_count ?? data.pagination?.total_count ?? 0,
        total_pages:
          statePagination?.total_pages ?? data.pagination?.total_pages ?? 0,
      });
    } else if (Array.isArray(occupantUsersData)) {
      setOccupantUsers(occupantUsersData as any);
      setPagination((prev) => ({
        current_page: statePagination?.current_page ?? prev.current_page,
        total_count: statePagination?.total_count ?? prev.total_count,
        total_pages: statePagination?.total_pages ?? prev.total_pages,
      }));
    }
  }, [occupantUsersData, statePagination]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const handleViewUser = (id: number) => {
    navigate(`/ops-console/settings/account/user-list-otp/detail/${id}`);
  };

  return (
    <div className="mobile-user-list min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Occupant Users
          </h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 pb-3">
          <div className="text-sm text-gray-600">
            Total: {pagination.total_count} users
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="px-4 py-2 space-y-3">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : occupantUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No users found</div>
        ) : (
          occupantUsers.map((user) => (
            <Card
              key={user.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewUser(user.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {user.firstname} {user.lastname}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <Badge variant={user.active ? "default" : "secondary"}>
                  {user.active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Mobile:</span>
                  <span>{user.mobile}</span>
                </div>
                {user.departmentName && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Department:</span>
                    <span>{user.departmentName}</span>
                  </div>
                )}
                {user.entity && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Entity:</span>
                    <span>{user.entity}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewUser(user.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Mobile Pagination */}
      {pagination.total_pages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(
                  Math.min(pagination.total_pages, currentPage + 1)
                )
              }
              disabled={currentPage === pagination.total_pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
