/** @format */

import { IPara } from "models/education";
import { IAttend, ITimeTable } from "models/others";
import { ISubjectCategory } from "models/subject";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "store/services";
import useGetAllData, { TypeReturnUseGetAllData } from "./useGetAllData";

type AttendType = {
  date: string;
  reason: 0 | 1;
  para: IPara | undefined;
  subject_category: ISubjectCategory | undefined;
};

export type AttendsType = {
  id: number | undefined;
  name: string | undefined;
  all_length: number,
  reason_length: number,
  attendances: {
    1: AttendType[];
    2: AttendType[];
  };
};

const GetAttends = (): { attends: AttendsType[]; loading: boolean } => {
  const user: any = useAppSelector((state) => state.user);

  const timeTable = useGetAllData({
    url: `student-time-tables?expand=subject`,
    isCall: "auto",
  }) as TypeReturnUseGetAllData<ITimeTable>;
  const attendData = useGetAllData({
    url: `student-attends?filter={"student_id":${user?.user?.id}}&expand=timeTable.week,timeTable.para,timeTable.subject,timeTable.subjectCategory,timeTable.teacher&fields=id,student_id,reason,date,timeTable.id,timeTable.subject.name,timeTable.subject.id,timeTable.subjectCategory.name,timeTable.subjectCategory.id,timeTable.week.name,timeTable.para.start_time,timeTable.para.end_time,timeTable.teacher&per-page=0`,
  }) as TypeReturnUseGetAllData<IAttend>;

  useEffect(() => {
    if (user?.user?.id) {
      attendData.fetch();
    }
  }, [user]);

  const getSubject = useMemo(() => {
    let arr: AttendsType[] = [];

    timeTable.items?.map((item) => {
      const check = arr.findIndex((e) => e.id === item?.subject?.id);

      if (check < 0) {
        arr.push({
          id: item?.subject?.id,
          name: item?.subject?.name,
          all_length: 0,
          reason_length: 0,
          attendances: {
            1: [],
            2: [],
          },
        });
      }
    });

    return arr;
  }, [timeTable]);

  const subjects: AttendsType[] = getSubject;

  const makeAttends = useMemo(() => {
    let arr: AttendsType[] = [...subjects];

    attendData.items.forEach((item) => {
      const index = arr.findIndex((e) => e.id === item?.timeTable?.subject?.id);

      if (index >= 0) {
        if (item.timeTable?.subjectCategory?.id === 1) {
          // arr[index] = {
          //   ...arr[index],
          //   all_length: arr[index].all_length+1,
          //   reason_length: item.reason && arr[index].reason_length+1,
          //   attendances: {
          //     ...arr[index].attendances,
          //     1: [
          //       ...arr[index].attendances[1],
          //       {
          //         date: item.date,
          //         reason: item.reason,
          //         para: item?.timeTable?.para,
          //         subject_category: item?.timeTable?.subjectCategory,
          //       },
          //     ],
          //   },
          // };
          arr[index].all_length++;
          if(item.reason) arr[index].reason_length++;
          arr[index].attendances[1].push({
            date: item.date,
            reason: item.reason,
            para: item?.timeTable?.para,
            subject_category: item?.timeTable?.subjectCategory,
          },)
        } else {
          arr[index].all_length++;
          if(item.reason) arr[index].reason_length++;
          arr[index].attendances[2].push({
            date: item.date,
            reason: item.reason,
            para: item?.timeTable?.para,
            subject_category: item?.timeTable?.subjectCategory,
          },)
        }
      }
    });

    return arr;
  }, [subjects]);

  const attends: AttendsType[] = makeAttends;
  const loading = !(!timeTable.loading && !attendData.loading);
  return { attends, loading };
};

export default GetAttends;
