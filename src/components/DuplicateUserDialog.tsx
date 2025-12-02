import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Company {
  active: boolean;
  company_name: string;
  user_type: string | null;
  organization_name: string;
}

interface DuplicateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companies: Company[];
  errorMessage: string;
}

export const DuplicateUserDialog: React.FC<DuplicateUserDialogProps> = ({
  open,
  onClose,
  onConfirm,
  companies,
  errorMessage,
}) => {
  const userType = localStorage.getItem("user_type");
  const isOrgAdmin = userType === "pms_organization_admin";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-[#C72030]">
            User Already Exists
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <p className="text-sm font-medium">
              This user is already associated with the following
              companies/organizations:
            </p>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Company Name</TableHead>
                  <TableHead className="font-semibold">
                    Organization Name
                  </TableHead>
                  <TableHead className="font-semibold">User Type</TableHead>
                  <TableHead className="font-semibold">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell>{company.company_name}</TableCell>
                    <TableCell>{company.organization_name}</TableCell>
                    <TableCell>{company.user_type || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={company.active ? "default" : "secondary"}>
                        {company.active ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <p className="text-sm font-medium">
            Do you want to assign the new permissions to this existing user?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {isOrgAdmin ? (
            <Button
              onClick={onConfirm}
              className="flex-1 h-11 bg-[#C72030] hover:bg-[#a01b26]"
            >
              Yes, Assign Permissions
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="flex-1 h-11 bg-[#C72030] hover:bg-[#a01b26]"
            >
              No, Do Not Assign Permissions
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="flex-1 h-11">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
