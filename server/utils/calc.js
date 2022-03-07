exports.incomeOverview = (userId, startDate, endDate) => {


    // do database stuff here.

    const income = 13500.50;
    const expenses = 7657.47;
    const net = income - expenses;

    return {
        income,
        expenses,
        net
    };
}