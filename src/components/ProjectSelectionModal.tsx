import React, { useState, useEffect } from "react";
import { Building2, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
    fetchAllowedCompanies,
    changeCompany,
} from "@/store/slices/projectSlice";
import {
    fetchAllowedSites,
    changeSite,
} from "@/store/slices/siteSlice";
import { getUser } from "@/utils/auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProjectSelectionModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

export const ProjectSelectionModal: React.FC<ProjectSelectionModalProps> = ({
    isOpen,
    onComplete,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        companies,
        selectedCompany,
        loading: projectLoading,
    } = useSelector((state: RootState) => state.project);

    const {
        sites,
        selectedSite,
        loading: siteLoading,
    } = useSelector((state: RootState) => state.site);

    const user = getUser();
    const userId = user?.id || 0;

    // Check if we're on VI site (no site selection needed)
    const hostname = window.location.hostname;
    const isViSite = hostname.includes("vi-web.gophygital.work") || hostname.includes("localhost");

    // Load companies on mount
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchAllowedCompanies());
        }
    }, [isOpen, dispatch]);

    // Load sites when company is selected
    useEffect(() => {
        if (selectedCompanyId && userId) {
            dispatch(fetchAllowedSites(userId));
        }
    }, [selectedCompanyId, userId, dispatch]);

    // Auto-set if already selected
    useEffect(() => {
        if (selectedCompany) {
            setSelectedCompanyId(selectedCompany.id);
        }
        if (selectedSite) {
            setSelectedSiteId(selectedSite.id);
        }
    }, [selectedCompany, selectedSite]);

    const handleSubmit = async () => {
        if (!selectedCompanyId) return;

        // For VI sites, only company selection is required
        if (isViSite) {
            if (selectedCompanyId) {
                setIsSubmitting(true);
                try {
                    await dispatch(changeCompany(selectedCompanyId)).unwrap();
                    onComplete();
                    window.location.reload();
                } catch (error) {
                    console.error("Failed to change company:", error);
                    setIsSubmitting(false);
                }
            }
            return;
        }

        // For other sites, both company and site required
        if (selectedCompanyId && selectedSiteId) {
            setIsSubmitting(true);
            try {
                await dispatch(changeCompany(selectedCompanyId)).unwrap();
                await dispatch(changeSite(selectedSiteId)).unwrap();
                onComplete();
                window.location.reload();
            } catch (error) {
                console.error("Failed to set project/site:", error);
                setIsSubmitting(false);
            }
        }
    };

    const canSubmit = isViSite
        ? selectedCompanyId !== null
        : selectedCompanyId !== null && selectedSiteId !== null;

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#C72030] to-[#a01827] rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Select Project</DialogTitle>
                            <DialogDescription>
                                Choose a project to continue
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Company Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Project / Company
                        </label>
                        <Select
                            value={selectedCompanyId?.toString()}
                            onValueChange={(value) => setSelectedCompanyId(Number(value))}
                            disabled={projectLoading || isSubmitting}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a project..." />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id.toString()}>
                                        {company.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Site Selection - Only for non-VI sites */}
                    {!isViSite && selectedCompanyId && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Site Location
                            </label>
                            <Select
                                value={selectedSiteId?.toString()}
                                onValueChange={(value) => setSelectedSiteId(Number(value))}
                                disabled={siteLoading || isSubmitting || !selectedCompanyId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a site..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sites.length > 0 ? (
                                        sites.map((site) => (
                                            <SelectItem key={site.id} value={site.id.toString()}>
                                                {site.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="px-2 py-3 text-sm text-gray-500">
                                            No sites available
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Info Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Admin Access Required</p>
                            <p className="text-blue-700">
                                You must select a {isViSite ? "project" : "project and site"} to access the admin
                                dashboard and management features.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit || isSubmitting}
                        className="bg-[#C72030] hover:bg-[#a01827] text-white px-6"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
