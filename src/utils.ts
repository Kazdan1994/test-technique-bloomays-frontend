// Function to transform the inputData array into the desired structure
import { Job, Mission, Missions } from './types.ts';

export function transformData(inputData: Mission[]) {
  const result: Missions = {};

  // Loop through each object in the inputData array
  for (const item of inputData) {
    const { beginDate, endDate, freelance, ...missionData } = item;
    const { firstname, lastname, id } = freelance;

    // Check if the beginDate already exists in the result object
    if (!result[beginDate]) {
      result[beginDate] = [];
    }

    // Check if the endDate already exists in the result object
    if (!result[endDate]) {
      result[endDate] = [];
    }

    // Push the data into the appropriate arrays in the result object
    result[beginDate].push({
      ...missionData,
      firstname,
      lastname,
      beginMission: beginDate,
      endMission: endDate,
      id: +id,
    });
    result[endDate].push({
      ...missionData,
      firstname,
      lastname,
      beginMission: beginDate,
      endMission: endDate,
      id: +id,
    });
  }

  return result;
}

export function sortKeys(obj: Missions) {
  const sortedKeys = Object.keys(obj).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  const sortedObj: { [key: string]: Job[] } = {};
  for (const key of sortedKeys) {
    sortedObj[key] = obj[key];
  }
  return sortedObj;
}
