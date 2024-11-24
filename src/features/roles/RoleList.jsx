import  { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import RoleForm from './RoleForm';

const mockRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access',
    permissions: ['read', 'write', 'delete'],
  },
  {
    id: 2,
    name: 'Editor',
    description: 'Can edit content',
    permissions: ['read', 'write'],
  },
];

const RoleList = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setOpenForm(true);
  };

  const handleDelete = (roleId) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  const handleSave = (roleData) => {
    if (selectedRole) {
      setRoles(roles.map((role) =>
        role.id === selectedRole.id ? { ...role, ...roleData } : role
      ));
    } else {
      setRoles([...roles, { ...roleData, id: roles.length + 1 }]);
    }
    setOpenForm(false);
    setSelectedRole(null);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Typography variant="h5">Roles</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedRole(null);
            setOpenForm(true);
          }}
        >
          Add Role
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  {role.permissions.map((permission) => (
                    <Chip
                      key={permission}
                      label={permission}
                      color="primary"
                      variant="outlined"
                      size="small"
                      style={{ marginRight: '4px' }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(role)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(role.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RoleForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedRole(null);
        }}
        onSave={handleSave}
        role={selectedRole}
      />
    </>
  );
};

export default RoleList;
