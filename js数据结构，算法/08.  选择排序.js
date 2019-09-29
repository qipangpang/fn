// 选择排序：
/*
  默认数组的第一个元素最小
* 从数组的第一项开始与后一项去比较，如果发现前者比后者大（认为后者是最小的），
* 拿当前最小的元素继续和后续的元素去比较，如果发现后续的元素中有比当前最小还小，就移动记录的标识
* 一轮完整的比较结束后将标识最小的元素放在数组的第一位，空出的位置由原来数组的第一位占取
* */


var arr = [1, 3,6,2,1,5,7,4]

function xzSort(arr) {
  var min; // 标识最小元素的标记
  var item;
  for (var i = 0; i < arr.length - 1; i++) {// 比较的轮数
    min = i;
    for (var j = i + 1; j < arr.length; j++) { // 比较的元素
      // 判断： 默认最小的元素 PK   j元素
      if (arr[min] > arr[j]) {
        // 如果后者比默认的元素还要小
        min = j;// 更换标识为后者
      }
    }
    // 一轮PK结束
    if(min !== i){
      item = arr[min];
      arr[min] = arr[i];
      arr[i] = item;
    }
  }
  
  return arr;
}

console.log(xzSort(arr));