import api from "./axios";

export const leaveApi = {
  /* =====================
     EMPLOYEE / MANAGER SELF
  ====================== */

  applyLeave: (payload: any) =>
    api.post("/leave/requests", payload).then(r => r.data),

  getMyRequests: () =>
    api.get("/leave/requests/me").then(r => r.data),

  getMyBalance: () =>
    api.get("/leave/balances/me").then(r => r.data),

  /* =====================
        ADMIN ONLY
  ====================== */

  getAllRequests: () =>
    api.get("/leave/requests").then(r => r.data),

  getRequestById: (id: string) =>
    api.get(`/leave/requests/${id}`).then(r => r.data),

  approveRequest: (id: string) =>
    api.patch(`/leave/requests/${id}/approve`).then(r => r.data),

  rejectRequest: (id: string, reason: string) =>
    api
      .patch(`/leave/requests/${id}/reject`, {
        rejectionReason: reason,
      })
      .then(r => r.data),

  deleteRequest: (id: string) =>
    api.delete(`/leave/requests/${id}`).then(r => r.data),

  /* =====================
        BALANCE (ADMIN)
  ====================== */

  getUserBalance: (userId: string) =>
    api.get(`/leave/balances/${userId}`).then(r => r.data),

  adjustBalance: (userId: string, payload: any) =>
    api
      .patch(`/leave/balances/${userId}`, payload)
      .then(r => r.data),
};