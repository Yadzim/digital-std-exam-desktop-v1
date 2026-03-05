import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { finishTimeLimit, resetFaceID, setIsOpen } from "store/faceID";
import { useAppSelector } from "store/services";

const useCheckFaceID = () => {
  const dispatch = useDispatch();
  const {
    isAuth,
    isOpen,
    isLoading,
    date: __date,
  } = useAppSelector((p) => p.faceID);

  const [isTimeReached, setIsTimeReached] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const date = __date ? __date - 20 : null;

  // console.log(isTimeReached);
  // console.log(
  //   "date: ",
  //   moment((__date ?? 0) * 1000).format("HH:mm:ss"),
  //   moment((date ?? 0) * 1000).format("HH:mm:ss")
  // );

  useEffect(() => {
    if (isAuth && !isLoading && !isOpen && date) {
      // intervalni ishga tushuramiz
      intervalRef.current = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        if (now >= date) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsTimeReached(true); // vaqt yetib keldi
          // dispatch(setIsOpen(false)); // modalni yopamiz
          dispatch(finishTimeLimit());
        }
        // console.log("current: ", moment(now * 1000).format("HH:mm:ss"));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuth, isLoading, isOpen, date]);

  useEffect(() => {
    return () => {
      // dispatch(setIsOpen(true));
    };
  }, []);

  function checkFaceIDTimeLimit() {
    if (isTimeReached) {
      dispatch(resetFaceID({}));
      dispatch(setIsOpen(true));
      setIsTimeReached(false);

      return false;
    } else {
      return true;
    }
  }

  function openModal() {
    dispatch(resetFaceID({}));
    dispatch(setIsOpen(true));
    setIsTimeReached(false);
  }

  return {
    isTimeReached,
    isAuth,
    checkFaceIDTimeLimit,
    openModal,
  };
};

export default useCheckFaceID;
