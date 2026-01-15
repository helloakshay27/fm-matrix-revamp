import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import { usePermissions } from "./PermissionsContext";

interface LockFunction {
  function_id: number;
  function_name: string;
  react_link: string;
  action_name: string;
  function_active: number;
  sub_functions: SubFunction[];
}

interface SubFunction {
  sub_function_id: number;
  sub_function_name: string;
  sub_function_display_name: string;
  sub_function_active: number;
  enabled: boolean;
}

interface LockModule {
  module_id: number;
  module_name: string;
  lock_functions: LockFunction[];
  module_active: number;
}

interface ActionLayoutContextType {
  currentModule: string;
  setCurrentModule: (module: string) => void;
  currentFunction: string;
  setCurrentFunction: (func: string) => void;
  availableModules: LockModule[];
  getModuleFunctions: (moduleName: string) => LockFunction[];
  isActionSidebarVisible: boolean;
}

const ActionLayoutContext = createContext<ActionLayoutContextType | undefined>(
  undefined
);

export const useActionLayout = () => {
  const context = useContext(ActionLayoutContext);
  if (context === undefined) {
    throw new Error(
      "useActionLayout must be used within an ActionLayoutProvider"
    );
  }
  return context;
};

interface ActionLayoutProviderProps {
  children: ReactNode;
}

export const ActionLayoutProvider: React.FC<ActionLayoutProviderProps> = ({
  children,
}) => {
  const [currentModule, setCurrentModule] = useState<string>("");
  const [currentFunction, setCurrentFunction] = useState<string>("");
  const [availableModules, setAvailableModules] = useState<LockModule[]>([]);
  const [isActionSidebarVisible, setIsActionSidebarVisible] =
    useState<boolean>(false);
  const location = useLocation();
  const { userRole } = usePermissions();

  // Extract available modules from userRole
  useEffect(() => {
    if (userRole && userRole.lock_modules) {
      // Filter modules that have at least one active function
      const modulesWithActiveFunctions = userRole.lock_modules.filter(
        (module: LockModule) => {
          const hasActiveFunction = module.lock_functions.some(
            (func) => func.function_active === 1
          );
          return hasActiveFunction;
        }
      );

      setAvailableModules(modulesWithActiveFunctions);

      console.log(
        "🎯 ActionLayout - Available modules with active functions:",
        modulesWithActiveFunctions.map((m: LockModule) => m.module_name)
      );
    }
  }, [userRole]);

  // Auto-detect module and function from current route
  useEffect(() => {
    const path = location.pathname;

    if (!userRole || !userRole.lock_modules) {
      setIsActionSidebarVisible(false);
      return;
    }

    let foundModule: string = "";
    let foundFunction: string = "";
    let foundMatch = false;

    // Search through all modules to find matching route
    for (const module of userRole.lock_modules) {
      for (const func of module.lock_functions) {
        if (func.function_active === 1 && func.react_link) {
          // Check if current path matches or starts with the function's react_link
          if (
            path === func.react_link ||
            path.startsWith(func.react_link + "/")
          ) {
            foundModule = module.module_name;
            foundFunction = func.function_name;
            foundMatch = true;
            break;
          }
        }
      }
      if (foundMatch) break;
    }

    if (foundMatch) {
      console.log(
        `🔄 ActionLayout - Route matched: Module="${foundModule}", Function="${foundFunction}"`
      );
      setCurrentModule(foundModule);
      setCurrentFunction(foundFunction);
      setIsActionSidebarVisible(true);
    } else {
      // No match found - hide action sidebar
      setIsActionSidebarVisible(false);
      console.log(
        `🔍 ActionLayout - No matching module/function for path: ${path}`
      );
    }
  }, [location.pathname, userRole]);

  // Get all active functions for a specific module
  const getModuleFunctions = (moduleName: string): LockFunction[] => {
    const module = availableModules.find(
      (m) => m.module_name.toLowerCase() === moduleName.toLowerCase()
    );

    if (!module) {
      return [];
    }

    // Return only active functions
    return module.lock_functions.filter((func) => func.function_active === 1);
  };

  return (
    <ActionLayoutContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        currentFunction,
        setCurrentFunction,
        availableModules,
        getModuleFunctions,
        isActionSidebarVisible,
      }}
    >
      {children}
    </ActionLayoutContext.Provider>
  );
};
