using api.Enums;

namespace api.DTOs
{
    public class HeatMapDTO
    {
        public int day { get; set; }
        public int value { get; set; }
        public string? leaveName { get; set; }

        public HeatMapDTO(LeavesTableDTO leaveData)
        {
            day = (leaveData.Date ?? DateTime.Now).Day;
            if (leaveData.IsLeaderApproved == null || leaveData.IsManagerApproved == null)
            {
                value = 42;
                leaveName = leaveData.LeaveName;
            }
            else
            {
                switch (leaveData.LeaveTypeId)
                {
                    case LeaveTypeEnum.UNDERTIME:
                        value = 6;
                        break;
                    case LeaveTypeEnum.SICK_LEAVE:
                        value = 12;
                        break;
                    case LeaveTypeEnum.VACATION_LEAVE:
                        value = 18;
                        break;
                    case LeaveTypeEnum.EMERGENCY_LEAVE:
                        value = 24;
                        break;
                    case LeaveTypeEnum.BEREAVEMENT_LEAVE:
                        value = 30;
                        break;
                    case LeaveTypeEnum.MATERNITY_LEAVE:
                        value = 36;
                        break;
                }
            }
        }

        public HeatMapDTO(int day, int value, string? leaveName)
        {
            this.day = day;
            this.value = value;
            this.leaveName = leaveName;
        }
    }
}
