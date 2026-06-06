export const authFile = 'playwright/.auth/admin.json';

export const testUsers = {
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'ayushn@gmail.com',
    password: process.env.TEST_ADMIN_PASSWORD || '123',
    displayName: process.env.TEST_ADMIN_DISPLAY_NAME || 'Ayush N',
  },
  multiInstitute: {
    email: process.env.TEST_MULTI_INSTITUTE_EMAIL || 'yashd@gmail.com',
    password: process.env.TEST_MULTI_INSTITUTE_PASSWORD || '123',
    displayName: process.env.TEST_MULTI_INSTITUTE_DISPLAY_NAME || 'Yash',
  },
  instituteList: {
    email: process.env.TEST_INSTITUTE_LIST_EMAIL || 'ayushl@gmail.com',
    password: process.env.TEST_INSTITUTE_LIST_PASSWORD || '123',
    expectedInstituteCount: Number(process.env.TEST_INSTITUTE_LIST_COUNT || 3),
  },
  invalid: {
    email: process.env.TEST_INVALID_EMAIL || 'wrong@gmail.com',
    password: process.env.TEST_INVALID_PASSWORD || 'wrong123',
  },
};

export const testInstitutes = {
  admin: [
    {
      tenant_id: 1,
      institute_id: 101,
      institute_name: 'GNIET Nagpur',
      roles: [{ role_id: 1, role_name: 'Institute Admin' }],
    },
  ],
  multiInstitute: [
    {
      tenant_id: 1,
      institute_id: 201,
      institute_name: 'RCOEM Nagpur',
      roles: [
        { role_id: 1, role_name: 'Institute Admin' },
        { role_id: 2, role_name: 'Trainer' },
        { role_id: 3, role_name: 'Student' },
      ],
    },
    {
      tenant_id: 1,
      institute_id: 202,
      institute_name: 'YCCE Nagpur',
      roles: [{ role_id: 1, role_name: 'Institute Admin' }],
    },
    {
      tenant_id: 1,
      institute_id: 203,
      institute_name: 'JD College Nagpur',
      roles: [{ role_id: 2, role_name: 'Trainer' }],
    },
    {
      tenant_id: 1,
      institute_id: 204,
      institute_name: 'Raisoni College Nagpur',
      roles: [{ role_id: 3, role_name: 'Student' }],
    },
    {
      tenant_id: 1,
      institute_id: 205,
      institute_name: 'GNIT Nagpur',
      roles: [{ role_id: 1, role_name: 'Institute Admin' }],
    },
  ],
  instituteList: [
    {
      tenant_id: 1,
      institute_id: 301,
      institute_name: 'RCOEM Nagpur',
      roles: [{ role_id: 1, role_name: 'Institute Admin' }],
    },
    {
      tenant_id: 1,
      institute_id: 302,
      institute_name: 'YCCE Nagpur',
      roles: [{ role_id: 2, role_name: 'Trainer' }],
    },
    {
      tenant_id: 1,
      institute_id: 303,
      institute_name: 'GNIT Nagpur',
      roles: [{ role_id: 3, role_name: 'Student' }],
    },
  ],
};
