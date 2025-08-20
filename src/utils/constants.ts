const userRolesEnum = {
  admin: "ADMIN",
  user: "USER",
};

const AvailableUserRoles = Object.values(userRolesEnum);

// api key status constants
const apikeyStatusesEnum = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
  Revoked: "REVOKED",
};
const AvailableApiKeyStatuses = Object.values(apikeyStatusesEnum);

// post status constants
const postStatusesEnum = {
  Approved: "APPROVED",
  Pending: "PENDING",
  Rejected: "REJECTED",
};
const AvailablePostStatuses = Object.values(postStatusesEnum);

export {
  userRolesEnum,
  AvailableUserRoles,
  apikeyStatusesEnum,
  AvailableApiKeyStatuses,
  postStatusesEnum,
  AvailablePostStatuses,
};
