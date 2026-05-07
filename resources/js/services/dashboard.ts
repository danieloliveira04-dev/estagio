import { DashboardMetrics } from "@/types";
import api from "./api";
import dashboard from "@/routes/admin/dashboard";

export const getMetrics = () => {
    return api.get<DashboardMetrics>(dashboard.metrics().url);
};