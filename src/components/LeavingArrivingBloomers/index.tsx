/**
 * Une fois les données reçues du back, il va falloir les manipuler pour avoir une structure
 * permettant un affichage par date d’arrivée (pour les bloomers entrant) et par date de sortie
 * (pour les bloomers sortant)
 */

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './LeavingArrivingBloomers.css';
import { Timeline } from 'primereact/timeline';
import { Calendar } from 'primereact/calendar';
import { EventTimeLine, Missions, Status } from '../../types.ts';
import { filterDates, sortKeys, transformData } from '../../utils.ts';
import { Skeleton } from 'primereact/skeleton';

function LeavingArrivingBloomers() {
  const [visible, setVisible] = useState<boolean>(true);
  const [date, setDate] = useState<Date>(new Date('2020-09-17'));
  const [arriving, setArriving] = useState<Missions>({});
  const [leaving, setLeaving] = useState<Missions>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMissions() {
      const response = await fetch('http://localhost:3000/missions').then((r) =>
        r.json(),
      );

      // Call the function with the input data
      const transformedData = transformData(response);

      // Separate the arriving and leaving data based on beginDate and endDate
      const arriving: Missions = {};
      const leaving: Missions = {};

      for (const key in transformedData) {
        if (Object.prototype.hasOwnProperty.call(transformedData, key)) {
          const data = transformedData[key];
          arriving[key] = data.filter((item) => item.beginMission === key);
          leaving[key] = data.filter((item) => item.endMission === key);
        }
      }

      // Call the function with the arriving and leaving objects
      const sortedArriving = sortKeys(arriving);
      const sortedLeaving = sortKeys(leaving);

      // Call the function with the arriving and leaving objects
      const filteredArriving = filterDates(sortedArriving, date);
      const filteredLeaving = filterDates(sortedLeaving, date);

      // Print the results
      setArriving(filteredArriving);
      setLeaving(filteredLeaving);
    }

    loadMissions().then(() => {
      setLoading(false);
    });
  }, [date]);

  const transform = (elements: Missions, status: Status): EventTimeLine[] => {
    const missionStatusList: EventTimeLine[] = [];

    for (const date of Object.keys(elements)) {
      for (const mission of elements[date]) {
        missionStatusList.push({
          status,
          date,
          name: `${mission.firstname} ${mission.lastname}`,
        });
      }
    }

    return missionStatusList;
  };

  const customizedContent = (item: EventTimeLine) => (
    <div>
      <span
        className={
          item.status === Status.ARRIVING ? 'text-green-400' : 'text-red-400'
        }
      >
        {item.date}
      </span>
      <br />
      {item.name}
    </div>
  );

  return (
    <>
      <Calendar
        value={date}
        onChange={(e) => setDate(e.value as Date)}
        dateFormat="dd/mm/yy"
        disabled
      />
      <Button
        label="Show"
        size="large"
        icon="pi pi-external-link"
        iconPos="right"
        onClick={() => setVisible(true)}
      />
      <Dialog visible={visible} onHide={() => setVisible(false)}>
        <h1 className="font-medium">
          <u className="text-green-700">2</u> Bloomers entrants
        </h1>
        {loading ? (
          <>
            <div className="flex ml-3 mb-4">
              <Skeleton shape="circle" size="1rem" className="mr-2"></Skeleton>
              <div style={{ flex: '1' }}>
                <Skeleton width="100%"></Skeleton>
              </div>
            </div>
            <Skeleton
              width="36px"
              height=".5rem"
              className="rotate-90"
            ></Skeleton>
            <div className="flex ml-3 mt-4">
              <Skeleton shape="circle" size="1rem" className="mr-2"></Skeleton>
              <div style={{ flex: '1' }}>
                <Skeleton width="100%" className="mb-2"></Skeleton>
              </div>
            </div>
          </>
        ) : (
          <Timeline
            className="customized-timeline"
            value={transform(arriving, Status.ARRIVING)}
            content={customizedContent}
          />
        )}
        <h1 className="font-medium">
          <u className="text-red-400">2</u> Bloomers sortants
        </h1>
        {loading ? (
          <>
            <div className="flex ml-3 mb-4">
              <Skeleton shape="circle" size="1rem" className="mr-2"></Skeleton>
              <div style={{ flex: '1' }}>
                <Skeleton width="100%"></Skeleton>
              </div>
            </div>
            <Skeleton
              width="36px"
              height=".5rem"
              className="rotate-90"
            ></Skeleton>
            <div className="flex ml-3 mt-4">
              <Skeleton shape="circle" size="1rem" className="mr-2"></Skeleton>
              <div style={{ flex: '1' }}>
                <Skeleton width="100%" className="mb-2"></Skeleton>
              </div>
            </div>
          </>
        ) : (
          <Timeline
            className="customized-timeline"
            value={transform(leaving, Status.LEAVING)}
            content={customizedContent}
          />
        )}
      </Dialog>
    </>
  );
}

export default LeavingArrivingBloomers;
