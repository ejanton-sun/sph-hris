export interface IEmployeeTimeEntry {
  id: number
  date: string
  timeIn: {
    id: number
    timeHour: string
    remarks: string
    createdAt: string
  }
  timeOut: {
    id: number
    timeHour: string
    remarks: string
    createdAt: string
  }
  startTime: string
  endTime: string
  workedHours: string
  trackedHours: string
  late: number
  undertime: number
  overtime: ITimeEntryOvertime
  status: string
  changeShift: IChangeShift
  eslChangeShift: IESLChangeShift
}

export interface IChangeShift {
  id: number
  manager: {
    name: string
  }
  timeIn: string
  timeOut: string
  description: string
}

export interface IESLChangeShift {
  id: number
  teamLeader: {
    name: string
  }
  timeIn: string
  timeOut: string
  description: string
  isLeaderApproved: boolean | null
}

export type ITimeEntryOvertime = {
  requestedMinutes: number
  approvedMinutes: number | null
  isLeaderApproved: boolean | null
  isManagerApproved: boolean | null
} | null

export interface ITimeEntry {
  id: number
  date: string
  user: {
    id: number
    name: string
    avatarLink: string
  }
  timeIn: {
    id: number
    timeHour: string
    remarks: string
  }
  timeOut: {
    id: number
    timeHour: string
    remarks: string
  }
  startTime: string
  endTime: string
  workedHours: string
  trackedHours: string
  late: number
  undertime: number
  overtime: ITimeEntryOvertime
  status: string
}

export interface ITimeEntryById {
  id: number
  timeHour: string
  remarks: string
  createdAt: string
  media: IMedia[]
}

export interface IMedia {
  mimeType: string
  link: string
  fileName: string
}

export interface ISpecificTimeEntryById {
  user: {
    id: number
    name: string
  }
}

export interface ISpecificUserDetail {
  name: string
  avatarLink: string
  employeeSchedule: {
    name: string
  }
  role: {
    name: string
  }
}

export interface ITimesheetSummary {
  user: {
    id: number
    name: string
    avatarLink: string
  }
  avatar: string
  leave: number
  absences: number
  late: number
  undertime: number
  overtime: number
}
