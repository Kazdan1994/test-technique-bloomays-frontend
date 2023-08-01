export type Freelance = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type Mission = {
  id: string;
  label: string;
  beginDate: string;
  endDate: string;
  missionType: string;
  freelance: Freelance;
};

export type Job = {
  firstname: string;
  lastname: string;
  beginMission: string;
  endMission: string;
  id: number;
};

export type Missions = {
  [date: string]: Job[];
};

export type EventTimeLine = {
  status: Status;
  date: string;
  name: string;
};

export enum Status {
  ARRIVING = 'arriving',
  LEAVING = 'leaving',
}
