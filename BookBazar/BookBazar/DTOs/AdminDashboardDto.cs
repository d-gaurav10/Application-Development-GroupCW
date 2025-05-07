namespace BookBazzar.DTOs
{
    public class AdminDashboardDto
    {
        public int TotalBooks { get; set; }
        public int TotalUsers { get; set; }
        public int TotalAdmins { get; set; }
        public int TotalMembers { get; set; }
        public int TotalStaff { get; set; }

        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int CompletedOrders { get; set; }

        public decimal TotalRevenue { get; set; }

        public List<string> LowStockBooks { get; set; }
        public List<string> MostRatedBooks { get; set; }
    }
}
