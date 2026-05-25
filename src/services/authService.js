import API from './api';

// Login API
export const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
};

// Get institutes and roles
export const getMyInstitutesRoles = async () => {
    const response = await API.get('/auth/my-institutes-roles');
    return response.data;
};

// Select institute context
export const selectContext = async (tenant_id, institute_id, role_id) => {
    const response = await API.post('/auth/select-context', {
        tenant_id,
        institute_id,
        role_id
    });
    return response.data;
};

// Logout
export const logout = async () => {
    const response = await API.post('/auth/logout');
    return response.data;
};

// Get current user
export const getMe = async () => {
    const response = await API.get('/auth/me');
    return response.data;
};