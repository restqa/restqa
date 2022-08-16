export function Iota(endValue, startValue= 1)
{
    let arr = []
    for (let i = startValue; i <= endValue; ++i)
    {
        arr.push(i);
    }
    return arr;
}
