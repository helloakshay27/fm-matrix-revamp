import React, { useState } from 'react';
import { ChevronLeft, Clock, Plus, Mic, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Types
interface Investigator {
  id: string;
  name: string;
  email: string;
  role: string;
  contactNo: string;
  type: 'internal' | 'external';
  company?: string;
}

interface Condition {
  id: string;
  condition: string;
  act: string;
  description: string;
}

interface RootCause {
  id: string;
  cause: string;
  description: string;
}

interface InjuredPerson {
  id: string;
  name: string;
  age: string;
  company: string;
  role: string;
  bodyParts: string[];
  attachments: File[];
}

interface PropertyDamage {
  id: string;
  propertyType: string;
  attachments: File[];
}

interface CorrectiveAction {
  id: string;
  action: string;
  responsiblePerson: string;
  targetDate: string;
  description: string;
}

interface PreventiveAction {
  id: string;
  action: string;
  responsiblePerson: string;
  targetDate: string;
  description: string;
}

export const IncidentNewDetails = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [investigators, setInvestigators] = useState<Investigator[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [rootCauses, setRootCauses] = useState<RootCause[]>([]);
  const [injuredPersons, setInjuredPersons] = useState<InjuredPerson[]>([]);
  const [propertyDamages, setPropertyDamages] = useState<PropertyDamage[]>([]);
  const [showInvestigateDetails, setShowInvestigateDetails] = useState(false);
  
  // Step 3 & 4 States
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [preventiveActions, setPreventiveActions] = useState<PreventiveAction[]>([]);
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [nextReviewResponsible, setNextReviewResponsible] = useState('');
  
  // Dialog States
  const [isInvestigatorModalOpen, setIsInvestigatorModalOpen] = useState(false);
  const [investigatorTab, setInvestigatorTab] = useState<'internal' | 'external'>('internal');
  
  // Form States
  const [hasInjury, setHasInjury] = useState(false);
  const [hasPropertyDamage, setHasPropertyDamage] = useState(false);
  
  // New Investigator Form
  const [newInvestigator, setNewInvestigator] = useState({
    name: '',
    email: '',
    role: '',
    contactNo: '',
    company: '',
  });

  // Sample data (would come from props/API)
  const incidentData = {
    reportedBy: 'Abdul Ghaffar',
    occurredOn: '20/08/2025, 02:45 AM',
    reportedOn: '20/08/2025, 02:45 AM',
    severity: 'Very High',
    supportRequired: 'Yes',
    categories: [
      {
        icon: '🔒',
        name: 'Security',
        subCategory: 'Harassment & Discrimination',
        subCategory2: 'Infrastructure & Maintenance Issue',
        subCategory3: 'Application not responding',
      },
      {
        icon: '🔒',
        name: 'Security',
        subCategory: 'Harassment & Discrimination',
        subCategory2: 'Infrastructure & Maintenance Issue',
        subCategory3: 'Application not responding',
      },
    ],
    description: 'This is how description will look like if the user has put description at the time of creation.',
    attachments: [
      { id: '1', name: 'image1.jpg', url: '/placeholder.jpg' },
      { id: '2', name: 'image2.jpg', url: '/placeholder.jpg' },
    ],
    location: {
      building: 'Peninsula Tech Building',
      area: 'Common Area',
      wing: 'Wing A',
      floor: 'Floor 2',
      room: '408',
    },
  };

  const steps = [
    { number: 1, label: 'Report' },
    { number: 2, label: 'Investigate' },
    { number: 3, label: 'Provisional' },
    { number: 4, label: 'Final Closure' },
  ];

  // Handlers
  const handleAddInvestigator = () => {
    if (newInvestigator.name && newInvestigator.email) {
      const investigator: Investigator = {
        id: Date.now().toString(),
        ...newInvestigator,
        type: investigatorTab,
      };
      setInvestigators([...investigators, investigator]);
      setNewInvestigator({ name: '', email: '', role: '', contactNo: '', company: '' });
      setIsInvestigatorModalOpen(false);
    }
  };

  const handleAddSampleInvestigators = () => {
    // For demo purposes - add sample investigators
    setInvestigators([
      {
        id: '1',
        name: 'Abdul Ghaffar',
        email: 'abdul@example.com',
        role: 'Investigator',
        contactNo: '1234567890',
        type: 'internal',
      },
      {
        id: '2',
        name: 'Kshitij Rasal',
        email: 'kshitij@example.com',
        role: 'Investigator',
        contactNo: '0987654321',
        type: 'internal',
      },
    ]);
  };

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      condition: '',
      act: '',
      description: '',
    };
    setConditions([...conditions, newCondition]);
  };

  const handleAddRootCause = () => {
    const newCause: RootCause = {
      id: Date.now().toString(),
      cause: '',
      description: '',
    };
    setRootCauses([...rootCauses, newCause]);
  };

  const handleAddInjuredPerson = () => {
    const newPerson: InjuredPerson = {
      id: Date.now().toString(),
      name: '',
      age: '',
      company: '',
      role: '',
      bodyParts: [],
      attachments: [],
    };
    setInjuredPersons([...injuredPersons, newPerson]);
  };

  const handleAddCorrectiveAction = () => {
    const newAction: CorrectiveAction = {
      id: Date.now().toString(),
      action: '',
      responsiblePerson: '',
      targetDate: '',
      description: '',
    };
    setCorrectiveActions([...correctiveActions, newAction]);
  };

  const handleAddPreventiveAction = () => {
    const newAction: PreventiveAction = {
      id: Date.now().toString(),
      action: '',
      responsiblePerson: '',
      targetDate: '',
      description: '',
    };
    setPreventiveActions([...preventiveActions, newAction]);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft...');
  };

  const handleSubmit = () => {
    console.log('Submitting...');
    if (currentStep === 2) {
      setShowInvestigateDetails(true);
    } else if (currentStep === 3) {
      // Move to final closure
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Final submission
      alert('Incident closed successfully!');
    }
  };

  // Progress Stepper Component
  const ProgressStepper = () => (
    <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step.number
                  ? 'bg-[#BF213E] text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            <span className="text-xs mt-1 text-gray-600">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 ${
                currentStep > step.number ? 'bg-[#BF213E]' : 'bg-gray-300'
              }`}
              style={{ marginBottom: '20px' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Report Step Component
  const ReportStep = () => (
    <div className="p-4 space-y-4">
      {/* Time Selection */}
      <div className="flex items-center gap-2 bg-[#F5E6D3] p-3 rounded">
        <span className="text-sm font-medium">Select Incident Over Time</span>
        <Input 
          type="text" 
          placeholder="HH:MM" 
          className="w-20 h-8 text-center bg-white"
        />
        <Clock className="w-4 h-4 ml-auto" />
      </div>

      {/* Report Details */}
      <div className="bg-[#F5E6D3] p-4 rounded space-y-3">
        <h3 className="font-semibold text-base">Report</h3>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-gray-600">Reported By</div>
          <div className="font-medium">: {incidentData.reportedBy}</div>
          
          <div className="text-gray-600">Occurred on</div>
          <div className="font-medium">: {incidentData.occurredOn}</div>
          
          <div className="text-gray-600">Reported on</div>
          <div className="font-medium">: {incidentData.reportedOn}</div>
          
          <div className="text-gray-600">Severity of Incident</div>
          <div className="font-medium">: {incidentData.severity}</div>
          
          <div className="text-gray-600">Support Required</div>
          <div className="font-medium">: {incidentData.supportRequired}</div>
        </div>

        {/* Categories */}
        {incidentData.categories.map((cat, idx) => (
          <div key={idx} className="space-y-2 mt-3">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-600">{idx + 1}. Category</div>
              <div className="flex items-center gap-2 font-medium">
                : <span className="text-lg">{cat.icon}</span> {cat.name}
              </div>
              
              <div className="text-gray-600">Sub Category</div>
              <div className="font-medium">: {cat.subCategory}</div>
              
              <div className="text-gray-600">Sub Category 2</div>
              <div className="font-medium">: {cat.subCategory2}</div>
              
              <div className="text-gray-600">Sub Category 3</div>
              <div className="font-medium">: {cat.subCategory3}</div>
            </div>
          </div>
        ))}

        {/* Description */}
        <div className="mt-4">
          <label className="text-sm text-gray-600 block mb-2">Description:</label>
          <div className="bg-white p-3 rounded border text-sm">
            {incidentData.description}
          </div>
        </div>

        {/* Attachments */}
        <div className="mt-4">
          <label className="text-sm text-gray-600 block mb-2">Attachments:</label>
          <div className="flex gap-2">
            {incidentData.attachments.map((att) => (
              <div key={att.id} className="w-20 h-20 bg-gray-200 rounded overflow-hidden">
                <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Location Details */}
        <div className="mt-4 bg-white p-3 rounded space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Building:</span>
            <span>{incidentData.location.building}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Area:</span>
            <span>{incidentData.location.area}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Wing:</div>
              <div>{incidentData.location.wing}</div>
            </div>
            <div>
              <div className="font-medium">Floor:</div>
              <div>{incidentData.location.floor}</div>
            </div>
            <div>
              <div className="font-medium">Room:</div>
              <div>{incidentData.location.room}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Investigate Step Component
  const InvestigateStep = () => {
    // Sample filled data for display
    const hasFilledData = investigators.length > 0 || showInvestigateDetails;

    if (hasFilledData) {
      return <InvestigateStepSummary />;
    }

    return <InvestigateStepForm />;
  };

  // Summary View (Images 9-10)
  const InvestigateStepSummary = () => (
    <div className="p-4 space-y-4">
      {/* Time and Duration */}
      <div className="flex items-center justify-between bg-[#F5E6D3] p-3 rounded">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Occurred Time</span>
          <span className="font-medium text-sm">09:26 AM</span>
        </div>
        <div className="text-sm">
          <span className="text-red-500 font-medium">Total Duration</span>
          <span className="ml-2">18 Hrs. 24 Min.</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Incident Over Time</span>
          <span className="font-medium text-sm">09:26 AM</span>
        </div>
      </div>

      {/* Investigators */}
      <div className="bg-[#F5E6D3] p-3 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">
            Abdul Ghaffar, Kshitij Rasal +8 other
          </span>
          <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
            + Investigator
          </Button>
        </div>
      </div>

      {/* Investigate Section */}
      <div className="bg-[#F5E6D3] rounded">
        <div className="flex items-center justify-between p-3 border-b border-gray-300">
          <h3 className="font-semibold">Investigate</h3>
          <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">WIP</span>
        </div>

        <div className="p-3 space-y-4">
          {/* Substandard Condition */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Substandard Condition</span>
              <button className="text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white p-3 rounded text-sm">
              Exposed live electrical wires near a control panel.
            </div>
          </div>

          {/* Substandard Act */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Substandard Act</span>
              <button className="text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white p-3 rounded text-sm">
              Started maintenance without isolating the power...
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Description:</span>
              <button className="text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white p-3 rounded text-sm">
              Started maintenance without isolating the power Started maintenance without isolating the power
            </div>
          </div>

          {/* Root Cause */}
          <div className="space-y-2 border-t border-gray-300 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Root Cause:</span>
              <button className="text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white p-3 rounded text-sm">
              No lockout–tagout (LOTO) procedure implemented...
            </div>
          </div>

          {/* Description for Root Cause */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Description:</span>
              <button className="text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white p-3 rounded text-sm">
              Started maintenance without isolating the power Started maintenance without isolating the power
            </div>
          </div>

          {/* Injury Section */}
          <div className="border-t border-gray-300 pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Injury</span>
              <button className="text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>

            {/* Person 1 */}
            <div className="bg-white p-3 rounded mb-3">
              <div className="text-sm font-semibold mb-2">Person 1</div>
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                <div className="text-gray-600">Name</div>
                <div>: Bilal Shaikh</div>
                <div className="text-gray-600">Age</div>
                <div>: 41</div>
                <div className="text-gray-600">Company</div>
                <div>: Piramal</div>
                <div className="text-gray-600">Role</div>
                <div>: Employee</div>
              </div>
              
              <div className="mt-2">
                <span className="text-sm text-gray-600">Body Parts :</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Head', 'Neck', 'Arms', 'Eyes', 'Legs', 'Skin', 'Mouth', 'Ears'].map((part) => (
                    <div key={part} className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked className="w-3 h-3" readOnly />
                      <span>{part}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <span className="text-sm text-gray-600">Attachment:</span>
                <div className="flex gap-2 mt-1">
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* Person 2 */}
            <div className="bg-white p-3 rounded">
              <div className="text-sm font-semibold mb-2">Person 2</div>
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                <div className="text-gray-600">Name</div>
                <div>: Bilal Shaikh</div>
                <div className="text-gray-600">Age</div>
                <div>: 41</div>
                <div className="text-gray-600">Company</div>
                <div>: Piramal</div>
                <div className="text-gray-600">Role</div>
                <div>: Employee</div>
              </div>
              
              <div className="mt-2">
                <span className="text-sm text-gray-600">Body Parts :</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Head', 'Neck', 'Arms', 'Eyes', 'Legs', 'Skin', 'Mouth', 'Ears'].map((part) => (
                    <div key={part} className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked className="w-3 h-3" readOnly />
                      <span>{part}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <span className="text-sm text-gray-600">Attachment:</span>
                <div className="flex gap-2 mt-1">
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Property Damage Section */}
          <div className="border-t border-gray-300 pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Property Damage</span>
              <button className="text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-3 rounded">
              <div className="grid grid-cols-2 gap-y-1 text-sm mb-3">
                <div className="text-gray-600">Property Type :</div>
                <div className="font-medium">Glass & Window</div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Attachment:</span>
                <div className="flex gap-2 mt-1">
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Form View (Original)
  const InvestigateStepForm = () => (
    <div className="p-4 space-y-4">
      {/* Time and Duration */}
      <div className="flex items-center justify-between bg-[#F5E6D3] p-3 rounded">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Occurred Time</span>
          <span className="font-medium text-sm">09:26 AM</span>
        </div>
        <div className="text-sm">
          <span className="text-red-500 font-medium">Total Duration</span>
          <span className="ml-2">18 Hrs. 24 Min.</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Incident Over Time</span>
          <span className="font-medium text-sm">09:26 AM</span>
        </div>
      </div>

      {/* Add Investigator */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter investigator name..."
          className="flex-1"
          onClick={() => setIsInvestigatorModalOpen(true)}
          readOnly
        />
        <Button
          variant="outline"
          className="border-[#BF213E] text-[#BF213E]"
          onClick={() => setIsInvestigatorModalOpen(true)}
        >
          + Investigator
        </Button>
      </div>

      {/* Quick action for demo */}
      {investigators.length === 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={handleAddSampleInvestigators}
        >
          Add Sample Investigators (Demo)
        </Button>
      )}

      {/* Investigators List */}
      {investigators.length > 0 && (
        <div className="bg-[#F5E6D3] p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">
              {investigators.map(inv => inv.name).join(', ')}
              {investigators.length > 2 && ` +${investigators.length - 2} other`}
            </span>
            <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
              + Investigator
            </Button>
          </div>
        </div>
      )}

      {/* Investigate Section */}
      <div className="bg-[#F5E6D3] rounded">
        <div className="flex items-center justify-between p-3 border-b border-gray-300">
          <h3 className="font-semibold">Investigate</h3>
          <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">WIP</span>
        </div>

        <div className="p-3 space-y-4">
          {/* Conditions */}
          {conditions.map((condition, idx) => (
            <div key={condition.id} className="space-y-2">
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select condition..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exposed-wires">Exposed live electrical wires near a control panel.</SelectItem>
                  <SelectItem value="other">Other conditions...</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select act..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-isolation">Started maintenance without isolating the power...</SelectItem>
                  <SelectItem value="other">Other acts...</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Give a brief description of the issue..."
                className="bg-white min-h-[80px]"
              />

              {idx === 0 && (
                <Button
                  variant="outline"
                  className="w-full border-[#BF213E] text-[#BF213E]"
                  onClick={handleAddCondition}
                >
                  + Add Condition
                </Button>
              )}
            </div>
          ))}

          {conditions.length === 0 && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500 mb-2">Substandard Condition</div>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select condition..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exposed-wires">Exposed live electrical wires near a control panel.</SelectItem>
                  <SelectItem value="other">Other conditions...</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-500 mb-2 mt-3">Substandard Act</div>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select act..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-isolation">Started maintenance without isolating the power...</SelectItem>
                  <SelectItem value="other">Other acts...</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-500 mb-2 mt-3">Description</div>
              <div className="relative">
                <Textarea
                  placeholder="Give a brief description of the issue..."
                  className="bg-white min-h-[80px]"
                />
                <button className="absolute right-3 bottom-3">
                  <Mic className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <Button
                variant="outline"
                className="w-full border-[#BF213E] text-[#BF213E] mt-2"
                onClick={handleAddCondition}
              >
                + Add Condition
              </Button>
            </div>
          )}

          {/* Root Cause */}
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Root Cause:</div>
            {rootCauses.length === 0 && (
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select root cause..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loto">No lockout–tagout (LOTO) procedure implemented...</SelectItem>
                    <SelectItem value="other">Other causes...</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-sm text-gray-500 mb-2 mt-3">Description</div>
                <div className="relative">
                  <Textarea
                    placeholder="Give a brief description of the issue..."
                    className="bg-white min-h-[80px]"
                  />
                  <button className="absolute right-3 bottom-3">
                    <Mic className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-[#BF213E] text-[#BF213E] mt-2"
                  onClick={handleAddRootCause}
                >
                  + Add Cause
                </Button>
              </div>
            )}
          </div>

          {/* Injury Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-gray-300">
            <span className="font-medium">Injury</span>
            <Switch checked={hasInjury} onCheckedChange={setHasInjury} />
          </div>

          {/* Injury Form */}
          {hasInjury && (
            <div className="space-y-3">
              <Tabs value={investigatorTab} onValueChange={(v) => setInvestigatorTab(v as any)}>
                <TabsList className="grid w-full grid-cols-2 bg-white">
                  <TabsTrigger value="internal" className="data-[state=active]:bg-[#F5E6D3]">
                    Internal
                  </TabsTrigger>
                  <TabsTrigger value="external" className="data-[state=active]:bg-[#F5E6D3]">
                    External
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Input placeholder="Enter Name" className="bg-white" />
              <Input placeholder="Enter Age" className="bg-white" />
              <Input placeholder="Enter Company" className="bg-white" />
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                </SelectContent>
              </Select>

              {/* Body Parts */}
              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Body Parts:</div>
                <div className="grid grid-cols-4 gap-2">
                  {['Head', 'Neck', 'Arms', 'Eyes', 'Legs', 'Skin', 'Mouth', 'Ears'].map((part) => (
                    <label key={part} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{part}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Attachment:</div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                  <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-[#BF213E] text-[#BF213E] mt-2"
                onClick={handleAddInjuredPerson}
              >
                + Add Person
              </Button>
            </div>
          )}

          {/* Property Damage Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-gray-300">
            <span className="font-medium">Property Damage</span>
            <Switch checked={hasPropertyDamage} onCheckedChange={setHasPropertyDamage} />
          </div>

          {/* Property Damage Form */}
          {hasPropertyDamage && (
            <div className="space-y-3">
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Property Type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glass">Glass & Window</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Attachment:</div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                  <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Provisional Step Component (Step 3)
  const ProvisionalStep = () => (
    <div className="p-4 space-y-4">
      {/* Time and Duration */}
      <div className="flex items-center justify-between bg-[#F5E6D3] p-3 rounded">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Occurred Time</span>
          <span className="font-medium text-sm">09:26 AM</span>
        </div>
        <div className="text-sm">
          <span className="text-red-500 font-medium">Total Duration</span>
          <span className="ml-2">18 Hrs. 24 Min.</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Incident Over Time</span>
          <span className="font-medium text-sm">09:26 AM</span>
        </div>
      </div>

      {/* Investigators */}
      <div className="bg-[#F5E6D3] p-3 rounded">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">
            Abdul Ghaffar, Kshitij Rasal, Aman +2
          </span>
          <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
            + Investigator
          </Button>
        </div>
      </div>

      {/* Provisional Section */}
      <div className="bg-[#F5E6D3] rounded">
        <div className="flex items-center justify-between p-3 border-b border-gray-300">
          <h3 className="font-semibold">Provisional</h3>
          <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700">
            Open
          </Button>
        </div>

        <div className="p-3 space-y-4">
          {/* Corrective Actions */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Corrective Actions:</h4>
            
            {correctiveActions.length === 0 && (
              <div className="space-y-3">
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select corrective action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insulate">Insulate or replace exposed wiring immediately.</SelectItem>
                    <SelectItem value="shutdown">Shut down and tag faulty circuits.</SelectItem>
                    <SelectItem value="other">Other actions...</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Responsible Person..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="person1">John Doe</SelectItem>
                    <SelectItem value="person2">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    className="bg-white flex-1"
                    defaultValue="2025-08-24"
                  />
                  <Button variant="ghost" size="icon">
                    <span className="text-xl">📅</span>
                  </Button>
                </div>

                <div className="text-sm text-gray-600 mb-1">Description:</div>
                <Textarea
                  placeholder="This is how description will look like if the user has put description at the time of creation."
                  className="bg-white min-h-[80px]"
                />

                <Button
                  variant="outline"
                  className="w-full border-[#BF213E] text-[#BF213E]"
                  onClick={handleAddCorrectiveAction}
                >
                  + Add Action
                </Button>
              </div>
            )}
          </div>

          {/* Preventive Actions */}
          <div className="border-t border-gray-300 pt-4">
            <h4 className="font-semibold text-sm mb-3">Preventive Actions:</h4>
            
            {preventiveActions.length === 0 && (
              <div className="space-y-3">
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select preventive action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loto">Implement and enforce LOTO procedure.</SelectItem>
                    <SelectItem value="training">Conduct safety training.</SelectItem>
                    <SelectItem value="other">Other actions...</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Responsible Person..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="person1">John Doe</SelectItem>
                    <SelectItem value="person2">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    className="bg-white flex-1"
                    defaultValue="2025-08-24"
                  />
                  <Button variant="ghost" size="icon">
                    <span className="text-xl">📅</span>
                  </Button>
                </div>

                <div className="text-sm text-gray-600 mb-1">Description:</div>
                <Textarea
                  placeholder="This is how description will look like if the user has put description at the time of creation."
                  className="bg-white min-h-[80px]"
                />

                <Button
                  variant="outline"
                  className="w-full border-[#BF213E] text-[#BF213E]"
                  onClick={handleAddPreventiveAction}
                >
                  + Add Action
                </Button>
              </div>
            )}
          </div>

          {/* Schedule Next Review */}
          <div className="border-t border-gray-300 pt-4">
            <h4 className="font-semibold text-sm mb-3 text-[#BF213E]">Schedule Next Review</h4>
            
            <div className="space-y-3">
              <Select value={nextReviewResponsible} onValueChange={setNextReviewResponsible}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Responsible Person..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">John Doe</SelectItem>
                  <SelectItem value="person2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="bg-white flex-1"
                  value={nextReviewDate}
                  onChange={(e) => setNextReviewDate(e.target.value)}
                  defaultValue="2025-10-30"
                />
                <Button variant="ghost" size="icon">
                  <span className="text-xl">📅</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Final Closure Step Component (Step 4)
  const FinalClosureStep = () => (
    <div className="p-4 space-y-4">
      {/* Time and Duration */}
      <div className="flex items-center justify-between bg-[#F5E6D3] p-3 rounded">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Occurred Time</span>
          <span className="font-medium text-sm">09:26 AM</span>
        </div>
        <div className="text-sm">
          <span className="text-red-500 font-medium">Total Duration</span>
          <span className="ml-2">18 Hrs. 24 Min.</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Incident Over Time</span>
          <span className="font-medium text-sm">09:26 AM</span>
        </div>
      </div>

      {/* Investigators */}
      <div className="bg-[#F5E6D3] p-3 rounded">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">
            Abdul Ghaffar, Kshitij Rasal, Aman +2
          </span>
          <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
            + Investigator
          </Button>
        </div>
      </div>

      {/* Final Closure Section */}
      <div className="bg-[#F5E6D3] rounded">
        <div className="flex items-center justify-between p-3 border-b border-gray-300">
          <h3 className="font-semibold">Final Closure</h3>
          <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700">
            Open
          </Button>
        </div>

        <div className="p-3 space-y-4">
          {/* 1. Corrective Actions */}
          <div>
            <h4 className="font-semibold text-sm mb-3">1. Corrective Actions</h4>
            
            <div className="bg-white p-3 rounded mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Insulate or replace exposed wiring immediately.</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
                </Button>
              </div>
              
              <Select>
                <SelectTrigger className="bg-gray-50 h-9">
                  <SelectValue placeholder="Responsible Person..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">John Doe</SelectItem>
                  <SelectItem value="person2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="bg-gray-50 flex-1 h-9"
                  defaultValue="2025-08-24"
                />
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <span className="text-lg">📅</span>
                </Button>
              </div>

              <div className="text-xs text-gray-600 mb-1">Description:</div>
              <div className="bg-gray-50 p-2 rounded text-sm">
                This is how description will look like if the user has put description at the time of creation.
              </div>
            </div>
          </div>

          {/* 2. Corrective Actions */}
          <div>
            <h4 className="font-semibold text-sm mb-3">2. Corrective Actions</h4>
            
            <div className="space-y-3">
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Shut down and tag faulty circuits." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shutdown">Shut down and tag faulty circuits.</SelectItem>
                  <SelectItem value="other">Other actions...</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Responsible Person..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">John Doe</SelectItem>
                  <SelectItem value="person2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="bg-white flex-1"
                  defaultValue="2025-08-24"
                />
                <Button variant="ghost" size="icon">
                  <span className="text-xl">📅</span>
                </Button>
              </div>

              <div className="text-sm text-gray-600 mb-1">Description:</div>
              <Textarea
                placeholder="This is how description will look like if the user has put description at the time of creation."
                className="bg-white min-h-[80px]"
              />

              <Button
                variant="outline"
                className="w-full border-[#BF213E] text-[#BF213E]"
                onClick={handleAddCorrectiveAction}
              >
                + Add Action
              </Button>
            </div>
          </div>

          {/* Preventive Actions */}
          <div className="border-t border-gray-300 pt-4">
            <h4 className="font-semibold text-sm mb-3">Preventive Actions</h4>
            
            <div className="space-y-3">
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select preventive action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loto">Implement and enforce LOTO procedure.</SelectItem>
                  <SelectItem value="training">Conduct safety training.</SelectItem>
                  <SelectItem value="other">Other actions...</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Responsible Person..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">John Doe</SelectItem>
                  <SelectItem value="person2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="bg-white flex-1"
                  defaultValue="2025-08-24"
                />
                <Button variant="ghost" size="icon">
                  <span className="text-xl">📅</span>
                </Button>
              </div>

              <div className="text-sm text-gray-600 mb-1">Description:</div>
              <Textarea
                placeholder="This is how description will look like if the user has put description at the time of creation."
                className="bg-white min-h-[80px]"
              />

              <Button
                variant="outline"
                className="w-full border-[#BF213E] text-[#BF213E]"
                onClick={handleAddPreventiveAction}
              >
                + Add Action
              </Button>
            </div>
          </div>

          {/* Schedule Next Review */}
          <div className="border-t border-gray-300 pt-4">
            <h4 className="font-semibold text-sm mb-3 text-[#BF213E]">Schedule Next Review</h4>
            
            <div className="space-y-3">
              <Select value={nextReviewResponsible} onValueChange={setNextReviewResponsible}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Responsible Person..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">John Doe</SelectItem>
                  <SelectItem value="person2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="bg-white flex-1"
                  value={nextReviewDate}
                  onChange={(e) => setNextReviewDate(e.target.value)}
                  defaultValue="2025-10-30"
                />
                <Button variant="ghost" size="icon">
                  <span className="text-xl">📅</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Investigator Modal
  const InvestigatorModal = () => (
    <Dialog open={isInvestigatorModalOpen} onOpenChange={setIsInvestigatorModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Investigator</DialogTitle>
        </DialogHeader>

        <Tabs value={investigatorTab} onValueChange={(v) => setInvestigatorTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internal">Internal</TabsTrigger>
            <TabsTrigger value="external">External</TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="space-y-3 mt-4">
            <Input
              placeholder="Search Person..."
              className="mb-3"
            />
            <div className="text-sm text-gray-500">Search for internal investigators</div>
          </TabsContent>

          <TabsContent value="external" className="space-y-3 mt-4">
            <Input
              placeholder="Name"
              value={newInvestigator.name}
              onChange={(e) => setNewInvestigator({ ...newInvestigator, name: e.target.value })}
            />
            <Input
              placeholder="Mail ID"
              type="email"
              value={newInvestigator.email}
              onChange={(e) => setNewInvestigator({ ...newInvestigator, email: e.target.value })}
            />
            <Input
              placeholder="Role"
              value={newInvestigator.role}
              onChange={(e) => setNewInvestigator({ ...newInvestigator, role: e.target.value })}
            />
            <Input
              placeholder="Contact No."
              value={newInvestigator.contactNo}
              onChange={(e) => setNewInvestigator({ ...newInvestigator, contactNo: e.target.value })}
            />

            <div className="text-sm font-medium mt-4 mb-2">Attachment</div>
            <div className="flex gap-2">
              <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </button>
              <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsInvestigatorModalOpen(false)}
          >
            Add Investigator
          </Button>
          <Button
            className="bg-[#BF213E] text-white hover:bg-[#9d1a32]"
            onClick={handleAddInvestigator}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <button onClick={handleBack}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Incident Details</h1>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {currentStep === 1 && <ReportStep />}
        {currentStep === 2 && <InvestigateStep />}
        {currentStep === 3 && <ProvisionalStep />}
        {currentStep === 4 && <FinalClosureStep />}
      </div>

      {/* Footer Buttons */}
      <div className="border-t p-4 space-y-2">
        {currentStep === 1 && (
          <Button
            className="w-full bg-[#BF213E] text-white hover:bg-[#9d1a32]"
            onClick={handleNext}
          >
            Next
          </Button>
        )}

        {currentStep === 2 && (
          <>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSaveAsDraft}
            >
              Save as draft
            </Button>
            <Button
              className="w-full bg-[#BF213E] text-white hover:bg-[#9d1a32]"
              onClick={handleNext}
            >
              Next
            </Button>
          </>
        )}

        {currentStep === 3 && (
          <Button
            className="w-full bg-[#BF213E] text-white hover:bg-[#9d1a32]"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}

        {currentStep === 4 && (
          <Button
            className="w-full bg-[#BF213E] text-white hover:bg-[#9d1a32]"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </div>

      {/* Modals */}
      <InvestigatorModal />
    </div>
  );
};

export default IncidentNewDetails;
