/**
 * format secund to hh:mm:ss
 * @param seconds secund (number)
 * @returns secund => HH:mm:ss format (string)
 */
export const toHHmmss = (second: number) => {
  const date = new Date(second * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/);

  if (date?.length) return date[0];
  else return "00:00:00";
};

/**
 * format secund to mm:ss
 * @param seconds secund (number)
 * @returns secund => HH:mm:ss format (string)
 */
export const tommss = (second: number) => {
  if (!second) return "00:00";
  const date = new Date(second * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/);

  if (date?.length) return date[0]?.split(":")?.slice(1, 3)?.join(":");
  else return "00:00";
};
