'use client'
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/admin/useDashboardStats";
import StatsCard from "@/components/dashboard/admin/StatsCard";
import RecentActivity from "@/components/dashboard/admin/RecentActivity";
import ChartCard from "@/components/dashboard/admin/ChartCard";
import Image from "next/image";

const Dashboard = () => {
    const { user, loading } = useAuth();
    const { stats, loading: statsLoading, error, refetch } = useDashboardStats();

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

    const consultationData = [
        { label: "En attente", value: stats.pendingConsultations, color: "#F59E0B" },
        { label: "Terminées", value: stats.completedConsultations, color: "#10B981" }
    ];

    const fileData = [
        { label: "En attente", value: stats.pendingFiles, color: "#F59E0B" },
        { label: "Acceptés", value: stats.acceptedFiles, color: "#10B981" },
        { label: "Refusés", value: stats.refusedFiles, color: "#EF4444" }
    ];

    return (
        <div className="mx-6 md:mx-0">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Image
                        src="/icons/dashboard/admin/dashboard.svg"
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
                    title="Avocats"
                    value={stats.totalAvocats}
                    icon="/icons/dashboard/admin/attorney.svg"
                    iconAlt="attorneys"
                    color="primary"
                />
                <StatsCard
                    title="Services"
                    value={stats.totalServices}
                    icon="/icons/dashboard/admin/service.svg"
                    iconAlt="services"
                    color="info"
                />
                <StatsCard
                    title="Clients"
                    value={stats.totalClients}
                    icon="/icons/dashboard/admin/client.svg"
                    iconAlt="clients"
                    color="success"
                />
                <StatsCard
                    title="Consultations"
                    value={stats.totalConsultations}
                    icon="/icons/dashboard/admin/consultation.svg"
                    iconAlt="consultations"
                    color="warning"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Blogs"
                    value={stats.totalBlogs}
                    icon="/icons/dashboard/admin/blog.svg"
                    iconAlt="blogs"
                    color="info"
                />
                <StatsCard
                    title="Témoignages"
                    value={stats.totalTestimonials}
                    icon="/icons/dashboard/admin/testimonial.svg"
                    iconAlt="testimonials"
                    color="success"
                />
                <StatsCard
                    title="Catégories"
                    value={stats.totalCategories}
                    icon="/icons/dashboard/admin/category.svg"
                    iconAlt="categories"
                    color="primary"
                />
                <StatsCard
                    title="Fichiers"
                    value={stats.totalClientFiles}
                    icon="/icons/dashboard/admin/file.svg"
                    iconAlt="files"
                    color="warning"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <ChartCard
                    title="Statut des Consultations"
                    data={consultationData}
                    total={stats.pendingConsultations + stats.completedConsultations}
                    icon="/icons/dashboard/admin/consultation.svg"
                />

                <ChartCard
                    title="Statut des Fichiers"
                    data={fileData}
                    total={stats.pendingFiles + stats.acceptedFiles + stats.refusedFiles}
                    icon="/icons/dashboard/admin/file.svg"
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
                            <span className="text-sm text-gray-600">Nouvelles consultations</span>
                            <span className="font-semibold text-gray-900">{stats.monthlyStats.consultations}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Nouveaux clients</span>
                            <span className="font-semibold text-gray-900">{stats.monthlyStats.newClients}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Nouveaux services</span>
                            <span className="font-semibold text-gray-900">{stats.monthlyStats.newServices}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Nouveaux blogs</span>
                            <span className="font-semibold text-gray-900">{stats.monthlyStats.newBlogs}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentActivity
                    title="Consultations Récentes"
                    items={stats.recentConsultations}
                    type="consultations"
                />
                <RecentActivity
                    title="Blogs Récents"
                    items={stats.recentBlogs}
                    type="blogs"
                />
                <RecentActivity
                    title="Services Récents"
                    items={stats.recentServices}
                    type="services"
                />
            </div>
        </div>
    );
};

export default Dashboard;