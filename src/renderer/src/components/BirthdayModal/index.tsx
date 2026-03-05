import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useAppSelector } from 'store/services';
import { FaCakeCandles } from 'react-icons/fa6';
import { FaRegStar, FaGift, FaFire } from 'react-icons/fa';
import { TbBabyBottle } from 'react-icons/tb';
import { BsStars } from 'react-icons/bs';
import { WiStars } from 'react-icons/wi';
import './styles.scss';

const BirthdayModal: React.FC = (): JSX.Element => {
  const user = useAppSelector(state => state.user.user);
  const [showModal, setShowModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; duration: number; content: string }>>([]);

  // Utility functions
  const isTodayBirthday = (birthday: string | null | undefined): boolean => {
    if (!birthday) return false;
    const today = moment();
    const birthDate = moment(birthday, 'YYYY-MM-DD');
    return today.month() === birthDate.month() && today.date() === birthDate.date();
  };

  const calculateAge = (birthday: string | null | undefined): number => {
    if (!birthday) return 0;
    const today = moment();
    const birthDate = moment(birthday, 'YYYY-MM-DD');
    return today.diff(birthDate, 'years');
  };

  const hasShownBirthdayToday = (userId: number | null | undefined): boolean => {
    if (!userId) return false;
    const today = moment().format('YYYY-MM-DD');
    const lastShownDate = localStorage.getItem(`birthday_shown_${userId}`);
    return lastShownDate === today;
  };

  const markBirthdayShown = (userId: number | null | undefined): void => {
    if (!userId) return;
    const today = moment().format('YYYY-MM-DD');
    localStorage.setItem(`birthday_shown_${userId}`, today);
  };

  // Check for birthday when user data is loaded
  useEffect(() => {
    if (user?.profile?.birthday && user?.user_id) {
      const birthday = user.profile.birthday;
      const userId = user.user_id;

      if (isTodayBirthday(birthday) && !hasShownBirthdayToday(userId)) {
        setShowModal(true);
        markBirthdayShown(userId);

        // Show message after confetti effect completes (10 seconds)
        setTimeout(() => {
          setShowMessage(true);

          // Hide message slowly after 3 seconds (fade out over 2 seconds)
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
        }, 10000);

        // Hide confetti after 10 seconds
        setTimeout(() => {
          setShowModal(false);
        }, 10000);
      }
    }
  }, [user]);

  // Create confetti when modal opens
  useEffect(() => {
    if (showModal) {
      const icons = ['star', 'stars-wi', 'stars-bs', 'gift', 'bottle', 'cake', 'fire'];

      // Create confetti - all falling from top, only icons
      // Stagger delays so icons appear gradually over 10 seconds
      const confettiArray = Array.from({ length: 25 }, (_, i) => {
        const iconType = icons[Math.floor(Math.random() * icons.length)];
        // Delay: 0 to 3 seconds (so all icons start within first 3 seconds)
        // Duration: 8 to 12 seconds (slow fall, icons disappear by end)
        return {
          id: i,
          left: Math.random() * 100,
          delay: (i / 25) * 3, // Stagger delays evenly over 3 seconds
          duration: 8 + Math.random() * 4, // 8-12 seconds for slow fall
          content: iconType
        };
      });
      setConfetti(confettiArray);
    }
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
  };

  if (!user?.profile || (!showModal && !showMessage)) {
    return <></>;
  }

  const firstName = user.profile.first_name || '';
  const lastName = user.profile.last_name || '';
  const age = calculateAge(user.profile.birthday);

  return (
    <>
      {/* Confetti animation - full screen */}
      {showModal && (
        <div className="confetti-container">
          {confetti.map((item) => {
            const drift = (Math.random() - 0.5) * 120;
            // Festive colors for confetti
            const colors = ['#FF6B9D', '#4ECDC4', '#FFD93D', '#95E1D3', '#F38181', '#A8E6CF', '#FFD3A5', '#FD9853'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={item.id}
                className="confetti-item confetti-fall-top"
                style={{
                  left: `${item.left}%`,
                  top: '-80px',
                  animationDelay: `${item.delay}s`,
                  animationDuration: `${item.duration}s`,
                  '--drift': `${drift}px`,
                  color: randomColor
                } as React.CSSProperties}
              >
                {item.content === 'star' ? <FaRegStar size={24} /> :
                  item.content === 'stars-wi' ? <WiStars size={24} /> :
                    item.content === 'stars-bs' ? <BsStars size={24} /> :
                      item.content === 'gift' ? <FaGift size={24} /> :
                        item.content === 'bottle' ? <TbBabyBottle size={24} /> :
                          item.content === 'cake' ? <FaCakeCandles size={24} /> :
                            <FaFire size={24} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Birthday message - centered on screen, shows for 5 seconds */}
      {showMessage && (
        <div className="birthday-message">
          <div className="birthday-emoji-large">
            <FaCakeCandles size={48} />
            <FaGift size={48} />
            <FaRegStar size={48} />
          </div>
          <h2 className="birthday-title">
            HAPPY BIRTHDAY!
          </h2>
          <p className="birthday-name">
            {firstName} {lastName}
          </p>
          <p className="birthday-age">
            Siz {age} yoshga to'ldingiz! 🎈
          </p>
        </div>
      )}
    </>
  );
};

export default BirthdayModal;
