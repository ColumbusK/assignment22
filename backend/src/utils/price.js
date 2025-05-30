const calculateFlightPrice = (durationMinutes, aircraftModel) => {
  // 基础价格：每分钟50-80新西兰元
  const basePrice = durationMinutes * (Math.random() * 30 + 50);

  // 根据机型调整价格
  let multiplier = 1;
  if (aircraftModel.includes("SF50")) {
    multiplier = 1.5; // 私人飞机价格更高
  } else if (aircraftModel.includes("PC12")) {
    multiplier = 1.3; // 商务机价格适中
  }

  // 添加随机波动 (±10%)
  const variation = 0.9 + Math.random() * 0.2;

  // 计算最终价格并四舍五入到整数
  return Math.round(basePrice * multiplier * variation);
};
export default calculateFlightPrice;
