export interface AttorneyDashboardStats {
    totalAttorneys: number;
    totalServices: number;
    totalTestimonials: number;
    totalBlogs: number;
    myBlogs: number;
    pendingBlogs: number;
    acceptedBlogs: number;
    refusedBlogs: number;
    assignedServices: number;
    pendingAssignedServices: number;
    completedAssignedServices: number;
    recentBlogs: any[];
    recentServices: any[];
    recentTestimonials: any[];
    monthlyStats: {
      newBlogs: number;
      newServices: number;
      newTestimonials: number;
    };
  }