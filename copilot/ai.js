const calculateDaysBetweenDates = (begin, end) => {
  const beginDate = new Date(begin);
  const endDate = new Date(end);
  const daysBetween = (endDate - beginDate) / 1000 / 60 / 60 / 24;
  return daysBetween;
};

// find all images without alternate text
// and give them a red border
const findImagesWithoutAltText = () => {
  const images = document.querySelectorAll('img');
  images.forEach(image => {
    if (!image.alt) {
      image.style.border = '2px solid red';
    }
  });
};

// return the current time
const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString();
};

// solve two sum problem
const twoSum = (nums, target) => {
  const numsMap = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in numsMap) {
      return [numsMap[complement], i];
    }
    numsMap[nums[i]] = i;
  }
};