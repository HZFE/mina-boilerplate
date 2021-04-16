export const willBeShakingInProductionMode = () => {
  // 这个方法没有任何地方被引用
  // 当 webpack mode = production 时 会 tree shaking 掉这个方法
  console.log("willBeShakingInProductionMode");
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

export const formatTime = (date) => {
  console.log(1);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};
