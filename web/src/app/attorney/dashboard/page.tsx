"use client"
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useAttorneyDashboardStats } from "@/hooks/attorney/useAttorneyDashboardStats";
import StatsCard from "@/components/dashboard/admin/StatsCard";
import RecentActivity from "@/components/dashboard/admin/RecentActivity";
import ChartCard from "@/components/dashboard/admin/ChartCard";
import TestimonialActivity from "@/components/dashboard/attorney/TestimonialActivity";
import Image from "next/image";

function Dashboard() {
  const { user, loading } = useAuth();
  const { stats, loading: statsLoading, error, refetch } = useAttorneyDashboardStats();

  if (loading || statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">Error: {error}</div>
        <button 
          onClick={refetch}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">No data available</div>
      </div>
    );
  }

  const blogStatusData = [
    { label: "En attente", value: stats.pendingBlogs || 0, color: "#F59E0B" },
    { label: "Acceptés", value: stats.acceptedBlogs || 0, color: "#10B981" },
    { label: "Refusés", value: stats.refusedBlogs || 0, color: "#EF4444" }
  ];

  const assignedServicesData = [
    { label: "En attente", value: stats.pendingAssignedServices || 0, color: "#F59E0B" },
    { label: "Terminés", value: stats.completedAssignedServices || 0, color: "#10B981" }
  ];

  return (
    <div className="mx-6 md:mx-0">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Image
            src="/icons/dashboard/attorney/dashboard.svg"
            alt="dashboard"
            width={32}
            height={32}
          />
          <h1 className="text-3xl font-black text-primary">Tableau de bord</h1>
        </div>
        <p className="text-gray-600">
          Bienvenue, {user?.name} {user?.surname}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Mes Articles"
          value={stats.myBlogs}
          icon="/icons/dashboard/attorney/blog.svg"
          iconAlt="my blogs"
          color="primary"
        />
        <StatsCard
          title="Services Disponibles"
          value={stats.totalServices}
          icon="/icons/dashboard/attorney/service.svg"
          iconAlt="services"
          color="info"
        />
        <StatsCard
          title="Avis Clients"
          value={stats.totalTestimonials}
          icon="/icons/dashboard/attorney/testimonial.svg"
          iconAlt="testimonials"
          color="success"
        />
        <StatsCard
          title="Collègues Avocats"
          value={stats.totalAttorneys}
          icon="/icons/dashboard/attorney/attorney.svg"
          iconAlt="attorneys"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Demandes de Services"
          value={stats.assignedServices}
          icon="/icons/dashboard/attorney/assigned.svg"
          iconAlt="assigned services"
          color="info"
        />
        <StatsCard
          title="Articles En Révision"
          value={stats.pendingBlogs}
          icon="/icons/dashboard/attorney/blog.svg"
          iconAlt="pending blogs"
          color="warning"
        />
        <StatsCard
          title="Articles Publiés"
          value={stats.acceptedBlogs}
          icon="/icons/dashboard/attorney/blog.svg"
          iconAlt="accepted blogs"
          color="success"
        />
        <StatsCard
          title="Articles Refusés"
          value={stats.refusedBlogs}
          icon="/icons/dashboard/attorney/blog.svg"
          iconAlt="refused blogs"
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard
          title="Statut de Mes Articles"
          data={blogStatusData}
          total={stats.pendingBlogs + stats.acceptedBlogs + stats.refusedBlogs}
          icon="/icons/dashboard/attorney/blog.svg"
        />

        <ChartCard
          title="Demandes de Services"
          data={assignedServicesData}
          total={stats.pendingAssignedServices + stats.completedAssignedServices}
          icon="/icons/dashboard/attorney/assigned.svg"
        />

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/icons/dashboard/admin/chart.svg"
              alt="monthly stats"
              width={24}
              height={24}
            />
            <h3 className="text-lg font-semibold text-gray-900">Ce mois</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mes nouveaux articles</span>
              <span className="font-semibold text-gray-900">{stats.monthlyStats.newBlogs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nouveaux services</span>
              <span className="font-semibold text-gray-900">{stats.monthlyStats.newServices}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nouveaux avis clients</span>
              <span className="font-semibold text-gray-900">{stats.monthlyStats.newTestimonials}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity
          title="Mes Articles Récents"
          items={stats.recentBlogs}
          type="blogs"
        />
        <RecentActivity
          title="Services Disponibles"
          items={stats.recentServices.map(service => ({
            ...service,
            status: undefined
          }))}
          type="services"
        />
        <TestimonialActivity
          title="Avis Clients Récents"
          items={stats.recentTestimonials}
        />
      </div>
    </div>
  );
}

export default Dashboard;
