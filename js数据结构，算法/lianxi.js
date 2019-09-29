var  arr = [3,4.6,7,9,0,1]
function m(arr) {
    var min
    var item
    for (var i = 0; i < arr.length-1; i++) {
        min = i
        for (var j = 0; j < arr.length; j++) {
            if (arr[min]>arr[j]) {
                min = j
            }

        }
        if (min !==i){
            item = arr[min];
            arr[min] =arr[i];
            arr[i] =item;
        }
    }
    return arr;
}