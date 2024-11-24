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
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types'; // Import PropTypes
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  permissions: yup.array().min(1, 'At least one permission is required'),
});

const availablePermissions = ['read', 'write', 'delete'];

const RoleForm = ({ open, onClose, onSave, role }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          width: isTablet ? '90%' : '600px',
          m: isTablet ? 2 : 'auto',
          p: isTablet ? 2 : 3,
        }
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ 
          fontSize: isTablet ? '1.25rem' : '1.5rem',
          pb: isTablet ? 1 : 2 
        }}>
          {role ? 'Edit Role' : 'Add Role'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: isTablet ? 2 : 3,
            py: isTablet ? 1 : 2 
          }}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              size={isTablet ? "small" : "medium"}
            />
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              size={isTablet ? "small" : "medium"}
              multiline
              rows={3}
            />
            <FormControl
              component="fieldset"
              error={formik.touched.permissions && Boolean(formik.errors.permissions)}
              sx={{ mt: isTablet ? 1 : 2 }}
            >
              <FormGroup sx={{ 
                display: 'grid',
                gridTemplateColumns: isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
                gap: 1
              }}>
                {availablePermissions.map((permission) => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={formik.values.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        name={`permissions.${permission}`}
                        size={isTablet ? "small" : "medium"}
                      />
                    }
                    label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                    sx={{ 
                      mr: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: isTablet ? '0.875rem' : '1rem'
                      }
                    }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: isTablet ? 2 : 3,
          py: isTablet ? 1.5 : 2 
        }}>
          <Button onClick={onClose} size={isTablet ? "small" : "medium"}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size={isTablet ? "small" : "medium"}
          >
            {role ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

RoleForm.propTypes = { // Add prop type validation
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  role: PropTypes.object,
};

export default RoleForm;
