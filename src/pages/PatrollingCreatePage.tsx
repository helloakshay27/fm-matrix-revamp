import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';

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

  const addQuestion = () => setQuestions(prev => [...prev, { task: '', inputType: '', mandatory: false }]);
  const addShift = () => setShifts(prev => [...prev, { name: '', start: '', end: '', assignee: '', supervisor: '' }]);
  const addCheckpoint = () => setCheckpoints(prev => [...prev, { building: '', wing: '', floor: '', area: '', room: '', shift: '' }]);

  const removeCheckpoint = (idx: number) => setCheckpoints(prev => prev.filter((_, i) => i !== idx));

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
      <div className="px-6 py-4 border-b flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-[#efe9dc] border border-[#eadfcb]" />
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

      <Section title="Patrol Name">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-1 block">Name</Label>
            <Input placeholder="Enter Name" value={patrolName} onChange={(e) => setPatrolName(e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Validity">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="mb-1 block">Start Date</Label>
            <Input type="date" placeholder="Select Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">End Date</Label>
            <Input type="date" placeholder="Select End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Grace Period</Label>
            <Input placeholder="Enter Grace Period" value={grace} onChange={(e) => setGrace(e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Question">
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="rounded-md border border-dashed bg-[#eef2f3]/60 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label className="mb-1 block">Mandatory</Label>
                  <div className="flex items-center gap-2 bg-[#eef2f3] rounded-md p-2 border border-[#E5E7EB]">
                    <Switch checked={q.mandatory} onCheckedChange={(v) => setQuestions(prev => prev.map((it, i) => i === idx ? { ...it, mandatory: Boolean(v) } : it))} />
                  </div>
                </div>
                <div>
                  <Label className="mb-1 block">Task</Label>
                  <Input placeholder="Enter Task" value={q.task} onChange={(e) => setQuestions(prev => prev.map((it, i) => i === idx ? { ...it, task: e.target.value } : it))} />
                </div>
                <div>
                  <Label className="mb-1 block">Input Type</Label>
                  <Select value={q.inputType} onValueChange={(v) => setQuestions(prev => prev.map((it, i) => i === idx ? { ...it, inputType: v } : it))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Input Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
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

      <Section title="Shift Setup">
        <div className="space-y-4">
          {shifts.map((s, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="mb-1 block">Shift Name</Label>
                <Input placeholder="Enter Shift Name" value={s.name} onChange={(e) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, name: e.target.value } : it))} />
              </div>
              <div>
                <Label className="mb-1 block">Start Time</Label>
                <Input type="time" value={s.start} onChange={(e) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, start: e.target.value } : it))} />
              </div>
              <div>
                <Label className="mb-1 block">End Time</Label>
                <Input type="time" value={s.end} onChange={(e) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, end: e.target.value } : it))} />
              </div>
              <div>
                <Label className="mb-1 block">Assignee</Label>
                <Select value={s.assignee} onValueChange={(v) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, assignee: v } : it))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">User 1</SelectItem>
                    <SelectItem value="user2">User 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1 block">Supervisor</Label>
                <Select value={s.supervisor} onValueChange={(v) => setShifts(prev => prev.map((it, i) => i === idx ? { ...it, supervisor: v } : it))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sup1">Supervisor 1</SelectItem>
                    <SelectItem value="sup2">Supervisor 2</SelectItem>
                  </SelectContent>
                </Select>
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

      <Section title="Checkpoint Setup">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-1 block">Building</Label>
                  <Select value={c.building} onValueChange={(v) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, building: v } : it))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Building" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b1">Building 1</SelectItem>
                      <SelectItem value="b2">Building 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Wing</Label>
                  <Select value={c.wing} onValueChange={(v) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, wing: v } : it))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Wing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w1">Wing 1</SelectItem>
                      <SelectItem value="w2">Wing 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Floor</Label>
                  <Select value={c.floor} onValueChange={(v) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, floor: v } : it))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="f1">Floor 1</SelectItem>
                      <SelectItem value="f2">Floor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Area</Label>
                  <Select value={c.area} onValueChange={(v) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, area: v } : it))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a1">Area 1</SelectItem>
                      <SelectItem value="a2">Area 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Room</Label>
                  <Select value={c.room} onValueChange={(v) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, room: v } : it))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="r1">Room 1</SelectItem>
                      <SelectItem value="r2">Room 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Shift</Label>
                  <Select value={c.shift} onValueChange={(v) => setCheckpoints(prev => prev.map((it, i) => i === idx ? { ...it, shift: v } : it))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Shift" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map((s, i) => (
                        <SelectItem key={i} value={`shift-${i + 1}`}>Shift {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
        <Button className="px-8 bg-[#C72030] hover:bg-[#C72030]/90 text-white border-0">Submit</Button>
        <Button variant="outline" className="px-8" onClick={() => navigate('/security/patrolling')}>Cancel</Button>
      </div>
    </div>
  );
};
