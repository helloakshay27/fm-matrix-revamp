import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    MenuItem,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { createProjectUsers } from '@/store/slices/projectUsersSlice';
import { createFmUser } from '@/store/slices/fmUserSlice';

const InternalUsersModal = ({ openDialog, handleCloseDialog, fetchData, roles, users, isEditing, record }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [formData, setFormData] = useState({
        name: '',
        mobileNumber: '',
        emailId: '',
        password: '',
        company: '',
        role: '',
        reportsTo: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    useEffect(() => {
        if (isEditing && record) {
            setFormData({
                ...formData,
                name: record.name,
                mobileNumber: record.mobile,
                emailId: record.email,
                company: record.company_id,
                role: record.role_id,
                reportsTo: record.report_to_id,
            });
        }
    }, [isEditing, record]);

    const validateForm = () => {
        if (!formData.name) {
            toast.error('Please enter Name');
            return false;
        }

        if (!formData.mobileNumber) {
            toast.error('Please enter Mobile Number');
            return false;
        }

        if (!formData.emailId) {
            toast.error('Please enter Email Id');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.emailId && !emailRegex.test(formData.emailId)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (!isEditing) {
            if (!formData.password) {
                toast.error('Please enter Password');
                return false;
            }
            if (formData.password.length < 6) {
                toast.error('Password must be at least 6 characters long');
                return false;
            }
        }

        if (!formData.role) {
            toast.error('Please select Role');
            return false;
        }

        if (!formData.reportsTo) {
            toast.error('Please select Reports To');
            return false;
        }

        return true;
    };


    const onSubmit = async () => {
        try {
            if (!validateForm()) return;

            const nameParts = formData.name.trim().split(" ");
            const firstname = nameParts[0] || "";
            const lastname = nameParts.slice(1).join(" ") || "";

            const payload = {
                user: {
                    firstname,
                    lastname,
                    mobile: formData.mobileNumber,
                    email: formData.emailId,
                    password: formData.password,
                    role_id: formData.role,
                    employee_type: "internal",
                    report_to_id: formData.reportsTo,
                },
            };

            const response = await dispatch(createFmUser({ baseUrl, token, data: payload })).unwrap();

            if (response.errors && Array.isArray(response.errors)) {
                toast.error(response.errors[0]);
                return;
            }

            toast.success("Internal User added successfully");
            fetchData(1, {
                employee_type: "internal"
            });
            handleCloseDialog();
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    };

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Add Internal User</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
                <TextField
                    margin="dense"
                    name="mobileNumber"
                    label="Mobile Number"
                    type="tel"
                    fullWidth
                    variant="outlined"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
                <TextField
                    margin="dense"
                    name="emailId"
                    label="Email Id"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={formData.emailId}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
                <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {/* <TextField
                    margin="dense"
                    name="company"
                    label="Company"
                    select
                    fullWidth
                    variant="outlined"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                >
                    <MenuItem value="">Select...</MenuItem>
                    {
                        companies.map((company) => (
                            <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                        ))
                    }
                </TextField> */}
                <TextField
                    margin="dense"
                    name="role"
                    label="Role"
                    select
                    fullWidth
                    variant="outlined"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                >
                    <MenuItem value="">Select...</MenuItem>
                    {
                        roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                        ))
                    }
                </TextField>
                <TextField
                    margin="dense"
                    name="reportsTo"
                    label="Reports To"
                    select
                    fullWidth
                    variant="outlined"
                    value={formData.reportsTo}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                >
                    <MenuItem value="">Select...</MenuItem>
                    {
                        users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                        ))
                    }
                </TextField>
            </DialogContent>

            <div className="flex justify-center gap-3 mb-4">
                <Button
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    className="bg-green-500 hover:bg-green-600 text-white px-6"
                    onClick={onSubmit}
                // disabled={loading}
                >
                    Submit
                </Button>
            </div>
        </Dialog>
    );
};

export default InternalUsersModal;