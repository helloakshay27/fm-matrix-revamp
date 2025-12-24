import { Cloud } from "lucide-react";

export const WelcomeHeader = () => {
    return (
        <div className="pb-6 border-b border-border mb-2">
            <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-semibold">Welcome to DocCloud!</h1>
                <Cloud className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground max-w-2xl">
                Here you can add a description or any other info relevant for the folder.
                It will show as a "Readme.md" and in the web interface also embedded nicely up at the top.
            </p>
        </div>
    );
};
