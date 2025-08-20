import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TrainingFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { email: string; trainingName: string }) => void;
  initialEmail?: string;
  initialTrainingName?: string;
}

const TrainingFilterDialog: React.FC<TrainingFilterDialogProps> = ({
  isOpen,
  onClose,
  onApply,
  initialEmail = '',
  initialTrainingName = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [trainingName, setTrainingName] = useState(initialTrainingName);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setTrainingName(initialTrainingName);
    }
  }, [isOpen, initialEmail, initialTrainingName]);

  const provided = email.trim().length > 0 || trainingName.trim().length > 0;

  const handleApply = () => {
    onApply({ email: email.trim(), trainingName: trainingName.trim() });
    onClose();
  };

  const handleReset = () => {
    setEmail('');
    setTrainingName('');
    onApply({ email: '', trainingName: '' });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.125rem' }}>
        FILTER BY
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 p-0 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        <div className="space-y-4">
          <TextField
            label="Email"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
          />
          <TextField
            label="Training Name"
            placeholder="Enter Training Name"
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
          />
          <p className="text-xs text-muted-foreground leading-snug">Provide Email or Training Name (or both). Search matches either (OR).</p>
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
        <Button
          onClick={handleApply}
          className="flex-1 text-white cursor-pointer disabled:opacity-60"
          style={{ backgroundColor: '#C72030' }}
          disabled={!provided}
        >
          Apply
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 cursor-pointer"
          disabled={!provided}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrainingFilterDialog;
