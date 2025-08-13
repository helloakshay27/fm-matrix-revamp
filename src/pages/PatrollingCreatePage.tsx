import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, Type, CalendarRange, ListChecks, Clock, MapPin } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, InputAdornment } from '@mui/material';

export const PatrollingCreatePage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'Create Patrolling'; }, []);

  type Question = { task: string; inputType: string; mandatory: boolean };
  type Shift = { name: string; start: string; end: string; assignee: string; supervisor: string };
  type Checkpoint = { building: string; wing: string; floor: string; area: string; room: string; shift: string };

  const [autoTicket, setAutoTicket] = useState(false);
  const [patrolName, setPatrolName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [grace, setGrace] = useState('');

  const [questions, setQuestions] = useState<Question[]>([{ task: '', inputType: '', mandatory: false }]);
  const [shifts, setShifts] = useState<Shift[]>([{ name: '', start: '', end: '', assignee: '', supervisor: '' }]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { building: '', wing: '', floor: '', area: '', room: '', shift: '' },
  ]);

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  } as const;

  const addQuestion = () => setQuestions(prev => [...prev, { task: '', inputType: '', mandatory: false }]);
  const addShift = () => setShifts(prev => [...prev, { name: '', start: '', end: '', assignee: '', supervisor: '' }]);
  const addCheckpoint = () => setCheckpoints(prev => [...prev, { building: '', wing: '', floor: '', area: '', room: '', shift: '' }]);

  const removeCheckpoint = (idx: number) => setCheckpoints(prev => prev.filter((_, i) => i !== idx));
  const removeQuestion = (idx: number) => setQuestions(prev => prev.filter((_, i) => i !== idx));
  const removeShift = (idx: number) => setShifts(prev => prev.filter((_, i) => i !== idx));

  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="bg-card rounded-lg border border-border shadow-sm">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide uppercase">Patrolling</h1>
        <div className="flex items-center gap-3 text-sm">
          <span>Auto-ticket</span>
          <Switch checked={autoTicket} onCheckedChange={setAutoTicket} />
        </div>
      </header>

      <Section title="Patrol Name" icon={<Type className="w-3.5 h-3.5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-1 block">Name</Label>
            <TextField
              label="Name"
              placeholder="Enter Name"
              value={patrolName}
              onChange={(e) => setPatrolName(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>
        </div>
      </Section>

      <Section title="Validity" icon={<CalendarRange className="w-3.5 h-3.5" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="mb-1 block">Start Date</Label>
            <TextField
              type="date"
              label="Start Date"
              placeholder="Select Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>
          <div>
            <Label className="mb-1 block">End Date</Label>
            <TextField
              type="date"
              label="End Date"
              placeholder="Select End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>
          <div>
            <Label className="mb-1 block">Grace Period</Label>
            <TextField
              label="Grace Period"
              placeholder="Enter Grace Period"
              value={grace}
              onChange={(e) => setGrace(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>
        </div>
      </Section>

      <Section title="Question" icon={<ListChecks className="w-3.5 h-3.5" />}>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="relative rounded-md border border-dashed bg-muted/30 p-4">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(idx)}
                  className="absolute -right-2 -top-2 rounded-full p-1 hover:bg-gray-100"
                  aria-label="Remove question"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label className="mb-1 block">Mandatory</Label>
                  <div className="flex items-center gap-2 bg-muted rounded-md p-2 border border-border">
                    <Switch checked={q.mandatory} onCheckedChange={(v) => setQuestions(prev => prev.map((it, i) => i === idx ? { ...it, mandatory: Boolean(v) } : it))} />
                  </div>
                </div>
                <div>
                  <Label className="mb-1 block">Task</Label>
                  <TextField
                    label="Task"
                    placeholder="Enter Task"
                    value={q.task}
                    onChange={(e) => setQuestions(prev => prev.map((it, i) => i === idx ? { ...it, task: e.target.value } : it))}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Input Type</InputLabel>
                    <MuiSelect
                      value={q.inputType}
                      onChange={(e) => setQuestions(prev => prev.map((it, i) => i === idx ? { ...it, inputType: String(e.target.value) } : it))}
                      label="Input Type"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Input Type</MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="checkbox">Checkbox</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button variant="outline" onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" /> Add Question
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Shift Setup" icon={<Clock className="w-3.5 h-3.5" />}>
        <div className="space-y-4">
          {shifts.map((s, idx) => (
            <div key={idx} className="relative">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeShift(idx)}
                  className="absolute -right-2 -top-2 rounded-full p-1 hover:bg-gray-100"
                  aria-label="Remove shift"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <p className="mb-3 text-sm font-medium text-muted-foreground">Shift {idx + 1}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-1 block">Shift Name</Label>
                  <TextField
                    label="Shift Name"
                    placeholder="Enter Shift Name"
                    value={s.name}
                    onChange={(e) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, name: e.target.value } : it))}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                </div>
                <div>
                  <Label className="mb-1 block">Start Time</Label>
                  <TextField
                    type="time"
                    label="Start Time"
                    value={s.start}
                    onChange={(e) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, start: e.target.value } : it))}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                </div>
                <div>
                  <Label className="mb-1 block">End Time</Label>
                  <TextField
                    type="time"
                    label="End Time"
                    value={s.end}
                    onChange={(e) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, end: e.target.value } : it))}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Assignee</InputLabel>
                    <MuiSelect
                      value={s.assignee}
                      onChange={(e) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, assignee: String(e.target.value) } : it))}
                      label="Assignee"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Assignee</MenuItem>
                      <MenuItem value="user1">User 1</MenuItem>
                      <MenuItem value="user2">User 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Supervisor</InputLabel>
                    <MuiSelect
                      value={s.supervisor}
                      onChange={(e) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, supervisor: String(e.target.value) } : it))}
                      label="Supervisor"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Supervisor</MenuItem>
                      <MenuItem value="sup1">Supervisor 1</MenuItem>
                      <MenuItem value="sup2">Supervisor 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button variant="outline" onClick={addShift}>
              <Plus className="w-4 h-4 mr-2" /> Add Shift
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Checkpoint Setup" icon={<MapPin className="w-3.5 h-3.5" />}>
        <div className="space-y-6">
          {checkpoints.map((c, idx) => (
            <div key={idx} className="relative">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeCheckpoint(idx)}
                  className="absolute -right-2 -top-2 rounded-full p-1 hover:bg-gray-100"
                  aria-label="Remove checkpoint"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <p className="mb-3 text-sm font-medium text-muted-foreground">Checkpoint {idx + 1}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Building</InputLabel>
                    <MuiSelect
                      value={c.building}
                      onChange={(e) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, building: String(e.target.value) } : it))}
                      label="Building"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Building</MenuItem>
                      <MenuItem value="b1">Building 1</MenuItem>
                      <MenuItem value="b2">Building 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Wing</InputLabel>
                    <MuiSelect
                      value={c.wing}
                      onChange={(e) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, wing: String(e.target.value) } : it))}
                      label="Wing"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Wing</MenuItem>
                      <MenuItem value="w1">Wing 1</MenuItem>
                      <MenuItem value="w2">Wing 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Floor</InputLabel>
                    <MuiSelect
                      value={c.floor}
                      onChange={(e) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, floor: String(e.target.value) } : it))}
                      label="Floor"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Floor</MenuItem>
                      <MenuItem value="f1">Floor 1</MenuItem>
                      <MenuItem value="f2">Floor 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Area</InputLabel>
                    <MuiSelect
                      value={c.area}
                      onChange={(e) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, area: String(e.target.value) } : it))}
                      label="Area"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Area</MenuItem>
                      <MenuItem value="a1">Area 1</MenuItem>
                      <MenuItem value="a2">Area 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Room</InputLabel>
                    <MuiSelect
                      value={c.room}
                      onChange={(e) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, room: String(e.target.value) } : it))}
                      label="Room"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Room</MenuItem>
                      <MenuItem value="r1">Room 1</MenuItem>
                      <MenuItem value="r2">Room 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Shift</InputLabel>
                    <MuiSelect
                      value={c.shift}
                      onChange={(e) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, shift: String(e.target.value) } : it))}
                      label="Shift"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select Shift</MenuItem>
                      {shifts.map((s, i) => (
                        <MenuItem key={i} value={`shift-${i + 1}`}>Shift {i + 1}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button variant="outline" onClick={addCheckpoint}>
              <Plus className="w-4 h-4 mr-2" /> Add Checkpoint
            </Button>
          </div>
        </div>
      </Section>

      <div className="flex items-center gap-3 justify-center pt-2">
        <Button variant="destructive" className="px-8">Submit</Button>
        <Button variant="outline" className="px-8" onClick={() => navigate('/security/patrolling')}>Cancel</Button>
      </div>
    </div>
  );
};
