using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{
    public class WorkingDayTime : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int EmployeeScheduleId { get; set; }
        public string? Day { get; set; }
        public TimeSpan From { get; set; }
        public TimeSpan To { get; set; }
        public TimeSpan BreakFrom { get; set; }
        public TimeSpan BreakTo { get; set; }
        public EmployeeSchedule EmployeeSchedule { get; set; } = default!;
    }
}
