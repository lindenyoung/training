// write a function that takes an array of nums and returns the lowest three

const findLowestThreeNums = (nums: number[]): number[] => {
  // sort first method
  // const sortedNums = nums.sort((a, b) => a - b);
  // return sortedNums.slice(0, 3);

  // no sort method
  let lowestNums: number[] = [Infinity, Infinity, Infinity];

  for (let i = 0; i < nums.length; i++) {
    const currNum = nums[i];
    if (currNum < lowestNums[0]) {
      lowestNums[2] = lowestNums[1];
      lowestNums[1] = lowestNums[0];
      lowestNums[0] = currNum;
    } else if (currNum < lowestNums[1]) {
      lowestNums[2] = lowestNums[1];
      lowestNums[1] = currNum;
    } else if (currNum < lowestNums[2]) {
      lowestNums[2] = currNum;
    }
  }

  return lowestNums;
};

// console.log(findLowestThreeNums([5, 3, 1, 10, 20, 2]));

interface Item {
  name: string;
  id: number;
  price: number;
  onSale?: boolean;
}

const findCheapestThreeItems = (items: Item[]): Item[] => {
  const cheapestItems = [...items].sort((a, b) => a.price - b.price);
  return cheapestItems.slice(0, 3);
};

const findCheapestThree = (items: Item[]): Item[] => {
  let lowestItems: Item[] = [{ name: '', id: 0, price: Infinity }, { name: '', id: 0, price: Infinity }, { name: '', id: 0, price: Infinity }];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.price < lowestItems[0].price) {
      lowestItems[2] = lowestItems[1];
      lowestItems[1] = lowestItems[0];
      lowestItems[0] = item;
    } else if (item.price < lowestItems[1].price) {
      lowestItems[2] = lowestItems[1];
      lowestItems[1] = item;
    } else if (item.price < lowestItems[2].price) {
      lowestItems[2] = item;
    }
  }

  return lowestItems;
};
