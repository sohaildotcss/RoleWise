import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  permissions: yup.array().min(1, 'At least one permission is required'),
});

const availablePermissions = ['read', 'write', 'delete'];

const RoleForm = ({ open, onClose, onSave, role }) => {
  const formik = useFormik({
    initialValues: {
      name: role?.name || '',
      description: role?.description || '',
      permissions: role?.permissions || [],
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      formik.resetForm();
    },
    enableReinitialize: true,
  });

  const handlePermissionChange = (permission) => {
    const currentPermissions = formik.values.permissions;
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];
    formik.setFieldValue('permissions', newPermissions);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{role ? 'Edit Role' : 'Add Role'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <FormControl
            component="fieldset"
            margin="normal"
            error={formik.touched.permissions && Boolean(formik.errors.permissions)}
          >
            <FormGroup>
              {availablePermissions.map((permission) => (
                <FormControlLabel
                  key={permission}
                  control={
                    <Checkbox
                      checked={formik.values.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      name={`permissions.${permission}`}
                    />
                  }
                  label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {role ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RoleForm;
