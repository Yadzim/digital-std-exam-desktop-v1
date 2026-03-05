import { useEffect } from 'react';
import { save_after_load, save_before_load } from 'utils/save_ui';
import { Loading } from './components/Loading';
import verification from './config/_axios/verification';
import RoutesMiddleware from 'routes/RoutesMiddleware'
import UserMe from 'services'
import { useAppDispatch, useAppSelector } from 'store/services';
import { TypeInitialStateAuth } from 'store/auth';
import { handleNetwork } from 'store/ui';
import { notification } from 'antd';
import { clearExamData } from 'utils/clearExamData';
import React from 'react';
import useCheckVersion from 'hooks/useCheckVersion';
import BirthdayModal from 'components/BirthdayModal';


function App() {

  const auth = useAppSelector(state => state.auth) as TypeInitialStateAuth;
  const dispatch: any = useAppDispatch();

  useCheckVersion();

  useEffect(() => {
    if (window.electron?.rendererReady) {
      window.electron.rendererReady();
    }
  }, []);

  if (!localStorage.getItem("_url") && window.location.pathname !== "/" && !localStorage.getItem("access_token")) {
    localStorage.setItem("_url", window.location.pathname);
  }

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      if (localStorage.getItem("access_token")) {
        sessionStorage.setItem("page_reloading", '_1_')
      }
      save_before_load();
    });
    return () => window.removeEventListener('beforeunload', save_before_load);
  }, [])

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      verification()
    }
    save_after_load()
    return () => window.removeEventListener('load', save_after_load);
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      (
        async () => {
          await dispatch(UserMe('/students/me?expand=profile,eduPlan.eduSemestrs.eduSemesterSubjects,course,faculty,eduSemestr'))
        }
      )()
      clearExamData();
    }
  }, [auth.isAuthenticated])


  React.useEffect(() => {
    const disabledEvent = (e: any) => {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else if (window.event) {
        window.event.cancelBubble = true;
      }
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 123) {
        disabledEvent(e);
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        disabledEvent(e);
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        disabledEvent(e);
      }
      if (e.ctrlKey && e.keyCode === 85) {
        disabledEvent(e);
      }
      if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        disabledEvent(e);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      disabledEvent(e);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
        disabledEvent(e);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [])

  useEffect(() => {
    window.addEventListener("online", () => {
      dispatch(handleNetwork({ isOnline: navigator.onLine }));
      notification.success({ message: "Tarmoqga ulandi !", placement: "bottomRight", duration: 5 });
    });
    window.addEventListener("offline", () => {
      dispatch(handleNetwork({ isOnline: navigator.onLine }));
      notification.warning({ message: "Tarmoqdan uzilish mavjud !", placement: "bottomRight", duration: 5 });
    });
  }, [navigator.onLine])

  if (sessionStorage.getItem('page_reloading') === '_1_') {
    return <Loading />
  }
  if (auth.isLoading) {
    return <Loading />
  }

  const _url: string = localStorage.getItem("_url") || window.location.pathname;

  return (
    <>
      <RoutesMiddleware />
      <BirthdayModal />
    </>
  );
}

export default App;