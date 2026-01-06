import * as rolePermissionService from '../modules/rolePermission/rolePermission.service.js';

const resources = ['properties', 'contracts', 'users', 'payments', 'features', 'facilities', 'media'];
const roles = ['manager', 'agent', 'broker', 'guest'];

export const initializeDefaultPermissions = async () => {
  try {
    console.log('Initializing default permissions...');
    
    for (const role of roles) {
      for (const resource of resources) {
        try {
          // Check if permission already exists
          const existing = await rolePermissionService.getUserPermissions(role);
          if (!existing[resource]) {
            // Create default read-only permission
            await rolePermissionService.createRolePermission({
              role,
              resource,
              actions: ['read']
            });
            console.log(`✓ Created default permission: ${role} -> ${resource} (read)`);
          }
        } catch (error) {
          // Permission might already exist, skip
          if (error.message.includes('already exists')) {
            continue;
          }
          console.error(`Error creating permission for ${role} -> ${resource}:`, error.message);
        }
      }
    }
    
    console.log('Default permissions initialized successfully!');
  } catch (error) {
    console.error('Error initializing permissions:', error);
  }
};








