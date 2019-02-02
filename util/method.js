exports.getDate = () => {
    let date = new Date();
    let newDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return newDate;
}