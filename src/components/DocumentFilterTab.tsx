import { FileText, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FilterTabs = () => {
    return (
        <div className="flex items-center gap-2 py-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Type
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Modified
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Users className="h-4 w-4 mr-2" />
                People
            </Button>
        </div>
    );
};
