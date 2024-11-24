import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  Button,
  useTheme,
} from '@mui/material';
import { roleApi } from '../../services/mockApi';

const PermissionList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await roleApi.getRoles();
      setRoles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load permissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (roleName, category, action, checked) => {
    try {
      setLoading(true);
      const role = roles.find(r => r.name === roleName);
      const updatedPermissions = { ...role.permissions };

      if (checked) {
        updatedPermissions[category] = [...(updatedPermissions[category] || []), action];
      } else {
        updatedPermissions[category] = updatedPermissions[category].filter(a => a !== action);
      }

      const updatedRole = { ...role, permissions: updatedPermissions };
      await roleApi.updateRole(roleName, updatedRole);
      
      setRoles(roles.map(r => r.name === roleName ? updatedRole : r));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update permission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const permissionCategories = ['users', 'roles', 'content'];
  const permissionActions = ['read', 'write', 'delete'];

  if (loading && roles.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Permission Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={loadRoles}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Permissions updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} lg={4} key={role.name}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {role.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                {permissionCategories.map((category) => (
                  <Box key={category} sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        textTransform: 'capitalize',
                        mb: 1,
                      }}
                    >
                      {category}
                    </Typography>
                    <FormGroup>
                      {permissionActions.map((action) => (
                        <FormControlLabel
                          key={`${category}-${action}`}
                          control={
                            <Switch
                              size="small"
                              checked={role.permissions[category]?.includes(action) || false}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role.name,
                                  category,
                                  action,
                                  e.target.checked
                                )
                              }
                              disabled={loading}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{ textTransform: 'capitalize' }}
                            >
                              {action}
                            </Typography>
                          }
                        />
                      ))}
                    </FormGroup>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PermissionList;
