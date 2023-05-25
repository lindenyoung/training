// Valid Palindrome

const isPalindrome = (s) => {
  if (!s.length) return true;
  
  s = s.toLowerCase().replace(/[^0-9A-Z]+/gi,"");

  let [left, right] = [0, s.length - 1];

  while (left < right) {
    if (s[left] !== s[right]) return false;

    left++;
    right--;
  }

  return true;
}
