// Simulated delay to mimic API latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initial mock data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'Viewer',
    status: 'Inactive',
  },
];

const mockRoles = [
  {
    name: 'Admin',
    description: 'Full system access',
    permissions: {
      users: ['read', 'write', 'delete'],
      roles: ['read', 'write', 'delete'],
      content: ['read', 'write', 'delete'],
    },
  },
  {
    name: 'Editor',
    description: 'Can manage content and view users',
    permissions: {
      users: ['read'],
      roles: ['read'],
      content: ['read', 'write'],
    },
  },
  {
    name: 'Viewer',
    description: 'Read-only access',
    permissions: {
      users: ['read'],
      roles: ['read'],
      content: ['read'],
    },
  },
];

// User API
export const userApi = {
  getUsers: async () => {
    await delay(500);
    return { data: mockUsers };
  },

  getUserById: async (id) => {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { data: user };
  },

  createUser: async (userData) => {
    await delay(700);
    const newUser = {
      id: String(mockUsers.length + 1),
      ...userData,
    };
    mockUsers.push(newUser);
    return { data: newUser };
  },

  updateUser: async (id, userData) => {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return { data: mockUsers[index] };
  },

  deleteUser: async (id) => {
    await delay(600);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
    return { success: true };
  },
};

// Role API
export const roleApi = {
  getRoles: async () => {
    await delay(500);
    return { data: mockRoles };
  },

  getRoleByName: async (name) => {
    await delay(300);
    const role = mockRoles.find(r => r.name === name);
    if (!role) throw new Error('Role not found');
    return { data: role };
  },

  createRole: async (roleData) => {
    await delay(700);
    if (mockRoles.some(r => r.name === roleData.name)) {
      throw new Error('Role already exists');
    }
    const newRole = {
      ...roleData,
      permissions: roleData.permissions || {},
    };
    mockRoles.push(newRole);
    return { data: newRole };
  },

  updateRole: async (name, roleData) => {
    await delay(500);
    const index = mockRoles.findIndex(r => r.name === name);
    if (index === -1) throw new Error('Role not found');
    mockRoles[index] = { ...mockRoles[index], ...roleData };
    return { data: mockRoles[index] };
  },

  deleteRole: async (name) => {
    await delay(600);
    const index = mockRoles.findIndex(r => r.name === name);
    if (index === -1) throw new Error('Role not found');
    // Check if any users are using this role
    if (mockUsers.some(u => u.role === name)) {
      throw new Error('Cannot delete role: Role is assigned to users');
    }
    mockRoles.splice(index, 1);
    return { success: true };
  },

  // Permission-specific operations
  updatePermissions: async (roleName, permissions) => {
    await delay(400);
    const role = mockRoles.find(r => r.name === roleName);
    if (!role) throw new Error('Role not found');
    role.permissions = permissions;
    return { data: role };
  },

  checkPermission: async (roleName, category, action) => {
    await delay(200);
    const role = mockRoles.find(r => r.name === roleName);
    if (!role) throw new Error('Role not found');
    return {
      data: {
        hasPermission: role.permissions[category]?.includes(action) || false,
      },
    };
  },
};

// Error simulation (uncomment to test error handling)
const errorRate = 0; // 0.2 = 20% error rate
const simulateError = () => Math.random() < errorRate;

export const addErrorSimulation = (api) => {
  return Object.keys(api).reduce((acc, key) => {
    const originalFn = api[key];
    acc[key] = async (...args) => {
      if (simulateError()) {
        throw new Error('Simulated API error');
      }
      return originalFn(...args);
    };
    return acc;
  }, {});
};

// Uncomment to enable error simulation
// export const userApi = addErrorSimulation(userApiImplementation);
// export const roleApi = addErrorSimulation(roleApiImplementation);
