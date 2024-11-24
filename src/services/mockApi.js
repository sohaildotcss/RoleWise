// Simulated delay to mimic API latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initial mock data
const mockUsers = [
  {
    id: 1,
    name: 'Sohail',
    email: 'sohail@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sam',
    email: 'sam@example.com',
    role: 'Editor',
    status: 'Active',
  },
];

const mockRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access',
    permissions: {
      users: ['read', 'write', 'delete'],
      roles: ['read', 'write', 'delete'],
      content: ['read', 'write', 'delete'],
    },
  },
  {
    id: 2,
    name: 'Editor',
    description: 'Content management',
    permissions: {
      users: ['read'],
      roles: ['read'],
      content: ['read', 'write'],
    },
  },
  {
    id: 3,
    name: 'Viewer',
    description: 'Read-only access',
    permissions: {
      users: ['read'],
      roles: ['read'],
      content: ['read'],
    },
  },
];

// Helper function to simulate API errors
const simulateError = () => {
  const shouldError = Math.random() < 0.1; // 10% chance of error
  if (shouldError) {
    throw new Error('API Error: Something went wrong');
  }
};

// User API
export const userApi = {
  getUsers: async () => {
    await delay(500);
    simulateError();
    return { data: mockUsers };
  },

  getUser: async (id) => {
    await delay(300);
    simulateError();
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { data: user };
  },

  createUser: async (userData) => {
    await delay(700);
    simulateError();
    const newUser = {
      ...userData,
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
    };
    mockUsers.push(newUser);
    return { data: newUser };
  },

  updateUser: async (id, userData) => {
    await delay(500);
    simulateError();
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return { data: mockUsers[index] };
  },

  deleteUser: async (id) => {
    await delay(600);
    simulateError();
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
    return { data: { success: true } };
  },
};

// Role API
export const roleApi = {
  getRoles: async () => {
    await delay(500);
    simulateError();
    return { data: mockRoles };
  },

  getRole: async (id) => {
    await delay(300);
    simulateError();
    const role = mockRoles.find(r => r.id === id);
    if (!role) throw new Error('Role not found');
    return { data: role };
  },

  createRole: async (roleData) => {
    await delay(700);
    simulateError();
    const newRole = {
      ...roleData,
      id: Math.max(...mockRoles.map(r => r.id)) + 1,
    };
    mockRoles.push(newRole);
    return { data: newRole };
  },

  updateRole: async (id, roleData) => {
    await delay(500);
    simulateError();
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    mockRoles[index] = { ...mockRoles[index], ...roleData };
    return { data: mockRoles[index] };
  },

  deleteRole: async (id) => {
    await delay(600);
    simulateError();
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    mockRoles.splice(index, 1);
    return { data: { success: true } };
  },

  // Special endpoint for updating role permissions
  updateRolePermissions: async (id, permissions) => {
    await delay(400);
    simulateError();
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    mockRoles[index].permissions = permissions;
    return { data: mockRoles[index] };
  },
};
