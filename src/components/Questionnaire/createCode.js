export function createCode() {
  let code;
  let codeArr = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  let length = 6;
  code = "";
  for (let i = 0; i < length; i++) {
    let randomI = Math.floor(Math.random() * 36);
    code += codeArr[randomI];
  }
  return code;
}
