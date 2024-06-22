export default function (item: any) {
    return Array.isArray(item) ? item : [item];
}
